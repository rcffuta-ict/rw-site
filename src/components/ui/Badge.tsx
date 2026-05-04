import type { OrderStatus, PaymentStatus } from "@/lib/data/types";

interface BadgeProps {
    label: string;
    className?: string;
}

export function Badge({ label, className = "" }: BadgeProps) {
    return (
        <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide ${className}`}
        >
            {label}
        </span>
    );
}

const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
    pending:         "Pending",
    partially_paid:  "Partial",
    paid:            "Paid",
    confirmed:       "Confirmed",
    in_production:   "In Production",
    delivered:       "Delivered",
    flagged:         "Flagged",
    cancelled:       "Cancelled",
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
    return (
        <span className={`badge-${status} inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide`}>
            {ORDER_STATUS_LABELS[status]}
        </span>
    );
}

const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
    pending:  "Pending",
    approved: "Approved",
    flagged:  "Flagged",
    rejected: "Rejected",
};

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
    return (
        <span className={`badge-${status} inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide`}>
            {PAYMENT_STATUS_LABELS[status]}
        </span>
    );
}
