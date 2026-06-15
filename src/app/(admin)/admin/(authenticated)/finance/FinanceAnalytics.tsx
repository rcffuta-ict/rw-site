/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { RevenueBreakdown } from "@/components/admin/finance/RevenueBreakdown";
import { ProductDistribution } from "@/components/admin/finance/ProductDistribution";
import { ProductFinancials } from "@/components/admin/finance/ProductFinancials";
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

export function FinanceAnalytics({ orders }: FinanceAnalyticsProps) {
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
                    Product performance
                </p>
            </div>

            {/* Per-product financial detail — collected vs outstanding per product */}
            <div className="rw-card p-6 shadow-sm">
                <ProductFinancials orders={orders} />
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                <div className="rw-card p-6 shadow-sm">
                    <RevenueBreakdown orders={orders} />
                </div>

                <div className="rw-card p-6 shadow-sm">
                    <ProductDistribution orders={orders} />
                </div>
            </div>
        </div>
    );
}
