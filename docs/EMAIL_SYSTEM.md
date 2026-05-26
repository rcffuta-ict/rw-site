# Email Integration System — RW '26

## Overview

This is a complete transactional email system built on Supabase Edge Functions and Zoho Mail. When order or payment statuses change, the database automatically triggers an email to the customer using editable HTML templates stored in the database.

**Key Features:**

- 🚀 **Automatic triggers** — fires on order/payment status change
- 📧 **Zoho SMTP** — reliable delivery via Zoho Mail
- 🎨 **Editable templates** — manage from admin UI, no code redeploy
- 📊 **Email logs** — audit trail of all sends (success/failure)
- 🔧 **Variables** — dynamic data injection (customer name, order ref, amounts, item list)
- 💾 **Database-driven** — templates stored in Supabase, easy to backup/migrate

---

## Architecture

```
┌─────────────────────────┐
│  Admin Updates Order    │
│    Status in Supabase   │
└────────────┬────────────┘
             │
             ▼
┌──────────────────────────────────┐
│ Database Trigger Fires:          │
│ notify_order_status_change()     │
└────────────┬─────────────────────┘
             │
             ▼
┌──────────────────────────────────┐
│ pg_net.http_post() calls Edge   │
│ Function: send-order-email       │
└────────────┬─────────────────────┘
             │
             ▼
┌──────────────────────────────────┐
│ Edge Function:                   │
│ 1. Fetch template from DB        │
│ 2. Fetch order + items from DB   │
│ 3. Inject variables              │
│ 4. Wrap in email shell           │
│ 5. Send via Zoho SMTP            │
│ 6. Log result to email_logs      │
└────────────┬─────────────────────┘
             │
             ▼
┌──────────────────────────────────┐
│ Customer Receives Email          │
│ + Entry in rw_email_logs         │
└──────────────────────────────────┘
```

---

## Database Schema

### Tables

#### `rw_email_templates`

Stores editable email templates. One row per template type.

```typescript
{
    id: UUID; // Primary key
    template_key: string; // Unique: 'pending', 'paid', 'payment_approved', etc.
    label: string; // Display name: "Order Confirmed", "Payment Approved"
    subject: string; // Email subject line (with {{variables}})
    body_html: string; // HTML email body (with {{variables}})
    is_active: boolean; // If false, template is skipped by triggers
    updated_at: timestamp; // Auto-updated on save
    updated_by: string; // Email of admin who last edited
}
```

#### `rw_email_logs`

Audit log of every email send attempt.

```typescript
{
    id: UUID; // Primary key
    order_id: UUID; // Foreign key to rw_orders (nullable)
    payment_id: UUID; // Foreign key to rw_payments (nullable)
    template_key: string; // Which template was used
    recipient_email: string; // Who received the email
    subject: string; // Subject line that was sent
    success: boolean; // Did it send successfully?
    error_message: string; // If failed, the error details
    sent_at: timestamp; // When the attempt was made
}
```

### Triggers

#### `order_status_email_trigger`

- **On:** UPDATE of `status` on `rw_orders`
- **Action:** Calls Edge Function if status changed
- **Payload:** order_id, new_status, customer_email, customer_name, order_ref, amounts

#### `payment_status_email_trigger`

- **On:** UPDATE of `status` on `rw_payments`
- **Action:** Calls Edge Function if status changed
- **Payload:** order_id, payment_id, new_status

---

## Email Template Variables

Every template supports these variables. Use double curly braces: `{{variable_name}}`

| Variable            | Example              | Use                            |
| ------------------- | -------------------- | ------------------------------ |
| `{{customer_name}}` | "John Doe"           | Greeting                       |
| `{{order_ref}}`     | "FF3A9C"             | Order ID display               |
| `{{total_amount}}`  | "₦15,000"            | Total price (formatted)        |
| `{{amount_paid}}`   | "₦10,000"            | Amount received (formatted)    |
| `{{balance}}`       | "₦5,000"             | Remaining payment (formatted)  |
| `{{items_html}}`    | `<table>...</table>` | Order line items as HTML table |

**Example template subject:**

```
Your RW'26 Pre-Order is Confirmed — #{{order_ref}}
```

**Example template body:**

```html
<p>Hi {{customer_name}},</p>
<p>Thank you for your pre-order totalling <strong>₦{{total_amount}}</strong>.</p>
{{items_html}}
<p>Please upload your payment receipt.</p>
```

---

## Default Templates

The system ships with 12 pre-written templates:

### Order Status Templates (8)

1. **pending** — "Order Received"
    - Trigger: Order created
    - CTA: Upload payment receipt

2. **partially_paid** — "Partial Payment Confirmed"
    - Trigger: Partial payment approved
    - CTA: Pay remaining balance

3. **paid** — "Full Payment Confirmed"
    - Trigger: Order fully paid
    - CTA: None / track status

4. **confirmed** — "Order Confirmed for Production"
    - Trigger: Moderator confirms for production
    - CTA: None / wait for update

