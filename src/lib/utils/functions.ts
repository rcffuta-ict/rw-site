import type { Order } from "../data/types";

export function ph(w: number, h: number, label = "", bg = "f3f4f6", fg = "9ca3af") {
    const text = encodeURIComponent(label ? `${label}\n${w}×${h}` : `${w}×${h}`);
    return `https://placehold.co/${w}x${h}/${bg}/${fg}?text=${text}`;
}

export const COLOR_HEX: Record<string, string> = {
    Black: "1a1a1a",
    White: "f5f5f0",
    Burgundy: "7a0c31",
    "Wine Red": "940011",
    Navy: "0a1628",
    Grey: "6b7280",
};

export function productImageUrl(
    name: string,
    color: string | null,
    width: number = 360,
    height: number = 480
) {
    const bg = color && COLOR_HEX[color] ? COLOR_HEX[color] : "f3f4f6";
    const fg = color ? "e0e0e0" : "9ca3af";
    const label = `${name}${color ? `\n${color}` : ""}`;
    return ph(width, height, label, bg, fg);
}

export function fmtNaira(n: number) {
    return `₦${Math.round(n).toLocaleString()}`;
}

export const formatNaira = fmtNaira;

export function getRelativeTime(dateString: string) {
    const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
    const date = new Date(dateString);
    const diffInMs = date.getTime() - Date.now();

    const minutes = Math.round(diffInMs / (1000 * 60));
    const hours = Math.round(diffInMs / (1000 * 60 * 60));
    const days = Math.round(diffInMs / (1000 * 60 * 60 * 24));

    if (Math.abs(minutes) < 1) return "Just now";
    if (Math.abs(minutes) < 60) return rtf.format(minutes, "minute");
    if (Math.abs(hours) < 24) return rtf.format(hours, "hour");
    return rtf.format(days, "day");
}

export function getEffectiveStatus(o: Order) {
    if (o.status === "flagged") return "flagged";
    if (o.status === "cancelled") return "cancelled";

    if (o.amountPaid >= o.totalAmount) return "paid";

    const hasApproved = o.payments?.some((p) => p.status === "approved");
    if (hasApproved && o.amountPaid > 0 && o.amountPaid < o.totalAmount) {
        return "partially_paid";
    }

    if (o.payments && o.payments.length > 0 && !hasApproved) {
        return "queued";
    }

    return "pending";
}

// ─── Order lifecycle bucket (for the admin Orders page) ───────────────────────
//
// One label per order across its WHOLE journey. Explicit fulfilment states the
// admin/verdict has set (production → pickup → delivered) take priority; before
// that we fall back to the payment-derived status (pending → queued → partial →
// paid). "queued" means receipts are in but not yet reviewed.

export type OrderLifecycle =
    | "pending"
    | "queued"
    | "partially_paid"
    | "paid"
    | "in_production"
    | "ready_for_pickup"
    | "delivered"
    | "flagged"
    | "cancelled";

export function getOrderLifecycleStatus(o: Order): OrderLifecycle {
    switch (o.status) {
        case "flagged":
            return "flagged";
        case "cancelled":
            return "cancelled";
        case "in_production":
            return "in_production";
        case "ready_for_pickup":
            return "ready_for_pickup";
        case "delivered":
            return "delivered";
        default:
            // pending | queued | partially_paid | paid
            return getEffectiveStatus(o) as OrderLifecycle;
    }
}

export function formatTime(iso: string) {
    return new Date(iso).toLocaleTimeString("en-NG", {
        hour: "2-digit",
        minute: "2-digit",
    });
}

export function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-NG", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}
