# Transactional Email: Supabase Outbox + Edge Function + ZeptoMail

A portable, project-agnostic version of the email system used in this repo. Copy this
into a new Next.js (App Router) + Supabase project and you get durable, retryable,
admin-editable transactional email without adding a queue service, a cron worker, or an
SMTP library.

Names here are genericised: substitute your own prefix for `app_` (this repo uses `rw_`).

---

## 1. Why this shape

The app **never sends email inline**. It writes a row to an outbox table and pings a
worker. That single decision buys you:

| Property | How you get it |
| --- | --- |
| Fast mutations | Enqueue is one insert; the SMTP round-trip never blocks the response |
| Durability | If the worker dies, the row is still `pending` and gets picked up next drain |
| Retries | `attempts` / `max_attempts` on the row, no external retry infra |
| Auditability | Every attempt writes to `app_email_logs`, success or failure |
| Editable copy | Templates live in Postgres, not in code — no redeploy to fix a typo |
| No secrets in the app | The provider token lives only in Edge Function secrets |

Deliberately **not** used: `pg_net` + database triggers. The original design fired emails
from a Postgres trigger via `pg_net.http_post()`. It broke (`schema "net" does not exist`),
was invisible to the app, and couldn't be retried from the UI. Sending is an application
concern — keep it in the application.

```
Server Action / service            Postgres                Edge Function (Deno)          ZeptoMail
────────────────────────           ────────                ────────────────────          ─────────
enqueueEmail() ──────────────────► app_email_queue
       │                            status = pending
       └─ after(fetch POST /functions/v1/send-email) ────►  claim (pending → sending)
                                                            load context + template
                                                            inject {{vars}} + shell
                                                            POST /v1.1/email ───────────►
                                    app_email_queue ◄─────  sent | pending(retry) | failed
                                    app_email_logs  ◄─────  audit row
```

---

## 2. Prerequisites

- Next.js App Router with Server Actions (`after()` from `next/server`; stable since 15,
  and what this repo uses on 16.2.4 — check the bundled docs in `node_modules/next/dist/docs/`
  before assuming API shapes on a newer major)
- A Supabase project, `supabase` CLI linked (`supabase link --project-ref <ref>`)
- A ZeptoMail account with a **verified sending domain** and a Send Mail token
  (starts with `Zoho-enczapikey`)

Any HTTP email API works — Resend, Postmark, SES — only §6 changes.

---

## 3. Schema

`supabase/migrations/<timestamp>_email_system.sql`. Idempotent; safe to re-run.

```sql
-- updated_at helper -----------------------------------------------------------
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Editable copy ---------------------------------------------------------------
create table if not exists app_email_templates (
  id           uuid primary key default gen_random_uuid(),
  template_key text not null unique,        -- 'welcome', 'payment_approved', …
  label        text not null,               -- human name for the admin UI
  subject      text not null,               -- may contain {{variables}}
  body_html    text not null,               -- may contain {{variables}}
  is_active    boolean not null default true,
  updated_at   timestamptz not null default now(),
  updated_by   text                         -- admin email, audit only
);

-- The outbox ------------------------------------------------------------------
create table if not exists app_email_queue (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),

  mode            text not null default 'template',  -- 'template' | 'custom'
  template_key    text,                              -- required when mode='template'
  subject         text,                              -- required when mode='custom'
  body_html       text,                              -- required when mode='custom'

  -- What the message is about. Swap `context_id` for a real FK to your domain
  -- table (orders, invoices, bookings…) if you want referential integrity.
  context_id      uuid,
  context_ids     jsonb,                             -- combined sends (see §7)
  context_type    text,

  recipient_email text,
  recipient_name  text,

  status          text not null default 'pending',   -- pending|sending|sent|failed
  attempts        integer not null default 0,
  max_attempts    integer not null default 5,
  last_error      text,
  sent_at         timestamptz,
  updated_at      timestamptz not null default now()
);

-- Drives the drain query and the stuck-row reaper.
create index if not exists idx_email_queue_status on app_email_queue(status, created_at);

-- Audit trail -----------------------------------------------------------------
create table if not exists app_email_logs (
  id              uuid primary key default gen_random_uuid(),
  queue_id        uuid references app_email_queue(id) on delete set null,
  context_id      uuid,
  template_key    text,
  recipient_email text not null,
  subject         text,
  success         boolean not null default false,
  error_message   text,
  sent_at         timestamptz not null default now()
);

create index if not exists idx_email_logs_context on app_email_logs(context_id);
create index if not exists idx_email_logs_sent_at on app_email_logs(sent_at desc);

drop trigger if exists email_templates_set_updated_at on app_email_templates;
create trigger email_templates_set_updated_at
  before update on app_email_templates
  for each row execute function set_updated_at();

drop trigger if exists email_queue_set_updated_at on app_email_queue;
create trigger email_queue_set_updated_at
  before update on app_email_queue
  for each row execute function set_updated_at();

-- RLS: enabled with NO policies. Both the app and the worker use the service
-- role, which bypasses RLS. Every other client — including any leaked anon key —
-- gets nothing. This is the whole access-control story; do not add policies
-- unless a browser client genuinely needs to read these tables.
alter table app_email_templates enable row level security;
alter table app_email_queue     enable row level security;
alter table app_email_logs      enable row level security;
```

