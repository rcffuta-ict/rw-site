"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Order, OrderItem } from "@/lib/data/types";
import { ph } from "@/lib/utils/functions";
import { OrderStatusBadge } from "@/components/ui/Badge";
import { PaymentHistory } from "@/components/admin/orders/PaymentHistory";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";

interface OrderDetailClientProps {
    order: Order;
}

function fmt(n: number) {
    return `₦${n.toLocaleString()}`;
}

export default function OrderDetailClient({ order: initialOrder }: OrderDetailClientProps) {
    const [order, setOrder] = useState(initialOrder);

    const pct = order.totalAmount > 0 ? Math.round((order.amountPaid / order.totalAmount) * 100) : 0;
    const remaining = order.totalAmount - order.amountPaid;

    function handleUpdateStatus() {
        alert("Status update stub — would trigger API call in production");
    }

    return (
        <div className="flex flex-col gap-10 animate-fade-in-up">
            <AdminBreadcrumb
                items={[
                    { label: "Orders", href: "/admin/orders" },
                    { label: order.orderRef }
                ]}
            />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-[var(--rw-border)] pb-8">
                <div className="flex flex-col gap-3">
                    <div className="flex items-center flex-wrap gap-4">
                        <h1 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-rw-ink tracking-tight">
                            {order.orderRef}
                        </h1>
                        <OrderStatusBadge status={order.status} />
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-[10px] sm:text-xs font-medium text-rw-muted">
                        <span className="flex items-center gap-1.5 shrink-0">
                            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                            {new Date(order.createdAt).toLocaleString("en-NG", { dateStyle: "medium", timeStyle: "short" })}
                        </span>
                        <span className="hidden sm:block h-1 w-1 rounded-full bg-rw-muted/30" />
                        <span className="text-rw-crimson font-bold uppercase tracking-tight shrink-0">ID: {order.id.split("-")[1].toUpperCase()}</span>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                    <Link
                        href={`/admin/orders/${order.orderRef}/details`}
                        className="btn-secondary !h-12 px-6 text-[11px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 w-full md:w-auto"
                    >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0zm-9-3.75h.008v.008H12V8.25z" /></svg>
                        Full Info
                    </Link>
                    <button 
                        onClick={handleUpdateStatus}
                        className="btn-secondary !h-12 px-6 text-[11px] font-bold uppercase tracking-widest w-full md:w-auto"
                    >
                        Confirm
                    </button>
                    <button 
                        onClick={handleUpdateStatus}
                        className="btn-primary !h-12 px-8 text-[11px] font-bold uppercase tracking-widest !bg-rw-ink hover:!bg-black shadow-lg w-full md:w-auto"
                    >
                        Update
                    </button>
                </div>
            </div>

            <div className="grid lg:grid-cols-[1fr_320px] gap-8 items-start">
                <div className="flex flex-col gap-6">
                    {/* Customer */}
                    <div className="rw-card p-8 bg-gradient-to-br from-white to-rw-bg-alt border-[var(--rw-border)]">
                        <div className="flex items-center gap-2 mb-6">
                            <span className="h-1 w-6 bg-rw-crimson rounded-full" />
                            <p className="text-[10px] font-bold text-rw-muted uppercase tracking-[0.2em]">
                                Customer Profile
                            </p>
                        </div>
                        <p className="font-display font-extrabold text-rw-ink text-2xl">
                            {order.customerName}
                        </p>
                        <div className="flex flex-col gap-3 mt-6">
                            <div className="flex items-center gap-3 text-sm text-rw-text-2 group">
                                <div className="h-8 w-8 rounded-lg bg-rw-bg-alt border border-[var(--rw-border)] flex items-center justify-center group-hover:border-rw-crimson/30 group-hover:text-rw-crimson transition-all">
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" /></svg>
                                </div>
                                <span className="font-medium">{order.customerEmail}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-rw-text-2 group">
                                <div className="h-8 w-8 rounded-lg bg-rw-bg-alt border border-[var(--rw-border)] flex items-center justify-center group-hover:border-rw-crimson/30 group-hover:text-rw-crimson transition-all">
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" /></svg>
                                </div>
                                <span className="font-medium font-mono">{order.customerPhone}</span>
                            </div>
                        </div>
                        {order.customerNote && (
                            <div className="mt-8 pt-6 border-t border-[var(--rw-border)] border-dashed">
                                <p className="text-[9px] font-bold text-rw-muted uppercase tracking-[0.15em] mb-3">Customer Remark</p>
                                <p className="text-sm italic text-rw-text-2 leading-relaxed bg-white rounded-2xl p-4 shadow-sm border border-[var(--rw-border)]">
                                    &ldquo;{order.customerNote}&rdquo;
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Items */}
                    <div className="rw-card overflow-hidden">
                        <div className="px-5 sm:px-6 py-4 border-b border-[var(--rw-border)] bg-rw-bg-alt/30">
                            <p className="text-[10px] font-bold text-rw-muted uppercase tracking-[0.15em]">
                                Line Items
                            </p>
                        </div>
                        <div className="divide-y divide-[var(--rw-border)]">
                            {order.items.map((i: OrderItem) => (
                                <div
                                    key={i.id}
                                    className="flex items-center gap-3 sm:gap-4 px-5 sm:px-6 py-4 hover:bg-rw-bg-alt/20 transition-colors"
                                >
                                    <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-lg sm:rounded-xl bg-rw-bg-alt overflow-hidden shrink-0 border border-[var(--rw-border)]">
                                        <img
                                            src={ph(56, 56, i.productName.slice(0, 6))}
                                            alt={i.productName}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-rw-ink text-xs sm:text-sm uppercase tracking-tight truncate">
                                            {i.productName}
                                        </p>
                                        <p className="text-[9px] sm:text-[10px] font-bold text-rw-muted uppercase tracking-tighter truncate">
                                            {i.variantLabel}
                                        </p>
                                    </div>
                                    <span className="text-[10px] sm:text-xs font-bold text-rw-muted shrink-0">
                                        × {i.quantity}
                                    </span>
                                    <span className="font-display font-extrabold text-rw-ink text-xs sm:text-sm shrink-0">
                                        {fmt(i.unitPrice * i.quantity)}
                                    </span>
                                </div>
                            ))}
                            <div className="flex justify-between items-center px-6 py-6 bg-rw-bg-alt/50 border-t border-[var(--rw-border)]">
                                <span className="text-[10px] sm:text-xs font-bold text-rw-muted uppercase tracking-widest">Total Valuation</span>
                                <span className="font-display font-black text-rw-crimson text-xl sm:text-2xl">
                                    {fmt(order.totalAmount)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Payments */}
                    <div className="mt-4">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="h-1 w-4 bg-rw-gold rounded-full" />
                            <p className="font-display font-extrabold text-xl text-rw-ink">
                                Payment Submissions{" "}
                                {order.payments.length > 0 &&
                                    <span className="text-rw-muted text-sm ml-1">({order.payments.length})</span>}
                            </p>
                        </div>
                        <PaymentHistory payments={order.payments} />
                    </div>
                </div>

                {/* Sidebar */}
                <div className="flex flex-col gap-8 sticky top-10">
                    <div className="rw-card p-8 flex flex-col gap-8 shadow-lg border-none ring-1 ring-[var(--rw-border)] bg-gradient-to-b from-white to-rw-bg-alt/30">
                        <div className="flex items-center gap-2">
                            <span className="h-1 w-6 bg-rw-crimson rounded-full" />
                            <p className="text-[10px] font-bold text-rw-muted uppercase tracking-[0.2em]">
                                Financial Overview
                            </p>
                        </div>

                        <div className="bg-rw-bg-alt p-5 rounded-2xl border border-[var(--rw-border)]">
                            <div className="flex justify-between items-end mb-3">
                                <span className="text-[11px] font-bold text-rw-muted uppercase tracking-tight">Collection</span>
                                <span className="font-display font-extrabold text-2xl text-rw-crimson">{pct}%</span>
                            </div>
                            <div className="progress-bar-track !h-2.5 bg-white border border-[var(--rw-border)]">
                                <div
                                    className="progress-bar-fill !h-full bg-gradient-to-r from-rw-crimson to-rw-crimson-dk"
                                    style={{ width: `${pct}%` }}
                                />
                            </div>
                        </div>
                        <dl className="flex flex-col gap-4 text-sm px-1">
                            <div className="flex justify-between">
                                <dt className="font-bold text-rw-muted text-xs uppercase tracking-tight">Order Total</dt>
                                <dd className="font-mono font-extrabold text-rw-ink">
                                    {fmt(order.totalAmount)}
                                </dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="font-bold text-rw-muted text-xs uppercase tracking-tight">Total Paid</dt>
                                <dd className="font-mono font-extrabold text-green-700">
                                    {fmt(order.amountPaid)}
                                </dd>
                            </div>
                            <div className="pt-5 border-t border-[var(--rw-border)] border-dashed">
                                <div className="flex justify-between items-center">
                                    <dt className="font-bold text-rw-ink text-xs uppercase tracking-widest">Balance Due</dt>
                                    <dd className="font-mono font-black text-xl text-rw-crimson bg-rw-crimson/5 px-3 py-1 rounded-xl">
                                        {fmt(remaining)}
                                    </dd>
                                </div>
                            </div>
                        </dl>

                        <Link
                            href={`/fulfil?ref=${order.orderRef}`}
                            target="_blank"
                            className="btn-secondary !h-12 !text-[11px] !font-bold uppercase tracking-widest border-dashed hover:border-solid transition-all"
                        >
                            Open payment page ↗
                        </Link>
                    </div>

                    {/* Quick info */}
                    <div className="rw-card p-6 flex flex-col gap-3">
                        <p className="text-[10px] font-bold text-rw-muted uppercase tracking-[0.15em]">
                            Timeline
                        </p>
                        <div className="text-sm text-rw-text-2 space-y-2">
                            <div className="flex items-center gap-3">
                                <span className="h-2 w-2 rounded-full bg-green-500 shrink-0" />
                                <span>
                                    Created{" "}
                                    {new Date(order.createdAt).toLocaleDateString(
                                        "en-NG",
                                        {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric",
                                        }
                                    )}
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="h-2 w-2 rounded-full bg-blue-500 shrink-0" />
                                <span>
                                    Updated{" "}
                                    {new Date(order.updatedAt).toLocaleDateString(
                                        "en-NG",
                                        {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric",
                                        }
                                    )}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
