// supabase/functions/send-order-email/index.ts
// Transactional email sender triggered by order/payment status changes
// Fetches templates from DB, renders with customer data, sends via Zoho SMTP

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
        items:rw_order_items (
          product_name, variant_label, quantity, unit_price, image_url
        )
      `
            )
            .eq("id", order_id)
            .single();

        if (orderError || !order) {
            throw new Error(`Order not found: ${orderError?.message}`);
        }

        // 2. Determine template key based on event type
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
            return new Response(
                JSON.stringify({ skipped: true, reason: "no_template" }),
                {
                    status: 200,
                }
            );
        }

        if (!template.is_active) {
            console.info(`Template ${templateKey} is inactive, skipping.`);
            return new Response(
                JSON.stringify({ skipped: true, reason: "template_inactive" }),
                {
                    status: 200,
                }
            );
        }

        // 4. Build items HTML for order summary
        const itemsHtml = buildItemsHtml(order.items || []);

        // 5. Inject variables into subject and body
        const balance = order.total_amount - order.amount_paid;
        const variables: Record<string, string> = {
            customer_name: order.customer_name || "",
            order_ref: order.order_ref || "",
            total_amount: formatNaira(order.total_amount || 0),
            amount_paid: formatNaira(order.amount_paid || 0),
            balance: formatNaira(balance),
            items_html: itemsHtml,
        };

        const subject = injectVars(template.subject, variables);
        const bodyContent = injectVars(template.body_html, variables);

        // 6. Wrap in full HTML email shell with RCF branding
        const fullHtml = wrapInEmailShell(bodyContent, order.order_ref);

        // 7. Send via Zoho SMTP
        await sendEmail({
            to: order.customer_email || "",
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

        return new Response(JSON.stringify({ sent: true, order_ref: order.order_ref }), {
            headers: { "Content-Type": "application/json" },
            status: 200,
        });
    } catch (err) {
        console.error("send-order-email error:", err);

        // Try to log the failure
        try {
            const payload = await req.clone().json();
            await supabase.from("rw_email_logs").insert({
                order_id: payload.order_id ?? null,
                payment_id: payload.payment_id ?? null,
                template_key: payload.new_status ?? "unknown",
                recipient_email: "unknown",
                success: false,
                error_message: String(err),
            });
        } catch (logErr) {
            console.error("Failed to log email error:", logErr);
        }

        return new Response(JSON.stringify({ error: String(err) }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
});

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Format an amount in Naira with proper localization
 */
function formatNaira(amount: number): string {
    return new Intl.NumberFormat("en-NG", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
}

/**
 * Replace {{variable}} placeholders in template strings
 */
function injectVars(template: string, vars: Record<string, string>): string {
    return template.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] ?? `{{${key}}}`);
}

/**
 * Build an HTML table of order items for the email body
 */
function buildItemsHtml(items: any[]): string {
    if (!items?.length) return "";

    const rows = items
        .map(
            (item) => `
    <tr>
      <td style="padding:8px 0;border-bottom:1px solid #f0e8d6;">${item.product_name || ""}</td>
      <td style="padding:8px 0;border-bottom:1px solid #f0e8d6;color:#8b6914;">${item.variant_label || ""}</td>
      <td style="padding:8px 0;border-bottom:1px solid #f0e8d6;text-align:center;">${item.quantity || 0}</td>
      <td style="padding:8px 0;border-bottom:1px solid #f0e8d6;text-align:right;">₦${formatNaira(item.unit_price || 0)}</td>
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

/**
 * Wrap email body in full HTML structure with RCF branding
 */
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

/**
 * Send email via Zoho SMTP
 */
async function sendEmail({
    to,
    subject,
    html,
}: {
    to: string;
    subject: string;
    html: string;
}): Promise<void> {
    const smtpUser = Deno.env.get("ZOHO_SMTP_USER");
    const smtpPass = Deno.env.get("ZOHO_SMTP_PASS");

    if (!smtpUser || !smtpPass) {
        throw new Error(
            "Zoho SMTP credentials not configured (ZOHO_SMTP_USER, ZOHO_SMTP_PASS)"
        );
    }

    const client = new SmtpClient();

    try {
        await client.connectTLS({
            hostname: "smtp.zoho.com",
            port: 465,
            username: smtpUser,
            password: smtpPass,
        });

        await client.send({
            from: smtpUser,
            to,
            subject,
            content: "Please view this email in an HTML-compatible mail client.",
            html,
        });
    } finally {
        await client.close();
    }
}
