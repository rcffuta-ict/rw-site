# Email Integration System for RCF FUTA Redemption Week '26

## 🎯 Overview

This PR implements a complete transactional email notification system for the pre-order platform. Customers now receive automatic email updates at every stage of their order and payment journey.

**Architecture:**
- **Database Layer:** Supabase tables for email templates and logs
- **Trigger Layer:** PostgreSQL triggers on `rw_orders.status` and `rw_payments.status` changes
- **Edge Function:** Supabase Function (`send-order-email`) that renders and sends emails
- **SMTP Gateway:** Zoho Mail for reliable email delivery
- **Admin UI:** Full template management interface for non-technical admins

---

## ✨ What's New

### Database Schema (`docs/schema.sql`)
- ✅ Added `pg_net` extension for HTTP calls from database triggers
- ✅ Created `rw_email_templates` table (editable email templates with variable support)
- ✅ Created `rw_email_logs` table (audit trail of all email send attempts)
- ✅ Added `notify_order_status_change()` trigger function (fires when order status changes)
- ✅ Added `notify_payment_status_change()` trigger function (fires when payment status changes)
- ✅ Enabled RLS on new tables

### Backend Services (`src/lib/services/email-templates.service.ts`)
- ✅ `getEmailTemplates()` — Fetch all templates with optional filters
- ✅ `getEmailTemplate(idOrKey)` — Fetch single template by ID or key
- ✅ `updateEmailTemplate()` — Update template with admin attribution
- ✅ `getEmailLogsForOrder()` — Audit trail for specific order
- ✅ `getRecentEmailLogs()` — Dashboard stats
- ✅ `getEmailStats()` — Email delivery success metrics

### Supabase Edge Function (`supabase/functions/send-order-email/index.ts`)
- ✅ Triggered by database via `pg_net.http_post()`
- ✅ Fetches order details and order items from DB
- ✅ Retrieves template by status key
- ✅ Injects variables: `{{customer_name}}`, `{{order_ref}}`, `{{total_amount}}`, `{{amount_paid}}`, `{{balance}}`, `{{items_html}}`
- ✅ Wraps content in RCF-branded HTML shell
- ✅ Sends via Zoho SMTP (TLS 465)
- ✅ Logs success/failure to `rw_email_logs`

### Admin UI Components
**EmailTemplateEditor.tsx** (`src/components/admin/EmailTemplateEditor.tsx`)
- ✅ Edit template label, subject, and HTML body
- ✅ Toggle template active/inactive status
- ✅ Live preview with sample data
- ✅ Supported variables reference panel
- ✅ Save with admin email attribution

**EmailLogsViewer.tsx** (`src/components/admin/EmailLogsViewer.tsx`)
- ✅ Display recent email sends (50 entries)
- ✅ Success/failure indicators
- ✅ Error message hover tooltips
- ✅ Time ago formatting

**Email Templates Admin Page** (`src/app/(admin)/admin/email-templates/page.tsx`)
- ✅ Full template management interface
- ✅ Email statistics dashboard (30-day metrics)
- ✅ Expandable template editor with syntax highlighting
- ✅ Recent email send audit log

### Email Templates Seed Script (`docs/seed-email-templates.sql`)
- ✅ 12 default templates pre-configured:
  - Order status (8): `pending`, `partially_paid`, `paid`, `confirmed`, `in_production`, `delivered`, `flagged`, `cancelled`
  - Payment status (4): `payment_pending`, `payment_approved`, `payment_flagged`, `payment_rejected`
