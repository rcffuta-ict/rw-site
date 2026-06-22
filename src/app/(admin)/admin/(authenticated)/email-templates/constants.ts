import type { Template, Variable, SampleData } from "./types";

export const TEMPLATES: Template[] = [
    {
        key: "pending",
        label: "Order Received",
        category: "order",
        icon: "📦",
        description: "Sent when customer create makes a pre-order",
    },
    {
        key: "partially_paid",
        label: "Partial Payment",
        category: "order",
        icon: "💰",
        description: "Sent when a payment is made for a pre-order",
    },
    {
        key: "paid",
        label: "Fully Paid",
        category: "order",
        icon: "✅",
        description: "Sent when a pre-order is paid in full",
    },
    {
        key: "confirmed",
        label: "Order Confirmed",
        category: "order",
        icon: "🔖",
        description: "Sent when a pre-order is acknowledged to have been paid",
    },
    {
        key: "in_production",
        label: "In Production",
        category: "order",
        icon: "🛠",
        description: "Sent when a pre-order is set for production",
    },
    {
        key: "ready_for_pickup",
        label: "Ready for Pickup",
        category: "order",
        icon: "📦",
        description:
            "Sent when a verdict is fulfilled — includes the customer's personal pickup code ({{pickup_token}})",
    },
    {
        key: "delivered",
        label: "Collected",
        category: "order",
        icon: "🎉",
        description: "Sent when an order is collected (pickup code verified)",
    },
    {
        key: "flagged",
        label: "Order Flagged",
        category: "order",
        icon: "⚠️",
        description: "Sent when a pre-order is flagged",
    },
    {
        key: "cancelled",
        label: "Cancelled",
        category: "order",
        icon: "❌",
        description: "Sent when a pre-order is cancelled",
    },
    {
        key: "payment_pending",
        label: "Receipt Received",
        category: "payment",
        icon: "📄",
        description: "Sent when a pre-order's payment is received",
    },
    {
        key: "payment_approved",
        label: "Payment Approved",
        category: "payment",
        icon: "✔️",
        description: "Sent when a pre-order payment is confirmed",
    },
    {
        key: "payment_flagged",
        label: "Payment Flagged",
        category: "payment",
        icon: "🚩",
        description: "Sent when a pre-order is flagged",
    },
    {
        key: "payment_rejected",
        label: "Payment Rejected",
        category: "payment",
        icon: "🚫",
        description: "Sent when a pre-order is rejected",
    },
    {
        key: "follow_up",
        label: "Follow-up Reminder",
        category: "follow-up",
        icon: "📬",
        description: "Gentle reminder sent from the Follow-up tab to stale orders",
    },
];

export const VARIABLES: Variable[] = [
    { name: "customer_name", desc: "Customer's full name" },
    { name: "order_ref", desc: "Order reference, auto-shown as #FF3A9C" },
    { name: "total_amount", desc: "Order total in Naira" },
    { name: "amount_paid", desc: "Amount paid so far" },
    { name: "balance", desc: "Remaining balance" },
    { name: "items_html", desc: "Auto-generated items table" },
    {
        name: "pickup_token",
        desc: "Personal pickup code (Ready for Pickup email only)",
    },
] as const;

export const DEFAULT_SUBJECTS: Record<string, string> = {
    pending: "Your RW'26 Pre-Order is Confirmed — {{order_ref}}",
    partially_paid: "Partial Payment Received — {{order_ref}}",
    paid: "Payment Complete — Your RW'26 Order is Fully Paid 🎉",
    confirmed: "Order {{order_ref}} — Queued for Production",
    in_production: "Your RW'26 Items Are Being Made — {{order_ref}}",
    ready_for_pickup: "Your RW'26 Order is Ready for Pickup — {{order_ref}}",
    delivered: "Order Collected — Thank You {{order_ref}}",
    flagged: "Action Required on Your Order {{order_ref}}",
    cancelled: "Your Order {{order_ref}} Has Been Cancelled",
    payment_pending: "We Received Your Payment Receipt — {{order_ref}}",
    payment_approved: "Payment Approved — {{order_ref}}",
    payment_flagged: "Issue With Your Payment Receipt — {{order_ref}}",
    payment_rejected: "Payment Could Not Be Verified — {{order_ref}}",
    follow_up: "A gentle reminder about your order {{order_ref}}",
};