5. **in_production** — "Items Being Made"
    - Trigger: Moderator marks in production
    - CTA: None / wait for ready notification

6. **delivered** — "Order Ready for Collection"
    - Trigger: Moderator marks delivered
    - CTA: Come collect items

7. **flagged** — "Action Required"
    - Trigger: Order flagged by moderator
    - CTA: Contact admin

8. **cancelled** — "Order Cancelled"
    - Trigger: Order cancelled
    - CTA: Contact admin to appeal

### Payment Status Templates (4)

9. **payment_pending** — "Receipt Received"
    - Trigger: Payment receipt submitted
    - CTA: Wait for review

10. **payment_approved** — "Payment Approved"
    - Trigger: Moderator approves payment
    - CTA: None

11. **payment_flagged** — "Receipt Has Issues"
    - Trigger: Moderator flags receipt
    - CTA: Resubmit clear receipt

12. **payment_rejected** — "Payment Verification Failed"
    - Trigger: Moderator rejects payment
    - CTA: Contact admin

---

## Admin Interface

### Email Templates Page

**URL:** `/admin/email-templates`

**Features:**

- View all 12 templates
- Expand template details
- Edit subject and HTML body
- Toggle active/inactive
- Live preview with sample data
- Save changes directly to database
- View email send stats (total, success rate, failures)
- Browse recent email logs

### Template Editor

- **Subject field:** Text input (supports {{variables}})
- **Body field:** HTML textarea (raw HTML)
- **Active toggle:** Inactive templates are skipped by triggers
- **Preview button:** Shows email with sample data injected
- **Save button:** Persists changes immediately

### Email Logs

- **Recent sends table:** Last 50 email send attempts
- **Status column:** ✓ Sent or ✗ Failed with error details
- **Filters:** By template, recipient, date range (SQL query recommended)

---

## Admin API (Server-Side)

All functions are `"use server"` and located in `lib/services/email-templates.service.ts`

### Functions

```typescript
// Get all templates
getEmailTemplates(options?: { only_active?: boolean }): Promise<ServiceResult<EmailTemplate[]>>

// Get a single template by key or ID
getEmailTemplate(idOrKey: string): Promise<ServiceResult<EmailTemplate>>

// Update a template
updateEmailTemplate(
  id: string,
  patch: Partial<Pick<EmailTemplate, "subject" | "body_html" | "is_active" | "label">>,
  adminEmail?: string
): Promise<ServiceResult<EmailTemplate>>

// Get email logs for an order
getEmailLogsForOrder(orderId: string): Promise<ServiceResult<EmailLog[]>>

// Get recent email logs (default 50)
getRecentEmailLogs(limit?: number): Promise<ServiceResult<EmailLog[]>>

// Get email statistics (success rate, failure count, etc.)
getEmailStats(since?: Date): Promise<ServiceResult<EmailStatistics>>
```

**Return type:**

```typescript
interface ServiceResult<T> {
    success: boolean;
    data?: T; // Present if success is true
    error?: string; // Present if success is false
}
```

---

## Supabase Edge Function

**File:** `supabase/functions/send-order-email/index.ts`

**Triggers:**

- HTTP POST from database triggers via `pg_net`

**Input (JSON body):**

```typescript
{
  event_type: "order_status" | "payment_status";
  order_id: string;
  new_status: string;           // e.g. "paid", "payment_approved"
  customer_email: string;
  customer_name: string;
  order_ref: string;
  total_amount: number;
  amount_paid: number;
  payment_id?: string;           // Only for payment_status events
  payment_amount?: number;       // Only for payment_status events
}
```

**Process:**

1. Fetch full order with items from Supabase
2. Look up email template by key (status or `payment_{status}`)
3. Skip if template is inactive
4. Build items HTML table
5. Inject variables into subject and body
6. Wrap in full email shell with RCF branding
7. Send via Zoho SMTP (TLS on port 465)
8. Log success/failure to `rw_email_logs`

**Environment variables (set as secrets):**

```
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
ZOHO_SMTP_USER (app-specific password)
ZOHO_SMTP_PASS
```

---

## Setup Checklist

- [ ] Schema migration ran (docs/schema.sql)
- [ ] Zoho Mail credentials generated (app password)
- [ ] Supabase database settings set (app.supabase_url, app.supabase_service_role_key)
- [ ] Edge Function deployed (`supabase functions deploy send-order-email`)
- [ ] Edge Function secrets set (ZOHO_SMTP_USER, ZOHO_SMTP_PASS)
- [ ] Email templates seeded (docs/seed-email-templates.sql)
- [ ] Admin can access `/admin/email-templates`
- [ ] Test email sent successfully
- [ ] Verify email logs are being created
- [ ] Review and customize template text

For detailed step-by-step instructions, see **docs/EMAIL_SETUP.md**.

---

## Testing

### Manual Test (via Supabase Dashboard)

1. Create a test order in `rw_orders` table:
    - customer_name: "Test User"
    - customer_email: [your email]
    - total_amount: 5000
    - status: "pending"

