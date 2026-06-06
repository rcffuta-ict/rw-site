-- ============================================================================
-- RW'26 — Email System Setup (for EXISTING projects)
-- ----------------------------------------------------------------------------
-- Apply this to a database that was created before email sending moved to the
-- application layer. Safe to run multiple times.
--
-- What it does:
--   1. Removes the old pg_net triggers/functions that caused
--      "schema \"net\" does not exist". Emails are now sent by the app
--      (lib/services/email.service.ts → send-order-email Edge Function), so the
--      database no longer needs pg_net at all.
--   2. Ensures the email tables, RLS, and the updated_at trigger exist.
--   3. Seeds the 12 default templates without overwriting your edits.
--
-- Paste the whole file into the Supabase SQL Editor and press Run.
-- ============================================================================


-- 1. Remove the old DB → HTTP email triggers (source of the "net" error) -------
drop trigger if exists order_status_email_trigger   on rw_orders;
drop trigger if exists payment_status_email_trigger on rw_payments;
drop function if exists notify_order_status_change();
drop function if exists notify_payment_status_change();
-- pg_net is no longer used by this app. Leaving the extension installed is
-- harmless; uncomment the next line only if nothing else in your project uses it:
-- drop extension if exists pg_net;


-- 2. updated_at helper --------------------------------------------------------
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;


-- 3. Tables -------------------------------------------------------------------
create table if not exists rw_email_templates (
  id           uuid primary key default gen_random_uuid(),
  template_key text not null unique,
  label        text not null,
  subject      text not null,
  body_html    text not null,
  is_active    boolean not null default true,
  updated_at   timestamptz not null default now(),
  updated_by   text
);

create table if not exists rw_email_logs (
  id              uuid primary key default gen_random_uuid(),
  order_id        uuid references rw_orders(id)   on delete set null,
  payment_id      uuid references rw_payments(id) on delete set null,
  template_key    text not null,
  recipient_email text not null,
  subject         text,
  success         boolean not null default false,
  error_message   text,
  sent_at         timestamptz not null default now()
);

create index if not exists idx_email_logs_order   on rw_email_logs(order_id);
create index if not exists idx_email_logs_sent_at on rw_email_logs(sent_at desc);

create table if not exists rw_email_queue (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  mode            text not null default 'status',   -- 'status' | 'custom'
  event_type      text,                             -- 'order_status' | 'payment_status'
  order_id        uuid references rw_orders(id)   on delete set null,
  payment_id      uuid references rw_payments(id) on delete set null,
  new_status      text,
  template_key    text,
  recipient_email text,
  subject         text,
  body_html       text,
  status          text not null default 'pending',  -- pending | sending | sent | failed
  attempts        integer not null default 0,
  max_attempts    integer not null default 5,
  last_error      text,
  sent_at         timestamptz,
  updated_at      timestamptz not null default now()
);

create index if not exists idx_email_queue_status on rw_email_queue(status, created_at);


-- 4. Keep updated_at fresh on every edit --------------------------------------
drop trigger if exists email_templates_set_updated_at on rw_email_templates;
create trigger email_templates_set_updated_at
  before update on rw_email_templates
  for each row execute function set_updated_at();

drop trigger if exists email_queue_set_updated_at on rw_email_queue;
create trigger email_queue_set_updated_at
  before update on rw_email_queue
  for each row execute function set_updated_at();


-- 5. Row Level Security -------------------------------------------------------
-- Enabled with no public policies: the admin app and the Edge Function both use
-- the service role, which bypasses RLS. Normal clients get no access.
alter table rw_email_templates enable row level security;
alter table rw_email_logs      enable row level security;
alter table rw_email_queue     enable row level security;


