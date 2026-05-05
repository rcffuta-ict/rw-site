"use client";

import { DEMO_ORDERS } from "@/lib/data/orders";
import { DEMO_PRODUCTS } from "@/lib/data/products";
import { fmtNaira } from "@/lib/utils/functions";

export function ProductDistribution() {
    // Calculate revenue by product category
    const categoryRevenue: Record<string, number> = {};
    let totalCollected = 0;

    // We only count approved payments
    DEMO_ORDERS.forEach(order => {
        if (order.status === "paid" || order.status === "confirmed" || order.status === "partially_paid") {
            order.items.forEach(item => {
                // Find product to get category
                const product = DEMO_PRODUCTS.find(p => p.name === item.productName);
                const category = product?.category || "Other";

                // For simplicity in this demo, we'll attribute revenue based on item valuation
                // scaled by the order's payment progress
                const paymentProgress = order.amountPaid / order.totalAmount;
                const itemAttributedRevenue = item.unitPrice * item.quantity * paymentProgress;

                categoryRevenue[category] = (categoryRevenue[category] || 0) + itemAttributedRevenue;
                totalCollected += itemAttributedRevenue;
            });
        }
    });

    const CATEGORY_LABELS: Record<string, string> = {
        tshirt: "T-Shirts",
        hoodie: "Hoodies",
        accessory: "Accessories",
        Other: "Other"
    };

    const sortedCategories = Object.entries(categoryRevenue)
        .sort(([, a], [, b]) => b - a);



    return (
        <div className="rw-card p-6 shadow-sm border border-[var(--rw-border)] bg-white animate-scale-in h-full">
            <h3 className="text-[10px] font-bold text-rw-muted uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-rw-crimson" />
                Revenue by Category
            </h3>
            <div className="flex flex-col gap-6">
                {sortedCategories.length === 0 ? (
                    <p className="text-sm text-rw-muted text-center py-8">No approved payments yet</p>
                ) : (
                    sortedCategories.map(([cat, amount]) => {
                        const pct = totalCollected > 0 ? Math.round((amount / totalCollected) * 100) : 0;
                        return (
                            <div key={cat} className="flex items-center gap-4 group">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1.5">
                                        <span className="text-sm font-bold text-rw-ink truncate group-hover:text-rw-crimson transition-colors">
                                            {CATEGORY_LABELS[cat] || cat}
                                        </span>
                                        <span className="text-sm font-mono font-bold text-rw-ink">{fmtNaira(amount)}</span>
                                    </div>
                                    <div className="h-1 rounded-full bg-rw-bg-alt overflow-hidden border border-[var(--rw-border-mid)]/10">
                                        <div
                                            className="h-full rounded-full bg-rw-crimson/80 group-hover:bg-rw-crimson transition-colors"
                                            style={{ width: `${pct}%` }}
                                        />
                                    </div>
                                </div>
                                <div className="shrink-0 w-10 text-right">
                                    <span className="text-[10px] font-bold text-rw-muted tracking-tighter">{pct}%</span>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            <div className="mt-auto pt-6 border-t border-[var(--rw-border)] border-dashed">
                <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-rw-muted uppercase tracking-[0.2em]">Total Collected</span>
                    <span className="font-display font-extrabold text-2xl text-green-700">{fmtNaira(totalCollected)}</span>
                </div>
            </div>
        </div>
    );
}
