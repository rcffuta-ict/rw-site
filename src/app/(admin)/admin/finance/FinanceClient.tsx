"use client";

import React, { useState } from "react";
import { DEMO_ORDERS } from "@/lib/data/orders";
import { ExportCsvButton } from "./component";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import { fmtNaira as fmt } from "@/lib/utils/functions";
import { AdminTabs, TabItem } from "@/components/admin/AdminTabs";
import { FinanceAnalytics } from "./FinanceAnalytics";
import { FinancePayments } from "./FinancePayments";
import { FinanceRecords } from "./FinanceRecords";

type FinanceTab = "analytics" | "payments" | "records";

export default function FinanceClient() {
    const [activeTab, setActiveTab] = useState<FinanceTab>("analytics");

    const allPayments = DEMO_ORDERS.flatMap((o) => o.payments.map((p) => ({ ...p, order: o })));
    const collected = allPayments.filter((p) => p.status === "approved").reduce((s, p) => s + p.amountClaimed, 0);
    const pending   = allPayments.filter((p) => p.status === "pending").reduce((s, p) => s + p.amountClaimed, 0);
    const flagged   = allPayments.filter((p) => p.status === "flagged").reduce((s, p) => s + p.amountClaimed, 0);
    const totalOrdered = DEMO_ORDERS.reduce((s, o) => s + o.totalAmount, 0);
    const outstanding = totalOrdered - collected;

    const summaryCards = [
        { label: "Collected", value: fmt(collected), sub: "Approved payments", icon: "M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" },
        { label: "Pending",   value: fmt(pending),   sub: "Awaiting review",   icon: "M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" },
        { label: "Flagged",   value: fmt(flagged),   sub: "Needs manual check", icon: "M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" },
        { label: "Outstanding", value: fmt(outstanding), sub: "Remaining balance", icon: "M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" },
    ];

    const tabs: TabItem[] = [
        { 
            key: "analytics", 
            label: "Analytics", 
            icon: <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" /></svg> 
        },
        { 
            key: "payments", 
            label: "Payment Inflow", 
            icon: <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" /></svg> 
        },
        { 
            key: "records", 
            label: "Financial Records", 
            icon: <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg> 
        },
    ];

    return (
        <div className="flex flex-col gap-10 animate-fade-in">
            <AdminBreadcrumb items={[{ label: "Finance" }]} />

            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-[var(--rw-border)] pb-10">
                <div className="flex flex-col gap-2">
                    <h1 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-rw-ink tracking-tight">Finance</h1>
                    <p className="text-sm text-rw-muted font-medium italic">Payment overview — Redemption Week &apos;26</p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <AdminTabs 
                        tabs={tabs} 
                        activeTab={activeTab} 
                        onChange={(key) => setActiveTab(key as FinanceTab)} 
                    />
                    <ExportCsvButton />
                </div>
            </div>

            {/* Tab Content */}
            <div className="flex flex-col gap-10">
                {activeTab === "analytics" && (
                    <FinanceAnalytics 
                        orders={DEMO_ORDERS}
                        stats={summaryCards}
                        collected={collected}
                        totalOrdered={totalOrdered}
                        allPayments={allPayments}
                        outstanding={outstanding}
                        fmt={fmt}
                    />
                )}

                {activeTab === "payments" && (
                    <FinancePayments 
                        allPayments={allPayments}
                        fmt={fmt}
                        PaymentStatusPill={PaymentStatusPill}
                    />
                )}

                {activeTab === "records" && (
                    <FinanceRecords 
                        orders={DEMO_ORDERS}
                        fmt={fmt}
                        totalOrdered={totalOrdered}
                        collected={collected}
                        outstanding={outstanding}
                    />
                )}
            </div>
        </div>
    );
}

function PaymentStatusPill({ status }: { status: string }) {
    const map: Record<string, string> = {
        pending:  "bg-amber-50 text-amber-700 border-amber-200",
        approved: "bg-green-50 text-green-700 border-green-200",
        flagged:  "bg-rw-crimson/10 text-rw-crimson border-rw-crimson/25",
        rejected: "bg-red-50 text-red-600 border-red-200",
    };
    return (
        <span className={`inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${map[status] ?? "bg-gray-100 text-gray-600 border-gray-200"}`}>
            {status}
        </span>
    );
}