2. Create an order item in `rw_order_items`:
    - link to the order
    - product_name: "T-Shirt"
    - variant_label: "Black · L"
    - quantity: 1
    - unit_price: 5000

3. Update order status to "paid":
    - Edit the order row
    - Change status from "pending" to "paid"
    - Save

4. Check `rw_email_logs` within 10 seconds:
    - New entry should appear with success=true
    - Email should arrive in your inbox

5. Check for failures:
    - If success=false, read the error_message column
    - Check Edge Function logs: Dashboard → Edge Functions → send-order-email

### SQL Test Queries

```sql
-- See all sent emails
SELECT * FROM rw_email_logs ORDER BY sent_at DESC LIMIT 20;

-- See failures only
SELECT * FROM rw_email_logs WHERE success = FALSE;

-- Success rate
SELECT COUNT(*) as total,
       SUM(CASE WHEN success THEN 1 ELSE 0 END) as successful,
       ROUND(100.0 * SUM(CASE WHEN success THEN 1 ELSE 0 END) / COUNT(*), 2) as percent
FROM rw_email_logs;

-- Emails for a specific order
SELECT * FROM rw_email_logs WHERE order_id = 'ORDER_UUID_HERE';
```

---

## Troubleshooting

### Email not sending

**Check 1: Database trigger is firing**

- Update an order status in Supabase
- Immediately check `rw_email_logs` for a new entry
- If no entry appears, trigger isn't firing

**Check 2: pg_net is enabled**

```sql
SELECT * FROM pg_extension WHERE extname = 'pg_net';
```

Should return 1 row. If not, run: `CREATE EXTENSION pg_net;`

**Check 3: Database settings are correct**

- Supabase Dashboard → Settings → Database → Postgres Settings
- Verify `app.supabase_url` and `app.supabase_service_role_key` are set
- Settings may take 1–2 minutes to apply after saving

**Check 4: Edge Function is deployed**

```bash
supabase functions list
```

Should show `send-order-email` in the list.

**Check 5: Secrets are set**

```bash
supabase secrets list
```

Should show `ZOHO_SMTP_USER` and `ZOHO_SMTP_PASS`.

**Check 6: Zoho credentials are correct**

- Regenerate app password in mail.zoho.com
- Update the secret: `supabase secrets set ZOHO_SMTP_PASS=new_password`
- Re-test

**Check 7: Template is active**

```sql
SELECT template_key, is_active FROM rw_email_templates;
```

Template should have `is_active = true`. Toggle it in the admin UI if needed.

### Email going to spam

- Configure SPF, DKIM, DMARC records for your sending domain
- Use a domain-verified Zoho account (not free zoho.com email)
- Test with your own email first, then use customer emails

### Admin page not loading

- Check that you're logged in and have admin role
- Verify RLS is properly configured (should allow admin to read templates)
- Check browser console for errors

### Template variables not replaced

- Ensure syntax is `{{variable_name}}` (double braces)
- Check variable name matches the list above
- Common mistake: `{variable_name}` (single braces) won't work

---

## Performance & Limits

- **Email send time:** 1–5 seconds per email (depends on Zoho SMTP latency)
- **Log retention:** Unlimited (no archival set, consider adding retention policy)
- **Template count:** 50+ (current default is 12)
- **Concurrent sends:** Edge Function limits to 1 per order status update (queuing recommended for bulk sends)

---

## Security

- 🔐 **Service role key** is only used server-side (Edge Function, Server Actions)
- 🔐 **Zoho credentials** are stored as Supabase secrets (not in code)
- 🔐 **Database triggers** use SECURITY DEFINER to safely call Edge Function
- 🔐 **RLS** is enabled on all email tables — only admin can read/write

---

## Roadmap

Potential enhancements:

- [ ] Email template preview in public store (show customer what they'll get)
- [ ] Batch email sending (admin can trigger manual sends to multiple orders)
- [ ] Email attachments (e.g., PDF invoice)
- [ ] SMS fallback (Twilio integration)
- [ ] HTML email signature with RCF branding
- [ ] Email scheduling (send at specific time)
- [ ] Unsubscribe links + preference center
- [ ] A/B testing templates
- [ ] Webhook retries for failed sends

---

## References

- **Setup Guide:** `docs/EMAIL_SETUP.md`
- **Complete Architecture:** `docs/email-integration.md`
- **Schema:** `docs/schema.sql`
- **Templates Seed:** `docs/seed-email-templates.sql`
- **Edge Function:** `supabase/functions/send-order-email/index.ts`
- **Service Layer:** `src/lib/services/email-templates.service.ts`
- **Components:** `src/components/admin/EmailTemplateEditor.tsx`, `EmailLogsViewer.tsx`
- **Admin Page:** `src/app/(admin)/admin/email-templates/page.tsx`

---

**Questions?** Refer to the docs or review the Edge Function logs in Supabase Dashboard.

Last updated: May 2026
RCF FUTA — Redemption Week '26