Seed templates with `on conflict (template_key) do nothing` so re-running a migration
never clobbers copy the admin has edited:

```sql
insert into app_email_templates (template_key, label, subject, body_html, is_active)
values
  ('welcome',
   'Welcome',
   'Welcome aboard, {{customer_name}}',
   '<p>Hi {{customer_name}},</p><p>Thanks for signing up.</p>',
   true)
on conflict (template_key) do nothing;
```

---

## 4. App layer — enqueue + drain trigger

`src/lib/services/email.service.ts`

```ts
// App-layer email: enqueue into app_email_queue (durable outbox) and ping the
// send-email Edge Function to drain it. Enqueuing is a fast insert, so mutations
// return immediately while delivery happens asynchronously.

import { after } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

export interface EnqueueResult {
    success: boolean;
    error?: string;
}

/**
 * Ping the worker without blocking the response. `after()` runs the callback
 * once the response has been flushed, so the user never waits on the drain.
 */
export function triggerEmailDrain(): void {
    const run = async (): Promise<void> => {
        const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        const drainSecret = process.env.EMAIL_DRAIN_SECRET;
        if (!baseUrl || !serviceKey) return;

        try {
            await fetch(`${baseUrl}/functions/v1/send-email`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${serviceKey}`,
                    ...(drainSecret ? { "x-drain-secret": drainSecret } : {}),
                },
                body: JSON.stringify({ drain: true }),
            });
        } catch (err) {
            // Never surface a drain failure to the caller — the row is safely
            // queued and the next drain (or the cron sweep) will pick it up.
            console.error("Email drain trigger failed:", err);
        }
    };

    try {
        after(run);
    } catch {
        // Outside a request scope (scripts, cron handlers): fire and forget.
        void run();
    }
}

async function enqueue(row: Record<string, unknown>): Promise<EnqueueResult> {
    try {
        const supabase = await createSupabaseAdminClient();
        const { error } = await supabase.from("app_email_queue").insert(row);
        if (error) {
            console.error("Email enqueue failed:", error.message);
            return { success: false, error: error.message };
        }
        triggerEmailDrain();
        return { success: true };
    } catch (err) {
        console.error("Email enqueue threw:", err);
        return { success: false, error: (err as Error).message };
    }
}

/** Queue a templated email. Copy lives in app_email_templates. */
export async function enqueueTemplateEmail(input: {
    templateKey: string;
    contextId?: string;
    contextType?: string;
    recipientEmail?: string;
    recipientName?: string;
}): Promise<EnqueueResult> {
    return enqueue({
        mode: "template",
        template_key: input.templateKey,
        context_id: input.contextId ?? null,
        context_type: input.contextType ?? null,
        recipient_email: input.recipientEmail ?? null,
        recipient_name: input.recipientName ?? null,
    });
}

