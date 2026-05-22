/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { RevenueBreakdown } from "@/components/admin/finance/RevenueBreakdown";
import { BankDistribution } from "@/components/admin/finance/BankDistribution";
import { ProductDistribution } from "@/components/admin/finance/ProductDistribution";
import type { PaymentWithOrder } from "@/lib/services/finance.service";
import type { Order } from "@/lib/data/types";

interface FinanceAnalyticsProps {
    orders: Order[];
    stats: any[];
    collected: number;
    totalOrdered: number;
    allPayments: PaymentWithOrder[];
    outstanding: number;
}

export function FinanceAnalytics({ orders, allPayments }: FinanceAnalyticsProps) {
    // For now, these are placeholder charts, but they consume the new data structure.
    return (
        <div className="flex flex-col gap-6 animate-fade-in-up">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--rw-border)]">
                <div className="flex items-center gap-2">
                    <span className="h-1 w-6 bg-blue-600 rounded-full" />
                    <h2 className="font-display font-bold text-xl text-rw-ink uppercase tracking-tight">
                        Financial Analytics
                    </h2>
                </div>
                <p className="text-xs text-rw-muted font-bold tracking-widest uppercase">
                    Data visualization
                </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Charts using the extracted order / payment arrays */}
                <div className="rw-card p-6 shadow-sm">
                    <RevenueBreakdown orders={orders} />
                </div>

                <div className="rw-card p-6 shadow-sm">
                    <BankDistribution payments={allPayments} />
                </div>
            </div>

            <div className="rw-card p-6 shadow-sm">
                <ProductDistribution orders={orders} />
            </div>

            <div className="p-8 text-center border-t border-[var(--rw-border)] opacity-60">
                <p className="text-sm font-bold text-rw-muted uppercase tracking-[0.2em]">
                    Advanced Analytics Engine
                </p>
                <p className="text-xs text-gray-400 mt-2">
                    Coming Soon — Extended reporting and export features.
                </p>
            </div>
        </div>
    );
}
