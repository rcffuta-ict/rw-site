"use client";

import React from "react";
import Link from "next/link";
import { Order, OrderItem } from "@/lib/data/types";
import { OrderStatusBadge } from "@/components/ui/Badge";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import { AdminTable } from "@/components/admin/AdminTable";

interface OrderInfoClientProps {
    order: Order;
}

function fmt(n: number) {
    return `₦${n.toLocaleString()}`;
}

export default function OrderInfoClient({ order }: OrderInfoClientProps) {
    return (
        <div className="flex flex-col gap-10 animate-fade-in">
            <AdminBreadcrumb
                items={[
                    { label: "Orders", href: "/admin/orders" },
                    { label: order.orderRef, href: `/admin/orders/${order.orderRef}` },
                    { label: "Information" }
                ]}
            />

            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                <div className="flex flex-col gap-3">
                    <div className="flex items-center flex-wrap gap-4">
                        <h1 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-rw-ink tracking-tight">Order Details</h1>
                        <span className="px-3 py-1 rounded-full bg-rw-bg-alt text-[10px] font-bold text-rw-muted border border-[var(--rw-border)] uppercase tracking-wider">Internal Metadata</span>
                    </div>
                    <p className="text-sm text-rw-muted font-medium italic">Comprehensive log of production, logistics, and raw system state for <span className="text-rw-ink font-bold">{order.orderRef}</span></p>
                </div>
                <div className="flex flex-col xs:flex-row gap-3 w-full sm:w-auto">
                    <button onClick={() => window.print()} className="btn-secondary !h-11 px-6 text-[11px] font-bold uppercase tracking-widest w-full xs:w-auto">
                        Print Manifest
                    </button>
                    <button onClick={() => alert("Exporting JSON — stub")} className="btn-primary !h-11 px-6 text-[11px] font-bold uppercase tracking-widest w-full xs:w-auto">
                        Export JSON
                    </button>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Column 1: Logistics & Production */}
                <div className="lg:col-span-2 flex flex-col gap-8">
                    <div className="rw-card overflow-hidden bg-white border-none shadow-xl ring-1 ring-[var(--rw-border)]">
                        <div className="px-8 py-6 border-b border-[var(--rw-border)] bg-rw-bg-alt/30 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="h-1 w-6 bg-rw-crimson rounded-full" />
                                <h3 className="font-display font-bold text-rw-ink uppercase tracking-tight">Production Metadata</h3>
                            </div>
                            <OrderStatusBadge status={order.status} />
                        </div>
                        <div className="p-8 grid sm:grid-cols-2 gap-8">
                            <div className="flex flex-col gap-1.5 p-4 rounded-xl bg-rw-bg-alt/50 border border-[var(--rw-border)]">
                                <span className="text-[10px] font-bold text-rw-muted uppercase tracking-widest">Processing Node</span>
                                <span className="font-mono text-sm text-rw-ink font-bold">NODE-LGS-01 (FUTA-ICT)</span>
                            </div>
                            <div className="flex flex-col gap-1.5 p-4 rounded-xl bg-rw-bg-alt/50 border border-[var(--rw-border)]">
                                <span className="text-[10px] font-bold text-rw-muted uppercase tracking-widest">Batch Number</span>
                                <span className="font-mono text-sm text-rw-ink font-bold">B-2026-MAY-05-A</span>
                            </div>
                            <div className="flex flex-col gap-1.5 p-4 rounded-xl bg-rw-bg-alt/50 border border-[var(--rw-border)]">
                                <span className="text-[10px] font-bold text-rw-muted uppercase tracking-widest">Expected Readiness</span>
                                <span className="font-mono text-sm text-rw-ink font-bold">2026-05-15T12:00:00Z</span>
                            </div>
                            <div className="flex flex-col gap-1.5 p-4 rounded-xl bg-rw-bg-alt/50 border border-[var(--rw-border)]">
                                <span className="text-[10px] font-bold text-rw-muted uppercase tracking-widest">Fulfillment Type</span>
                                <span className="font-mono text-sm text-rw-ink font-bold">Physical Pickup (Campus)</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-5">
                        <div className="flex items-center gap-2">
                            <span className="h-1 w-6 bg-rw-ink rounded-full" />
                            <h3 className="font-display font-bold text-xl text-rw-ink uppercase tracking-tight">Line Items Detail</h3>
                        </div>
                        <AdminTable<OrderItem>
                            data={order.items}
                            keyExtractor={(item) => item.id}
                            columns={[
                                {
                                    label: "SKU / Item",
                                    key: "productName",
                                    render: (item) => (
                                        <div className="flex flex-col">
                                            <span className="font-bold text-rw-ink text-xs sm:text-sm">{item.productName}</span>
                                            <span className="text-[9px] sm:text-[10px] font-mono text-rw-muted font-bold uppercase">{item.variantId}</span>
                                        </div>
                                    )
                                },
                                {
                                    label: "Specifications",
                                    key: "variantLabel",
                                    render: (item) => (
                                        <span className="text-[10px] sm:text-xs font-bold text-rw-muted bg-white px-2.5 py-1.5 rounded-lg border border-[var(--rw-border)] shadow-sm inline-block">
                                            {item.variantLabel}
                                        </span>
                                    )
                                },
                                {
                                    label: "Quantity",
                                    key: "quantity",
                                    align: "right",
                                    render: (item) => <span className="font-bold text-rw-ink text-xs sm:text-sm">{item.quantity}</span>
                                },
                                {
                                    label: "Valuation",
                                    key: "valuation",
                                    align: "right",
                                    render: (item) => <span className="font-mono font-black text-rw-ink text-xs sm:text-sm">{fmt(item.unitPrice * item.quantity)}</span>
                                }
                            ]}
                        />
                    </div>

                    <div className="rw-card p-8 bg-rw-ink text-white/90 border-none shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-5">
                            <svg className="h-32 w-32" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L1 21h22L12 2zm0 3.45l8.27 14.3H3.73L12 5.45zM11 16h2v2h-2v-2zm0-7h2v5h-2V9z" /></svg>
                        </div>
                        <h3 className="font-display font-bold text-xl mb-6 flex items-center gap-3">
                            <span className="h-1.5 w-1.5 rounded-full bg-rw-orange animate-pulse" />
                            Raw System Response (v1)
                        </h3>
                        <div className="bg-black/40 rounded-2xl p-6 overflow-x-auto border border-white/5 backdrop-blur-sm">
                            <pre className="text-[11px] text-rw-orange/90 font-mono leading-relaxed custom-scrollbar">
                                {JSON.stringify(order, null, 2)}
                            </pre>
                        </div>
                    </div>
                </div>

                {/* Column 2: Audit & History */}
                <div className="flex flex-col gap-8 sticky top-10">
                    <div className="rw-card p-8 flex flex-col gap-6 bg-white border-none shadow-xl ring-1 ring-[var(--rw-border)]">
                        <div className="flex items-center gap-2">
                            <span className="h-1 w-6 bg-rw-gold rounded-full" />
                            <h3 className="font-display font-bold text-rw-ink uppercase tracking-tight">Audit Trail</h3>
                        </div>
                        <div className="flex flex-col gap-6">
                            {[
                                { event: "Payment Verified", date: order.updatedAt, actor: "System Agent (AI)" },
                                { event: "Order Confirmed", date: order.updatedAt, actor: "Admin" },
                                { event: "Order Created", date: order.createdAt, actor: "Customer (Web)" },
                            ].map((log, i) => (
                                <div key={i} className="flex gap-4 group">
                                    <div className="flex flex-col items-center">
                                        <div className={`h-2.5 w-2.5 rounded-full mt-1.5 ${i === 0 ? "bg-rw-crimson ring-4 ring-rw-crimson/10" : "bg-rw-muted"}`} />
                                        {i !== 2 && <div className="w-px flex-1 bg-[var(--rw-border)] my-2" />}
                                    </div>
                                    <div className="flex flex-col gap-1 pb-2">
                                        <span className={`text-xs font-bold transition-colors ${i === 0 ? "text-rw-ink" : "text-rw-muted"}`}>{log.event}</span>
                                        <span className="text-[10px] text-rw-muted font-medium italic">{new Date(log.date).toLocaleString()}</span>
                                        <span className="text-[10px] font-bold text-rw-muted uppercase tracking-widest opacity-50 mt-1">By {log.actor}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="rw-card p-8 bg-rw-crimson text-white shadow-xl shadow-rw-crimson/20 border-none relative overflow-hidden group">
                        <div className="absolute -bottom-10 -right-10 h-40 w-40 bg-white/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
                        <h3 className="font-display font-bold text-lg mb-6 uppercase tracking-wider relative z-10">Quick Actions</h3>
                        <div className="flex flex-col gap-3 relative z-10">
                            <button onClick={() => alert("Flagged — stub")} className="w-full h-11 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-[10px] font-bold uppercase tracking-widest transition-all">
                                Flag for Audit
                            </button>
                            <button onClick={() => alert("Reminder sent — stub")} className="w-full h-11 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-[10px] font-bold uppercase tracking-widest transition-all">
                                Send Reminders
                            </button>
                            <button onClick={() => alert("Archived — stub")} className="w-full h-11 rounded-xl bg-black/20 hover:bg-black/30 border border-black/10 text-[10px] font-bold uppercase tracking-widest transition-all text-white/50">
                                Archive Order
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
