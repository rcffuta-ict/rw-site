import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getDemoOrder } from "@/lib/data/orders";
import { OrderStatusBadge } from "@/components/ui/Badge";

import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";

import { AdminTable } from "@/components/admin/AdminTable";
import { OrderItem } from "@/lib/data/types";

interface Props {
    params: Promise<{ orderRef: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { orderRef } = await params;
    return { title: `Details: ${orderRef} — RW'26 Admin` };
}

function fmt(n: number) {
    return `₦${n.toLocaleString()}`;
}

export default async function OrderDetailsInfoPage({ params }: Props) {
    const { orderRef } = await params;
    const order = getDemoOrder(orderRef);
    if (!order) notFound();

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
                <div>
                    <div className="flex items-center flex-wrap gap-4 mb-3">
                        <h1 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-rw-ink tracking-tight">Order Details</h1>
                        <span className="px-3 py-1 rounded-full bg-rw-bg-alt text-[10px] font-bold text-rw-muted border border-[var(--rw-border)] uppercase tracking-wider">Internal Reference</span>
                    </div>
                    <p className="text-sm text-rw-muted font-medium">Detailed breakdown of metadata, logistics and production status for <span className="text-rw-ink font-bold">{order.orderRef}</span></p>
                </div>
                <div className="flex flex-col xs:flex-row gap-3 w-full sm:w-auto">
                    <button className="btn-secondary !h-11 px-6 text-[11px] font-bold uppercase tracking-widest w-full xs:w-auto">
                        Print Manifest
                    </button>
                    <button className="btn-primary !h-11 px-6 text-[11px] font-bold uppercase tracking-widest w-full xs:w-auto">
                        Export JSON
                    </button>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Column 1: Logistics & Production */}
                <div className="lg:col-span-2 flex flex-col gap-8">
                    <div className="rw-card overflow-hidden">
                        <div className="px-8 py-6 border-b border-[var(--rw-border)] bg-rw-bg-alt/30 flex items-center justify-between">
                            <h3 className="font-display font-bold text-rw-ink">Production Metadata</h3>
                            <OrderStatusBadge status={order.status} />
                        </div>
                        <div className="p-8 grid sm:grid-cols-2 gap-8">
                            <div className="flex flex-col gap-1.5">
                                <span className="text-[10px] font-bold text-rw-muted uppercase tracking-widest">Processing Node</span>
                                <span className="font-mono text-sm text-rw-ink font-bold">NODE-LGS-01 (FUTA-ICT)</span>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <span className="text-[10px] font-bold text-rw-muted uppercase tracking-widest">Batch Number</span>
                                <span className="font-mono text-sm text-rw-ink font-bold">B-2026-MAY-05-A</span>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <span className="text-[10px] font-bold text-rw-muted uppercase tracking-widest">Expected Readiness</span>
                                <span className="font-mono text-sm text-rw-ink font-bold">2026-05-15T12:00:00Z</span>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <span className="text-[10px] font-bold text-rw-muted uppercase tracking-widest">Fulfillment Type</span>
                                <span className="font-mono text-sm text-rw-ink font-bold">Physical Pickup (Campus)</span>
                            </div>
                        </div>
                    </div>

            <AdminTable<OrderItem>
                data={order.items}
                keyExtractor={(item: OrderItem) => item.id}
                columns={[
                    {
                        label: "SKU / Item",
                        key: "productName",
                        render: (item: OrderItem) => (
                            <div className="flex flex-col">
                                <span className="font-bold text-rw-ink text-xs sm:text-sm">{item.productName}</span>
                                <span className="text-[9px] sm:text-[10px] font-mono text-rw-muted uppercase">{item.variantId}</span>
                            </div>
                        )
                    },
                    {
                        label: "Specifications",
                        key: "variantLabel",
                        render: (item: OrderItem) => (
                            <span className="text-[10px] sm:text-xs text-rw-text-2 bg-rw-bg-alt px-2.5 py-1 rounded-lg border border-[var(--rw-border)] whitespace-nowrap">
                                {item.variantLabel}
                            </span>
                        )
                    },
                    {
                        label: "Quantity",
                        key: "quantity",
                        align: "right",
                        render: (item: OrderItem) => <span className="font-bold text-rw-ink text-xs sm:text-sm">{item.quantity}</span>
                    },
                    {
                        label: "Valuation",
                        key: "valuation",
                        align: "right",
                        render: (item: OrderItem) => <span className="font-mono text-rw-ink text-xs sm:text-sm">{fmt(item.unitPrice * item.quantity)}</span>
                    }
                ]}
            />

                    <div className="rw-card p-8">
                        <h3 className="font-display font-bold text-rw-ink mb-6">Raw System Response (v1)</h3>
                        <div className="bg-rw-ink rounded-2xl p-6 overflow-x-auto border border-white/10 shadow-2xl">
                            <pre className="text-[11px] text-green-400 font-mono leading-relaxed">
                                {JSON.stringify(order, null, 2)}
                            </pre>
                        </div>
                    </div>
                </div>

                {/* Column 2: Audit & History */}
                <div className="flex flex-col gap-8">
                    <div className="rw-card p-8 flex flex-col gap-6">
                        <h3 className="font-display font-bold text-rw-ink">Audit Trail</h3>
                        <div className="flex flex-col gap-6">
                            {[
                                { event: "Payment Verified", date: order.updatedAt, actor: "System Agent (AI)" },
                                { event: "Order Confirmed", date: order.updatedAt, actor: "Admin" },
                                { event: "Order Created", date: order.createdAt, actor: "Customer (Web)" },
                            ].map((log, i) => (
                                <div key={i} className="flex gap-4 group">
                                    <div className="flex flex-col items-center">
                                        <div className="h-2 w-2 rounded-full bg-rw-crimson mt-1.5" />
                                        {i !== 2 && <div className="w-px flex-1 bg-[var(--rw-border)] my-1" />}
                                    </div>
                                    <div className="flex flex-col gap-1 pb-2">
                                        <span className="text-xs font-bold text-rw-ink group-hover:text-rw-crimson transition-colors">{log.event}</span>
                                        <span className="text-[10px] text-rw-muted font-medium">{new Date(log.date).toLocaleString()}</span>
                                        <span className="text-[10px] font-bold text-rw-muted uppercase tracking-tight opacity-50">By {log.actor}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="rw-card p-8 bg-rw-crimson text-white">
                        <h3 className="font-display font-bold mb-4">Quick Actions</h3>
                        <div className="flex flex-col gap-3">
                            <button className="w-full h-11 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold uppercase tracking-widest transition-all">
                                Flag for Audit
                            </button>
                            <button className="w-full h-11 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold uppercase tracking-widest transition-all">
                                Send Reminders
                            </button>
                            <button className="w-full h-11 rounded-xl bg-black/20 hover:bg-black/30 border border-black/10 text-xs font-bold uppercase tracking-widest transition-all text-white/70">
                                Archive Order
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
