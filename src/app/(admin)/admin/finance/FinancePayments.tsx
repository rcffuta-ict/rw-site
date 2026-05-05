"use client";

import React from "react";
import Link from "next/link";
import { AdminTable } from "@/components/admin/AdminTable";

interface FinancePaymentsProps {
    allPayments: any[];
    fmt: (n: number) => string;
    PaymentStatusPill: (props: { status: string }) => React.ReactNode;
}

export function FinancePayments({ allPayments, fmt, PaymentStatusPill }: FinancePaymentsProps) {
    return (
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
                                <span className="font-display font-bold text-rw-ink">{fmt(p.amountClaimed)}</span>
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
    );
}
