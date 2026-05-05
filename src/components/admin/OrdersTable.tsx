import React from "react";
import Link from "next/link";
import { Order } from "@/lib/data/types";
import { OrderStatusBadge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/cards/Card";

interface OrdersTableProps {
    orders: Order[];
}

export function OrdersTable({ orders }: OrdersTableProps) {
    if (orders.length === 0) {
        return (
            <Card className="p-12 text-center">
                <p className="text-rw-muted text-sm font-medium">No orders found.</p>
            </Card>
        );
    }

    return (
        <Card className="overflow-hidden">
            <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-sm text-left">
                    <thead>
                        <tr className="border-b border-[var(--rw-border)] bg-rw-bg-alt/50 text-rw-muted">
                            <th className="px-5 py-3 text-xs font-bold uppercase tracking-widest">Ref</th>
                            <th className="px-5 py-3 text-xs font-bold uppercase tracking-widest">Customer</th>
                            <th className="px-5 py-3 text-xs font-bold uppercase tracking-widest hidden sm:table-cell">Items</th>
                            <th className="px-5 py-3 text-xs font-bold uppercase tracking-widest text-right">Total</th>
                            <th className="px-5 py-3 text-xs font-bold uppercase tracking-widest text-right hidden md:table-cell">Paid</th>
                            <th className="px-5 py-3 text-xs font-bold uppercase tracking-widest">Status</th>
                            <th className="px-5 py-3 text-xs font-bold uppercase tracking-widest text-right hidden lg:table-cell">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(o => (
                            <tr key={o.id} className="border-b border-[var(--rw-border)] last:border-0 hover:bg-rw-bg-alt/30 transition-colors group">
                                <td className="px-5 py-4">
                                    <Link href={`/admin/orders/${o.orderRef}`} className="font-mono font-bold text-rw-crimson hover:underline text-sm tracking-tight">
                                        {o.orderRef}
                                    </Link>
                                </td>
                                <td className="px-5 py-4">
                                    <p className="font-bold text-rw-ink truncate max-w-[140px] sm:max-w-none">{o.customerName}</p>
                                    <p className="text-[10px] text-rw-muted truncate max-w-[140px] sm:max-w-none hidden sm:block font-medium">{o.customerEmail}</p>
                                </td>
                                <td className="px-5 py-4 hidden sm:table-cell">
                                    <span className="text-[10px] font-bold text-rw-muted bg-rw-bg-alt px-1.5 py-0.5 rounded border border-[var(--rw-border)]">
                                        {o.items.length} ITEM{o.items.length !== 1 ? "S" : ""}
                                    </span>
                                </td>
                                <td className="px-5 py-4 text-right font-bold text-rw-ink whitespace-nowrap">₦{o.totalAmount.toLocaleString()}</td>
                                <td className="px-5 py-4 text-right text-rw-text-2 hidden md:table-cell whitespace-nowrap">₦{o.amountPaid.toLocaleString()}</td>
                                <td className="px-5 py-4">
                                    <OrderStatusBadge status={o.status} />
                                </td>
                                <td className="px-5 py-4 text-right text-[10px] font-bold text-rw-muted hidden lg:table-cell uppercase tracking-tighter">
                                    {new Date(o.createdAt).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "2-digit" })}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
}
