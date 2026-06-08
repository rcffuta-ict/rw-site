// supabase/functions/send-order-email/index.ts
// Email queue worker for RW'26.
//
// The Next.js app enqueues rows into `rw_email_queue` and then pings this
// function to drain it (see lib/services/email.service.ts). This function:
//   • claims pending rows (status pending → sending, atomically)
//   • renders each (status template, or a custom admin message)
//   • sends via the ZeptoMail HTTP API
//   • marks sent / failed (with retry via `attempts`) and writes rw_email_logs
//
// POST body:
//   {}                  → drain pending rows (default)
//   { "drain": true }   → drain pending rows
//   { "queue_id": "…" } → process just that row (used by the Retry button)
//
// There is no pg_net / `net` dependency anywhere.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

const SITE_URL = Deno.env.get("PUBLIC_SITE_URL") ?? "https://rw.rcffuta.com";
const BATCH_SIZE = 25;

serve(async (req) => {
    try {
        const body = await req.json().catch(() => ({}));
        const ids: string[] = body.queue_id ? [body.queue_id] : await pendingIds();

        let sent = 0;
        let failed = 0;
        for (const id of ids) {
            const row = await claim(id);
            if (!row) continue; // already taken by another run
            const ok = await processRow(row);
            ok ? sent++ : failed++;
        }

        return json({ processed: ids.length, sent, failed }, 200);
    } catch (err) {
        console.error("queue worker error:", err);
        return json({ error: String(err) }, 500);
    }
});

// ─── Queue plumbing ──────────────────────────────────────────────────────────

async function pendingIds(): Promise<string[]> {
    const { data } = await supabase
        .from("rw_email_queue")
        .select("id")
        .eq("status", "pending")
        .order("created_at", { ascending: true })
        .limit(BATCH_SIZE);
    return (data ?? []).map((r: { id: string }) => r.id);
}

/** Atomically move a row pending → sending. Returns the row only if we won it. */
async function claim(id: string) {
    const { data } = await supabase
        .from("rw_email_queue")
        .update({ status: "sending" })
        .eq("id", id)
        .eq("status", "pending")
        .select("*")
        .single();
    return data;
}

async function processRow(row: any): Promise<boolean> {
    try {
        const { subject, html, recipient, recipientName } = await render(row);
        await sendEmail({ to: recipient, toName: recipientName, subject, html });

        await supabase
            .from("rw_email_queue")
            .update({
                status: "sent",
                sent_at: new Date().toISOString(),
                last_error: null,
            })
            .eq("id", row.id);

        await supabase.from("rw_email_logs").insert({
            order_id: row.order_id,
            payment_id: row.payment_id,
            template_key:
                row.template_key ?? (row.mode === "custom" ? "custom" : row.new_status),
            recipient_email: recipient,
            subject,
            success: true,
        });
        return true;
    } catch (err) {
        const attempts = (row.attempts ?? 0) + 1;
        const exhausted = attempts >= (row.max_attempts ?? 5);
        await supabase
            .from("rw_email_queue")
            .update({
                status: exhausted ? "failed" : "pending",
                attempts,
                last_error: String(err),
            })
            .eq("id", row.id);

        await supabase.from("rw_email_logs").insert({
            order_id: row.order_id,
            payment_id: row.payment_id,
            template_key:
                row.template_key ?? (row.mode === "custom" ? "custom" : row.new_status),
            recipient_email: row.recipient_email ?? "unknown",
            success: false,
            error_message: String(err),
        });
        console.error(`queue row ${row.id} failed (attempt ${attempts}):`, err);
        return false;
    }
}

// ─── Rendering ───────────────────────────────────────────────────────────────

async function render(row: any) {
    const order = row.order_id ? await fetchOrder(row.order_id) : null;
    const vars = order ? buildVariables(order) : { customer_name: "" };
    const recipient = row.recipient_email || order?.customer_email || "";
    const recipientName = order?.customer_name || "";
    const orderRef = order?.order_ref || "";

    if (!recipient) throw new Error("No recipient email");

    if (row.mode === "custom") {
        if (!row.subject || !row.body_html)
            throw new Error("Custom email missing subject/body");

        // Several orders that share this email were combined into one send:
        // render the admin's message once (using the primary order's
        // variables), then append a details block for each order.
        const orderIds: string[] = Array.isArray(row.order_ids) ? row.order_ids : [];
        if (orderIds.length > 1) {
            const orders = (await Promise.all(orderIds.map(fetchOrder))).filter(
                Boolean
            );
            const primary = orders[0] ?? order;
            const primaryVars = primary ? buildVariables(primary) : vars;
            const blocks = orders.map(buildOrderBlock).join("");
            return {
                subject: injectVars(row.subject, primaryVars),
                html: wrapInEmailShell(
                    injectVars(row.body_html, primaryVars) + blocks,
                    primary?.order_ref || orderRef
                ),
                recipient,
                recipientName: primary?.customer_name || recipientName,
            };
        }

        return {
            subject: injectVars(row.subject, vars),
            html: wrapInEmailShell(injectVars(row.body_html, vars), orderRef),
            recipient,
            recipientName,
        };
    }

    // status mode
    const { data: template } = await supabase
        .from("rw_email_templates")
        .select("subject, body_html, is_active")
        .eq("template_key", row.template_key)
        .single();

    if (!template) throw new Error(`No template for key: ${row.template_key}`);
    if (!template.is_active) throw new Error(`Template ${row.template_key} is inactive`);

    return {
        subject: `${injectVars(template.subject, vars)} - Redemption Week RCFFUTA`,
        html: wrapInEmailShell(injectVars(template.body_html, vars), orderRef),
        recipient,
        recipientName,
    };
}

