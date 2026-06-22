"use client";

import { useMemo } from "react";
import { formatNaira } from "@/lib/utils/functions";
import type { Order, Product } from "@/lib/data/types";

const icon = (d: string) => (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d={d} />
    </svg>
);

interface ProductDemand {
    name: string;
    category: string;
    units: number;
    value: number; // ordered value (unitPrice × qty)
    available: boolean;
}

/**
 * Demand-side analytics for the catalog: how the products are actually being
 * ordered. Pairs each product with order-item demand (matched on the snapshot
 * product name) so the team can see what's moving and what isn't.
 */
export function ProductAnalytics({
    products,
    orders,
}: {
    products: Product[];
    orders: Order[];
}) {
    const a = useMemo(() => {
        // Aggregate ordered units/value per product name (exclude cancelled).
        const demand = new Map<string, { units: number; value: number }>();
        let totalUnits = 0;
        let totalValue = 0;
        for (const o of orders) {
            if (o.status === "cancelled") continue;
            for (const it of o.items) {
                const d = demand.get(it.productName) ?? { units: 0, value: 0 };
                d.units += it.quantity;
                d.value += it.unitPrice * it.quantity;
                demand.set(it.productName, d);
                totalUnits += it.quantity;
                totalValue += it.unitPrice * it.quantity;
            }
        }

        // Join to the live catalog so we can flag availability + zero-demand items.
        const rows: ProductDemand[] = products.map((p) => {
            const d = demand.get(p.name) ?? { units: 0, value: 0 };
            return {
                name: p.name,
                category: p.categoryLabel,
                units: d.units,
                value: d.value,
                available: p.isAvailable,
            };
        });

        const top = [...rows].sort((x, y) => y.units - x.units).slice(0, 6);
        const maxUnits = top.length ? Math.max(...top.map((r) => r.units), 1) : 1;
        const noDemand = rows.filter((r) => r.units === 0 && r.available).length;

        // Units ordered per category.
        const byCategory = new Map<string, number>();
        for (const r of rows) {
            byCategory.set(r.category, (byCategory.get(r.category) ?? 0) + r.units);
        }
        const categories = [...byCategory.entries()]
            .map(([label, units]) => ({ label, units }))
            .sort((x, y) => y.units - x.units);
        const maxCat = categories.length
            ? Math.max(...categories.map((c) => c.units), 1)
            : 1;

        return { rows, top, maxUnits, noDemand, totalUnits, totalValue, categories, maxCat };
    }, [products, orders]);

    return (
        <div className="flex flex-col gap-4">
            {/* Hero */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rw-card p-5">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-rw-muted">
                                Units Ordered
                            </p>
                            <p className="font-display font-black text-3xl text-rw-ink mt-1 tabular-nums">
                                {a.totalUnits}
                            </p>
                        </div>
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-rw-crimson/8 text-rw-crimson">
                            {icon("M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007Z")}
                        </span>
                    </div>
                    <p className="text-[11px] text-rw-muted font-medium mt-3">
                        Total demand across live orders
                    </p>
                </div>

                <div className="rw-card p-5">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-rw-muted">
                                Order Value
                            </p>
                            <p className="font-display font-black text-3xl text-rw-ink mt-1">
                                {formatNaira(a.totalValue)}
                            </p>
                        </div>
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
                            {icon("M2.25 18 9 11.25l4.306 4.307a11.95 11.95 0 0 1 5.814-5.519l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941")}
                        </span>
                    </div>
                    <p className="text-[11px] text-rw-muted font-medium mt-3">
                        Catalog value ordered (ex-cancelled)
                    </p>
                </div>

                <div className="rw-card p-5">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-rw-muted">
                                Best Seller
                            </p>
                            <p className="font-display font-black text-lg text-rw-ink mt-1 truncate">
                                {a.top[0]?.units ? a.top[0].name : "—"}
                            </p>
                        </div>
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-rw-gold/10 text-rw-gold">
                            {icon("M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.504-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0")}
                        </span>
                    </div>
                    <p className="text-[11px] text-rw-muted font-medium mt-3">
                        {a.top[0]?.units ? `${a.top[0].units} units ordered` : "No orders yet"}
                    </p>
                </div>

                <div className="rw-card p-5">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-rw-muted">
                                Needs Attention
                            </p>
                            <p className="font-display font-black text-3xl text-rw-ink mt-1 tabular-nums">
                                {a.noDemand}
                            </p>
                        </div>
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                            {icon("M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z")}
                        </span>
                    </div>
                    <p className="text-[11px] text-rw-muted font-medium mt-3">
                        Live products with zero orders
                    </p>
                </div>
            </div>

            {/* Breakdown */}
            <div className="grid gap-4 lg:grid-cols-2">
                {/* Top products by demand */}
                <div className="rw-card p-5">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-rw-muted mb-4">
                        Top Products by Demand
                    </p>
                    {a.top.length === 0 || a.top[0].units === 0 ? (
                        <p className="text-sm text-rw-muted italic py-6 text-center">
                            No orders to rank yet.
                        </p>
                    ) : (
                        <div className="flex flex-col gap-3.5">
                            {a.top
                                .filter((r) => r.units > 0)
                                .map((r, i) => (
                                    <div key={r.name} className="flex items-center gap-3">
                                        <span className="font-display font-black text-sm text-rw-muted w-5 shrink-0 tabular-nums">
                                            {i + 1}
                                        </span>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-2 mb-1">
                                                <p className="text-sm font-bold text-rw-ink truncate">
                                                    {r.name}
                                                    {!r.available && (
                                                        <span className="ml-2 text-[9px] font-black uppercase tracking-wider text-amber-600">
                                                            hidden
                                                        </span>
                                                    )}
                                                </p>
                                                <span className="text-xs font-bold text-rw-ink tabular-nums shrink-0">
                                                    {r.units} units
                                                </span>
                                            </div>
                                            <div className="h-2 w-full rounded-full bg-rw-bg-alt overflow-hidden">
                                                <div
                                                    className="h-full rounded-full bg-rw-crimson transition-all duration-500"
                                                    style={{ width: `${(r.units / a.maxUnits) * 100}%` }}
                                                />
                                            </div>
                                            <p className="text-[10px] text-rw-muted font-medium mt-1">
                                                {formatNaira(r.value)} · {r.category}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    )}
                </div>

                {/* Demand by category */}
                <div className="rw-card p-5">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-rw-muted mb-4">
                        Demand by Category
                    </p>
                    {a.categories.length === 0 ? (
                        <p className="text-sm text-rw-muted italic py-6 text-center">
                            No categories yet.
                        </p>
                    ) : (
                        <div className="flex flex-col gap-3.5">
                            {a.categories.map((c) => (
                                <div key={c.label}>
                                    <div className="flex items-center justify-between gap-2 mb-1">
                                        <p className="text-sm font-bold text-rw-ink truncate">
                                            {c.label}
                                        </p>
                                        <span className="text-xs font-bold text-rw-ink tabular-nums shrink-0">
                                            {c.units} units
                                        </span>
                                    </div>
                                    <div className="h-2 w-full rounded-full bg-rw-bg-alt overflow-hidden">
                                        <div
                                            className="h-full rounded-full bg-rw-gold transition-all duration-500"
                                            style={{ width: `${(c.units / a.maxCat) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
