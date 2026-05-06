"use client";

import React from "react";
import Link from "next/link";
import { Order } from "@/lib/data/types";
import { fmtNaira as fmt } from "@/lib/utils/functions";
import { Button } from "@/components/ui/forms/Button";

interface OrderQuickViewProps {
    order: Order;
    onClose: () => void;
}

export function OrderQuickView({ order, onClose }: OrderQuickViewProps) {
    const totalUnits = order.items.reduce((acc, item) => acc + item.quantity, 0);
    const paymentPercentage = Math.min(
        Math.round((order.amountPaid / order.totalAmount) * 100),
        100
    );

    return (
        <div className="flex flex-col h-[70vh] md:h-[650px] animate-fade-in-up">
            {/* Header: Reference & Status */}
            <div className="flex items-center justify-between pb-6 mb-2 border-b border-[var(--rw-border)] shrink-0">
                <div>
                    <span className="text-[10px] font-black text-rw-muted uppercase tracking-[0.4em] block mb-1">
                        Secure Transaction
                    </span>
                    <h3 className="font-mono font-bold text-lg text-rw-ink tracking-tighter">
                        REF: <span className="text-rw-crimson">{order.orderRef}</span>
                    </h3>
                </div>
                <div className={`tag-pill badge-${order.status} scale-110 origin-right`}>
                    <span className="uppercase text-[10px] tracking-widest">
                        {order.status.replace("_", " ")}
                    </span>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar py-4">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    {/* Left 3 Cols: Core Intelligence */}
                    <div className="lg:col-span-3 space-y-8">
                        {/* Financial Card */}
                        <div className="rw-card p-6 bg-rw-bg-alt/30 border-none ring-1 ring-[var(--rw-border)] relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
                                <svg
                                    className="h-24 w-24"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.97 0-1.82 1.28-3.26 3.11-3.69V3.5h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .92.73 1.34 2.68 1.93 2.63.79 4.13 1.82 4.13 4.18-.01 2.22-1.51 3.44-3.51 3.87z" />
                                </svg>
                            </div>

                            <div className="relative z-10">
                                <span className="eyebrow !text-rw-muted opacity-80">
                                    Payment Metrics
                                </span>
                                <div className="flex items-baseline gap-2 mt-1">
                                    <h2 className="font-display font-black text-4xl text-rw-ink tracking-tighter">
                                        {fmt(order.totalAmount)}
                                    </h2>
                                </div>

                                <div className="mt-6 space-y-2">
                                    <div className="flex justify-between items-end text-[10px] font-black uppercase tracking-wider">
                                        <span className="text-rw-muted">Coverage</span>
                                        <span
                                            className={
                                                paymentPercentage === 100
                                                    ? "text-green-600"
                                                    : "text-rw-crimson"
                                            }
                                        >
                                            {paymentPercentage}% Collected
                                        </span>
                                    </div>
                                    <div className="progress-bar-track bg-white">
                                        <div
                                            className="progress-bar-fill shadow-sm"
                                            style={{ width: `${paymentPercentage}%` }}
                                        />
                                    </div>
                                    <div className="flex justify-between pt-2">
                                        <div className="flex flex-col">
                                            <span className="text-[9px] font-bold text-rw-muted uppercase">
                                                Paid
                                            </span>
                                            <span className="text-sm font-bold text-rw-ink">
                                                {fmt(order.amountPaid)}
                                            </span>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className="text-[9px] font-bold text-rw-muted uppercase">
                                                Balance
                                            </span>
                                            <span
                                                className={`text-sm font-black ${order.totalAmount > order.amountPaid ? "text-rw-crimson" : "text-rw-ink"}`}
                                            >
                                                {fmt(
                                                    order.totalAmount - order.amountPaid
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Customer Section */}
                        <div className="space-y-4">
                            <h4 className="eyebrow px-1 opacity-60">Client DNA</h4>
                            <div className="rw-card p-5 flex items-center gap-5 hover-lift border-none ring-1 ring-[var(--rw-border)]">
                                <div className="h-14 w-14 rounded-2xl bg-rw-ink text-white flex items-center justify-center font-display font-black text-xl shadow-lg shrink-0">
                                    {order.customerName[0]}
                                </div>
                                <div className="min-w-0">
                                    <p className="font-display font-black text-rw-ink text-lg leading-tight truncate">
                                        {order.customerName}
                                    </p>
                                    <p className="text-xs text-rw-muted font-medium truncate">
                                        {order.customerEmail}
                                    </p>
                                    <p className="text-[11px] font-mono font-bold text-rw-crimson mt-1">
                                        {order.customerPhone}
                                    </p>
                                </div>
                            </div>

                            {order.customerNote && (
                                <div className="p-4 rounded-2xl bg-rw-bg-warm border border-rw-gold/20 flex gap-3 italic">
                                    <div className="text-rw-gold">
                                        <svg
                                            className="h-5 w-5"
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M21 15h2v2h-2v-2zm0-4h2v2h-2v-2zm0-4h2v2h-2V7zm-2 8h-2v2h2v-2zm0-4h-2v2h2v-2zm0-4h-2v2h2V7zm-2 8h-2v2h2v-2zm0-4h-2v2h2v-2zm0-4h-2v2h2V7zM7 15h2v2H7v-2zm0-4h2v2H7v-2zm0-4h2v2H7V7zm-2 8h-2v2h2v-2zm0-4h-2v2h2v-2zm0-4h-2v2h2V7zm-2 8H1v2h2v-2zm0-4H1v2h2v-2zm0-4H1v2h2V7z" />
                                        </svg>
                                    </div>
                                    <p className="text-xs text-rw-text-2 font-medium leading-relaxed">
                                        &#34;{order.customerNote}&rdquo;
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right 2 Cols: Manifest */}
                    <div className="lg:col-span-2 flex flex-col h-full">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="eyebrow opacity-60">Manifest</h4>
                            <span className="text-[10px] font-black text-rw-ink bg-rw-bg-alt px-2 py-1 rounded-md border border-[var(--rw-border)]">
                                {totalUnits} Units
                            </span>
                        </div>

                        <div className="flex-1 space-y-3 bg-rw-bg-alt/20 rounded-2xl p-2 border border-[var(--rw-border)] overflow-y-auto max-h-[300px] lg:max-h-none">
                            {order.items.map((item) => (
                                <div
                                    key={item.id}
                                    className="p-3 bg-white rounded-xl border border-[var(--rw-border)] flex flex-col gap-1 hover:border-rw-crimson/30 transition-colors group"
                                >
                                    <div className="flex justify-between items-start">
                                        <span className="text-xs font-black text-rw-ink leading-tight flex-1 pr-2">
                                            {item.productName}
                                        </span>
                                        <span className="text-xs font-bold text-rw-ink font-mono">
                                            {fmt(item.unitPrice * item.quantity)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center text-[10px] font-bold text-rw-muted">
                                        <span>{item.variantLabel}</span>
                                        <span className="bg-rw-bg-alt px-1.5 py-0.5 rounded uppercase">
                                            Qty: {item.quantity}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Matrix */}
            <div className="pt-6 mt-4 border-t border-[var(--rw-border)] shrink-0 space-y-3">
                <Link href={`/admin/orders/${order.orderRef}`} onClick={onClose}>
                    <Button className="w-full h-14 bg-crimson-gradient text-white !rounded-xl shadow-crimson group relative overflow-hidden transition-all hover:scale-[1.01]">
                        <span className="font-display font-black uppercase tracking-[0.2em] text-sm flex items-center justify-center gap-2">
                            Enter Fulfillment Control
                            <svg
                                className="h-5 w-5 transition-transform group-hover:translate-x-1"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={3}
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                                />
                            </svg>
                        </span>
                    </Button>
                </Link>
                <button
                    onClick={onClose}
                    className="w-full text-[9px] font-black text-rw-muted uppercase tracking-[0.4em] hover:text-rw-crimson transition-colors"
                >
                    Return to Dashboard
                </button>
            </div>
        </div>
    );
}
