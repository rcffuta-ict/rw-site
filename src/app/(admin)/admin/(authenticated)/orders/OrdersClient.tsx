"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

import { OrderStatusBadge } from "@/components/ui/Badge";
import type { OrderStatus } from "@/lib/data/types";
import { SearchInput } from "@/components/ui/SearchInput";
import { OrderStats } from "@/components/admin/orders/OrderStats";
import { OrderVerdictActions } from "@/components/admin/orders/OrderVerdictActions";

import { Order } from "@/lib/data/types";
import { getEffectiveStatus } from "@/lib/utils/functions";
import { OrdersTable } from "@/components/admin/OrdersTable";

const STATUS_TABS: { key: string; label: string }[] = [
    { key: "all", label: "All" },
    { key: "pending", label: "Pending" },
    { key: "partially_paid", label: "Partial" },
    { key: "paid", label: "Paid" },
    { key: "queued", label: "Queued" },
    { key: "flagged", label: "Flagged" },
];

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
            const effectiveStatus = getEffectiveStatus(o);
            const matchesStatus =
                statusFilter === "all" || effectiveStatus === statusFilter;
            const matchesSearch =
                !searchQuery ||
                o.orderRef.toLowerCase().includes(searchQuery.toLowerCase()) ||
                o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                o.customerEmail.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesStatus && matchesSearch;
        });
    }, [statusFilter, searchQuery]);

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
            <div className="flex flex-col xl:flex-row gap-6 items-start xl:items-end justify-between bg-white p-6 rounded-[24px] border border-[var(--rw-border)] shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="flex flex-col gap-4 w-full max-w-2xl">
                    <div className="flex items-center gap-2 ml-1">
                        <span className="h-1 w-4 bg-rw-crimson rounded-full" />
                        <label className="text-[10px] font-bold text-rw-muted uppercase tracking-[0.2em]">
                            Filter by Status
                        </label>
                    </div>
                    <div className="flex sm:flex-wrap gap-2 p-1.5 rounded-[18px] bg-rw-bg-alt border border-[var(--rw-border)] overflow-x-auto scrollbar-hide -mx-2 sm:mx-0">
                        {STATUS_TABS.map((t) => (
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
            <OrdersTable orders={filteredOrders} />
        </div>
    );
}
