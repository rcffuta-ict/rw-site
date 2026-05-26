# Email Integration — Quick Reference

## 🎯 What Was Built

A **production-ready transactional email system** for the RCF FUTA Redemption Week '26 pre-order platform.

**Customers receive automatic emails when:**
- Order is created
- Payment is received
- Payment is approved/rejected
- Order status changes (confirmed, in production, delivered, etc.)

---

## 📁 What Was Added/Modified

### New Files
```
supabase/functions/send-order-email/index.ts    ← Deno Edge Function
src/lib/services/email-templates.service.ts     ← Backend CRUD service
src/components/admin/EmailTemplateEditor.tsx    ← Admin UI component
src/components/admin/EmailLogsViewer.tsx        ← Admin logs component
src/app/(admin)/admin/email-templates/page.tsx  ← Admin management page
docs/seed-email-templates.sql                   ← Default template data
IMPLEMENTATION_SUMMARY.md                       ← Full setup guide
PR_MESSAGE.md                                   ← This PR description
```

### Updated Files
```
docs/schema.sql                                 ← Added email tables & triggers
src/lib/data/types.ts                          ← Added email types
.env.example                                    ← Documented email variables
pnpm-lock.yaml                                  ← Added date-fns dependency
```

---

## 🔧 How to Deploy

### Step 1: Run Schema Migration
```sql
-- In Supabase Dashboard → SQL Editor
-- Paste entire contents of: docs/schema.sql
```

### Step 2: Configure Supabase Settings
```
Settings → Database → Postgres Settings
  app.supabase_url = https://YOUR_PROJECT_REF.supabase.co
  app.supabase_service_role_key = YOUR_SERVICE_ROLE_KEY
```

### Step 3: Setup Zoho SMTP
```
mail.zoho.com → Settings → Mail Accounts → Security → App Passwords
Generate app password → Save credentials
```

### Step 4: Set Edge Function Secrets
```bash
supabase secrets set ZOHO_SMTP_USER=orders@yourdomain.com
supabase secrets set ZOHO_SMTP_PASS=your_app_password
```

### Step 5: Deploy Function
```bash
supabase functions deploy send-order-email
```

### Step 6: Seed Templates
```sql
-- In Supabase Dashboard → SQL Editor
-- Paste entire contents of: docs/seed-email-templates.sql
```

### Step 7: Update .env.local
```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

---

## 📧 Email Triggers

| Order Status | Email Sent | Template Key |
|---|---|---|
| `pending` | ✅ Order received | `pending` |
| `partially_paid` | ✅ Partial payment confirmed | `partially_paid` |
| `paid` | ✅ Full payment confirmed | `paid` |
| `confirmed` | ✅ Queued for production | `confirmed` |
| `in_production` | ✅ Items being made | `in_production` |
| `delivered` | ✅ Ready for collection | `delivered` |
| `flagged` | ✅ Action required | `flagged` |
| `cancelled` | ✅ Order cancelled | `cancelled` |

| Payment Status | Email Sent | Template Key |
|---|---|---|
| `pending` | ✅ Receipt received | `payment_pending` |
| `approved` | ✅ Payment confirmed | `payment_approved` |
| `flagged` | ✅ Receipt flagged | `payment_flagged` |
| `rejected` | ✅ Payment rejected | `payment_rejected` |

---

## 🎨 Customize Templates

**From Admin UI:**
1. Go to **Admin → Email Templates**
2. Click template name to expand
3. Edit subject, body HTML
4. Toggle active/inactive
5. Click "Preview" to see sample
6. Click "Save Template"

**Supported Variables:**
- `{{customer_name}}`
- `{{order_ref}}`
- `{{total_amount}}`
- `{{amount_paid}}`
- `{{balance}}`
- `{{items_html}}`

---

## 📊 Monitor Emails

**From Admin Dashboard:**
- Go to **Admin → Email Templates**
- See 30-day stats: total sent, successful, failed, success rate
- View recent email sends with status indicators

**From Database:**
```sql
SELECT * FROM rw_email_logs ORDER BY sent_at DESC LIMIT 50;
SELECT COUNT(*) FROM rw_email_templates;  -- Should be 12
```

---

## 🚨 Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| No email sent | Trigger not firing | Re-run schema.sql; check pg_net enabled |
| SMTP auth error | Wrong credentials | Regenerate Zoho app password; update secret |
| Email in spam | Domain not verified | Setup SPF, DKIM, DMARC records |
| Variables not replaced | Wrong syntax | Use `{{variable_name}}` with double braces |
| Template not found | Key mismatch | Check template_key in DB matches trigger |

---

## 📝 Architecture

```
Admin updates order status
        ↓
Database trigger fires
        ↓
pg_net calls Edge Function
        ↓
Edge Function:
  1. Fetches order + items
  2. Gets template from DB
  3. Injects variables
  4. Wraps in HTML shell
  5. Sends via Zoho SMTP
  6. Logs result
        ↓
Customer gets email
```

---

## ✅ Verification

After setup, test by:
1. Create test order
2. Update order status
3. Check `rw_email_logs` table
4. Verify email in inbox (check spam)
5. Check variables replaced correctly

---

## 📚 Full Documentation

See `IMPLEMENTATION_SUMMARY.md` for:
- Complete setup instructions
- API reference for services
- Security considerations
- Monitoring & debugging
- Common issues & solutions

---

**Questions?** See `IMPLEMENTATION_SUMMARY.md` or check the trigger functions in `docs/schema.sql`.