export const DEFAULT_BODIES: Record<string, string> = {
    pending: `<p>Hi {{customer_name}},</p>
<p>We have received your pre-order <strong>{{order_ref}}</strong> totalling <strong>{{total_amount}}</strong>. Please upload your payment receipt to proceed with your order.</p>
{{items_html}}
<p>If you have any questions, don't hesitate to reach out to us.</p>
<p>God bless you — <strong>RCF FUTA Team</strong></p>`,

    partially_paid: `<p>Hi {{customer_name}},</p>
<p>Thank you! We have confirmed a payment of <strong>{{amount_paid}}</strong> on your order <strong>{{order_ref}}</strong>.</p>
<p>Your outstanding balance is <strong>{{balance}}</strong>. Please complete your payment to move your order to production.</p>
{{items_html}}
<p>— <strong>RCF FUTA Team</strong></p>`,

    paid: `<p>Hi {{customer_name}},</p>
<p>Wonderful news! Your order <strong>{{order_ref}}</strong> is fully paid ({{total_amount}}). 🎉</p>
<p>We will notify you as soon as your order enters production. Thank you for being part of Redemption Week '26!</p>
{{items_html}}
<p>— <strong>RCF FUTA Team</strong></p>`,

    confirmed: `<p>Hi {{customer_name}},</p>
<p>Great news! Your order <strong>{{order_ref}}</strong> has been confirmed and queued for production.</p>
<p>We will send you another update when your items are being made. Stay blessed!</p>
<p>— <strong>RCF FUTA Team</strong></p>`,

    in_production: `<p>Hi {{customer_name}},</p>
<p>Your order <strong>{{order_ref}}</strong> is currently in production — your items are being made!</p>
<p>We will notify you once they are ready for collection. Watch this space!</p>
<p>— <strong>RCF FUTA Team</strong></p>`,

    ready_for_pickup: `<p>Hi {{customer_name}},</p>
<p>Wonderful news! Your order <strong>{{order_ref}}</strong> has been produced and is now <strong>ready for collection</strong>. 🎉</p>
<p>Please show this <strong>pickup code</strong> to our team at the pickup point — it confirms the order is really yours:</p>
<p style="text-align:center;margin:24px 0;"><span style="display:inline-block;font-size:24px;font-weight:800;letter-spacing:3px;padding:14px 28px;border:2px dashed #FF0015;border-radius:12px;color:#1C0003;">{{pickup_token}}</span></p>
<p>Keep this code private — only share it at the desk when collecting.</p>
{{items_html}}
<p>To God be the glory — <strong>RCF FUTA Team</strong></p>`,

    delivered: `<p>Hi {{customer_name}},</p>
<p>Your order <strong>{{order_ref}}</strong> has been collected. 🎉</p>
<p>We hope you absolutely love your Redemption Week '26 items and that they are a blessing to you. Thank you for being part of it!</p>
<p>To God be the glory — <strong>RCF FUTA Team</strong></p>`,

    flagged: `<p>Hi {{customer_name}},</p>
<p>Your order <strong>{{order_ref}}</strong> has been flagged for review and requires your attention.</p>
<p>Please contact us as soon as possible so we can resolve this quickly and get your order back on track.</p>
<p>— <strong>RCF FUTA Team</strong></p>`,

    cancelled: `<p>Hi {{customer_name}},</p>
<p>We regret to inform you that your order <strong>{{order_ref}}</strong> has been cancelled.</p>
<p>If you believe this is an error or would like more information, please contact us immediately.</p>
<p>— <strong>RCF FUTA Team</strong></p>`,

    payment_pending: `<p>Hi {{customer_name}},</p>
<p>We have received your payment receipt for order <strong>{{order_ref}}</strong> and it is currently under review.</p>
<p>We will notify you once your payment has been verified. This usually takes a few hours.</p>
<p>— <strong>RCF FUTA Team</strong></p>`,

    payment_approved: `<p>Hi {{customer_name}},</p>
<p>Your payment of <strong>{{amount_paid}}</strong> for order <strong>{{order_ref}}</strong> has been approved! ✅</p>
<p>Your order is moving forward. We will keep you updated on every step.</p>
<p>— <strong>RCF FUTA Team</strong></p>`,

    payment_flagged: `<p>Hi {{customer_name}},</p>
<p>There is an issue with the payment receipt you submitted for order <strong>{{order_ref}}</strong>.</p>
<p>Please contact us or submit a clearer copy of your receipt so we can verify your payment promptly.</p>
<p>— <strong>RCF FUTA Team</strong></p>`,

    payment_rejected: `<p>Hi {{customer_name}},</p>
<p>Unfortunately, the payment receipt for order <strong>{{order_ref}}</strong> could not be verified.</p>
<p>Please contact us with your bank transaction details so we can resolve this as quickly as possible.</p>
<p>— <strong>RCF FUTA Team</strong></p>`,

    follow_up: `<p>Hi {{customer_name}},</p>
<p>We noticed your Redemption Week '26 order <strong>{{order_ref}}</strong> still has an outstanding balance of <strong>{{balance}}</strong>. We'd love to help you complete it!</p>
<p>Please upload your payment receipt in your order dashboard so we can move your order forward. If you've already paid, kindly ignore this message.</p>
{{items_html}}
<p>If you have any questions or need help, just reach out — we're happy to assist.</p>
<p>God bless you — <strong>RCF FUTA Team</strong></p>`,
};