/** Queue a one-off message composed in the admin UI. */
export async function enqueueCustomEmail(input: {
    subject: string;
    bodyHtml: string;
    contextId?: string;
    contextIds?: string[];   // several records combined into one send — see §7
    recipientEmail: string;
    recipientName?: string;
}): Promise<EnqueueResult> {
    const combined = (input.contextIds?.length ?? 0) > 1;
    return enqueue({
        mode: "custom",
        subject: input.subject,
        body_html: input.bodyHtml,
        context_id: input.contextId ?? input.contextIds?.[0] ?? null,
        context_ids: combined ? input.contextIds : null,
        recipient_email: input.recipientEmail,
        recipient_name: input.recipientName ?? null,
    });
}
```

Call sites are one line inside your existing service functions — after the state change
has committed, never before:

```ts
await updateOrderStatus(orderId, "paid");
await enqueueTemplateEmail({
    templateKey: "payment_approved",
    contextId: orderId,
    recipientEmail: order.customerEmail,
});
```

### Admin read + retry

`src/lib/services/email-queue.service.ts`

```ts
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { triggerEmailDrain } from "@/lib/services/email.service";

export interface EmailQueueRow {
    id: string;
    created_at: string;
    mode: "template" | "custom";
    template_key: string | null;
    recipient_email: string | null;
    subject: string | null;
    status: "pending" | "sending" | "sent" | "failed";
    attempts: number;
    last_error: string | null;
    sent_at: string | null;
}

const COLUMNS =
    "id, created_at, mode, template_key, recipient_email, subject, status, attempts, last_error, sent_at";

export async function getRecentEmailQueue(limit = 50) {
    const supabase = await createSupabaseAdminClient();
    const { data, error } = await supabase
        .from("app_email_queue")
        .select(COLUMNS)
        .order("created_at", { ascending: false })
        .limit(limit);

    if (error) return { success: false as const, error: error.message };
    return { success: true as const, data: (data ?? []) as EmailQueueRow[] };
}

/** Re-queue a failed or stuck email and nudge the worker. */
export async function requeueEmail(id: string) {
    const supabase = await createSupabaseAdminClient();
    const { error } = await supabase
        .from("app_email_queue")
        .update({ status: "pending", attempts: 0, last_error: null })
        .eq("id", id);

    if (error) return { success: false as const, error: error.message };
    triggerEmailDrain();
    return { success: true as const };
}
```

Wrap both in `"use server"` actions that assert an admin session before running.

---

## 5. The worker

`supabase/functions/send-email/index.ts`. Deno, no npm install.

```ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

const BATCH_SIZE = 25;
const STUCK_AFTER_MINUTES = 5;
const DRAIN_SECRET = Deno.env.get("EMAIL_DRAIN_SECRET");

serve(async (req) => {
    // verify_jwt is off so the app can ping with a plain fetch — gate on a
    // shared secret instead of leaving the endpoint fully open.
    if (DRAIN_SECRET && req.headers.get("x-drain-secret") !== DRAIN_SECRET) {
        return json({ error: "unauthorized" }, 401);
    }

    try {
        const body = await req.json().catch(() => ({}));

        await reapStuck();

        const ids: string[] = body.queue_id ? [body.queue_id] : await pendingIds();

        let sent = 0;
        let failed = 0;
        for (const id of ids) {
            const row = await claim(id);
            if (!row) continue;            // another run won this row
            (await processRow(row)) ? sent++ : failed++;
        }

        return json({ processed: ids.length, sent, failed }, 200);
    } catch (err) {
        console.error("queue worker error:", err);
        return json({ error: String(err) }, 500);
    }
});

// ─── Queue plumbing ─────────────────────────────────────────────────────────

async function pendingIds(): Promise<string[]> {
    const { data } = await supabase
        .from("app_email_queue")
        .select("id")
        .eq("status", "pending")
        .order("created_at", { ascending: true })
        .limit(BATCH_SIZE);
    return (data ?? []).map((r: { id: string }) => r.id);
}

/**
 * Atomically move a row pending → sending; returns the row only if we won it.
 * This conditional update is what makes concurrent drains safe — two overlapping
 * runs cannot both claim the same row, so nobody gets a duplicate email.
 */
async function claim(id: string) {
    const { data } = await supabase
        .from("app_email_queue")
        .update({ status: "sending" })
        .eq("id", id)
        .eq("status", "pending")
        .select("*")
        .single();
    return data;
}

/** Release rows abandoned mid-send by a crashed/timed-out invocation. */
async function reapStuck(): Promise<void> {
    const cutoff = new Date(Date.now() - STUCK_AFTER_MINUTES * 60_000).toISOString();
    await supabase
        .from("app_email_queue")
        .update({ status: "pending", last_error: "reclaimed after stuck send" })
        .eq("status", "sending")
        .lt("updated_at", cutoff);
}

