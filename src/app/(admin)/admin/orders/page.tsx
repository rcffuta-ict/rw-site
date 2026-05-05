"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { DEMO_ORDERS } from "@/lib/data/orders";
import { OrderStatusBadge } from "@/components/ui/Badge";
import type { OrderStatus } from "@/lib/data/types";
import { SearchInput } from "@/components/ui/SearchInput";
import { OrderStats } from "@/components/admin/orders/OrderStats";
import { OrderVerdictActions } from "@/components/admin/orders/OrderVerdictActions";

import { AdminTable } from "@/components/admin/AdminTable";
import { Order } from "@/lib/data/types";

function fmt(n: number) { return `₦${n.toLocaleString()}`; }

const STATUS_TABS: { key: OrderStatus | "all"; label: string }[] = [
    { key: "all",            label: "All" },
    { key: "pending",        label: "Pending" },
    { key: "partially_paid", label: "Partial" },
    { key: "paid",           label: "Paid" },
    { key: "confirmed",      label: "Confirmed" },
    { key: "flagged",        label: "Flagged" },
];

export default function AdminOrdersPage() {
    const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
    const [searchQuery, setSearchQuery] = useState("");

    const filteredOrders = useMemo(() => {
        return DEMO_ORDERS.filter(o => {
            const matchesStatus = statusFilter === "all" || o.status === statusFilter;
            const matchesSearch = !searchQuery || 
                o.orderRef.toLowerCase().includes(searchQuery.toLowerCase()) ||
                o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                o.customerEmail.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesStatus && matchesSearch;
        });
    }, [statusFilter, searchQuery]);

    return (
        <div className="flex flex-col gap-8 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-[var(--rw-border)] pb-8">
                <div className="flex flex-col gap-2">
                    <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-rw-ink tracking-tight">Orders</h1>
                    <p className="text-xs sm:text-sm text-rw-muted font-medium">Manage fulfillment and track payments across the platform</p>
                </div>
                <div className="w-full sm:w-auto animate-scale-in">
                    <OrderVerdictActions />
                </div>
            </div>

            <OrderStats orders={DEMO_ORDERS} />

            {/* Filter & Search Bar */}
            <div className="flex flex-col xl:flex-row gap-6 items-start xl:items-end justify-between bg-white p-6 rounded-[24px] border border-[var(--rw-border)] shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="flex flex-col gap-4 w-full max-w-2xl">
                    <div className="flex items-center gap-2 ml-1">
                        <span className="h-1 w-4 bg-rw-crimson rounded-full" />
                        <label className="text-[10px] font-bold text-rw-muted uppercase tracking-[0.2em]">Filter by Status</label>
                    </div>
                    <div className="flex sm:flex-wrap gap-2 p-1.5 rounded-[18px] bg-rw-bg-alt border border-[var(--rw-border)] overflow-x-auto scrollbar-hide -mx-2 sm:mx-0">
                        {STATUS_TABS.map(t => (
                            <button
                                key={t.key}
                                onClick={() => setStatusFilter(t.key)}
                                className={`rounded-[14px] px-6 py-2.5 text-[11px] font-bold uppercase tracking-wider transition-all duration-200 whitespace-nowrap ${
                                    t.key === statusFilter
                                        ? "bg-white text-rw-crimson shadow-sm scale-[1.02] border border-[var(--rw-border)]"
                                        : "text-rw-muted hover:text-rw-ink hover:bg-white/50"
                                }`}
                            >
                                {t.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="w-full xl:max-w-md !mt-0 group">
                    <SearchInput 
                        query={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onClear={() => setSearchQuery("")}
                    />
                </div>
            </div>

            {/* Orders table */}
            <AdminTable<Order>
                data={filteredOrders}
                keyExtractor={(o: Order) => o.id}
                emptyMessage="No orders found matching your criteria"
                columns={[
                    {
                        label: "Ref",
                        key: "orderRef",
                        render: (o: Order) => (
                            <Link href={`/admin/orders/${o.orderRef}`} className="font-mono font-bold text-rw-crimson hover:text-rw-crimson-dk transition-colors border-b border-rw-crimson/20 pb-0.5">{o.orderRef}</Link>
                        )
                    },
                    {
                        label: "Customer",
                        key: "customerName",
                        render: (o: Order) => (
                            <div className="flex flex-col">
                                <span className="font-bold text-rw-ink group-hover:text-rw-crimson transition-colors">{o.customerName}</span>
                                <span className="text-xs text-rw-muted">{o.customerEmail}</span>
                            </div>
                        )
                    },
                    {
                        label: "Items",
                        key: "items",
                        align: "right",
                        className: "hidden sm:table-cell",
                        render: (o: Order) => (
                            <span className="px-2 py-1 rounded-md bg-rw-bg-alt text-[11px] font-bold">{o.items.length} items</span>
                        )
                    },
                    {
                        label: "Total",
                        key: "totalAmount",
                        align: "right",
                        render: (o: Order) => <span className="font-display font-bold text-rw-ink">{fmt(o.totalAmount)}</span>
                    },
                    {
                        label: "Paid",
                        key: "amountPaid",
                        align: "right",
                        className: "hidden md:table-cell",
                        render: (o: Order) => (
                            <span className={o.amountPaid >= o.totalAmount ? "text-green-600 font-semibold" : ""}>
                                {fmt(o.amountPaid)}
                            </span>
                        )
                    },
                    {
                        label: "Status",
                        key: "status",
                        render: (o: Order) => <OrderStatusBadge status={o.status} />
                    },
                    {
                        label: "Date",
                        key: "createdAt",
                        align: "right",
                        className: "hidden lg:table-cell",
                        render: (o: Order) => (
                            <span className="text-xs text-rw-muted font-medium">
                                {new Date(o.createdAt).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
                            </span>
                        )
                    }
                ]}
                footer={
                    <div className="flex items-center justify-between">
                        <p className="text-xs text-rw-muted font-medium italic">Showing {filteredOrders.length} of {DEMO_ORDERS.length} orders</p>
                        <div className="flex gap-2">
                            <button disabled className="px-3 py-1 text-xs font-bold text-rw-muted border border-[var(--rw-border)] rounded-lg bg-white/50 opacity-50">Prev</button>
                            <button disabled className="px-3 py-1 text-xs font-bold text-rw-muted border border-[var(--rw-border)] rounded-lg bg-white/50 opacity-50">Next</button>
                        </div>
                    </div>
                }
            />
        </div>
    );
}
