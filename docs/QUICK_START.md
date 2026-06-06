# Email Integration — Quick Start

**Getting emails working in 5 steps (15 minutes):**

## Step 1: Run Schema (Supabase SQL Editor)

```sql
-- Copy & paste entire docs/schema.sql into Supabase SQL Editor
-- Click "Run"
-- Wait for completion (no errors)
```

## Step 2: Get Zoho Credentials

```
1. Log in to mail.zoho.com
2. Settings → Mail Accounts → [Your account] → Security → App Passwords
3. Click "Generate"
4. Note: ZOHO_SMTP_USER and ZOHO_SMTP_PASS
```

## Step 3: Set Database Settings (Supabase)

```
Dashboard → Settings → Database → Postgres Settings (scroll down)

Add these two:
app.supabase_url = https://YOUR_PROJECT_REF.supabase.co
app.supabase_service_role_key = [your service role key from Dashboard → API]
```

## Step 4: Deploy Edge Function

```bash
supabase link --project-ref YOUR_PROJECT_REF
supabase functions deploy send-order-email

# Set secrets
supabase secrets set ZOHO_SMTP_USER=your_email@domain.com
supabase secrets set ZOHO_SMTP_PASS=your_app_password
```

## Step 5: Seed Templates (Supabase SQL Editor)

```sql
-- Copy & paste entire docs/seed-email-templates.sql
-- Click "Run"
```

## ✅ Done! Test It:

```
1. Go to http://localhost:3000/admin/email-templates
2. Create test order in Supabase → rw_orders
3. Update order status: pending → paid
4. Check your email (30 seconds)
```

**Troubleshooting:** Check email logs at `/admin/email-templates`

---

**Full setup guide:** `docs/EMAIL_SETUP.md`
**Complete reference:** `docs/EMAIL_SYSTEM.md`
