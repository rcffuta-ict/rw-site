"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

import { OrderStatusBadge } from "@/components/ui/Badge";
import type { OrderStatus } from "@/lib/data/types";
import { SearchInput } from "@/components/ui/SearchInput";
import { OrderStats } from "@/components/admin/orders/OrderStats";
import { OrderVerdictActions } from "@/components/admin/orders/OrderVerdictActions";

import { AdminTable } from "@/components/admin/AdminTable";
import { Order } from "@/lib/data/types";
import { formatNaira } from "@/lib/utils/functions";

function getRelativeTime(dateString: string) {
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

const STATUS_TABS: { key: string; label: string }[] = [
    { key: "all", label: "All" },
    { key: "pending", label: "Pending" },
    { key: "partially_paid", label: "Partial" },
    { key: "paid", label: "Paid" },
    { key: "confirmed", label: "Queued" },
    { key: "in_production", label: "Production" },
    { key: "ready", label: "Ready" },
    { key: "delivered", label: "Delivered" },
    { key: "flagged", label: "Flagged" },
    { key: "cancelled", label: "Cancelled" },
];

const TAB_COLORS: Record<string, string> = {
    all: "#1C0003",
    pending: "#f59e0b",
    partially_paid: "#f97316",
    paid: "#10b981",
    confirmed: "#3b82f6",
    in_production: "#8b5cf6",
    ready: "#06b6d4",
    delivered: "#22c55e",
    flagged: "#ef4444",
    cancelled: "#9ca3af",
};

export default function OrdersClient({
    initialOrders,
    isAdmin,
}: {
    initialOrders: Order[];
    isAdmin: boolean;
}) {
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState("");

    const filteredOrders = useMemo(() => {
        return initialOrders.filter((o) => {
            const matchesStatus = statusFilter === "all" || o.status === statusFilter;
            const matchesSearch =
                !searchQuery ||
                o.orderRef.toLowerCase().includes(searchQuery.toLowerCase()) ||
                o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                o.customerEmail.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesStatus && matchesSearch;
        });
    }, [statusFilter, searchQuery, initialOrders]);

    const tabCounts = useMemo(() => {
        const counts: Record<string, number> = { all: initialOrders.length };
        STATUS_TABS.slice(1).forEach((t) => {
            counts[t.key] = initialOrders.filter((o) => o.status === t.key).length;
        });
        return counts;
    }, [initialOrders]);

    return (
        <div className="flex flex-col gap-8 animate-fade-in-up">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-[var(--rw-border)] pb-8">
                <div className="flex flex-col gap-2">
                    <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-rw-muted mb-0.5">
                        Fulfillment Dashboard
                    </p>
                    <h1 className="font-display font-extrabold text-2xl lg:text-3xl text-rw-ink tracking-tight">
                        Orders
                    </h1>
                    <p className="text-xs sm:text-sm text-rw-muted font-medium italic">
                        Manage fulfillment and track payments across the platform
                    </p>
                </div>
                <div className="w-full sm:w-auto animate-scale-in">
                    {isAdmin && <OrderVerdictActions />}
                </div>
            </div>

            <OrderStats orders={initialOrders} />

            {/* Filter & Search Bar */}
            <div className="flex flex-col xl:flex-row gap-6 items-start justify-between bg-white p-6 rounded-[24px] border border-[var(--rw-border)] shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="flex flex-col gap-3 w-full">
                    <div className="flex items-center gap-2 ml-1">
                        <span className="h-1 w-4 bg-rw-crimson rounded-full" />
                        <label className="text-[10px] font-bold text-rw-muted uppercase tracking-[0.2em]">
                            Filter by Status
                        </label>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {STATUS_TABS.map((t) => {
                            const count = tabCounts[t.key] ?? 0;
                            const isActive = t.key === statusFilter;
                            const color = TAB_COLORS[t.key] ?? "#1C0003";
                            return (
                                <button
                                    key={t.key}
                                    onClick={() => setStatusFilter(t.key)}
                                    className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-[10px] font-bold uppercase tracking-wider transition-all duration-200 border ${
                                        isActive
                                            ? "text-white shadow-sm scale-[1.02]"
                                            : "bg-white text-rw-muted border-[var(--rw-border)] hover:border-rw-ink hover:text-rw-ink"
                                    }`}
                                    style={
                                        isActive
                                            ? {
                                                  backgroundColor: color,
                                                  borderColor: color,
                                              }
                                            : undefined
                                    }
                                >
                                    {t.label}
                                    {count > 0 && (
                                        <span
                                            className={`rounded-full px-1.5 py-0.5 text-[9px] font-black leading-none ${
                                                isActive
                                                    ? "bg-white/20 text-white"
                                                    : "bg-rw-bg-alt text-rw-muted"
                                            }`}
                                        >
                                            {count}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="w-full xl:max-w-md">
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
                            <Link
                                href={`/admin/orders/${o.orderRef}`}
                                className="font-mono font-bold text-rw-crimson hover:text-rw-crimson-dk transition-colors border-b border-rw-crimson/20 pb-0.5"
                            >
                                {o.orderRef}
                            </Link>
                        ),
                    },
                    {
                        label: "Customer",
                        key: "customerName",
                        render: (o: Order) => (
                            <div className="flex flex-col">
                                <span className="font-bold text-rw-ink group-hover:text-rw-crimson transition-colors">
                                    {o.customerName}
                                </span>
                                <span className="text-xs text-rw-muted">
                                    {o.customerEmail}
                                </span>
                            </div>
                        ),
                    },
                    {
                        label: "Items",
                        key: "items",
                        align: "right",
                        className: "hidden sm:table-cell",
                        render: (o: Order) => (
                            <span className="px-2 py-1 rounded-md bg-rw-bg-alt text-[11px] font-bold">
                                {o.items.reduce((s, i) => s + i.quantity, 0)} pcs
                            </span>
                        ),
                    },
                    {
                        label: "Total",
                        key: "totalAmount",
                        align: "right",
                        render: (o: Order) => (
                            <span className="font-display font-bold text-rw-ink">
                                {formatNaira(o.totalAmount)}
                            </span>
                        ),
                    },
                    {
                        label: "Balance",
                        key: "amountPaid",
                        align: "right",
                        className: "hidden md:table-cell",
                        render: (o: Order) => {
                            const balance = o.totalAmount - o.amountPaid;
                            return (
                                <div className="flex flex-col items-end">
                                    <span
                                        className={
                                            balance === 0
                                                ? "text-green-600 font-semibold text-xs"
                                                : "text-rw-crimson font-semibold text-xs"
                                        }
                                    >
                                        {balance === 0
                                            ? "Cleared"
                                            : `−${formatNaira(balance)}`}
                                    </span>
                                    <span className="text-[9px] text-rw-muted">
                                        of {formatNaira(o.totalAmount)}
                                    </span>
                                </div>
                            );
                        },
                    },
                    {
                        label: "Status",
                        key: "status",
                        render: (o: Order) => <OrderStatusBadge status={o.status} />,
                    },
                    {
                        label: "Date",
                        key: "createdAt",
                        align: "right",
                        className: "hidden lg:table-cell",
                        render: (o: Order) => {
                            const date = new Date(o.createdAt);
                            const absoluteDate = date.toLocaleDateString("en-NG", {
                                day: "numeric",
                                month: "short",
                            });
                            const relative = getRelativeTime(o.createdAt);

                            return (
                                <div className="flex flex-col items-end">
                                    <span className="text-xs font-bold text-rw-ink">
                                        {absoluteDate}
                                    </span>
                                    <span className="text-[10px] font-semibold text-rw-crimson mt-0.5 tracking-wide">
                                        {relative}
                                    </span>
                                </div>
                            );
                        },
                    },
                ]}
                footer={
                    <div className="flex items-center justify-between">
                        <p className="text-xs text-rw-muted font-medium italic">
                            Showing {filteredOrders.length} of {initialOrders.length}{" "}
                            orders
                        </p>
                    </div>
                }
            />
        </div>
    );
}
