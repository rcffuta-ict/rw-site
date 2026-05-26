# Email Integration Implementation Checklist

## ✅ Implementation Complete

All files have been created and integrated. Below is your deployment checklist.

---

## 📁 Files Delivered

### Schema & Database

- ✅ `docs/schema.sql` — Updated with email tables & triggers
- ✅ `docs/seed-email-templates.sql` — 12 default templates

### Backend

- ✅ `supabase/functions/send-order-email/index.ts` — Edge Function
- ✅ `supabase/config.toml` — Supabase config
- ✅ `supabase/deno.json` — Deno config
- ✅ `src/lib/services/email-templates.service.ts` — Server API
- ✅ `src/lib/data/types.ts` — Updated with email types

### Admin UI

- ✅ `src/app/(admin)/admin/email-templates/page.tsx` — Admin page
- ✅ `src/components/admin/EmailTemplateEditor.tsx` — Editor component
- ✅ `src/components/admin/EmailLogsViewer.tsx` — Logs component

### Configuration

- ✅ `.env.example` — Updated with email variables

### Documentation

- ✅ `README_EMAIL_INTEGRATION.md` — Main overview
- ✅ `docs/QUICK_START.md` — 5-step quick start
- ✅ `docs/EMAIL_SETUP.md` — 10-step detailed guide
- ✅ `docs/EMAIL_SYSTEM.md` — System reference
- ✅ `docs/IMPLEMENTATION_SUMMARY.md` — What was built
- ✅ `docs/FILE_STRUCTURE.md` — File layout
- ✅ `docs/INDEX.md` — Documentation index

---

## 🎯 Deployment Checklist

### Phase 1: Database Setup (5 min)

- [ ] Open Supabase Dashboard SQL Editor
- [ ] Copy entire `docs/schema.sql`
- [ ] Paste into SQL Editor
- [ ] Click "Run"
- [ ] Wait for completion (should see "12 tables created" or similar)
- [ ] Verify no errors in output

### Phase 2: Zoho Mail Setup (3 min)

- [ ] Log in to mail.zoho.com
- [ ] Go to Settings → Mail Accounts
- [ ] Select your sending account
- [ ] Go to Security → App Passwords
- [ ] Click "Generate password"
- [ ] Select "Third-party app"
- [ ] Copy the generated password
- [ ] Note these two values:
    - ZOHO_SMTP_USER = your email (e.g., orders@yourdomain.com)
    - ZOHO_SMTP_PASS = generated password

### Phase 3: Supabase Database Settings (2 min)

- [ ] Open Supabase Dashboard
- [ ] Go to Settings → Database → Postgres Settings
- [ ] Scroll down to "Application settings"
- [ ] Add setting 1:
    - Variable: `app.supabase_url`
    - Value: `https://YOUR_PROJECT_REF.supabase.co`
- [ ] Add setting 2:
    - Variable: `app.supabase_service_role_key`
    - Value: [Your Service Role Key from Dashboard → API]
- [ ] Click "Save"
- [ ] Wait 1–2 minutes for settings to apply

### Phase 4: Edge Function Deployment (3 min)

```bash
# Link your Supabase project
supabase link --project-ref YOUR_PROJECT_REF

# Deploy the function
supabase functions deploy send-order-email

# Set secrets
supabase secrets set ZOHO_SMTP_USER=your_email@domain.com
supabase secrets set ZOHO_SMTP_PASS=your_zoho_app_password
```

- [ ] supabase link succeeds
- [ ] supabase functions deploy completes
- [ ] supabase secrets set commands succeed
- [ ] Verify in Supabase Dashboard:
    - Edge Functions → send-order-email (should be listed)

### Phase 5: Seed Email Templates (2 min)

- [ ] Open Supabase Dashboard SQL Editor
- [ ] Create new query
- [ ] Copy entire `docs/seed-email-templates.sql`
- [ ] Paste into SQL Editor
- [ ] Click "Run"
- [ ] Verify no errors
- [ ] Check: `SELECT COUNT(*) FROM rw_email_templates;` → Should return 12

### Phase 6: Test (5 min)

- [ ] Start Next.js dev server: `pnpm dev`
- [ ] Navigate to: `http://localhost:3000/admin/email-templates`
- [ ] Page should load with 12 templates visible
- [ ] Create test order in Supabase (`rw_orders` table):
    - customer_name: "Test User"
    - customer_email: [YOUR TEST EMAIL]
    - total_amount: 5000
    - order_ref: "TEST01"
- [ ] Update order status: `pending` → `paid`
- [ ] Wait 30 seconds
- [ ] Check your email inbox (should have email with RCF branding)
- [ ] Check `/admin/email-templates` → Recent Email Sends
- [ ] Should see new log entry with success=true

### Phase 7: Customize (10 min)

- [ ] Go to `/admin/email-templates`
- [ ] Expand "Order Received" template (pending)
- [ ] Review default subject and body text
- [ ] Customize as needed (optional)
- [ ] Click "Preview" to see sample
- [ ] Click "Save Template"
- [ ] Repeat for other templates as desired
- [ ] Ensure all templates have `is_active = true`

### Phase 8: Monitor (ongoing)

