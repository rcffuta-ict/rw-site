"use client";

import React from "react";
import { AdminStats } from "@/components/admin/AdminStats";
import { Order } from "@/lib/data/types";
import { ProductDistribution } from "@/components/admin/finance/ProductDistribution";

interface FinanceAnalyticsProps {
    orders: Order[];
    stats: any[];
    collected: number;
    totalOrdered: number;
    allPayments: any[];
    outstanding: number;
    fmt: (n: number) => string;
}

export function FinanceAnalytics({
    stats,
    collected,
    totalOrdered,
    allPayments,
    outstanding,
    orders,
    fmt
}: FinanceAnalyticsProps) {
    return (
        <div className="flex flex-col gap-10 animate-fade-in-up">
            <AdminStats
                stats={stats.map(c => ({
                    label: c.label,
                    value: c.value,
                    sub: c.sub,
                    icon: <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d={c.icon} /></svg>
                }))}
            />

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Collection progress */}
                <div className="rw-card p-8 lg:col-span-2 flex flex-col justify-between bg-white border-none shadow-xl ring-1 ring-[var(--rw-border)]">
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <span className="h-1 w-6 bg-rw-crimson rounded-full" />
                                <p className="font-display font-bold text-rw-ink text-xl">Collection Progress</p>
                            </div>
                            <span className="text-sm font-bold text-rw-crimson bg-rw-crimson/5 px-3 py-1 rounded-full">
                                {totalOrdered > 0 ? Math.round(collected/totalOrdered*100) : 0}% of goal
                            </span>
                        </div>
                        <div className="progress-bar-track !h-10 rounded-2xl bg-rw-bg-alt overflow-hidden border border-[var(--rw-border)] p-1">
                            <div className="progress-bar-fill !h-full rounded-xl bg-gradient-to-r from-rw-crimson to-rw-crimson-dk transition-all duration-1000 shadow-sm relative overflow-hidden" style={{ width: `${totalOrdered > 0 ? Math.round(collected/totalOrdered*100) : 0}%` }}>
                                <div className="absolute inset-0 bg-white/20 animate-pulse" />
                            </div>
                        </div>
                        <div className="flex justify-between text-xs font-bold text-rw-muted mt-6 uppercase tracking-widest px-1">
                            <div className="flex flex-col gap-1">
                                <span>Collected</span>
                                <span className="text-2xl font-display font-black text-green-700">{fmt(collected)}</span>
                            </div>
                            <div className="flex flex-col gap-1 text-right">
                                <span>Total Expected</span>
                                <span className="text-2xl font-display font-black text-rw-ink">{fmt(totalOrdered)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-6 border-t border-[var(--rw-border)] pt-8">
                        <div>
                            <p className="text-[10px] font-bold text-rw-muted uppercase tracking-wider mb-1">Avg Order</p>
                            <p className="text-xl font-display font-bold text-rw-ink">
                                {orders.length > 0 ? fmt(Math.round(totalOrdered / orders.length)) : "₦0"}
                            </p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-rw-muted uppercase tracking-wider mb-1">Payments</p>
                            <p className="text-xl font-display font-bold text-rw-ink">{allPayments.filter(p => p.status === "approved").length}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-rw-muted uppercase tracking-wider mb-1">Audit</p>
                            <p className="text-xl font-display font-bold text-amber-600">{allPayments.filter(p => p.status === "pending").length}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-rw-muted uppercase tracking-wider mb-1">Gap</p>
                            <p className="text-xl font-display font-bold text-rw-crimson">{fmt(outstanding)}</p>
                        </div>
                    </div>
                </div>

                {/* Product Distribution */}
                <div className="lg:h-full">
                    <ProductDistribution />
                </div>
            </div>
        </div>
    );
}
