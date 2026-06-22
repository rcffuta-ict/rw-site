"use client";

import { useState, useMemo } from "react";

import { SearchInput } from "@/components/ui/SearchInput";
import { OrderStats } from "@/components/admin/orders/OrderStats";
import { OrderVerdictActions } from "@/components/admin/orders/OrderVerdictActions";

import { Order } from "@/lib/data/types";
import { getOrderLifecycleStatus, type OrderLifecycle } from "@/lib/utils/functions";
import { OrdersTable } from "@/components/admin/OrdersTable";
import { RefreshButton } from "@/components/admin/RefreshButton";

// Tab → which lifecycle buckets it shows. "all" is everything; the rest map to
// one bucket each, covering the full journey from payment to collection.
const STATUS_TABS: { key: string; label: string; match?: OrderLifecycle }[] = [
    { key: "all", label: "All" },
    { key: "pending", label: "Pending", match: "pending" },
    { key: "queued", label: "Needs Review", match: "queued" },
    { key: "partially_paid", label: "Partial", match: "partially_paid" },
    { key: "paid", label: "Paid", match: "paid" },
    { key: "in_production", label: "Production", match: "in_production" },
    { key: "ready_for_pickup", label: "Pickup", match: "ready_for_pickup" },
    { key: "delivered", label: "Delivered", match: "delivered" },
    { key: "flagged", label: "Flagged", match: "flagged" },
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

    // Precompute each order's lifecycle bucket once.
    const stages = useMemo(
        () => new Map(initialOrders.map((o) => [o.id, getOrderLifecycleStatus(o)])),
        [initialOrders]
    );

    // Live count per tab for the count chips.
    const tabCounts = useMemo(() => {
        const c: Record<string, number> = { all: initialOrders.length };
        for (const stage of stages.values()) c[stage] = (c[stage] ?? 0) + 1;
        return c;
    }, [initialOrders, stages]);

    const filteredOrders = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        return initialOrders.filter((o) => {
            const matchesStatus =
                statusFilter === "all" || stages.get(o.id) === statusFilter;
            const matchesSearch =
                !q ||
                o.orderRef.toLowerCase().includes(q) ||
                o.customerName.toLowerCase().includes(q) ||
                o.customerEmail.toLowerCase().includes(q);
            return matchesStatus && matchesSearch;
        });
    }, [statusFilter, searchQuery, initialOrders, stages]);

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
                <div className="w-full sm:w-auto flex items-center gap-3 animate-scale-in">
                    <RefreshButton />
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
                        {STATUS_TABS.map((t) => {
                            const active = t.key === statusFilter;
                            const count = tabCounts[t.key] ?? 0;
                            return (
                                <button
                                    key={t.key}
                                    onClick={() => setStatusFilter(t.key)}
                                    className={`flex items-center gap-2 rounded-[14px] pl-4 pr-2.5 py-2.5 text-[11px] font-bold uppercase tracking-wider transition-all duration-200 whitespace-nowrap ${
                                        active
                                            ? "bg-white text-rw-crimson shadow-sm scale-[1.02] border border-[var(--rw-border)]"
                                            : "text-rw-muted hover:text-rw-ink hover:bg-white/50"
                                    }`}
                                >
                                    {t.label}
                                    <span
                                        className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-black tabular-nums ${
                                            active
                                                ? "bg-rw-crimson/10 text-rw-crimson"
                                                : "bg-white/70 text-rw-muted"
                                        }`}
                                    >
                                        {count}
                                    </span>
                                </button>
                            );
                        })}
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