- [ ] Check `/admin/email-templates` dashboard:
    - Email stats card (total sent, success rate)
    - Recent sends table (verify delivery)
    - Error logs (if any failures)
- [ ] Monitor for at least 24 hours
- [ ] Verify no errors in Edge Function logs

### Phase 9: Go Live

- [ ] Review all template content one more time
- [ ] Ensure Zoho domain has SPF/DKIM/DMARC (optional but recommended)
- [ ] Set `DEMO_MODE = false` in `src/lib/config.ts` (if applicable)
- [ ] Deploy Next.js app
- [ ] Keep monitoring dashboard for first 24 hours

### Phase 10: Production Checklist

- [ ] Email templates reviewed and customized
- [ ] All templates marked `is_active = true`
- [ ] Test emails received successfully
- [ ] Admin dashboard loads and shows stats
- [ ] Edge Function logs show no errors
- [ ] Database logs show completed triggers
- [ ] Zoho SMTP working reliably
- [ ] Staff trained on email management

---

## 🧪 Testing Matrix

Verify each order status triggers correct email:

| Status         | Template               | Test By                 | Expected      |
| -------------- | ---------------------- | ----------------------- | ------------- |
| pending        | Order Received         | Create order            | Email arrives |
| partially_paid | Partial Payment        | Approve partial payment | Email arrives |
| paid           | Full Payment Confirmed | Approve full payment    | Email arrives |
| confirmed      | Queued for Production  | Update to confirmed     | Email arrives |
| in_production  | Items Being Made       | Update to in_production | Email arrives |
| delivered      | Ready for Collection   | Update to delivered     | Email arrives |
| flagged        | Action Required        | Update to flagged       | Email arrives |
| cancelled      | Order Cancelled        | Update to cancelled     | Email arrives |

Payment statuses:

| Status           | Template            | Test By         | Expected      |
| ---------------- | ------------------- | --------------- | ------------- |
| payment_pending  | Receipt Received    | Submit receipt  | Email arrives |
| payment_approved | Payment Approved    | Approve receipt | Email arrives |
| payment_flagged  | Receipt Has Issues  | Flag receipt    | Email arrives |
| payment_rejected | Verification Failed | Reject receipt  | Email arrives |

---

## 🐛 Troubleshooting Matrix

| Problem            | Check                           | Solution                                  |
| ------------------ | ------------------------------- | ----------------------------------------- |
| Emails not sending | `rw_email_logs.success = false` | See error_message column                  |
| Trigger not firing | Check Edge Function logs        | Run `CREATE EXTENSION pg_net;`            |
| SMTP auth fails    | Zoho credentials                | Regenerate app password in Zoho           |
| Variables empty    | Template HTML                   | Use `{{variable}}` syntax (double braces) |
| Page 404           | Auth check                      | Ensure logged in as admin                 |
| Function timeout   | Check logs                      | Increase timeout in supabase/config.toml  |

---

## 📝 Quick Commands Reference

```bash
# Check Supabase link
supabase projects list

# Deploy function
supabase functions deploy send-order-email

# View function logs
supabase functions list
supabase logs --filter function_name=send-order-email

# Set secrets
supabase secrets set ZOHO_SMTP_USER=...
supabase secrets set ZOHO_SMTP_PASS=...

# View secrets
supabase secrets list

# SQL queries
SELECT COUNT(*) FROM rw_email_templates;          # Should be 12
SELECT * FROM rw_email_logs ORDER BY sent_at;    # Recent sends
SELECT * FROM rw_email_logs WHERE success=false; # Failures
```

---

## 📊 Success Criteria

You've successfully deployed when ALL of these are true:

✅ All 12 templates exist in `rw_email_templates`
✅ Edge Function deployed and accessible
✅ Edge Function secrets set correctly
✅ Database settings configured
✅ Test order triggered email send
✅ Email arrived in inbox
✅ Log entry created in `rw_email_logs`
✅ Admin page loads and shows templates
✅ Can edit and save template changes
✅ Dashboard shows email statistics
✅ No errors in Edge Function logs

---

## 📞 Support Resources

| Issue              | Reference                                  |
| ------------------ | ------------------------------------------ |
| Step-by-step setup | `docs/EMAIL_SETUP.md`                      |
| System reference   | `docs/EMAIL_SYSTEM.md`                     |
| Quick start        | `docs/QUICK_START.md`                      |
| File locations     | `docs/FILE_STRUCTURE.md`                   |
| API reference      | `docs/EMAIL_SYSTEM.md` (Admin API section) |
| Troubleshooting    | `docs/EMAIL_SETUP.md` (Step 10)            |

---

## ✨ You're Done When:

- [ ] All checklist items above are completed
- [ ] Test email received successfully
- [ ] Admin dashboard shows email statistics
- [ ] No errors in logs
- [ ] Templates customized and saved
- [ ] Ready to handle production emails

---

**Estimated total time:** 30–45 minutes
**Difficulty:** Low (mostly copy-paste and config)
**Expertise needed:** None (all steps documented)

**Next step:** Start with Phase 1 above (Database Setup)

---

**Last updated:** May 2026
**Status:** ✅ Ready to Deploy
**RCF FUTA — Redemption Week '26**
