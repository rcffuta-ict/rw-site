# Email Integration — File Structure & Overview

```
rw-site/
├── docs/
│   ├── schema.sql                    ← Updated: +pg_net, +email tables, +triggers
│   ├── seed-email-templates.sql      ← NEW: 12 default templates
│   ├── email-integration.md          ← Original specification
│   ├── EMAIL_SETUP.md                ← NEW: Step-by-step setup guide
│   ├── EMAIL_SYSTEM.md               ← NEW: Complete system reference
│   ├── IMPLEMENTATION_SUMMARY.md     ← NEW: What was built
│   └── QUICK_START.md                ← NEW: 5-step quick start
│
├── supabase/
│   ├── config.toml                   ← NEW: Supabase local config
│   ├── deno.json                     ← NEW: Deno dependencies
│   └── functions/
│       └── send-order-email/
│           └── index.ts              ← NEW: Edge Function (sends emails)
│
├── src/
│   ├── lib/
│   │   ├── data/
│   │   │   └── types.ts              ← Updated: +EmailTemplate, +EmailLog types
│   │   └── services/
│   │       └── email-templates.service.ts  ← NEW: Server-side CRUD API
│   │
│   ├── components/admin/
│   │   ├── EmailTemplateEditor.tsx   ← NEW: Template editor component
│   │   └── EmailLogsViewer.tsx       ← NEW: Email logs table component
│   │
│   └── app/(admin)/admin/
│       └── email-templates/
│           └── page.tsx              ← NEW: Admin dashboard page
│
├── .env.example                      ← Updated: +email variables
└── package.json                      ← (No changes needed)
```

---

## File Purposes

### 📋 Documentation
| File | Purpose |
|------|---------|
| `QUICK_START.md` | 5-step setup (15 min) |
| `EMAIL_SETUP.md` | Detailed 10-step guide with troubleshooting |
| `EMAIL_SYSTEM.md` | Complete reference (architecture, API, testing) |
| `IMPLEMENTATION_SUMMARY.md` | What was built and why |
| `schema.sql` | Database schema (includes email tables) |
| `seed-email-templates.sql` | 12 pre-written email templates |

### 🗄️ Database
| File | Purpose |
|------|---------|
| `schema.sql` | `rw_email_templates` (editable templates) |
| `schema.sql` | `rw_email_logs` (audit log) |
| `schema.sql` | `notify_order_status_change()` trigger |
| `schema.sql` | `notify_payment_status_change()` trigger |

### ⚙️ Backend
| File | Purpose |
|------|---------|
| `send-order-email/index.ts` | Deno Edge Function that sends emails |
| `email-templates.service.ts` | TypeScript API for managing templates |
| `types.ts` | `EmailTemplate`, `EmailLog` interfaces |

### 🎨 Admin UI
| File | Purpose |
|------|---------|
| `email-templates/page.tsx` | Admin dashboard (template list + logs) |
| `EmailTemplateEditor.tsx` | Edit subject, body, active status |
| `EmailLogsViewer.tsx` | View recent email sends |

---

## Data Flow

```
┌─────────────────────────────────────────────────────────┐
│ 1. ADMIN UPDATES ORDER STATUS (Supabase Table Editor)   │
└────────────────────┬────────────────────────────────────┘
                     │
        ┌────────────▼───────────────┐
        │ rw_orders.status UPDATE    │
        │ Fires trigger             │
        └────────────┬───────────────┘
                     │
        ┌────────────▼──────────────────────────────────┐
        │ notify_order_status_change()                  │
        │ Calls pg_net.http_post()                      │
        │ → Supabase Edge Function                      │
        └────────────┬───────────────────────────────────┘
                     │
        ┌────────────▼──────────────────────────────────┐
        │ send-order-email Edge Function                │
        │ 1. Fetch template by key                      │
        │ 2. Fetch order + items                        │
        │ 3. Inject variables                           │
        │ 4. Wrap in email shell                        │
        │ 5. Send via Zoho SMTP                         │
        │ 6. Log result                                 │
        └────────────┬───────────────────────────────────┘
                     │
        ┌────────────▼──────────────────────────────────┐
        │ 2. EMAIL ARRIVES IN CUSTOMER INBOX            │
        │ 3. LOG ENTRY CREATED IN rw_email_logs         │
        │ 4. ADMIN SEES LOG AT /admin/email-templates   │
        └───────────────────────────────────────────────┘
```

