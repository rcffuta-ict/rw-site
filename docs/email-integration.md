# RCF FUTA — Redemption Week '26

## Email Notification System: Comprehensive Implementation Plan

---

## Overview

This document covers the full implementation of transactional email notifications for every stage of the pre-order flow. The system is built on:

- **Supabase** — database triggers, Edge Functions, `pg_net` for HTTP calls
- **Zoho Mail** — SMTP delivery
- **Next.js** — admin template editor UI
- **React Email / HTML** — email templates styled to the project's color theme

The flow is: **order status changes in Supabase → database trigger fires → Edge Function called → Zoho SMTP sends email to customer.**

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Email Trigger Matrix](#2-email-trigger-matrix)
3. [Step 1 — Supabase: Enable pg_net](#3-step-1--supabase-enable-pg_net)
4. [Step 2 — Email Templates Table](#4-step-2--email-templates-table)
5. [Step 3 — Database Trigger Function](#5-step-3--database-trigger-function)
6. [Step 4 — Supabase Edge Function](#6-step-4--supabase-edge-function)
7. [Step 5 — Zoho SMTP Configuration](#7-step-5--zoho-smtp-configuration)
8. [Step 6 — Environment Variables](#8-step-6--environment-variables)
9. [Step 7 — Admin Template Editor UI](#9-step-7--admin-template-editor-ui)
10. [Step 9 — Email Log Table](#11-step-9--email-log-table)
11. [Step 10 — Testing Checklist](#12-step-10--testing-checklist)
12. [Troubleshooting](#13-troubleshooting)

---

## 1. Architecture Overview

```
[Moderator updates order status in Admin UI]
        ↓
[rw_orders.status UPDATE fires SQL trigger]
        ↓
[notify_order_status_change() calls pg_net.http_post()]
        ↓
[Supabase Edge Function: send-order-email]
        ↓ (fetches order + items + email template from DB)
[Renders HTML email with customer data injected]
        ↓
[Sends via Zoho SMTP (nodemailer)]
        ↓
[Logs result to rw_email_logs]
        ↓
[Customer receives email]
```

**Key design decisions:**

- Templates are stored in the database so admins can edit them from the Supabase UI or the custom admin template editor without a code deployment.
- `pg_net` is used for the trigger-to-function call so no external queue or webhook is needed.
- Zoho is called via SMTP (not the Zoho API) for simplicity and reliability.

---

## 2. Email Trigger Matrix

Every `order_status` enum value maps to one email. The table below defines when each fires and its purpose.

| Status           | Trigger Event                     | Email Purpose                              | CTA                    |
| ---------------- | --------------------------------- | ------------------------------------------ | ---------------------- |
| `pending`        | Order created                     | Confirm order received, show items + total | Upload payment receipt |
| `partially_paid` | Payment approved (partial)        | Confirm partial payment, show balance      | Pay remaining balance  |
| `paid`           | Payment fully approved            | Confirm full payment received              | None / track order     |
| `confirmed`      | Moderator confirms for production | Order queued for production                | None                   |
| `in_production`  | Moderator marks in production     | Item is being made                         | None                   |
| `delivered`      | Moderator marks delivered         | Item is ready / collected                  | Write a review / share |
| `flagged`        | Moderator flags order             | Issue with order, action required          | Contact admin          |
| `cancelled`      | Order cancelled                   | Order cancelled, refund info if applicable | Contact admin          |

Additionally, payment-level events also trigger emails:

| Payment Status | Trigger Event              | Email Purpose                  |
| -------------- | -------------------------- | ------------------------------ |
| `pending`      | Customer submits receipt   | Receipt received, under review |
| `approved`     | Moderator approves payment | Payment confirmed              |
| `flagged`      | Moderator flags receipt    | Problem with receipt, resubmit |
| `rejected`     | Moderator rejects payment  | Payment rejected, reason given |

---

## 3. Step 1 — Supabase: Enable pg_net

Run this in **Supabase UI → Database → SQL Editor**:

```sql
-- Enable the pg_net extension for making HTTP calls from triggers
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Set app-level settings used by the trigger
-- Replace values with your actual Supabase project URL and service role key
ALTER DATABASE postgres SET app.supabase_url = 'https://YOUR_PROJECT_REF.supabase.co';
ALTER DATABASE postgres SET app.supabase_service_role_key = 'YOUR_SERVICE_ROLE_KEY';
```

> **Security note:** The service role key is stored as a database setting, only accessible from within Postgres — not exposed to client-side code. It is used only to authenticate the call to the Edge Function.

---

## 4. Step 2 — Email Templates Table

This table stores the editable email templates. Admins can update subject lines and body HTML directly from the Supabase Table Editor or from your custom admin UI.

Run in **SQL Editor**:

```sql
-- ─── Email Templates ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS rw_email_templates (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- The key matches either an order_status value or a payment_status event key
  template_key TEXT NOT NULL UNIQUE,
  label        TEXT NOT NULL,             -- human-readable name e.g. "Order Confirmed"
  subject      TEXT NOT NULL,             -- email subject line (supports {{variables}})
  body_html    TEXT NOT NULL,             -- full HTML body (supports {{variables}})
  is_active    BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_by   TEXT                       -- email of the admin who last edited
);

CREATE OR REPLACE TRIGGER email_templates_set_updated_at
  BEFORE UPDATE ON rw_email_templates
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE rw_email_templates IS
  'Editable transactional email templates. template_key maps to order_status or payment event keys. '
  'Supports {{customer_name}}, {{order_ref}}, {{total_amount}}, {{amount_paid}}, {{balance}}, {{items_html}} variables.';

-- ─── Email Logs ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS rw_email_logs (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id       UUID REFERENCES rw_orders(id) ON DELETE SET NULL,
  payment_id     UUID REFERENCES rw_payments(id) ON DELETE SET NULL,
  template_key   TEXT NOT NULL,
  recipient_email TEXT NOT NULL,
  subject        TEXT,
  success        BOOLEAN NOT NULL DEFAULT FALSE,
  error_message  TEXT,
  sent_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_email_logs_order ON rw_email_logs(order_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_sent_at ON rw_email_logs(sent_at DESC);
```

### Seed the Default Templates

```sql
INSERT INTO rw_email_templates (template_key, label, subject, body_html) VALUES

('pending',
 'Order Received',
 'Your RW''26 Pre-Order is Confirmed — #{{order_ref}}',
 '<p>Hi {{customer_name}},</p><p>We have received your pre-order <strong>#{{order_ref}}</strong> totalling <strong>₦{{total_amount}}</strong>. Please upload your payment receipt to proceed.</p>{{items_html}}<p>— RCF FUTA Team</p>'),

('partially_paid',
 'Partial Payment Confirmed',
 'Partial Payment Received — #{{order_ref}}',
 '<p>Hi {{customer_name}},</p><p>We confirmed a payment of <strong>₦{{amount_paid}}</strong> on your order <strong>#{{order_ref}}</strong>. Your outstanding balance is <strong>₦{{balance}}</strong>.</p>{{items_html}}<p>— RCF FUTA Team</p>'),

('paid',
 'Full Payment Confirmed',
 'Payment Complete — Your RW''26 Order is Fully Paid 🎉',
 '<p>Hi {{customer_name}},</p><p>Your order <strong>#{{order_ref}}</strong> is fully paid (₦{{total_amount}}). We will notify you when it enters production.</p>{{items_html}}<p>— RCF FUTA Team</p>'),

('confirmed',
 'Order Confirmed for Production',
 'Order #{{order_ref}} — Queued for Production',
 '<p>Hi {{customer_name}},</p><p>Great news! Your order <strong>#{{order_ref}}</strong> has been confirmed and queued for production. We will update you when it is ready.</p><p>— RCF FUTA Team</p>'),

('in_production',
 'Order In Production',
 'Your RW''26 Items Are Being Made — #{{order_ref}}',
 '<p>Hi {{customer_name}},</p><p>Your order <strong>#{{order_ref}}</strong> is currently in production. We will notify you once it is ready for collection.</p><p>— RCF FUTA Team</p>'),

('delivered',
 'Order Delivered',
 'Your RW''26 Order is Ready for Collection — #{{order_ref}}',
 '<p>Hi {{customer_name}},</p><p>Your order <strong>#{{order_ref}}</strong> is ready! Please come and collect your items. We hope you love them!</p><p>— RCF FUTA Team</p>'),

('flagged',
 'Order Flagged — Action Required',
 'Action Required on Your Order #{{order_ref}}',
 '<p>Hi {{customer_name}},</p><p>Your order <strong>#{{order_ref}}</strong> has been flagged for review. Please contact us so we can resolve any issues as soon as possible.</p><p>— RCF FUTA Team</p>'),

('cancelled',
 'Order Cancelled',
 'Your Order #{{order_ref}} Has Been Cancelled',
 '<p>Hi {{customer_name}},</p><p>We are sorry to inform you that your order <strong>#{{order_ref}}</strong> has been cancelled. If you believe this is an error, please contact us immediately.</p><p>— RCF FUTA Team</p>'),

('payment_pending',
 'Payment Receipt Received',
 'We Received Your Payment Receipt — #{{order_ref}}',
 '<p>Hi {{customer_name}},</p><p>Your payment receipt for order <strong>#{{order_ref}}</strong> is under review. We will notify you once it has been verified.</p><p>— RCF FUTA Team</p>'),

('payment_approved',
 'Payment Approved',
 'Payment Approved — #{{order_ref}}',
 '<p>Hi {{customer_name}},</p><p>Your payment of <strong>₦{{amount_paid}}</strong> for order <strong>#{{order_ref}}</strong> has been approved.</p><p>— RCF FUTA Team</p>'),

('payment_flagged',
 'Payment Receipt Flagged',
 'Issue With Your Payment Receipt — #{{order_ref}}',
 '<p>Hi {{customer_name}},</p><p>There is an issue with the payment receipt you submitted for order <strong>#{{order_ref}}</strong>. Please contact us or resubmit a clear receipt.</p><p>— RCF FUTA Team</p>'),

('payment_rejected',
 'Payment Rejected',
 'Payment Could Not Be Verified — #{{order_ref}}',
 '<p>Hi {{customer_name}},</p><p>Unfortunately your payment receipt for order <strong>#{{order_ref}}</strong> could not be verified. Please contact us to resolve this.</p><p>— RCF FUTA Team</p>')

ON CONFLICT (template_key) DO NOTHING;
```

---

## 5. Step 3 — Database Trigger Function

This fires when `rw_orders.status` is updated. It calls the Edge Function via `pg_net`.

```sql
-- ─── Trigger: notify on order status change ───────────────────────────────────
CREATE OR REPLACE FUNCTION notify_order_status_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Only fire when status actually changes
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    PERFORM net.http_post(
      url     := current_setting('app.supabase_url')
                 || '/functions/v1/send-order-email',
      headers := jsonb_build_object(
        'Content-Type',  'application/json',
        'Authorization', 'Bearer ' || current_setting('app.supabase_service_role_key')
      ),
      body    := jsonb_build_object(
        'event_type',      'order_status',
        'order_id',        NEW.id,
        'new_status',      NEW.status,
        'customer_email',  NEW.customer_email,
        'customer_name',   NEW.customer_name,
        'order_ref',       NEW.order_ref,
        'total_amount',    NEW.total_amount,
        'amount_paid',     NEW.amount_paid
      )::text
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER order_status_email_trigger
  AFTER UPDATE OF status ON rw_orders
  FOR EACH ROW EXECUTE FUNCTION notify_order_status_change();


-- ─── Trigger: notify on payment status change ────────────────────────────────
CREATE OR REPLACE FUNCTION notify_payment_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    PERFORM net.http_post(
      url     := current_setting('app.supabase_url')
                 || '/functions/v1/send-order-email',
      headers := jsonb_build_object(
        'Content-Type',  'application/json',
        'Authorization', 'Bearer ' || current_setting('app.supabase_service_role_key')
      ),
      body    := jsonb_build_object(
        'event_type',     'payment_status',
        'order_id',       NEW.order_id,
        'payment_id',     NEW.id,
        'new_status',     NEW.status,
        'payment_amount', NEW.amount_confirmed
      )::text
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER payment_status_email_trigger
  AFTER UPDATE OF status ON rw_payments
  FOR EACH ROW EXECUTE FUNCTION notify_payment_status_change();
```

---

## 6. Step 4 — Supabase Edge Function

Create this file at `supabase/functions/send-order-email/index.ts` in your project repo, then deploy with `supabase functions deploy send-order-email`.

```typescript
// supabase/functions/send-order-email/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";

const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

serve(async (req) => {
    try {
        const payload = await req.json();
        const { event_type, order_id, new_status, payment_id } = payload;

        // 1. Fetch full order with items
        const { data: order, error: orderError } = await supabase
            .from("rw_orders")
            .select(
                `
        *,
        rw_order_items (
          product_name, variant_label, quantity, unit_price, image_url
        )
      `
            )
            .eq("id", order_id)
            .single();

        if (orderError || !order) {
            throw new Error(`Order not found: ${orderError?.message}`);
        }

        // 2. Determine template key
        const templateKey =
            event_type === "payment_status" ? `payment_${new_status}` : new_status;

        // 3. Fetch template from DB
        const { data: template, error: templateError } = await supabase
            .from("rw_email_templates")
            .select("subject, body_html, is_active")
            .eq("template_key", templateKey)
            .single();

        if (templateError || !template) {
            console.warn(`No template found for key: ${templateKey}`);
            return new Response("No template", { status: 200 });
        }

        if (!template.is_active) {
            console.info(`Template ${templateKey} is inactive, skipping.`);
            return new Response("Template inactive", { status: 200 });
        }

        // 4. Build items HTML for order summary block
        const itemsHtml = buildItemsHtml(order.rw_order_items);

        // 5. Inject variables into subject + body
        const balance = order.total_amount - order.amount_paid;
        const variables: Record<string, string> = {
            customer_name: order.customer_name,
            order_ref: order.order_ref,
            total_amount: formatNaira(order.total_amount),
            amount_paid: formatNaira(order.amount_paid),
            balance: formatNaira(balance),
            items_html: itemsHtml,
        };

        const subject = injectVars(template.subject, variables);
        const bodyContent = injectVars(template.body_html, variables);

        // 6. Wrap in full HTML email shell
        const fullHtml = wrapInEmailShell(bodyContent, order.order_ref);

        // 7. Send via Zoho SMTP
        await sendEmail({
            to: order.customer_email,
            subject,
            html: fullHtml,
        });

        // 8. Log success
        await supabase.from("rw_email_logs").insert({
            order_id: order_id,
            payment_id: payment_id ?? null,
            template_key: templateKey,
            recipient_email: order.customer_email,
            subject,
            success: true,
        });

        return new Response(JSON.stringify({ sent: true }), {
            headers: { "Content-Type": "application/json" },
        });
    } catch (err) {
        console.error("send-order-email error:", err);

        // Log failure if we have enough context
        try {
            const payload = await req.clone().json();
            await supabase.from("rw_email_logs").insert({
                order_id: payload.order_id ?? null,
                template_key: payload.new_status ?? "unknown",
                recipient_email: "unknown",
                success: false,
                error_message: String(err),
            });
        } catch {
            /* ignore secondary logging errors */
        }

        return new Response(JSON.stringify({ error: String(err) }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
});

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatNaira(amount: number): string {
    return new Intl.NumberFormat("en-NG", {
        minimumFractionDigits: 0,
    }).format(amount);
}

function injectVars(template: string, vars: Record<string, string>): string {
    return template.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] ?? `{{${key}}}`);
}

function buildItemsHtml(items: any[]): string {
    if (!items?.length) return "";
    const rows = items
        .map(
            (item) => `
    <tr>
      <td style="padding:8px 0;border-bottom:1px solid #f0e8d6;">${item.product_name}</td>
      <td style="padding:8px 0;border-bottom:1px solid #f0e8d6;color:#8b6914;">${item.variant_label}</td>
      <td style="padding:8px 0;border-bottom:1px solid #f0e8d6;text-align:center;">${item.quantity}</td>
      <td style="padding:8px 0;border-bottom:1px solid #f0e8d6;text-align:right;">₦${formatNaira(item.unit_price)}</td>
    </tr>
  `
        )
        .join("");
    return `
    <table style="width:100%;border-collapse:collapse;margin:16px 0;font-size:14px;">
      <thead>
        <tr style="background:#fdf6e8;">
          <th style="padding:8px;text-align:left;color:#5c4a1e;">Item</th>
          <th style="padding:8px;text-align:left;color:#5c4a1e;">Variant</th>
          <th style="padding:8px;text-align:center;color:#5c4a1e;">Qty</th>
          <th style="padding:8px;text-align:right;color:#5c4a1e;">Price</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

function wrapInEmailShell(bodyContent: string, orderRef: string): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>RCF FUTA — Redemption Week '26</title>
</head>
<body style="margin:0;padding:0;background:#fdf6e8;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#fdf6e8;padding:32px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0"
               style="background:#ffffff;border-radius:8px;overflow:hidden;
                      border:1px solid #e8d5a3;max-width:600px;">

          <!-- Header -->
          <tr>
            <td style="background:#5c4a1e;padding:24px 32px;text-align:center;">
              <p style="margin:0;color:#f5c842;font-size:11px;letter-spacing:3px;
                        text-transform:uppercase;font-family:Arial,sans-serif;">
                RCF FUTA
              </p>
              <h1 style="margin:4px 0 0;color:#ffffff;font-size:22px;
                         font-family:Georgia,serif;font-weight:normal;">
                Redemption Week '26
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px;color:#3d2e0e;font-size:16px;line-height:1.7;">
              ${bodyContent}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#fdf6e8;padding:20px 32px;border-top:1px solid #e8d5a3;
                       text-align:center;">
              <p style="margin:0;font-size:12px;color:#8b6914;font-family:Arial,sans-serif;">
                Order reference: <strong>#${orderRef}</strong>
              </p>
              <p style="margin:8px 0 0;font-size:11px;color:#b8a06a;font-family:Arial,sans-serif;">
                RCF FUTA · Federal University of Technology, Akure
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

async function sendEmail({
    to,
    subject,
    html,
}: {
    to: string;
    subject: string;
    html: string;
}) {
    const client = new SmtpClient();

    await client.connectTLS({
        hostname: "smtp.zoho.com",
        port: 465,
        username: Deno.env.get("ZOHO_SMTP_USER")!,
        password: Deno.env.get("ZOHO_SMTP_PASS")!,
    });

    await client.send({
        from: Deno.env.get("ZOHO_SMTP_USER")!,
        to,
        subject,
        content: "Please view this email in an HTML-compatible mail client.",
        html,
    });

    await client.close();
}
```

---

## 7. Step 5 — Zoho SMTP Configuration

### In Zoho Mail settings:

1. Log in to **mail.zoho.com → Settings → Mail Accounts**
2. Select your sending account
3. Go to **Security → App Passwords** and generate a new app password labeled `rw26-supabase`
4. Note down the password — you will use it as `ZOHO_SMTP_PASS`

### SMTP connection details:

| Setting        | Value                                 |
| -------------- | ------------------------------------- |
| Host           | `smtp.zoho.com`                       |
| Port (SSL)     | `465`                                 |
| Port (TLS)     | `587`                                 |
| Authentication | Your Zoho email + app password        |
| From address   | Must match authenticated Zoho account |

> Use port **465 with TLS** (`connectTLS`) as shown in the Edge Function. Port 587 requires `STARTTLS` which has a different connection method in Deno's SMTP client.

---

## 8. Step 6 — Environment Variables

Add these to your Supabase project via **Supabase Dashboard → Settings → Edge Functions → Secrets**, or via the CLI:

```bash
supabase secrets set ZOHO_SMTP_USER=orders@yourdomain.com
supabase secrets set ZOHO_SMTP_PASS=your_zoho_app_password
```

These are already injected automatically by Supabase and do not need to be set manually:

```
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
SUPABASE_ANON_KEY
```

And in your Next.js `.env.local` (for the admin template editor UI):

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

---

## 9. Step 7 — Admin Template Editor UI

Create a page at `app/admin/email-templates/page.tsx` (or `pages/admin/email-templates.tsx`). This page lets admins:

- Browse all templates by status type
- Edit subject and body HTML with live preview
- Toggle templates active/inactive
- See the supported `{{variables}}` list
- Save directly to the `rw_email_templates` table via Supabase client

The React component for this UI is provided separately (see **Step 8**). Here is the data-fetching layer:

```typescript
// lib/email-templates.ts
import { createClient } from "@/lib/supabase/server"; // or your client factory

export interface EmailTemplate {
    id: string;
    template_key: string;
    label: string;
    subject: string;
    body_html: string;
    is_active: boolean;
    updated_at: string;
    updated_by: string | null;
}

export async function getAllTemplates(): Promise<EmailTemplate[]> {
    const supabase = createClient();
    const { data, error } = await supabase
        .from("rw_email_templates")
        .select("*")
        .order("template_key");

    if (error) throw error;
    return data;
}

export async function updateTemplate(
    id: string,
    patch: Partial<Pick<EmailTemplate, "subject" | "body_html" | "is_active">>,
    adminEmail: string
) {
    const supabase = createClient();
    const { error } = await supabase
        .from("rw_email_templates")
        .update({ ...patch, updated_by: adminEmail })
        .eq("id", id);

    if (error) throw error;
}
```

---

## 10. SKIP

## 11. Step 9 — Email Log Table

The `rw_email_logs` table (created in Step 2) records every send attempt. You can query it directly in the **Supabase Table Editor** or build a simple admin log view.

Useful queries:

```sql
-- Last 50 emails sent
SELECT sent_at, recipient_email, template_key, subject, success, error_message
FROM rw_email_logs
ORDER BY sent_at DESC
LIMIT 50;

-- Failed sends in last 24 hours
SELECT * FROM rw_email_logs
WHERE success = FALSE
  AND sent_at > NOW() - INTERVAL '24 hours'
ORDER BY sent_at DESC;

-- Email volume per template
SELECT template_key, COUNT(*) AS total_sent,
       SUM(CASE WHEN success THEN 1 ELSE 0 END) AS successful
FROM rw_email_logs
GROUP BY template_key
ORDER BY total_sent DESC;
```

---

## 12. Step 10 — Testing Checklist

Work through this list before going live:

- [ ] `pg_net` extension is enabled (`SELECT * FROM pg_extension WHERE extname = 'pg_net'`)
- [ ] `app.supabase_url` and `app.supabase_service_role_key` database settings are correct
- [ ] Edge Function deployed: `supabase functions deploy send-order-email`
- [ ] Zoho SMTP secrets set in Supabase Edge Function secrets
- [ ] All 12 default templates seeded (`SELECT COUNT(*) FROM rw_email_templates` → 12)
- [ ] Test by updating an order status manually in Supabase Table Editor and checking `rw_email_logs`
- [ ] Verify email arrives in inbox (check spam folder on first run)
- [ ] Test every status transition at least once
- [ ] Confirm `{{variables}}` are being replaced correctly in received emails
- [ ] Enable RLS policy on `rw_email_templates` so only admin role can write:

---

## 13. Troubleshooting

| Symptom                                  | Likely Cause                                              | Fix                                                                                 |
| ---------------------------------------- | --------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| No email sent, no log entry              | Trigger not firing                                        | Check `pg_net` is enabled; re-run trigger creation SQL                              |
| Log entry shows error: `Order not found` | Race condition — trigger fires before transaction commits | Add `DEFERRABLE INITIALLY DEFERRED` to trigger, or use `pg_net` with a slight delay |
| Log entry shows SMTP auth error          | Wrong Zoho credentials                                    | Regenerate app password in Zoho; update Supabase secret                             |
| Email arrives but variables not replaced | Template uses wrong syntax                                | Variables must use double curly braces: `{{order_ref}}`                             |
| Emails going to spam                     | Sending domain not verified                               | Set up SPF, DKIM, and DMARC records for your Zoho domain                            |
| Edge Function timeout                    | SMTP connection slow                                      | Zoho SMTP can be slow; increase Supabase function timeout to 10s in `config.toml`   |
| Template editor not saving               | RLS blocking write                                        | Ensure admin is authenticated and RLS policy allows writes                          |

---

## Summary of Files Created / Modified

| File                                           | Action        | Purpose                                                         |
| ---------------------------------------------- | ------------- | --------------------------------------------------------------- |
| Supabase SQL Editor                            | Run migration | `pg_net` extension, templates table, email logs, triggers       |
| `supabase/functions/send-order-email/index.ts` | Create        | Edge Function — fetches template, renders email, sends via Zoho |
| `lib/email-templates.ts`                       | Create        | TypeScript helpers for template CRUD                            |
| `app/admin/email-templates/page.tsx`           | Create        | Admin UI page wrapper                                           |
| `components/admin/EmailTemplateEditor.jsx`     | Create        | React template editor with live preview                         |
| `.env.local`                                   | Update        | Add Supabase env vars                                           |
| Supabase Secrets                               | Set           | `ZOHO_SMTP_USER`, `ZOHO_SMTP_PASS`                              |

---

_Last updated: May 2026 · RCF FUTA — Redemption Week '26_
