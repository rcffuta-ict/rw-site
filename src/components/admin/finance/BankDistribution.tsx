"use client";

import { DEMO_ORDERS } from "@/lib/data/orders";

export function BankDistribution() {
    // Calculate revenue by bank
    const bankRevenue: Record<string, number> = {};
    let totalCollected = 0;

    DEMO_ORDERS.forEach(order => {
        order.payments.forEach(payment => {
            if (payment.status === "approved") {
                const bank = payment.extractedBank || "Other / Unknown";
                bankRevenue[bank] = (bankRevenue[bank] || 0) + payment.amountClaimed;
                totalCollected += payment.amountClaimed;
            }
        });
    });

    const sortedBanks = Object.entries(bankRevenue)
        .sort(([, a], [, b]) => b - a);

    function fmt(n: number) { return `₦${n.toLocaleString()}`; }

    return (
        <div className="rw-card p-6 shadow-sm border border-[var(--rw-border)] bg-white animate-scale-in">
            <h3 className="text-[10px] font-bold text-rw-muted uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-rw-crimson" />
                Revenue by Bank
            </h3>
            <div className="flex flex-col gap-5">
                {sortedBanks.length === 0 ? (
                    <p className="text-sm text-rw-muted text-center py-8">No approved payments yet</p>
                ) : (
                    sortedBanks.map(([bank, amount]) => {
                        const pct = Math.round((amount / totalCollected) * 100);
                        return (
                            <div key={bank} className="flex items-center gap-4 group">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1.5">
                                        <span className="text-sm font-bold text-rw-ink truncate group-hover:text-rw-crimson transition-colors">{bank}</span>
                                        <span className="text-sm font-mono font-bold text-rw-ink">{fmt(amount)}</span>
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
            
            <div className="mt-8 pt-6 border-t border-[var(--rw-border)] border-dashed">
                <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-rw-muted uppercase tracking-[0.2em]">Total Approved</span>
                    <span className="font-display font-extrabold text-2xl text-green-700">{fmt(totalCollected)}</span>
                </div>
            </div>
        </div>
    );
}
