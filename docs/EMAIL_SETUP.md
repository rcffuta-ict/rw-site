// EMAIL INTEGRATION SETUP GUIDE
// ─────────────────────────────────────────────────────────────────────────────
//
// This guide covers the complete email integration implementation for RW '26.
// Follow each step to enable transactional emails triggered by order/payment
// status changes.
//
// Overview:
//   1. order/payment status changes in Supabase → database trigger fires
//   2. Trigger calls Supabase Edge Function via pg_net HTTP POST
//   3. Edge Function fetches template from DB + customer order data
//   4. Template is rendered with variable injection
//   5. Email is sent via Zoho SMTP
//   6. Send attempt is logged to rw_email_logs table
//
// Timeline: ~30 minutes for full setup (includes Zoho config and testing)

# ═════════════════════════════════════════════════════════════════════════════
# STEP 1: Create Supabase Project & Run Schema
# ═════════════════════════════════════════════════════════════════════════════

1. Log in to Supabase Dashboard
2. Create a new project OR use existing project
3. Go to Project → SQL Editor
4. Create a new query and paste the entire contents of docs/schema.sql
5. Click "Run" to execute the full schema
6. Verify: All tables created, no errors in output

✓ At this point:
  - pg_net extension is enabled
  - rw_email_templates table exists (empty)
  - rw_email_logs table exists (empty)
  - order_status_email_trigger is created (but won't fire yet—missing DB settings)

# ═════════════════════════════════════════════════════════════════════════════
# STEP 2: Configure Zoho Mail & Generate SMTP Credentials
# ═════════════════════════════════════════════════════════════════════════════

1. Log in to mail.zoho.com
2. Go to Settings → Mail Accounts → [Your sending account]
3. Navigate to Security → App Passwords (or Create App Password)
4. Click "Generate password for {app-name}" (choose "Third-party app")
5. Select "IMAP" or "Custom app" (depending on your Zoho version)
6. Zoho will generate an app-specific password (it looks different from your account password)
7. Copy this password — you'll need it in Step 3

✓ You now have:
  - ZOHO_SMTP_USER = your Zoho email (e.g., orders@yourdomain.com)
  - ZOHO_SMTP_PASS = app password (e.g., AbCdEfGhIjKlMn1234)

# ═════════════════════════════════════════════════════════════════════════════
# STEP 3: Set Supabase Database Settings
# ═════════════════════════════════════════════════════════════════════════════

These settings are required by the database triggers to call the Edge Function.

1. Go to Supabase Project → Settings → Database → Postgres Settings (scroll down)
2. Look for "Application settings" section
3. Scroll to the bottom and add two new settings:

   Variable: app.supabase_url
   Value: https://YOUR_PROJECT_REF.supabase.co

   Variable: app.supabase_service_role_key
   Value: [Your Supabase Service Role Key]

4. To get your Service Role Key:
   - Dashboard → Settings → API → Service role (click "Reveal")
   - Copy the full key

5. Save the settings (they may take a minute to apply)

✓ Database triggers can now make authenticated calls to the Edge Function

# ═════════════════════════════════════════════════════════════════════════════
# STEP 4: Create & Deploy Supabase Edge Function
# ═════════════════════════════════════════════════════════════════════════════

The Edge Function (supabase/functions/send-order-email/index.ts) is already
created in your Next.js project. Deploy it using the CLI:

1. Install Supabase CLI (if not already installed):
   npm install -g supabase

2. Link your local project to Supabase:
   supabase link --project-ref YOUR_PROJECT_REF

3. Deploy the Edge Function:
   supabase functions deploy send-order-email

4. Set secrets in Supabase (these are used by the Edge Function):
   supabase secrets set ZOHO_SMTP_USER=orders@yourdomain.com
   supabase secrets set ZOHO_SMTP_PASS=your_app_password_here

5. Verify the function is deployed:
   - Dashboard → Edge Functions → send-order-email
   - You should see the function listed

✓ Edge Function is live and can send emails

# ═════════════════════════════════════════════════════════════════════════════
# STEP 5: Seed Default Email Templates
# ═════════════════════════════════════════════════════════════════════════════

Default templates are pre-written and ready to customize. Load them into the DB:

1. Go to Supabase Dashboard → SQL Editor
2. Create a new query
3. Paste the entire contents of docs/seed-email-templates.sql
4. Click "Run" to execute

✓ 12 default templates are now in the database:
  - Order statuses: pending, partially_paid, paid, confirmed, in_production, delivered, flagged, cancelled
  - Payment statuses: payment_pending, payment_approved, payment_flagged, payment_rejected

Verify by querying:
  SELECT COUNT(*) FROM rw_email_templates;
  → Result should be 12

# ═════════════════════════════════════════════════════════════════════════════
# STEP 6: Update Admin UI to Include Email Templates Page
# ═════════════════════════════════════════════════════════════════════════════

The admin page and components are already created in your project:
  - src/app/(admin)/admin/email-templates/page.tsx
  - src/components/admin/EmailTemplateEditor.tsx
  - src/components/admin/EmailLogsViewer.tsx

1. Start your Next.js dev server:
   pnpm dev

2. Navigate to: http://localhost:3000/admin/email-templates

3. You should see:
   - All 12 default templates
   - Email stats (sends, success rate, failures)
   - Recent email logs
   - Editor UI for each template

4. Click on any template to expand and edit:
   - Change subject line or body HTML
   - Toggle template active/inactive
   - Click "Preview" to see sample rendering
   - Click "Save Template" to persist changes

✓ Admin can now manage email templates from the UI

# ═════════════════════════════════════════════════════════════════════════════
# STEP 7: Test the Integration End-to-End
# ═════════════════════════════════════════════════════════════════════════════

Create a test order and update its status to trigger email sends:

1. Go to the Supabase Dashboard → Table Editor
2. Find the rw_orders table
3. Create a new row (or use an existing order):
   - customer_name: "John Doe"
   - customer_email: [YOUR TEST EMAIL]
   - customer_phone: "123456789"
   - total_amount: 10000
   - status: "pending"
   - order_ref: "TEST01" (or auto-generated)

4. Wait a moment, then add a line item (rw_order_items):
   - order_id: [the order you just created]
   - product_name: "T-Shirt"
   - variant_label: "Black · L"
   - quantity: 1
   - unit_price: 10000

5. Go back to rw_orders and manually UPDATE the order status:
   - Click "Edit" on the order
   - Change status from "pending" to "paid"
   - Click Save

6. Check rw_email_logs within 10 seconds:
   - A new log entry should appear with success=true
   - Email should arrive in your inbox within 30 seconds

7. If no email arrives:
   - Check rw_email_logs for errors (error_message column)
   - Check Supabase Edge Functions logs (Dashboard → Edge Functions → send-order-email)
   - Verify Zoho credentials are correct
   - Check spam folder

✓ Email integration is working!

# ═════════════════════════════════════════════════════════════════════════════
# STEP 8: Verify Template Variables & Styling
# ═════════════════════════════════════════════════════════════════════════════

Test template variable injection:

1. Go to email-templates admin page
2. Click "Preview" on any template
3. You should see:
   - {{customer_name}} replaced with "John Doe"
   - {{order_ref}} replaced with "FF3A9C"
   - {{total_amount}} replaced with "₦15,000"
   - {{items_html}} replaced with an order summary table

If variables are NOT being replaced:
  - Check template body HTML — ensure syntax is {{variable_name}} (double braces)
  - Make sure variable names match the list in the editor UI

# ═════════════════════════════════════════════════════════════════════════════
# STEP 9: Monitor Email Logs & Health
# ═════════════════════════════════════════════════════════════════════════════

In the admin email-templates page:

1. View "Email Stats" card:
   - Total Sent (30 days)
   - Successful / Failed
   - Success Rate (%)

2. View "Recent Email Sends" table:
   - Every send attempt is logged here
   - Click the Failed status to see error details

3. Query the database for deeper analysis:
   ```sql
   -- All failed sends
   SELECT * FROM rw_email_logs
   WHERE success = FALSE
   ORDER BY sent_at DESC
   LIMIT 10;

   -- Email volume by template
   SELECT template_key, COUNT(*) as total_sent
   FROM rw_email_logs
   GROUP BY template_key
   ORDER BY total_sent DESC;

   -- Success rate per template
   SELECT template_key,
          COUNT(*) as total,
          SUM(CASE WHEN success THEN 1 ELSE 0 END) as successful,
          ROUND(100.0 * SUM(CASE WHEN success THEN 1 ELSE 0 END) / COUNT(*), 2) as success_rate
   FROM rw_email_logs
   GROUP BY template_key;
   ```

# ═════════════════════════════════════════════════════════════════════════════
# STEP 10: Production Checklist
# ═════════════════════════════════════════════════════════════════════════════

Before going live with emails:

☐ All 12 email templates seeded and reviewed
☐ Zoho SMTP credentials are correct (tested in Step 7)
☐ Database settings (app.supabase_url, app.supabase_service_role_key) are set
☐ Edge Function is deployed (supabase functions deploy send-order-email)
☐ Edge Function secrets are set (ZOHO_SMTP_USER, ZOHO_SMTP_PASS)
☐ Test email was received successfully
☐ Email template variables render correctly
☐ RLS policies allow admin to access rw_email_templates table
☐ Admins can edit templates from the UI and save changes
☐ Email logs are being created for each send attempt
☐ Customer email addresses in orders are valid
☐ Zoho domain has SPF, DKIM, DMARC records configured (if sending from custom domain)

# ═════════════════════════════════════════════════════════════════════════════
# Troubleshooting
# ═════════════════════════════════════════════════════════════════════════════

| Problem | Likely Cause | Solution |
|---------|--------------|----------|
| Trigger doesn't fire | pg_net extension not enabled | Run: CREATE EXTENSION pg_net; in SQL Editor |
| Trigger fires but no email | Database settings not set | Set app.supabase_url and app.supabase_service_role_key in DB settings |
| 401 Unauthorized in logs | Service role key is wrong | Copy the Service Role Key again from Dashboard → Settings → API |
| SMTP auth error | Zoho credentials wrong | Regenerate app password in Zoho Mail → Settings → Security |
| Email goes to spam | SPF/DKIM/DMARC not configured | Configure DNS records for your sending domain |
| Template variables not replaced | Wrong syntax in template | Use {{variable_name}} (double braces) |
| Edge Function times out | Zoho SMTP is slow | Increase timeout in supabase/config.toml: functions_verify_jwt = false, function_timeout = 10 |
| Admin can't save templates | RLS policy blocking writes | Ensure admin role has correct RLS policy on rw_email_templates |

# ═════════════════════════════════════════════════════════════════════════════
# Files & References
# ═════════════════════════════════════════════════════════════════════════════

Created/Modified:
  - docs/schema.sql — Updated with email tables & triggers
  - docs/seed-email-templates.sql — Default template seeds
  - supabase/functions/send-order-email/index.ts — Edge Function
  - src/lib/services/email-templates.service.ts — Server-side CRUD
  - src/lib/data/types.ts — EmailTemplate & EmailLog types
  - src/components/admin/EmailTemplateEditor.tsx — Template editor component
  - src/components/admin/EmailLogsViewer.tsx — Logs viewer component
  - src/app/(admin)/admin/email-templates/page.tsx — Admin page
  - .env.example — Email environment variables

Documentation:
  - docs/email-integration.md — Complete architecture & API reference
  - SETUP.md (this file) — Step-by-step implementation guide

# ═════════════════════════════════════════════════════════════════════════════

Questions or issues? Check the email-integration.md for detailed architecture
and API reference documentation.

Last updated: May 2026
RCF FUTA — Redemption Week '26
