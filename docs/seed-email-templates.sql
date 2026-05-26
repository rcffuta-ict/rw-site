-- docs/seed-email-templates.sql
-- Seed default email templates for the Redemption Week email system
-- Run this in the Supabase SQL Editor after running schema.sql
--
-- This script inserts 12 default templates:
--   - 8 order status templates (pending, partially_paid, paid, confirmed, in_production, delivered, flagged, cancelled)
--   - 4 payment status templates (payment_pending, payment_approved, payment_flagged, payment_rejected)
--
-- All templates use the RCF FUTA brand colors and support variable injection.
-- Customize subject lines and body text as needed from the admin UI.

INSERT INTO rw_email_templates (template_key, label, subject, body_html, is_active)
VALUES

-- Order Status Templates
('pending',
 'Order Received',
 'Your RW''26 Pre-Order is Confirmed — #{{order_ref}}',
 '<p>Hi {{customer_name}},</p>
<p>Thank you for your pre-order! We have received your order <strong>#{{order_ref}}</strong> totalling <strong>₦{{total_amount}}</strong>.</p>
<p>Please upload your payment receipt to proceed. You can pay via bank transfer and submit the receipt in your order dashboard.</p>
{{items_html}}
<p>If you have any questions, please contact us at support@rcffuta.com</p>
<p>— RCF FUTA Team</p>'),

('partially_paid',
 'Partial Payment Confirmed',
 'Partial Payment Received — #{{order_ref}}',
 '<p>Hi {{customer_name}},</p>
<p>Thank you! We have confirmed a payment of <strong>₦{{amount_paid}}</strong> on your order <strong>#{{order_ref}}</strong>.</p>
<p>Your outstanding balance is <strong>₦{{balance}}</strong>. Please submit payment for the remaining amount to complete your order.</p>
{{items_html}}
<p>— RCF FUTA Team</p>'),

('paid',
 'Full Payment Confirmed',
 'Payment Complete — Your RW''26 Order is Fully Paid 🎉',
 '<p>Hi {{customer_name}},</p>
<p>Excellent! Your order <strong>#{{order_ref}}</strong> is now fully paid (₦{{total_amount}}).</p>
<p>Your items are queued for production. We will notify you as soon as they are ready.</p>
{{items_html}}
<p>Thank you for your support!</p>
<p>— RCF FUTA Team</p>'),

('confirmed',
 'Order Confirmed for Production',
 'Order #{{order_ref}} — Queued for Production',
 '<p>Hi {{customer_name}},</p>
<p>Great news! Your order <strong>#{{order_ref}}</strong> has been confirmed and is now queued for production.</p>
<p>We will update you once your items are ready for collection. Typical turnaround is 2–3 weeks.</p>
<p>— RCF FUTA Team</p>'),

('in_production',
 'Order In Production',
 'Your RW''26 Items Are Being Made — #{{order_ref}}',
 '<p>Hi {{customer_name}},</p>
<p>Your order <strong>#{{order_ref}}</strong> is currently in production. We are working hard to make your items perfect!</p>
<p>We will notify you as soon as your order is ready for collection.</p>
<p>— RCF FUTA Team</p>'),

('delivered',
 'Order Ready for Collection',
 'Your RW''26 Order is Ready — #{{order_ref}}',
 '<p>Hi {{customer_name}},</p>
<p>Wonderful news! Your order <strong>#{{order_ref}}</strong> is ready for collection!</p>
<p>Please come collect your items at the designated pickup location. If you have any questions about timing or location, please contact us.</p>
<p>We hope you love your items! Feel free to share photos or leave a review.</p>
<p>— RCF FUTA Team</p>'),

('flagged',
 'Order Flagged — Action Required',
 'Action Required on Your Order #{{order_ref}}',
 '<p>Hi {{customer_name}},</p>
<p>Your order <strong>#{{order_ref}}</strong> has been flagged for review. This may be due to a payment verification issue or an inquiry we need to resolve with you.</p>
<p>Please contact us at support@rcffuta.com or reply to this email as soon as possible so we can help.</p>
<p>— RCF FUTA Team</p>'),

('cancelled',
 'Order Cancelled',
 'Your Order #{{order_ref}} Has Been Cancelled',
 '<p>Hi {{customer_name}},</p>
<p>We are writing to inform you that your order <strong>#{{order_ref}}</strong> has been cancelled.</p>
<p>If you believe this is an error or would like to discuss this cancellation, please contact us immediately at support@rcffuta.com.</p>
<p>— RCF FUTA Team</p>'),

-- Payment Status Templates
('payment_pending',
 'Payment Receipt Received',
 'We Received Your Payment Receipt — #{{order_ref}}',
 '<p>Hi {{customer_name}},</p>
<p>Your payment receipt for order <strong>#{{order_ref}}</strong> has been received and is under review.</p>
<p>Our team will verify the payment details and confirm within 24 hours. We will notify you once it has been approved.</p>
<p>— RCF FUTA Team</p>'),

('payment_approved',
 'Payment Approved',
 'Payment Approved — #{{order_ref}}',
 '<p>Hi {{customer_name}},</p>
<p>Great! Your payment of <strong>₦{{amount_paid}}</strong> for order <strong>#{{order_ref}}</strong> has been verified and approved.</p>
<p>Thank you for your payment. Your order is on track!</p>
<p>— RCF FUTA Team</p>'),

('payment_flagged',
 'Payment Receipt Flagged',
 'Issue With Your Payment Receipt — #{{order_ref}}',
 '<p>Hi {{customer_name}},</p>
<p>There is an issue with the payment receipt you submitted for order <strong>#{{order_ref}}</strong>.</p>
<p>This may be due to unclear image quality, missing details, or a discrepancy in the amount. Please contact us or resubmit a clear receipt at your earliest convenience.</p>
<p>Contact: support@rcffuta.com</p>
<p>— RCF FUTA Team</p>'),

('payment_rejected',
 'Payment Could Not Be Verified',
 'Payment Verification Issue — #{{order_ref}}',
 '<p>Hi {{customer_name}},</p>
<p>Unfortunately, we could not verify the payment receipt you submitted for order <strong>#{{order_ref}}</strong>.</p>
<p>The receipt details do not match our records or there may be another issue. Please contact us at support@rcffuta.com with your receipt details so we can help resolve this quickly.</p>
<p>— RCF FUTA Team</p>')

ON CONFLICT (template_key) DO NOTHING;
