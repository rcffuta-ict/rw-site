"use client";

import React, { useState } from "react";
import { AdminTabs, TabItem } from "@/components/admin/AdminTabs";
import { RefreshButton } from "@/components/admin/RefreshButton";
import { FinanceAnalytics } from "./FinanceAnalytics";
import { FinancePayments } from "./FinancePayments";
import { FinanceRecords } from "./FinanceRecords";
import { fmtNaira as fmt } from "@/lib/utils/functions";
import type { PaymentWithOrder } from "@/lib/services/finance.service";

type FinanceTab = "analytics" | "payments" | "records";

interface SummaryCard {
    label: string;
    value: string;
    sub: string;
    color: "green" | "amber" | "red" | "blue";
    icon: string;
}

interface FinanceClientProps {
    payments: PaymentWithOrder[];
    summaryCards: SummaryCard[];
    collected: number;
    totalOrdered: number;
}

const COLOR_MAP: Record<SummaryCard["color"], string> = {
    green: "bg-green-50 text-green-700 border-green-100",
    amber: "bg-amber-50 text-amber-700 border-amber-100",
    red: "bg-rw-crimson/8 text-rw-crimson border-rw-crimson/15",
    blue: "bg-blue-50 text-blue-700 border-blue-100",
};

const ICON_COLOR_MAP: Record<SummaryCard["color"], string> = {
    green: "text-green-600",
    amber: "text-amber-500",
    red: "text-rw-crimson",
    blue: "text-blue-600",
};

const tabs: TabItem[] = [
    {
        key: "analytics",
        label: "Analytics",
        icon: (
            <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
                />
            </svg>
        ),
    },
    {
        key: "payments",
        label: "Payment Inflow",
        icon: (
            <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 4.5h14.25M3 9h9.75M3 13.5h9.75m4.5-4.5v12m0 0-3.75-3.75M17.25 21 21 17.25"
                />
            </svg>
        ),
    },
    {
        key: "records",
        label: "Financial Records",
        icon: (
            <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                />
            </svg>
        ),
    },
];

export function PaymentStatusPill({ status }: { status: string }) {
    const map: Record<string, string> = {
        pending: "bg-amber-50 text-amber-700 border-amber-200",
        approved: "bg-green-50 text-green-700 border-green-200",
        flagged: "bg-rw-crimson/10 text-rw-crimson border-rw-crimson/25",
        rejected: "bg-red-50 text-red-600 border-red-200",
    };
    return (
        <span
            className={`inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${map[status] ?? "bg-gray-100 text-gray-600 border-gray-200"}`}
        >
            {status}
        </span>
    );
}

export default function FinanceClient({
    payments,
    summaryCards,
    collected,
    totalOrdered,
}: FinanceClientProps) {
    const [activeTab, setActiveTab] = useState<FinanceTab>("payments");

    // Derive order list (unique) for analytics
    const orderMap = new Map();
    payments.forEach((p) => orderMap.set(p.order.id, p.order));
    const orders = Array.from(orderMap.values());

    const pending = payments
        .filter((p) => p.status === "pending")
        .reduce((s, p) => s + p.extractedAmount, 0);
    const outstanding = totalOrdered - collected;

    return (
        <div className="flex flex-col gap-8 animate-fade-in">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-[var(--rw-border)] pb-8">
                <div>
                    <p className="eyebrow mb-1">Redemption Week &apos;26</p>
                    <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-rw-ink tracking-tight">
                        Finance
                    </h1>
                    <p className="text-sm text-rw-muted font-medium mt-1">
                        Transaction monitor · payment review · audit trail
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <RefreshButton />
                    <AdminTabs
                        tabs={tabs}
                        activeTab={activeTab}
                        onChange={(key) => setActiveTab(key as FinanceTab)}
                    />
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {summaryCards.map((card) => (
                    <div
                        key={card.label}
                        className={`rw-card p-5 flex flex-col gap-3 border ${COLOR_MAP[card.color]}`}
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-[0.15em] opacity-70">
                                {card.label}
                            </span>
                            <svg
                                className={`h-5 w-5 opacity-60 ${ICON_COLOR_MAP[card.color]}`}
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={1.5}
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d={card.icon}
                                />
                            </svg>
                        </div>
                        <p className="font-display font-black text-2xl leading-none">
                            {card.value}
                        </p>
                        <p className="text-[10px] font-medium opacity-60">{card.sub}</p>
                    </div>
                ))}
            </div>

            {/* Collection progress bar */}
            {totalOrdered > 0 && (
                <div className="rw-card p-5">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold text-rw-ink">
                            Collection Progress
                        </span>
                        <span className="text-xs font-bold text-rw-muted">
                            {fmt(collected)} of {fmt(totalOrdered)}
                            <span className="ml-2 text-rw-crimson">
                                ({Math.round((collected / totalOrdered) * 100)}%)
                            </span>
                        </span>
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-rw-bg-alt overflow-hidden">
                        <div
                            className="h-full rounded-full bg-gradient-to-r from-green-500 to-green-400 transition-all duration-700"
                            style={{
                                width: `${Math.min((collected / totalOrdered) * 100, 100)}%`,
                            }}
                        />
                    </div>
                    {pending > 0 && (
                        <p className="mt-2 text-[10px] text-amber-600 font-bold">
                            + {fmt(pending)} pending review · {fmt(outstanding)} total
                            outstanding
                        </p>
                    )}
                </div>
            )}

            {/* Tab Content */}
            <div>
                {activeTab === "analytics" && (
                    <FinanceAnalytics
                        orders={orders}
                        stats={summaryCards}
                        collected={collected}
                        totalOrdered={totalOrdered}
                        allPayments={payments}
                        outstanding={outstanding}
                    />
                )}
                {activeTab === "payments" && (
                    <FinancePayments
                        allPayments={payments}
                        PaymentStatusPill={PaymentStatusPill}
                    />
                )}
                {activeTab === "records" && (
                    <FinanceRecords allPayments={payments} fmt={fmt} />
                )}
            </div>
        </div>
    );
}