async function fetchOrder(orderId: string) {
    const { data } = await supabase
        .from("rw_orders")
        .select(
            `*, items:rw_order_items ( product_name, variant_label, quantity, unit_price, image_url )`
        )
        .eq("id", orderId)
        .single();
    return data;
}

function buildVariables(order: any): Record<string, string> {
    const balance = (order.total_amount || 0) - (order.amount_paid || 0);
    return {
        customer_name: order.customer_name || "",
        order_ref: order.order_ref || "",
        // Money fields are returned ready-formatted WITH the ₦ symbol, so
        // template authors just write {{total_amount}} (no manual ₦).
        total_amount: naira(order.total_amount || 0),
        amount_paid: naira(order.amount_paid || 0),
        balance: naira(balance),
        items_html: buildItemsHtml(order.items || []),
    };
}

/**
 * A per-order section appended to a combined custom email — the order
 * reference, its amounts, and its items table.
 */
function buildOrderBlock(order: any): string {
    const balance = (order.total_amount || 0) - (order.amount_paid || 0);
    return `
    <div style="margin-top:24px; padding-top:16px; border-top:1px solid #e8d0d4;">
      <p style="margin:0 0 4px; font-size:14px; font-weight:700; color:#1C0003;">
        Order #${order.order_ref || ""}
      </p>
      <p style="margin:0 0 8px; font-size:13px; color:#5c4048;">
        Total ${naira(order.total_amount || 0)} · Paid ${naira(order.amount_paid || 0)} · Balance ${naira(balance)}
      </p>
      ${buildItemsHtml(order.items || [])}
    </div>`;
}

// ─── Formatting helpers ──────────────────────────────────────────────────────

function json(body: unknown, status: number): Response {
    return new Response(JSON.stringify(body), {
        status,
        headers: { "Content-Type": "application/json" },
    });
}

