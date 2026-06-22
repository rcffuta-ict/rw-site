"use client";

import { useMemo } from "react";
import { Order } from "@/lib/data/types";
import { getOrderLifecycleStatus, fmtNaira } from "@/lib/utils/functions";

const icon = (d: string) => (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d={d} />
    </svg>
);

// Lifecycle pipeline, in journey order, with the icon + accent each chip uses.
const PIPELINE: {
    key: string;
    label: string;
    color: string;
    d: string;
}[] = [
    { key: "pending", label: "Pending", color: "text-rw-muted", d: "M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" },
    { key: "queued", label: "Needs Review", color: "text-purple-600", d: "M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178ZM15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" },
    { key: "partially_paid", label: "Partial", color: "text-amber-600", d: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" },
    { key: "paid", label: "Paid", color: "text-green-600", d: "M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" },
    { key: "in_production", label: "In Production", color: "text-indigo-600", d: "M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085" },
    { key: "ready_for_pickup", label: "Ready for Pickup", color: "text-rw-gold", d: "M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" },
    { key: "delivered", label: "Delivered", color: "text-emerald-600", d: "M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" },
];

function ProgressBar({ pct, className = "bg-rw-crimson" }: { pct: number; className?: string }) {
    return (
        <div className="h-1.5 w-full rounded-full bg-rw-bg-alt overflow-hidden">
            <div
                className={`h-full rounded-full ${className} transition-all duration-500`}
                style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
            />
        </div>
    );
}

export function OrderStats({ orders }: { orders: Order[] }) {
    const m = useMemo(() => {
        const total = orders.length;
        const counts: Record<string, number> = {};
        let collected = 0;
        let outstanding = 0;
        let totalOrdered = 0;
        for (const o of orders) {
            counts[getOrderLifecycleStatus(o)] = (counts[getOrderLifecycleStatus(o)] ?? 0) + 1;
            collected += o.amountPaid;
            if (o.status !== "cancelled") {
                totalOrdered += o.totalAmount;
                outstanding += Math.max(o.totalAmount - o.amountPaid, 0);
            }
        }
        const delivered = counts.delivered ?? 0;
        return {
            total,
            counts,
            collected,
            outstanding,
            totalOrdered,
            delivered,
            collectedPct: totalOrdered > 0 ? Math.round((collected / totalOrdered) * 100) : 0,
            fulfilledPct: total > 0 ? Math.round((delivered / total) * 100) : 0,
            flagged: counts.flagged ?? 0,
        };
    }, [orders]);

    return (
        <div className="flex flex-col gap-4">
            {/* Hero KPIs */}
            <div className="grid gap-4 md:grid-cols-3">
                {/* Total */}
                <div className="rw-card p-5 flex flex-col justify-between gap-4">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-rw-muted">
                                Total Orders
                            </p>
                            <p className="font-display font-black text-3xl text-rw-ink mt-1 tabular-nums">
                                {m.total}
                            </p>
                        </div>
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-rw-crimson/8 text-rw-crimson">
                            {icon("M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007Z")}
                        </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                        <span className="text-[10px] font-bold text-rw-muted bg-rw-bg-alt rounded-md px-2 py-1">
                            {m.counts.pending ?? 0} pending
                        </span>
                        <span className="text-[10px] font-bold text-purple-700 bg-purple-50 rounded-md px-2 py-1">
                            {m.counts.queued ?? 0} to review
                        </span>
                        {m.flagged > 0 && (
                            <span className="text-[10px] font-bold text-rw-crimson bg-rw-crimson/8 rounded-md px-2 py-1">
                                {m.flagged} flagged
                            </span>
                        )}
                    </div>
                </div>

                {/* Revenue collected */}
                <div className="rw-card p-5 flex flex-col justify-between gap-4">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-rw-muted">
                                Revenue Collected
                            </p>
                            <p className="font-display font-black text-3xl text-rw-ink mt-1">
                                {fmtNaira(m.collected)}
                            </p>
                        </div>
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
                            {icon("M2.25 18 9 11.25l4.306 4.307a11.95 11.95 0 0 1 5.814-5.519l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941")}
                        </span>
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <ProgressBar pct={m.collectedPct} className="bg-green-500" />
                        <p className="text-[11px] text-rw-muted font-medium">
                            <span className="font-bold text-rw-ink">{m.collectedPct}%</span> of{" "}
                            {fmtNaira(m.totalOrdered)} ·{" "}
                            <span className="font-bold text-rw-crimson">{fmtNaira(m.outstanding)}</span>{" "}
                            outstanding
                        </p>
                    </div>
                </div>

                {/* Fulfillment */}
                <div className="rw-card p-5 flex flex-col justify-between gap-4">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-rw-muted">
                                Fulfillment
                            </p>
                            <p className="font-display font-black text-3xl text-rw-ink mt-1 tabular-nums">
                                {m.delivered}
                                <span className="text-lg text-rw-muted">/{m.total}</span>
                            </p>
                        </div>
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                            {icon("M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z")}
                        </span>
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <ProgressBar pct={m.fulfilledPct} className="bg-emerald-500" />
                        <p className="text-[11px] text-rw-muted font-medium">
                            <span className="font-bold text-rw-ink">{m.fulfilledPct}%</span> delivered ·{" "}
                            {m.counts.ready_for_pickup ?? 0} ready ·{" "}
                            {m.counts.in_production ?? 0} in production
                        </p>
                    </div>
                </div>
            </div>

            {/* Lifecycle pipeline */}
            <div className="rw-card p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-rw-muted mb-3 ml-1">
                    Fulfillment Pipeline
                </p>
                <div className="flex gap-2.5 overflow-x-auto scrollbar-hide pb-1">
                    {PIPELINE.map((s, i) => (
                        <div key={s.key} className="flex items-center gap-2.5 shrink-0">
                            <div className="flex items-center gap-3 rounded-xl border border-[var(--rw-border)] bg-rw-bg-alt/40 px-3.5 py-2.5 min-w-[124px]">
                                <span className={`${s.color}`}>{icon(s.d)}</span>
                                <div>
                                    <p className="font-display font-black text-lg leading-none text-rw-ink tabular-nums">
                                        {m.counts[s.key] ?? 0}
                                    </p>
                                    <p className="text-[9px] font-bold uppercase tracking-wider text-rw-muted mt-0.5">
                                        {s.label}
                                    </p>
                                </div>
                            </div>
                            {i < PIPELINE.length - 1 && (
                                <svg className="h-3.5 w-3.5 text-rw-muted/40 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                </svg>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
