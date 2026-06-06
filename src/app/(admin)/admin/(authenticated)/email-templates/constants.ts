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
        key: "delivered",
        label: "Delivered",
        category: "order",
        icon: "🎉",
        description: "Sent when a pre-order is set as delievered",
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
];

export const VARIABLES: Variable[] = [
    { name: "customer_name", desc: "Customer's full name" },
    { name: "order_ref", desc: "6-char order reference e.g. FF3A9C" },
    { name: "total_amount", desc: "Order total in Naira" },
    { name: "amount_paid", desc: "Amount paid so far" },
    { name: "balance", desc: "Remaining balance" },
    { name: "items_html", desc: "Auto-generated items table" },
] as const;

export const DEFAULT_SUBJECTS: Record<string, string> = {
    pending: "Your RW'26 Pre-Order is Confirmed — #{{order_ref}}",
    partially_paid: "Partial Payment Received — #{{order_ref}}",
    paid: "Payment Complete — Your RW'26 Order is Fully Paid 🎉",
    confirmed: "Order #{{order_ref}} — Queued for Production",
    in_production: "Your RW'26 Items Are Being Made — #{{order_ref}}",
    delivered: "Your RW'26 Order is Ready for Collection — #{{order_ref}}",
    flagged: "Action Required on Your Order #{{order_ref}}",
    cancelled: "Your Order #{{order_ref}} Has Been Cancelled",
    payment_pending: "We Received Your Payment Receipt — #{{order_ref}}",
    payment_approved: "Payment Approved — #{{order_ref}}",
    payment_flagged: "Issue With Your Payment Receipt — #{{order_ref}}",
    payment_rejected: "Payment Could Not Be Verified — #{{order_ref}}",
};

export const DEFAULT_BODIES: Record<string, string> = {
    pending: `<p>Hi {{customer_name}},</p>
<p>We have received your pre-order <strong>#{{order_ref}}</strong> totalling <strong>{{total_amount}}</strong>. Please upload your payment receipt to proceed with your order.</p>
{{items_html}}
<p>If you have any questions, don't hesitate to reach out to us.</p>
<p>God bless you — <strong>RCF FUTA Team</strong></p>`,

    partially_paid: `<p>Hi {{customer_name}},</p>
<p>Thank you! We have confirmed a payment of <strong>{{amount_paid}}</strong> on your order <strong>#{{order_ref}}</strong>.</p>
<p>Your outstanding balance is <strong>{{balance}}</strong>. Please complete your payment to move your order to production.</p>
{{items_html}}
<p>— <strong>RCF FUTA Team</strong></p>`,

    paid: `<p>Hi {{customer_name}},</p>
<p>Wonderful news! Your order <strong>#{{order_ref}}</strong> is fully paid ({{total_amount}}). 🎉</p>
<p>We will notify you as soon as your order enters production. Thank you for being part of Redemption Week '26!</p>
{{items_html}}
<p>— <strong>RCF FUTA Team</strong></p>`,

    confirmed: `<p>Hi {{customer_name}},</p>
<p>Great news! Your order <strong>#{{order_ref}}</strong> has been confirmed and queued for production.</p>
<p>We will send you another update when your items are being made. Stay blessed!</p>
<p>— <strong>RCF FUTA Team</strong></p>`,

    in_production: `<p>Hi {{customer_name}},</p>
<p>Your order <strong>#{{order_ref}}</strong> is currently in production — your items are being made!</p>
<p>We will notify you once they are ready for collection. Watch this space!</p>
<p>— <strong>RCF FUTA Team</strong></p>`,

    delivered: `<p>Hi {{customer_name}},</p>
<p>Your order <strong>#{{order_ref}}</strong> is <strong>ready for collection</strong>! 🎉</p>
<p>Please come and pick up your Redemption Week '26 items. We hope you absolutely love them and that they are a blessing to you.</p>
<p>To God be the glory — <strong>RCF FUTA Team</strong></p>`,

    flagged: `<p>Hi {{customer_name}},</p>
<p>Your order <strong>#{{order_ref}}</strong> has been flagged for review and requires your attention.</p>
<p>Please contact us as soon as possible so we can resolve this quickly and get your order back on track.</p>
<p>— <strong>RCF FUTA Team</strong></p>`,

    cancelled: `<p>Hi {{customer_name}},</p>
<p>We regret to inform you that your order <strong>#{{order_ref}}</strong> has been cancelled.</p>
<p>If you believe this is an error or would like more information, please contact us immediately.</p>
<p>— <strong>RCF FUTA Team</strong></p>`,

    payment_pending: `<p>Hi {{customer_name}},</p>
<p>We have received your payment receipt for order <strong>#{{order_ref}}</strong> and it is currently under review.</p>
<p>We will notify you once your payment has been verified. This usually takes a few hours.</p>
<p>— <strong>RCF FUTA Team</strong></p>`,

    payment_approved: `<p>Hi {{customer_name}},</p>
<p>Your payment of <strong>{{amount_paid}}</strong> for order <strong>#{{order_ref}}</strong> has been approved! ✅</p>
<p>Your order is moving forward. We will keep you updated on every step.</p>
<p>— <strong>RCF FUTA Team</strong></p>`,

    payment_flagged: `<p>Hi {{customer_name}},</p>
<p>There is an issue with the payment receipt you submitted for order <strong>#{{order_ref}}</strong>.</p>
<p>Please contact us or submit a clearer copy of your receipt so we can verify your payment promptly.</p>
<p>— <strong>RCF FUTA Team</strong></p>`,

    payment_rejected: `<p>Hi {{customer_name}},</p>
<p>Unfortunately, the payment receipt for order <strong>#{{order_ref}}</strong> could not be verified.</p>
<p>Please contact us with your bank transaction details so we can resolve this as quickly as possible.</p>
<p>— <strong>RCF FUTA Team</strong></p>`,
};

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
