"use client";

import { DEMO_ORDERS } from "@/lib/data/orders";

export function RevenueBreakdown() {
    // Calculate revenue by product category/name
    const productRevenue: Record<string, number> = {};
    let totalRevenue = 0;

    DEMO_ORDERS.forEach(order => {
        order.items.forEach(item => {
            const amount = item.quantity * item.unitPrice;
            productRevenue[item.productName] = (productRevenue[item.productName] || 0) + amount;
            totalRevenue += amount;
        });
    });

    const sortedProducts = Object.entries(productRevenue)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5);

    function fmt(n: number) { return `₦${n.toLocaleString()}`; }

    return (
        <div className="rw-card p-6 shadow-sm border border-[var(--rw-border)] bg-white animate-scale-in">
            <h3 className="text-[10px] font-bold text-rw-muted uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-rw-crimson" />
                Revenue by Product
            </h3>
            <div className="flex flex-col gap-6">
                {sortedProducts.map(([name, amount], i) => {
                    const pct = Math.round((amount / totalRevenue) * 100);
                    return (
                        <div key={name} className="flex flex-col gap-2 group">
                            <div className="flex items-center justify-between text-sm">
                                <span className="font-bold text-rw-ink group-hover:text-rw-crimson transition-colors">{name}</span>
                                <span className="font-mono font-bold text-rw-ink">{fmt(amount)}</span>
                            </div>
                            <div className="h-1.5 rounded-full bg-rw-bg-alt overflow-hidden border border-[var(--rw-border-mid)]/20">
                                <div 
                                    className="h-full rounded-full bg-gradient-to-r from-rw-crimson to-rw-crimson-dk transition-all duration-1000 ease-out" 
                                    style={{ width: `${pct}%`, transitionDelay: `${i * 100}ms` }} 
                                />
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[9px] text-rw-muted font-bold uppercase tracking-tight">{pct}% share</span>
                                <span className="text-[9px] text-rw-muted font-bold uppercase tracking-tight">{Math.round(amount/4500)} units est.</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
