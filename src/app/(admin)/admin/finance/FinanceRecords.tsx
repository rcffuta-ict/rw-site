"use client";

import React from "react";
import Link from "next/link";
import { AdminTable } from "@/components/admin/AdminTable";
import { OrderStatusBadge } from "@/components/ui/Badge";
import { Order } from "@/lib/data/types";

interface FinanceRecordsProps {
    orders: Order[];
    fmt: (n: number) => string;
    totalOrdered: number;
    collected: number;
    outstanding: number;
}

export function FinanceRecords({ orders, fmt, totalOrdered, collected, outstanding }: FinanceRecordsProps) {
    return (
        <div className="flex flex-col gap-5 animate-fade-in-up">
            <div className="flex items-center gap-2">
                <span className="h-1 w-6 bg-rw-crimson rounded-full" />
                <h2 className="font-display font-bold text-xl text-rw-ink uppercase tracking-tight">Order Financials</h2>
            </div>
            <AdminTable<Order>
                data={orders}
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
                        render: (o) => <span className="font-display font-bold text-rw-ink">{fmt(o.totalAmount)}</span>
                    },
                    {
                        label: "Paid",
                        key: "amountPaid",
                        align: "right",
                        render: (o) => <span className="font-display font-bold text-green-700">{fmt(o.amountPaid)}</span>
                    },
                    {
                        label: "Balance",
                        key: "balance",
                        align: "right",
                        className: "hidden md:table-cell",
                        render: (o) => <span className="font-display font-bold text-rw-crimson">{fmt(o.totalAmount - o.amountPaid)}</span>
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
                        <div className="text-right">{fmt(totalOrdered)}</div>
                        <div className="text-right text-green-700">{fmt(collected)}</div>
                        <div className="text-right text-rw-crimson hidden md:block">{fmt(outstanding)}</div>
                        <div className="hidden sm:block" />
                    </div>
                }
            />
        </div>
    );
}