// Default days of inactivity before an order is considered "stale" and shown
// in the Follow-up tab. The editable reminder content lives in the "follow_up"
// template (DEFAULT_SUBJECTS/DEFAULT_BODIES, and rw_email_templates once seeded).
export const FOLLOW_UP_DEFAULT_DAYS = 2;
export const FOLLOW_UP_TEMPLATE_KEY = "follow_up";

export const SAMPLE_DATA: SampleData = {
    customer_name: "Adaeze Okonkwo",
    order_ref: "FF3A9C",
    total_amount: "₦15,500",
    amount_paid: "₦8,000",
    balance: "₦7,500",
    items_html: `<table style="width:100%;border-collapse:collapse;margin:16px 0;font-size:13px;">
    <thead><tr style="background:#f9f5f0;">
      <th style="padding:8px;text-align:left;color:#3d2e0e;border-bottom:2px solid #e8d5a3;">Item</th>
      <th style="padding:8px;text-align:left;color:#3d2e0e;border-bottom:2px solid #e8d5a3;">Variant</th>
      <th style="padding:8px;text-align:center;color:#3d2e0e;border-bottom:2px solid #e8d5a3;">Qty</th>
      <th style="padding:8px;text-align:right;color:#3d2e0e;border-bottom:2px solid #e8d5a3;">Price</th>
    </tr></thead>
    <tbody>
      <tr><td style="padding:8px 0;border-bottom:1px solid #f0e8d6;">RW'26 Hoodie</td><td style="padding:8px 0;border-bottom:1px solid #f0e8d6;color:#8b6914;">Black · L · Holy Spirit</td><td style="padding:8px 0;border-bottom:1px solid #f0e8d6;text-align:center;">1</td><td style="padding:8px 0;border-bottom:1px solid #f0e8d6;text-align:right;">₦9,500</td></tr>
      <tr><td style="padding:8px 0;">RW'26 T-Shirt</td><td style="padding:8px 0;color:#8b6914;">White · M · RW'26</td><td style="padding:8px 0;text-align:center;">2</td><td style="padding:8px 0;text-align:right;">₦6,000</td></tr>
    </tbody>
  </table>`,
};