function formatNaira(amount: number): string {
    return new Intl.NumberFormat("en-NG", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
}

/** Formatted amount with the Naira symbol, e.g. ₦15,500 */
function naira(amount: number): string {
    return `₦${formatNaira(amount)}`;
}

/**
 * Force every link in the email body to be brand-coloured + underlined. Email
 * clients ignore CSS classes/stylesheets, so the style must be inline on each
 * <a> — this covers links from templates or raw HTML, not just ones inserted
 * via the editor (which already carry the style).
 */
const LINK_STYLE = "color:#FF0015;text-decoration:underline;";
function styleLinks(html: string): string {
    return html.replace(/<a\b([^>]*)>/gi, (_full, attrs: string) => {
        if (/\bstyle\s*=/i.test(attrs)) {
            // Merge into the existing style attribute (don't clobber it).
            return `<a${attrs.replace(
                /\bstyle\s*=\s*"([^"]*)"/i,
                (_m, s: string) => `style="${s};${LINK_STYLE}"`
            )}>`;
        }
        return `<a${attrs} style="${LINK_STYLE}">`;
    });
}

function injectVars(template: string, vars: Record<string, string>): string {
    return template.replace(
        /\{\{(\w+)\}\}/g,
        (match: string, key: string, offset: number, source: string) => {
            const value = vars[key];
            if (value === undefined) return match;
            // Order refs are stored bare (e.g. FF3A9C) but shown with a leading
            // "#". Add it automatically — unless the author already typed one
            // right before the token (e.g. legacy "#{{order_ref}}") so we never
            // double it up.
            if (key === "order_ref" && value && source[offset - 1] !== "#") {
                return `#${value}`;
            }
            return value;
        }
    );
}

function buildItemsHtml(items: any[]): string {
    if (!items?.length) return "";

    const rows = items
        .map(
            (item) => `
    <tr>
      <td style="padding:12px 8px; border-bottom:1px solid #e8d0d4; color:#1C0003; font-weight:500;">
        ${item.product_name || ""}
      </td>
      <td style="padding:12px 8px; border-bottom:1px solid #e8d0d4; color:#5c4048;">
        ${item.variant_label || ""}
      </td>
      <td style="padding:12px 8px; border-bottom:1px solid #e8d0d4; text-align:center; color:#1C0003;">
        ${item.quantity || 0}
      </td>
      <td style="padding:12px 8px; border-bottom:1px solid #e8d0d4; text-align:right; color:#1C0003; font-weight:600;">
        ${naira(item.unit_price || 0)}
      </td>
    </tr>`
        )
        .join("");

    return `
    <table style="width:100%; border-collapse:collapse; margin:24px 0; font-size:14px; table-layout:fixed;">
      <thead>
        <tr style="background:#fdf5f5;">
          <th style="padding:12px 8px; text-align:left; color:#5c4048; font-size:12px; text-transform:uppercase; letter-spacing:0.5px; font-weight:600;">Item</th>
          <th style="padding:12px 8px; text-align:left; color:#5c4048; font-size:12px; text-transform:uppercase; letter-spacing:0.5px; font-weight:600;">Variant</th>
          <th style="padding:12px 8px; text-align:center; color:#5c4048; font-size:12px; text-transform:uppercase; letter-spacing:0.5px; font-weight:600;">Qty</th>
          <th style="padding:12px 8px; text-align:right; color:#5c4048; font-size:12px; text-transform:uppercase; letter-spacing:0.5px; font-weight:600;">Price</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>`;
}
/** Branded shell — colours mirror the site theme (ink #1C0003, crimson #FF0015). */
/** Professional Preorder Email Shell */
function wrapInEmailShell(bodyContent: string, orderRef?: string): string {
    const refLine = orderRef
        ? `<p style="margin:0 0 8px 0; font-size:13px; color:#9a8085;">
         Order Reference: <strong style="color:#1C0003;">#${orderRef}</strong>
       </p>`
        : "";

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Preorder Confirmation - Redemption Week '26</title>
</head>
<body style="margin:0; padding:0; background-color:#fdf5f5; font-family:Arial,Helvetica,sans-serif; -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#fdf5f5; padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:900px; background:#ffffff; overflow:hidden; border:1px solid #e8d0d4;">

          <!-- HEADER -->
          <tr>
            <td style="background:#1C0003; padding:20px 10px; text-align:center;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <!-- Flex-like header with icon + title -->
                    <table cellpadding="0" cellspacing="0" style="margin:0 auto;">
                      <tr>
                        <td style="padding-right:12px;">
                          <img src="${SITE_URL}/images/logos/tenure-icon.png"
                               alt="RCF FUTA" width="auto" height="70"
                               style="display:block;" />
                        </td>
                        <td style="text-align:left; vertical-align:middle;">
                          <p style="margin:0; color:#FF6A00; font-size:13px; font-weight:700; letter-spacing:3px; text-transform:uppercase;">
                            RCF FUTA
                          </p>
                          <h1 style="margin:4px 0 0 0; color:#ffffff; font-size:26px; font-weight:700; line-height:1.1;">
                            Redemption Week
                          </h1>
                          <p style="margin:2px 0 0 0; color:#FF6A00; font-size:15px; font-weight:600;">
                            38th Anniversary
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Accent -->
          <tr>
            <td height="5" style="background:#FF0015; height:5px; font-size:0;">&nbsp;</td>
          </tr>

          <!-- BODY -->
          <tr>
            <td style="padding:26px 20px; color:#1C0003; font-size:15.5px; line-height:26px;">
              ${styleLinks(bodyContent)}
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background:#fdf5f5; padding:22px 0px; border-top:1px solid #e8d0d4; text-align:center;">
              ${refLine}

              <p style="margin:12px 0 8px; font-size:13px; color:#1C0003; font-weight:700;">
                Redemption Week '26 • RCFFUTA
              </p>
              <p style="margin:0 0 16px; font-size:12px; color:#5c4048; font-style:italic;">
                The Lord's Witnesses: The Purified Army
              </p>

              <hr style="border:0; border-top:1px solid #e8d0d4; width:70%; margin:20px auto;" />

              <p style="margin:0; font-size:11px; color:#9a8085; line-height:1.5;">
              <span>
              This is an official communication from the Redemption Week Merch Team.<br>
                Please do not reply to this email. For enquiries, contact the committee.
              </span>
              <span>
                    You are receiving this email because you placed an order
                    on the
                    <a
                        href="https://rw.rcffuta.com"
                        style="color:#FF0015;text-decoration:underline;"
                    >
                        Redemption Week platform
                    </a>
                    .
                </span>
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

// ─── ZeptoMail HTTP API ──────────────────────────────────────────────────────

async function sendEmail({
    to,
    toName,
    subject,
    html,
}: {
    to: string;
    toName?: string;
    subject: string;
    html: string;
}): Promise<void> {
    const token = Deno.env.get("ZEPTO_TOKEN");
    const fromAddress = Deno.env.get("ZEPTO_FROM") ?? "info@rw.rcffuta.com";
    const fromName = Deno.env.get("ZEPTO_FROM_NAME") ?? "Redemption Week RCF FUTA";
    const apiUrl =
        Deno.env.get("ZEPTO_API_URL") ?? "https://api.zeptomail.com/v1.1/email";

    if (!token) throw new Error("ZEPTO_TOKEN not configured");
    if (!to) throw new Error("No recipient email address");

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
            to: [{ email_address: { address: to, name: toName || to } }],
            subject,
            htmlbody: html,
        }),
    });

    if (!res.ok) {
        const detail = await res.text().catch(() => "");
        throw new Error(`ZeptoMail ${res.status}: ${detail}`);
    }
}