async function processRow(row: any): Promise<boolean> {
    try {
        const { subject, html, recipient, recipientName } = await render(row);
        await sendEmail({ to: recipient, toName: recipientName, subject, html });

        await supabase
            .from("app_email_queue")
            .update({ status: "sent", sent_at: new Date().toISOString(), last_error: null })
            .eq("id", row.id);

        await supabase.from("app_email_logs").insert({
            queue_id: row.id,
            context_id: row.context_id,
            template_key: row.template_key ?? "custom",
            recipient_email: recipient,
            subject,
            success: true,
        });
        return true;
    } catch (err) {
        const attempts = (row.attempts ?? 0) + 1;
        const exhausted = attempts >= (row.max_attempts ?? 5);

        // Back to `pending` until attempts run out — the next drain retries it.
        await supabase
            .from("app_email_queue")
            .update({
                status: exhausted ? "failed" : "pending",
                attempts,
                last_error: String(err),
            })
            .eq("id", row.id);

        await supabase.from("app_email_logs").insert({
            queue_id: row.id,
            context_id: row.context_id,
            template_key: row.template_key ?? "custom",
            recipient_email: row.recipient_email ?? "unknown",
            success: false,
            error_message: String(err),
        });
        console.error(`queue row ${row.id} failed (attempt ${attempts}):`, err);
        return false;
    }
}

// ─── Rendering ──────────────────────────────────────────────────────────────

async function render(row: any) {
    const context = row.context_id ? await loadContext(row.context_id) : null;
    const vars = buildVariables(context);
    const recipient = row.recipient_email || context?.customer_email || "";
    const recipientName = row.recipient_name || context?.customer_name || "";

    if (!recipient) throw new Error("No recipient email");

    if (row.mode === "custom") {
        if (!row.subject || !row.body_html) {
            throw new Error("Custom email missing subject/body");
        }
        return {
            subject: injectVars(row.subject, vars),
            html: wrapInEmailShell(injectVars(row.body_html, vars)),
            recipient,
            recipientName,
        };
    }

    const { data: template } = await supabase
        .from("app_email_templates")
        .select("subject, body_html, is_active")
        .eq("template_key", row.template_key)
        .single();

    if (!template) throw new Error(`No template for key: ${row.template_key}`);
    if (!template.is_active) throw new Error(`Template ${row.template_key} is inactive`);

    return {
        subject: injectVars(template.subject, vars),
        html: wrapInEmailShell(injectVars(template.body_html, vars)),
        recipient,
        recipientName,
    };
}

/** ─── PROJECT-SPECIFIC: point this at your own domain table. ─── */
async function loadContext(id: string) {
    const { data } = await supabase
        .from("app_orders")
        .select("*, items:app_order_items ( product_name, quantity, unit_price )")
        .eq("id", id)
        .single();
    return data;
}

/** ─── PROJECT-SPECIFIC: the {{variables}} template authors may use. ─── */
function buildVariables(context: any): Record<string, string> {
    if (!context) return {};
    return {
        customer_name: context.customer_name ?? "",
        reference: context.reference ?? "",
        // Money is returned ready-formatted WITH the currency symbol, so authors
        // write {{total_amount}} and can never double up the symbol by hand.
        total_amount: money(context.total_amount ?? 0),
    };
}

function money(amount: number): string {
    return `₦${new Intl.NumberFormat("en-NG", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount)}`;
}

function injectVars(template: string, vars: Record<string, string>): string {
    // Unknown tokens are left intact rather than blanked — a visible {{typo}}
    // in a test send is far easier to debug than a silent empty string.
    return template.replace(/\{\{(\w+)\}\}/g, (match, key: string) =>
        vars[key] === undefined ? match : vars[key]
    );
}

/**
 * Email clients strip <style> blocks and ignore classes, so link styling has to
 * be inlined on every <a> — including links pasted as raw HTML into a template.
 */
const LINK_STYLE = "color:#FF0015;text-decoration:underline;";
function styleLinks(html: string): string {
    return html.replace(/<a\b([^>]*)>/gi, (_full, attrs: string) => {
        if (/\bstyle\s*=/i.test(attrs)) {
            return `<a${attrs.replace(
                /\bstyle\s*=\s*"([^"]*)"/i,
                (_m, s: string) => `style="${s};${LINK_STYLE}"`
            )}>`;
        }
        return `<a${attrs} style="${LINK_STYLE}">`;
    });
}

