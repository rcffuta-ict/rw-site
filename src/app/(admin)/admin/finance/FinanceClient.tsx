"use client";

import React, { useState } from "react";
import Link from "next/link";
import { DEMO_ORDERS } from "@/lib/data/orders";
import { OrderStatusBadge } from "@/components/ui/Badge";
import { AdminTable } from "@/components/admin/AdminTable";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import { BankDistribution } from "@/components/admin/finance/BankDistribution";
import { ExportCsvButton } from "./component";
import { Order } from "@/lib/data/types";
import { AdminStats } from "@/components/admin/AdminStats";
import { fmtNaira } from "@/lib/utils/functions";



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
        { label: "Collected", value: fmtNaira(collected), sub: "Approved payments", icon: "M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" },
        { label: "Pending",   value: fmtNaira(pending),   sub: "Awaiting review",   icon: "M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" },
        { label: "Flagged",   value: fmtNaira(flagged),   sub: "Needs manual check", icon: "M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" },
        { label: "Outstanding", value: fmtNaira(outstanding), sub: "Remaining balance", icon: "M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" },
    ];

    const tabs: { key: FinanceTab; label: string; icon: React.ReactNode }[] = [
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
                <ExportCsvButton />
            </div>

            <AdminStats
                stats={summaryCards.map(c => ({
                    label: c.label,
                    value: c.value,
                    sub: c.sub,
                    icon: <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d={c.icon} /></svg>
                }))}
            />

            {/* Fancy Tab Menu */}
            <div className="flex items-center gap-1 p-1 bg-rw-bg-alt border border-[var(--rw-border)] rounded-[20px] self-start overflow-x-auto scrollbar-hide max-w-full">
                {tabs.map((t) => (
                    <button
                        key={t.key}
                        onClick={() => setActiveTab(t.key)}
                        className={`flex items-center gap-2.5 px-6 py-3 rounded-[16px] text-[11px] font-bold uppercase tracking-wider transition-all duration-300 whitespace-nowrap ${
                            activeTab === t.key
                                ? "bg-white text-rw-crimson shadow-sm scale-[1.02] border border-[var(--rw-border)]"
                                : "text-rw-muted hover:text-rw-ink hover:bg-white/50"
                        }`}
                    >
                        {t.icon}
                        {t.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="flex flex-col gap-10">
                {activeTab === "analytics" && (
                    <div className="flex flex-col gap-10 animate-fade-in-up">
                        <div className="grid lg:grid-cols-3 gap-8">
                            {/* Collection progress */}
                            <div className="rw-card p-8 lg:col-span-2 flex flex-col justify-between bg-white border-none shadow-xl ring-1 ring-[var(--rw-border)]">
                                <div>
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-2">
                                            <span className="h-1 w-6 bg-rw-crimson rounded-full" />
                                            <p className="font-display font-bold text-rw-ink text-xl">Collection Progress</p>
                                        </div>
                                        <span className="text-sm font-bold text-rw-crimson bg-rw-crimson/5 px-3 py-1 rounded-full">{Math.round(collected/totalOrdered*100)}% of goal</span>
                                    </div>
                                    <div className="progress-bar-track !h-10 rounded-2xl bg-rw-bg-alt overflow-hidden border border-[var(--rw-border)] p-1">
                                        <div className="progress-bar-fill !h-full rounded-xl bg-gradient-to-r from-rw-crimson to-rw-crimson-dk transition-all duration-1000 shadow-sm relative overflow-hidden" style={{ width: `${Math.round(collected/totalOrdered*100)}%` }}>
                                            <div className="absolute inset-0 bg-white/20 animate-pulse" />
                                        </div>
                                    </div>
                                    <div className="flex justify-between text-xs font-bold text-rw-muted mt-6 uppercase tracking-widest px-1">
                                        <div className="flex flex-col gap-1">
                                            <span>Collected</span>
                                            <span className="text-2xl font-display font-black text-green-700">{fmtNaira(collected)}</span>
                                        </div>
                                        <div className="flex flex-col gap-1 text-right">
                                            <span>Total Expected</span>
                                            <span className="text-2xl font-display font-black text-rw-ink">{fmtNaira(totalOrdered)}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-6 border-t border-[var(--rw-border)] pt-8">
                                    <div>
                                        <p className="text-[10px] font-bold text-rw-muted uppercase tracking-wider mb-1">Avg Order</p>
                                        <p className="text-xl font-display font-bold text-rw-ink">{fmtNaira(Math.round(totalOrdered / DEMO_ORDERS.length))}</p>
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
                                        <p className="text-xl font-display font-bold text-rw-crimson">{fmtNaira(outstanding)}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Bank Distribution */}
                            <div className="lg:h-full">
                                <BankDistribution />
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "payments" && (
                    <div className="flex flex-col gap-5 animate-fade-in-up">
                        <div className="flex items-center gap-2">
                            <span className="h-1 w-6 bg-rw-gold rounded-full" />
                            <h2 className="font-display font-bold text-xl text-rw-ink uppercase tracking-tight">Payment Submissions</h2>
                        </div>
                        <AdminTable<any>
                            data={allPayments}
                            keyExtractor={(p) => p.id}
                            columns={[
                                {
                                    label: "Order",
                                    key: "order",
                                    render: (p) => <Link href={`/admin/orders/${p.order.orderRef}`} className="font-mono font-bold text-rw-crimson hover:text-rw-crimson-dk transition-colors border-b border-rw-crimson/20">{p.order.orderRef}</Link>
                                },
                                {
                                    label: "Customer",
                                    key: "customer",
                                    className: "hidden sm:table-cell",
                                    render: (p) => <span className="font-bold text-rw-ink">{p.order.customerName}</span>
                                },
                                {
                                    label: "Amount",
                                    key: "amountClaimed",
                                    align: "right",
                                    render: (p) => (
                                        <div className="flex flex-col items-end">
                                            <span className="font-display font-bold text-rw-ink">{fmtNaira(p.amountClaimed)}</span>
                                            <span className="text-[10px] font-bold text-rw-muted uppercase tracking-tight">{p.percentOfTotal}% of total</span>
                                        </div>
                                    )
                                },
                                {
                                    label: "Bank",
                                    key: "bank",
                                    className: "hidden md:table-cell",
                                    render: (p) => <span className="text-xs font-bold text-rw-muted uppercase tracking-widest">{p.extractedBank ?? "—"}</span>
                                },
                                {
                                    label: "Status",
                                    key: "status",
                                    render: (p) => <PaymentStatusPill status={p.status} />
                                },
                                {
                                    label: "Date",
                                    key: "createdAt",
                                    align: "right",
                                    className: "hidden lg:table-cell",
                                    render: (p) => (
                                        <span className="text-xs text-rw-muted font-medium">
                                            {new Date(p.createdAt).toLocaleDateString("en-NG", { day: "numeric", month: "short" })}
                                        </span>
                                    )
                                }
                            ]}
                        />
                    </div>
                )}

                {activeTab === "records" && (
                    <div className="flex flex-col gap-5 animate-fade-in-up">
                        <div className="flex items-center gap-2">
                            <span className="h-1 w-6 bg-rw-crimson rounded-full" />
                            <h2 className="font-display font-bold text-xl text-rw-ink uppercase tracking-tight">Order Financials</h2>
                        </div>
                        <AdminTable<Order>
                            data={DEMO_ORDERS}
                            keyExtractor={(o) => o.id}
                            columns={[
                                {
                                    label: "Ref",
                                    key: "orderRef",
                                    render: (o) => <Link href={`/admin/orders/${o.orderRef}`} className="font-mono font-bold text-rw-crimson hover:text-rw-crimson-dk transition-colors border-b border-rw-crimson/20">{o.orderRef}</Link>
                                },
                                {
                                    label: "Customer",
                                    key: "customerName",
                                    className: "hidden sm:table-cell",
                                    render: (o) => <span className="font-bold text-rw-ink">{o.customerName}</span>
                                },
                                {
                                    label: "Total",
                                    key: "totalAmount",
                                    align: "right",
                                    render: (o) => <span className="font-display font-bold text-rw-ink">{fmtNaira(o.totalAmount)}</span>
                                },
                                {
                                    label: "Paid",
                                    key: "amountPaid",
                                    align: "right",
                                    render: (o) => <span className="font-display font-bold text-green-700">{fmtNaira(o.amountPaid)}</span>
                                },
                                {
                                    label: "Balance",
                                    key: "balance",
                                    align: "right",
                                    className: "hidden md:table-cell",
                                    render: (o) => <span className="font-display font-bold text-rw-crimson">{fmtNaira(o.totalAmount - o.amountPaid)}</span>
                                },
                                {
                                    label: "Status",
                                    key: "status",
                                    render: (o) => <OrderStatusBadge status={o.status} />
                                }
                            ]}
                            footer={
                                <div className="grid grid-cols-2 sm:grid-cols-6 gap-4 font-display font-black text-rw-ink text-base sm:text-lg">
                                    <div className="hidden sm:block sm:col-span-2">TOTALS</div>
                                    <div className="text-right">{fmtNaira(totalOrdered)}</div>
                                    <div className="text-right text-green-700">{fmtNaira(collected)}</div>
                                    <div className="text-right text-rw-crimson hidden md:block">{fmtNaira(outstanding)}</div>
                                    <div className="hidden sm:block" />
                                </div>
                            }
                        />
                    </div>
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