-- 6. Default templates --------------------------------------------------------
-- ON CONFLICT DO NOTHING => existing rows (including your edits) are untouched;
-- only missing template keys are inserted.
insert into rw_email_templates (template_key, label, subject, body_html, is_active)
values
  ('pending',
   'Order Received',
   'Your RW''26 Pre-Order is Confirmed — #{{order_ref}}',
   '<p>Hi {{customer_name}},</p>
<p>Thank you for your pre-order! We have received your order <strong>#{{order_ref}}</strong> totalling <strong>{{total_amount}}</strong>.</p>
<p>Please upload your payment receipt to proceed. You can pay via bank transfer and submit the receipt in your order dashboard.</p>
{{items_html}}
<p>If you have any questions, please contact us at support@rcffuta.com</p>
<p>— RCF FUTA Team</p>',
   true),

  ('partially_paid',
   'Partial Payment Confirmed',
   'Partial Payment Received — #{{order_ref}}',
   '<p>Hi {{customer_name}},</p>
<p>Thank you! We have confirmed a payment of <strong>{{amount_paid}}</strong> on your order <strong>#{{order_ref}}</strong>.</p>
<p>Your outstanding balance is <strong>{{balance}}</strong>. Please submit payment for the remaining amount to complete your order.</p>
{{items_html}}
<p>— RCF FUTA Team</p>',
   true),

  ('paid',
   'Full Payment Confirmed',
   'Payment Complete — Your RW''26 Order is Fully Paid 🎉',
   '<p>Hi {{customer_name}},</p>
<p>Excellent! Your order <strong>#{{order_ref}}</strong> is now fully paid ({{total_amount}}).</p>
<p>Your items are queued for production. We will notify you as soon as they are ready.</p>
{{items_html}}
<p>Thank you for your support!</p>
<p>— RCF FUTA Team</p>',
   true),

  ('confirmed',
   'Order Confirmed for Production',
   'Order #{{order_ref}} — Queued for Production',
   '<p>Hi {{customer_name}},</p>
<p>Great news! Your order <strong>#{{order_ref}}</strong> has been confirmed and is now queued for production.</p>
<p>We will update you once your items are ready for collection. Typical turnaround is 2–3 weeks.</p>
<p>— RCF FUTA Team</p>',
   true),

  ('in_production',
   'Order In Production',
   'Your RW''26 Items Are Being Made — #{{order_ref}}',
   '<p>Hi {{customer_name}},</p>
<p>Your order <strong>#{{order_ref}}</strong> is currently in production. We are working hard to make your items perfect!</p>
<p>We will notify you as soon as your order is ready for collection.</p>
<p>— RCF FUTA Team</p>',
   true),

  ('delivered',
   'Order Ready for Collection',
   'Your RW''26 Order is Ready — #{{order_ref}}',
   '<p>Hi {{customer_name}},</p>
<p>Wonderful news! Your order <strong>#{{order_ref}}</strong> is ready for collection!</p>
<p>Please come collect your items at the designated pickup location. If you have any questions about timing or location, please contact us.</p>
<p>We hope you love your items! Feel free to share photos or leave a review.</p>
<p>— RCF FUTA Team</p>',
   true),

  ('flagged',
   'Order Flagged — Action Required',
   'Action Required on Your Order #{{order_ref}}',
   '<p>Hi {{customer_name}},</p>
<p>Your order <strong>#{{order_ref}}</strong> has been flagged for review. This may be due to a payment verification issue or an inquiry we need to resolve with you.</p>
<p>Please contact us at support@rcffuta.com or reply to this email as soon as possible so we can help.</p>
<p>— RCF FUTA Team</p>',
   true),

  ('cancelled',
   'Order Cancelled',
   'Your Order #{{order_ref}} Has Been Cancelled',
   '<p>Hi {{customer_name}},</p>
<p>We are writing to inform you that your order <strong>#{{order_ref}}</strong> has been cancelled.</p>
<p>If you believe this is an error or would like to discuss this cancellation, please contact us immediately at support@rcffuta.com.</p>
<p>— RCF FUTA Team</p>',
   true),

  ('payment_pending',
   'Payment Receipt Received',
   'We Received Your Payment Receipt — #{{order_ref}}',
   '<p>Hi {{customer_name}},</p>
<p>Your payment receipt for order <strong>#{{order_ref}}</strong> has been received and is under review.</p>
<p>Our team will verify the payment details and confirm within 24 hours. We will notify you once it has been approved.</p>
<p>— RCF FUTA Team</p>',
   true),

  ('payment_approved',
   'Payment Approved',
   'Payment Approved — #{{order_ref}}',
   '<p>Hi {{customer_name}},</p>
<p>Great! Your payment of <strong>{{amount_paid}}</strong> for order <strong>#{{order_ref}}</strong> has been verified and approved.</p>
<p>Thank you for your payment. Your order is on track!</p>
<p>— RCF FUTA Team</p>',
   true),

  ('payment_flagged',
   'Payment Receipt Flagged',
   'Issue With Your Payment Receipt — #{{order_ref}}',
   '<p>Hi {{customer_name}},</p>
<p>There is an issue with the payment receipt you submitted for order <strong>#{{order_ref}}</strong>.</p>
<p>This may be due to unclear image quality, missing details, or a discrepancy in the amount. Please contact us or resubmit a clear receipt at your earliest convenience.</p>
<p>Contact: support@rcffuta.com</p>
<p>— RCF FUTA Team</p>',
   true),

  ('payment_rejected',
   'Payment Could Not Be Verified',
   'Payment Verification Issue — #{{order_ref}}',
   '<p>Hi {{customer_name}},</p>
<p>Unfortunately, we could not verify the payment receipt you submitted for order <strong>#{{order_ref}}</strong>.</p>
<p>The receipt details do not match our records or there may be another issue. Please contact us at support@rcffuta.com with your receipt details so we can help resolve this quickly.</p>
<p>— RCF FUTA Team</p>',
   true)

on conflict (template_key) do nothing;


-- 7. Normalise money placeholders in existing templates -----------------------
-- The app now prefixes the ₦ symbol automatically for {{total_amount}},
-- {{amount_paid}} and {{balance}}. Strip any hand-typed ₦ immediately before
-- those tokens so they don't render twice (₦₦15,500). Idempotent.
update rw_email_templates set
  subject   = replace(replace(replace(subject,   '₦{{total_amount}}', '{{total_amount}}'), '₦{{amount_paid}}', '{{amount_paid}}'), '₦{{balance}}', '{{balance}}'),
  body_html = replace(replace(replace(body_html, '₦{{total_amount}}', '{{total_amount}}'), '₦{{amount_paid}}', '{{amount_paid}}'), '₦{{balance}}', '{{balance}}')
where subject like '%₦{{%' or body_html like '%₦{{%';

-- ============================================================================
-- After running: deploy the Edge Function and set its ZeptoMail secrets —
--   supabase functions deploy send-order-email
--   supabase secrets set ZEPTO_TOKEN='Zoho-enczapikey XXXX' ZEPTO_FROM='info@rw.rcffuta.com'
-- The app needs NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in its env.
-- ============================================================================
