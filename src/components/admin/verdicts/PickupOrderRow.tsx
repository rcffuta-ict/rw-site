"use client";

import { OrderStatusBadge } from "@/components/ui/Badge";
import { formatNaira } from "@/lib/utils/functions";
import type { Order } from "@/lib/data/types";

function formatWhen(iso: string | null) {
    if (!iso) return null;
    const d = new Date(iso);
    if (isNaN(d.getTime())) return null;
    return d.toLocaleString("en-NG", {
        day: "numeric",
        month: "short",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });
}

/**
 * One order on the pickup desk / verdict detail. Shows live status and, when the
 * order is awaiting collection, a "Mark Delivered" action that opens the
 * token-gated dialog (handled by the parent).
 */
export function PickupOrderRow({
    order,
    onDeliverClick,
}: {
    order: Order;
    onDeliverClick: (order: Order) => void;
}) {
    const ready = order.status === "ready_for_pickup";
    const delivered = order.status === "delivered";
    const when = formatWhen(order.deliveredAt);

    return (
        <div className="flex items-center gap-4 p-4 rounded-2xl border border-[var(--rw-border)] bg-white">
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2.5">
                    <span className="font-mono font-black text-sm text-rw-crimson">
                        {order.orderRef}
                    </span>
                    <OrderStatusBadge status={order.status} />
                </div>
                <p className="text-sm font-bold text-rw-ink mt-0.5 truncate">
                    {order.customerName}
                </p>
                <p className="text-[11px] text-rw-muted truncate">
                    {delivered && when
                        ? `Collected ${when}${order.deliveredByName ? ` · by ${order.deliveredByName}` : ""}`
                        : order.customerEmail}
                </p>
            </div>

            <div className="flex flex-col items-end gap-2 shrink-0">
                <span className="font-display font-black text-sm text-rw-ink">
                    {formatNaira(order.totalAmount)}
                </span>
                {ready && (
                    <button
                        onClick={() => onDeliverClick(order)}
                        className="h-9 px-4 rounded-lg bg-rw-ink text-white text-[10px] font-black uppercase tracking-widest hover:bg-rw-crimson transition-colors"
                    >
                        Mark Delivered
                    </button>
                )}
                {delivered && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-emerald-600">
                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        Collected
                    </span>
                )}
            </div>
        </div>
    );
}
