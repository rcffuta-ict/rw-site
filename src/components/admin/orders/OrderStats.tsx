"use client";

import { Order } from "@/lib/data/types";
import { formatNaira } from "@/lib/utils/functions";

function StatCard({
    label,
    value,
    sub,
    color,
    bg,
    icon,
}: {
    label: string;
    value: number | string;
    sub?: string;
    color: string;
    bg: string;
    icon: React.ReactNode;
}) {
    return (
        <div
            className="rw-card p-5 flex flex-col gap-3 hover:shadow-md transition-shadow"
            style={{ borderTop: `3px solid ${color}` }}
        >
            <div
                className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: bg }}
            >
                <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke={color}
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                >
                    {icon}
                </svg>
            </div>
            <div>
                <p
                    className="font-display font-black text-2xl text-rw-ink"
                    style={{ color: typeof value === "string" ? color : undefined }}
                >
                    {value}
                </p>
                <p className="text-[10px] font-bold text-rw-muted uppercase tracking-wider mt-0.5">
                    {label}
                </p>
                {sub && (
                    <p className="text-[10px] text-rw-muted/70 mt-0.5">{sub}</p>
                )}
            </div>
        </div>
    );
}

// React import needed for JSX in this file
import React from "react";

export function OrderStats({ orders }: { orders: Order[] }) {
    const total = orders.length;
    const pending = orders.filter((o) => o.status === "pending").length;
    const partialPaid = orders.filter((o) => o.status === "partially_paid").length;
    const paid = orders.filter(
        (o) => o.status === "paid" || o.status === "confirmed"
    ).length;
    const inProduction = orders.filter((o) => o.status === "in_production").length;
    const ready = orders.filter((o) => o.status === "ready").length;
    const delivered = orders.filter((o) => o.status === "delivered").length;
    const flagged = orders.filter((o) => o.status === "flagged").length;

    const totalRevenue = orders.reduce((s, o) => s + o.totalAmount, 0);
    const collected = orders.reduce((s, o) => s + o.amountPaid, 0);
    const outstanding = totalRevenue - collected;

    const pendingPayments = orders.reduce(
        (s, o) => s + o.payments.filter((p) => p.status === "pending").length,
        0
    );

    return (
        <div className="space-y-4">
            {/* Financial Summary Strip */}
            <div className="grid grid-cols-3 gap-4 bg-[#1C0003] rounded-2xl p-5 text-white">
                <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-1">
                        Total Revenue
                    </p>
                    <p className="font-display font-black text-xl">{formatNaira(totalRevenue)}</p>
                    <p className="text-[10px] text-white/30 mt-0.5">{total} orders</p>
                </div>
                <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-1">
                        Collected
                    </p>
                    <p className="font-display font-black text-xl text-green-400">
                        {formatNaira(collected)}
                    </p>
                    <div className="mt-2 h-1 w-full bg-white/10 rounded-full overflow-hidden">
                        <div
                            className="h-full rounded-full bg-green-400 transition-all"
                            style={{
                                width: `${totalRevenue > 0 ? Math.round((collected / totalRevenue) * 100) : 0}%`,
                            }}
                        />
                    </div>
                </div>
                <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-1">
                        Outstanding
                    </p>
                    <p className="font-display font-black text-xl text-orange-400">
                        {formatNaira(outstanding)}
                    </p>
                    <p className="text-[10px] text-white/30 mt-0.5">
                        {pendingPayments} pending review
                    </p>
                </div>
            </div>

            {/* Status Breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                {[
                    { label: "Pending", value: pending, color: "#f59e0b", bg: "#fef3c7", icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /> },
                    { label: "Partial", value: partialPaid, color: "#f97316", bg: "#ffedd5", icon: <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /> },
                    { label: "Paid", value: paid, color: "#10b981", bg: "#d1fae5", icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /> },
                    { label: "Production", value: inProduction, color: "#8b5cf6", bg: "#ede9fe", icon: <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" /> },
                    { label: "Ready", value: ready, color: "#06b6d4", bg: "#cffafe", icon: <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /> },
                    { label: "Delivered", value: delivered, color: "#22c55e", bg: "#dcfce7", icon: <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" /> },
                    { label: "Flagged", value: flagged, color: "#ef4444", bg: "#fee2e2", icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" /> },
                    { label: "Cancelled", value: orders.filter((o) => o.status === "cancelled").length, color: "#9ca3af", bg: "#f3f4f6", icon: <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /> },
                ].map((s) => (
                    <div
                        key={s.label}
                        className="rw-card p-3 flex flex-col items-center gap-1.5 text-center"
                        style={{ borderTop: `2px solid ${s.color}20` }}
                    >
                        <div
                            className="h-7 w-7 rounded-lg flex items-center justify-center"
                            style={{ background: s.bg }}
                        >
                            <svg
                                className="h-3.5 w-3.5"
                                fill="none"
                                stroke={s.color}
                                strokeWidth={2}
                                viewBox="0 0 24 24"
                            >
                                {s.icon}
                            </svg>
                        </div>
                        <p className="font-display font-black text-xl text-rw-ink leading-none">
                            {s.value}
                        </p>
                        <p className="text-[9px] font-bold text-rw-muted uppercase tracking-wider leading-none">
                            {s.label}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