/** Branded wrapper. Table-based layout + inline styles = Outlook-safe. */
function wrapInEmailShell(bodyContent: string): string {
    const siteUrl = Deno.env.get("PUBLIC_SITE_URL") ?? "https://example.com";
    return `<!DOCTYPE html>
<html lang="en">
  <head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
  <body style="margin:0;padding:0;background:#f6f6f6;font-family:Arial,Helvetica,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding:40px 0;">
      <tr><td align="center">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background:#fff;border:1px solid #e5e5e5;">
          <tr><td style="padding:26px 20px;color:#111;font-size:15.5px;line-height:26px;">
            ${styleLinks(bodyContent)}
          </td></tr>
          <tr><td style="background:#fafafa;padding:22px;border-top:1px solid #e5e5e5;text-align:center;font-size:11px;color:#888;">
            Please do not reply to this email.<br />
            <a href="${siteUrl}" style="${LINK_STYLE}">${siteUrl}</a>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;
}

// ─── Provider: ZeptoMail HTTP API ───────────────────────────────────────────

async function sendEmail(input: {
    to: string;
    toName?: string;
    subject: string;
    html: string;
}): Promise<void> {
    const token = Deno.env.get("ZEPTO_TOKEN");
    const fromAddress = Deno.env.get("ZEPTO_FROM");
    const fromName = Deno.env.get("ZEPTO_FROM_NAME") ?? "";
    const apiUrl = Deno.env.get("ZEPTO_API_URL") ?? "https://api.zeptomail.com/v1.1/email";

    if (!token) throw new Error("ZEPTO_TOKEN not configured");
    if (!fromAddress) throw new Error("ZEPTO_FROM not configured");
    if (!input.to) throw new Error("No recipient email address");

    // Tolerate the secret being stored with or without the scheme prefix.
    const authorization = token.startsWith("Zoho-enczapikey")
        ? token
        : `Zoho-enczapikey ${token}`;

    const res = await fetch(apiUrl, {
        method: "POST",
        headers: {
            Authorization: authorization,
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify({
            from: { address: fromAddress, name: fromName },
            to: [{ email_address: { address: input.to, name: input.toName || input.to } }],
            subject: input.subject,
            htmlbody: input.html,
        }),
    });

    if (!res.ok) {
        const detail = await res.text().catch(() => "");
        throw new Error(`ZeptoMail ${res.status}: ${detail}`);
    }
}

function json(body: unknown, status: number): Response {
    return new Response(JSON.stringify(body), {
        status,
        headers: { "Content-Type": "application/json" },
    });
}
```

`supabase/config.toml`:

```toml
[functions]

[functions.send-email]
verify_jwt = false   # the app pings with a service key + x-drain-secret instead
```

---

## 6. Swapping the provider

Only `sendEmail()` changes.

**Resend**
```ts
await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${Deno.env.get("RESEND_API_KEY")}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: `${fromName} <${fromAddress}>`, to: [input.to], subject: input.subject, html: input.html }),
});
```

**Postmark**
```ts
await fetch("https://api.postmarkapp.com/email", {
    method: "POST",
    headers: { "X-Postmark-Server-Token": Deno.env.get("POSTMARK_TOKEN")!, "Content-Type": "application/json" },
    body: JSON.stringify({ From: fromAddress, To: input.to, Subject: input.subject, HtmlBody: input.html }),
});
```

Keep the contract identical: **throw on failure**. The retry/logging machinery keys off
the exception, so a provider adapter that swallows errors silently breaks the outbox.

---

## 7. Optional: combining several records into one email

When a bulk admin action selects records that share a recipient address, sending N
separate emails to the same person is a bad look. Group before enqueueing:

```ts
const groups = new Map<string, { email: string; ids: string[] }>();
for (const record of records) {
    const key = record.customerEmail.trim().toLowerCase();
    if (!key) continue;
    const group = groups.get(key);
    if (group) group.ids.push(record.id);
    else groups.set(key, { email: record.customerEmail, ids: [record.id] });
}

await Promise.all(
    Array.from(groups.values()).map((g) =>
        enqueueCustomEmail({ contextIds: g.ids, recipientEmail: g.email, subject, bodyHtml })
    )
);
```

The worker then checks `row.context_ids`: if it has more than one entry, load them all
and build **merged variables** — references joined, money fields summed, one captioned
detail block per record — and render the message once. See
`supabase/functions/send-order-email/index.ts` (`buildCombinedVariables`) in this repo for
the reference implementation.

---

## 8. Environment & deploy

**Next.js** (`.env.local` + hosting env):
```
NEXT_PUBLIC_SUPABASE_URL=https://<ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=…
SUPABASE_SERVICE_ROLE_KEY=…      # server only — never expose to the browser
EMAIL_DRAIN_SECRET=<random 32 bytes>
```

**Edge Function secrets** (`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are injected
automatically):
```bash
supabase secrets set \
  ZEPTO_TOKEN='Zoho-enczapikey XXXXXXXX' \
  ZEPTO_FROM='info@yourdomain.com' \
  ZEPTO_FROM_NAME='Your App' \
  PUBLIC_SITE_URL='https://yourdomain.com' \
  EMAIL_DRAIN_SECRET='<same value as the app>'

supabase functions deploy send-email
```

**Safety net** — the `after()` ping is best-effort, so add a sweep so a lost ping can
never strand a row (Supabase Dashboard → Integrations → Cron, or `pg_cron` + `pg_net`):

```sql
select cron.schedule(
  'drain-email-queue', '*/5 * * * *',
  $$ select net.http_post(
       url     := 'https://<ref>.supabase.co/functions/v1/send-email',
       headers := '{"Content-Type":"application/json","x-drain-secret":"<secret>"}'::jsonb,
       body    := '{"drain":true}'::jsonb
     ); $$
);
```

This is the one legitimate use of `pg_net` here: a dumb periodic sweep, not per-row
delivery logic.

---

## 9. Checklist

- [ ] Migration applied; three tables exist with RLS on and no policies
- [ ] Default templates seeded (`on conflict do nothing`)
- [ ] `send-email` deployed, `verify_jwt = false`, secrets set
- [ ] App env has `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `EMAIL_DRAIN_SECRET`
- [ ] SPF, DKIM and DMARC configured for the sending domain
- [ ] Test send lands in an inbox (not spam) and writes `app_email_logs.success = true`
- [ ] Admin Delivery view lists queue rows and the Retry button works
- [ ] Cron sweep scheduled
- [ ] Failure path verified: set a bad `ZEPTO_TOKEN`, confirm `attempts` climbs and the
      row lands in `failed` after `max_attempts`

---

## 10. Failure modes and where they surface

| Symptom | Look at | Usual cause |
| --- | --- | --- |
| Row stays `pending` | Function logs; was the ping sent? | Missing env in the app, or worker 401 on `x-drain-secret` |
| Row stuck in `sending` | `updated_at` age | Worker crashed mid-send; the reaper releases it after 5 min |
| `failed` with `ZeptoMail 401` | `last_error` | Token wrong, or missing the `Zoho-enczapikey ` prefix |
| `failed` with `ZeptoMail 400` | `last_error` body | From-address domain not verified in ZeptoMail |
| `No template for key: X` | `app_email_templates` | Template not seeded, or key typo at the call site |
| `Template X is inactive` | `is_active` | Admin toggled it off — intended behaviour |
| Vars render as `{{name}}` | `buildVariables()` | Key not in the map; unknown tokens are left visible on purpose |
| Email renders unstyled | — | Classes/`<style>` stripped by the client; inline everything |

---

## 11. Gotchas learned the hard way

1. **Enqueue after the commit, never before.** A queued email for a transaction that then
   rolls back is a lie the customer receives.
2. **`after()` needs a request scope.** In scripts and cron handlers it throws — hence the
   try/catch fallback to `void run()`.
3. **`claim()` is load-bearing.** Without the `.eq("status", "pending")` guard on the
   update, two overlapping drains double-send. Don't "simplify" it.
4. **Never let the worker return 200 on a send failure.** The retry logic depends on the
   throw propagating out of `sendEmail()`.
5. **Format money in `buildVariables()`, symbol included.** Let template authors type a
   currency symbol by hand and you will ship `₦₦15,500`.
6. **Idempotent seeds only.** `on conflict do nothing`, so re-running a migration never
   overwrites the admin's edited copy.
7. **Log every attempt, including failures.** `app_email_logs` is how you answer "did they
   actually get it?" months later.
```
