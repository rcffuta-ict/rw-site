"use client";

import { useAdminModal } from "@/context/AdminModalContext";
import { OrderQuickView } from "@/components/admin/orders/OrderQuickView";
import type { Order } from "@/lib/data/types";

interface OrderRefCellProps {
    order: Order;
    className?: string;
}

/**
 * Renders an order reference that, when clicked, opens a quick-preview modal
 * (OrderQuickView) instead of navigating away. Use this for order-ref columns
 * on pages other than the Orders page, where a full navigation is disruptive.
 */
export function OrderRefCell({ order, className = "" }: OrderRefCellProps) {
    const { openModal, closeModal } = useAdminModal();

    return (
        <button
            type="button"
            onClick={() =>
                openModal(<OrderQuickView order={order} onClose={closeModal} />, {
                    title: "Order Information",
                    description: `Quick overview of order ${order.orderRef}`,
                    maxWidth: "4xl",
                })
            }
            className={`font-mono font-bold text-rw-crimson border-b border-rw-crimson/20 hover:border-rw-crimson transition-all ${className}`}
        >
            #{order.orderRef}
        </button>
    );
}
