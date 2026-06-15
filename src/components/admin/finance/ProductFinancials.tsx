"use client";

import type { Order } from "@/lib/data/types";
import { formatNaira } from "@/lib/utils/functions";

interface ProductRow {
    name: string;
    units: number;
    orders: number;
    gross: number; // total ordered value (unitPrice × qty)
    collected: number; // attributed to approved/settled payments
    outstanding: number; // gross − collected
}

// Orders that have begun settling — their amountPaid reflects approved inflow.
const SETTLING_STATUSES = new Set(["paid", "confirmed", "partially_paid"]);

/**
 * Per-product financial breakdown. Collected revenue is attributed to each
 * product line by the parent order's payment progress (amountPaid / totalAmount),
 * since payments settle an order as a whole rather than individual line items.
 */
export function ProductFinancials({ orders }: { orders: Order[] }) {
    const map = new Map<string, ProductRow & { orderIds: Set<string> }>();

    orders.forEach((order) => {
        const progress =
            SETTLING_STATUSES.has(order.status) && order.totalAmount > 0
                ? order.amountPaid / order.totalAmount
                : 0;

        order.items.forEach((item) => {
            const gross = item.unitPrice * item.quantity;
            const row =
                map.get(item.productName) ??
                {
                    name: item.productName,
                    units: 0,
                    orders: 0,
                    gross: 0,
                    collected: 0,
                    outstanding: 0,
                    orderIds: new Set<string>(),
                };

            row.units += item.quantity;
            row.gross += gross;
            row.collected += gross * progress;
            row.orderIds.add(order.id);
            map.set(item.productName, row);
        });
    });

    const rows: ProductRow[] = Array.from(map.values())
        .map((r) => ({
            name: r.name,
            units: r.units,
            orders: r.orderIds.size,
            gross: r.gross,
            collected: r.collected,
            outstanding: Math.max(r.gross - r.collected, 0),
        }))
        .sort((a, b) => b.gross - a.gross);

    const totals = rows.reduce(
        (acc, r) => ({
            units: acc.units + r.units,
            gross: acc.gross + r.gross,
            collected: acc.collected + r.collected,
            outstanding: acc.outstanding + r.outstanding,
        }),
        { units: 0, gross: 0, collected: 0, outstanding: 0 }
    );

    return (
        <div className="flex flex-col bg-white animate-scale-in">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-[10px] font-bold text-rw-muted uppercase tracking-[0.2em] flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-rw-crimson" />
                    Financials by Product
                </h3>
                <span className="text-[10px] font-bold text-rw-muted uppercase tracking-widest">
                    {rows.length} {rows.length === 1 ? "product" : "products"}
                </span>
            </div>

            {rows.length === 0 ? (
                <p className="text-sm text-rw-muted text-center py-12">
                    No product orders yet
                </p>
            ) : (
                <div className="overflow-x-auto -mx-2">
                    <table className="w-full min-w-[640px] border-collapse">
                        <thead>
                            <tr className="text-[9px] font-black text-rw-muted uppercase tracking-[0.15em]">
                                <th className="text-left font-black px-2 pb-3">
                                    Product
                                </th>
                                <th className="text-right font-black px-2 pb-3">Units</th>
                                <th className="text-right font-black px-2 pb-3">
                                    Orders
                                </th>
                                <th className="text-right font-black px-2 pb-3">Gross</th>
                                <th className="text-right font-black px-2 pb-3">
                                    Collected
                                </th>
                                <th className="text-right font-black px-2 pb-3">
                                    Outstanding
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((r) => {
                                const pct =
                                    r.gross > 0
                                        ? Math.round((r.collected / r.gross) * 100)
                                        : 0;
                                return (
                                    <tr
                                        key={r.name}
                                        className="border-t border-[var(--rw-border)] group hover:bg-rw-bg-alt/30 transition-colors"
                                    >
                                        <td className="px-2 py-3 max-w-[200px]">
                                            <p
                                                className="text-sm font-bold text-rw-ink truncate group-hover:text-rw-crimson transition-colors"
                                                title={r.name}
                                            >
                                                {r.name}
                                            </p>
                                            <div className="mt-1.5 h-1 w-full rounded-full bg-rw-bg-alt overflow-hidden border border-[var(--rw-border-mid)]/10">
                                                <div
                                                    className="h-full rounded-full bg-green-500/80"
                                                    style={{ width: `${pct}%` }}
                                                />
                                            </div>
                                        </td>
                                        <td className="px-2 py-3 text-right font-mono text-sm text-rw-ink">
                                            {r.units}
                                        </td>
                                        <td className="px-2 py-3 text-right font-mono text-sm text-rw-muted">
                                            {r.orders}
                                        </td>
                                        <td className="px-2 py-3 text-right font-mono text-sm font-bold text-rw-ink">
                                            {formatNaira(r.gross)}
                                        </td>
                                        <td className="px-2 py-3 text-right font-mono text-sm font-bold text-green-700">
                                            {formatNaira(Math.round(r.collected))}
                                            <span className="block text-[9px] font-bold text-rw-muted tracking-tight">
                                                {pct}%
                                            </span>
                                        </td>
                                        <td className="px-2 py-3 text-right font-mono text-sm font-bold text-amber-600">
                                            {formatNaira(Math.round(r.outstanding))}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                        <tfoot>
                            <tr className="border-t-2 border-[var(--rw-border)] font-black">
                                <td className="px-2 pt-4 text-[10px] uppercase tracking-[0.2em] text-rw-muted">
                                    Total
                                </td>
                                <td className="px-2 pt-4 text-right font-mono text-sm text-rw-ink">
                                    {totals.units}
                                </td>
                                <td className="px-2 pt-4" />
                                <td className="px-2 pt-4 text-right font-mono text-sm text-rw-ink">
                                    {formatNaira(totals.gross)}
                                </td>
                                <td className="px-2 pt-4 text-right font-mono text-sm text-green-700">
                                    {formatNaira(Math.round(totals.collected))}
                                </td>
                                <td className="px-2 pt-4 text-right font-mono text-sm text-amber-600">
                                    {formatNaira(Math.round(totals.outstanding))}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            )}
        </div>
    );
}