- ✅ RCF-branded HTML with project colors (burgundy #5c4a1e, gold #f5c842, cream #fdf6e8)
- ✅ Professional copy tailored to each event

### Type Definitions (`src/lib/data/types.ts`)
- ✅ `EmailTemplate` interface (with camelCase mapping)
- ✅ `EmailLog` interface
- ✅ Aligned with existing project conventions

---

## 🚀 How It Works

### Order Status Change Flow
```
Admin updates order.status in UI
        ↓
Database trigger fires: notify_order_status_change()
        ↓
pg_net.http_post() calls Edge Function asynchronously
        ↓
Edge Function fetches order + items + template from DB
        ↓
Renders HTML with customer data injected
        ↓
Sends via Zoho SMTP (smpt.zoho.com:465 TLS)
        ↓
Logs result (success/failure) to rw_email_logs
        ↓
Customer receives email in inbox
```

### Payment Status Change Flow
Same flow, but:
- Triggered by `rw_payments.status` UPDATE
- Template key derived from: `payment_{{ new_status }}`
- Email notifies about payment approval/rejection status

---

## 🔧 Setup Instructions

### 1. Run Schema Migration
In Supabase Dashboard → SQL Editor, run:
```sql
-- Paste entire contents of docs/schema.sql
```

Verify:
- ✅ `pg_net` extension exists
- ✅ `rw_email_templates` table created
- ✅ `rw_email_logs` table created
- ✅ Trigger functions created

### 2. Configure Supabase Database Settings
In **Supabase Dashboard → Settings → Database → Postgres Settings**:
```
app.supabase_url = https://YOUR_PROJECT_REF.supabase.co
app.supabase_service_role_key = YOUR_SERVICE_ROLE_KEY
```

### 3. Generate Zoho SMTP Credentials
- Log in to **mail.zoho.com → Settings → Mail Accounts**
- Select your sending account
- Go to **Security → App Passwords**
- Generate new app password labeled `rw26-supabase`
- Note the password

### 4. Set Supabase Edge Function Secrets
In **Supabase Dashboard → Edge Functions → Secrets**:
```bash
supabase secrets set ZOHO_SMTP_USER=orders@yourdomain.com
supabase secrets set ZOHO_SMTP_PASS=your_zoho_app_password
```

### 5. Deploy Edge Function
```bash
supabase functions deploy send-order-email
```

### 6. Seed Default Templates
In Supabase Dashboard → SQL Editor, run:
```sql
-- Paste entire contents of docs/seed-email-templates.sql
```

Verify: `SELECT COUNT(*) FROM rw_email_templates` → should return **12**

### 7. Update Environment Variables
In `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
```

---

## 📧 Email Trigger Matrix

| Event | Status | Template Key | Trigger |
|-------|--------|---|---|
| Order created | `pending` | `pending` | Customer needs to upload receipt |
| Partial payment approved | `partially_paid` | `partially_paid` | Confirm partial payment received |
| Full payment approved | `paid` | `paid` | Confirm order fully paid |
| Moderator confirms | `confirmed` | `confirmed` | Order queued for production |
| In production | `in_production` | `in_production` | Items being made |
| Ready for collection | `delivered` | `delivered` | Order ready pickup |
| Manual review needed | `flagged` | `flagged` | Issue requires action |
| Order cancelled | `cancelled` | `cancelled` | Cancellation notice |
| Receipt submitted | Payment `pending` | `payment_pending` | Receipt under review |
| Payment verified | Payment `approved` | `payment_approved` | Payment confirmed |
| Receipt flagged | Payment `flagged` | `payment_flagged` | Resubmit receipt |
| Payment rejected | Payment `rejected` | `payment_rejected` | Payment could not be verified |

---

## 🎨 Customization

### Edit Email Templates from Admin UI
1. Go to **Admin → Email Templates**
2. Click template name to expand
3. Edit subject, body HTML, or toggle active status
4. Click "Preview" to see sample rendering
5. Click "Save Template" to persist changes

### Supported Template Variables
- `{{customer_name}}` — Customer's first name
- `{{order_ref}}` — Order reference code (e.g., `FF3A9C`)
- `{{total_amount}}` — Formatted total (e.g., `₦15,000`)
- `{{amount_paid}}` — Formatted paid amount
- `{{balance}}` — Remaining balance
- `{{items_html}}` — HTML table of order items

### Add New Email Template
1. Insert row in `rw_email_templates` with unique `template_key`
2. Set `label`, `subject`, `body_html`, `is_active`
3. Add corresponding logic in Edge Function (or keep dormant for future use)

---

## 📊 Monitoring & Debugging

### View Email Logs
```sql
-- Last 50 emails sent
SELECT sent_at, recipient_email, template_key, success, error_message
FROM rw_email_logs
ORDER BY sent_at DESC
LIMIT 50;

-- Failed sends in last 24 hours
SELECT * FROM rw_email_logs
WHERE success = FALSE AND sent_at > NOW() - INTERVAL '24 hours'
ORDER BY sent_at DESC;

-- Success rate by template
SELECT template_key, COUNT(*) AS total,
       SUM(CASE WHEN success THEN 1 ELSE 0 END) AS successful,
       ROUND(100.0 * SUM(CASE WHEN success THEN 1 ELSE 0 END) / COUNT(*), 2) AS success_rate
FROM rw_email_logs
GROUP BY template_key
ORDER BY template_key;
```

### Admin Dashboard Stats
Visit **Admin → Email Templates** to see:
- Total emails sent (30 days)
- Successful sends
- Failed sends
- Success rate %

### Test Email Manually
1. Update an order status from Admin UI
2. Check `rw_email_logs` table
3. Look for matching `template_key` entry
4. If `success=false`, check `error_message` column

---

## 🔐 Security Considerations

- ✅ Zoho SMTP credentials stored in Supabase Secrets (never in code or .env)
- ✅ Email templates stored in DB (not hardcoded)
- ✅ RLS enabled on all email tables (service_role only)
- ✅ Edge Function authenticated via service role key
- ✅ All sends logged for audit purposes
- ✅ Admin attribution tracked (`updated_by` field)

---

## 📦 Dependencies Added

```json
{
  "date-fns": "^3.x" // For email log time formatting
}
```

All other dependencies (Supabase, Next.js, React) already present.

---

## 📁 File Structure

```
docs/
  ├── schema.sql                    (updated with email tables & triggers)
  ├── seed-email-templates.sql      (NEW — default template data)
  └── email-integration.md          (referenced guide)

supabase/
  └── functions/
      └── send-order-email/
          └── index.ts              (NEW — Deno Edge Function)

src/
  ├── lib/
  │   ├── data/
  │   │   └── types.ts              (updated with EmailTemplate, EmailLog)
  │   └── services/
  │       └── email-templates.service.ts  (NEW — CRUD service)
  ├── components/admin/
  │   ├── EmailTemplateEditor.tsx         (NEW — template editor component)
  │   └── EmailLogsViewer.tsx             (NEW — logs display component)
  └── app/(admin)/admin/
      └── email-templates/
          └── page.tsx               (NEW — admin page)
```

---

## ✅ Testing Checklist

Before merging:
- [ ] Schema migration runs without errors
- [ ] `rw_email_templates` table has 12 rows (seed script ran)
- [ ] Database settings (app.supabase_url, app.supabase_service_role_key) configured
- [ ] Zoho SMTP secrets set in Supabase
- [ ] Edge Function deployed: `supabase functions deploy send-order-email`
- [ ] Update order status in test order → email log entry appears in `rw_email_logs`
- [ ] Check email inbox (and spam folder) for test email
- [ ] Test all 8 order statuses at least once
- [ ] Verify variables replaced correctly in received email
- [ ] Admin can edit template, save, and changes persist
- [ ] Email stats dashboard shows correct metrics
- [ ] Deactivate template, change status, verify no email sent

---

## 🚨 Common Issues & Fixes

| Problem | Cause | Solution |
|---------|-------|----------|
| No email sent, no log | Trigger not firing | Run schema.sql again; check `pg_net` enabled |
| Log shows "Order not found" | Race condition | Order transaction not committed yet |
| SMTP auth error in log | Wrong credentials | Regenerate Zoho app password; update secret |
| Email arrives in spam | Domain not verified | Set up SPF, DKIM, DMARC records |
| Variables not replaced | Wrong syntax | Use `{{variable_name}}` with double braces |
| Template not found | Template key mismatch | Check `template_key` in trigger vs. DB |

---

## 📝 Notes

- Email templates can be edited from the admin UI without code redeploy
- Triggers are set to SECURITY DEFINER to bypass RLS
- Edge Function uses Deno's native SMTP client (no external dependencies)
- All email sends are logged for compliance & debugging
- Success rate metrics available in admin dashboard
- System gracefully skips emails for inactive templates

---

## 🎉 Summary

This implementation provides a **production-ready transactional email system** with:
- ✅ Database-driven templates (no code redeploy needed)
- ✅ Automatic triggers on order/payment status changes
- ✅ Professional RCF-branded emails
- ✅ Zoho SMTP integration
- ✅ Full admin UI for template management
- ✅ Audit logging & monitoring
- ✅ Variable injection for dynamic content
- ✅ Success/failure tracking

Customers now receive timely, professional notifications throughout their pre-order journey. 🎊