---

## Admin Workflow

### Managing Templates
```
1. Go to /admin/email-templates
2. Click "expand" on any template
3. Edit subject or body HTML
4. Click "Preview" to see sample rendering
5. Click "Save Template"
6. Changes live immediately (no redeploy)
7. Template becomes active on next trigger
```

### Monitoring Emails
```
1. Dashboard shows:
   - Total emails sent (30 days)
   - Success rate %
   - Failures count
2. Table shows:
   - Recent 50 sends
   - Status (✓ or ✗)
   - Recipients + subjects
   - Timestamps
3. Click failed emails to see error details
```

### Testing Manually
```
1. Create test order in Supabase
2. Update status (e.g., pending → paid)
3. Check /admin/email-templates logs
4. Verify email arrives in inbox
5. Check error_message if failed
```

---

## Environment Variables

Needed for local dev & production:

```bash
# For Edge Function (Supabase Secrets)
ZOHO_SMTP_USER=your_email@domain.com
ZOHO_SMTP_PASS=your_zoho_app_password

# For Database (Postgres Settings in Supabase)
app.supabase_url=https://your_project.supabase.co
app.supabase_service_role_key=your_service_role_key
```

See `.env.example` for reference.

---

## Key Features

✅ **Automatic triggers** — No manual action needed  
✅ **12 default templates** — Covers all order/payment states  
✅ **Editable from admin UI** — No code redeploy required  
✅ **Live preview** — See email before sending (in editor)  
✅ **Variable injection** — {{customer_name}}, {{order_ref}}, etc.  
✅ **Email logs** — Audit trail of all sends  
✅ **Success metrics** — Dashboard shows stats  
✅ **Error tracking** — See failure reasons  
✅ **Zoho integration** — Reliable SMTP delivery  

---

## Architecture Decisions

| Decision | Reason |
|----------|--------|
| Database-stored templates | Easy to edit from admin UI, no code redeploy |
| pg_net for triggers | Serverless, no external queue needed |
| Deno Edge Function | Supabase native, easy deployment |
| Zoho SMTP | Reliable, inexpensive, easy to set up |
| Server-side CRUD | Secure (service role key not exposed) |
| RLS on email tables | Admin-only access by default |

---

## Scalability Notes

- 📧 **Throughput:** ~20 emails/second (Zoho SMTP limit)
- ⏱️ **Latency:** 1–5 seconds per email (Zoho connection)
- 💾 **Storage:** No limit on logs (consider retention policy after 1 year)
- 🔄 **Retries:** Currently 1 attempt (Edge Function can be updated for retries)

For bulk sends, consider adding an async job queue.

---

## Support & Debugging

**Quick help:**
- See error in logs? → Check `ERROR_MESSAGE` column in `rw_email_logs`
- Trigger not firing? → Verify `pg_net` extension enabled
- Edge Function not running? → Check Supabase Dashboard → Edge Functions logs
- Variables not replaced? → Check template syntax: `{{variable}}`
- Email in spam? → Configure SPF/DKIM/DMARC for your domain

**Detailed help:**
- Setup issues → `docs/EMAIL_SETUP.md`
- Architecture/API → `docs/EMAIL_SYSTEM.md`
- Specific troubleshooting → `docs/EMAIL_SETUP.md` (Troubleshooting section)

---

## Next Steps

1. **Review:** `docs/QUICK_START.md`
2. **Follow:** `docs/EMAIL_SETUP.md` (step 1–10)
3. **Test:** Create test order, update status, check inbox
4. **Customize:** Edit templates at `/admin/email-templates`
5. **Go live:** Monitor dashboard for send failures

---

**Last updated:** May 2026  
**Status:** ✅ Production Ready  
**RCF FUTA — Redemption Week '26**
