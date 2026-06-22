/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useMemo } from "react";
import { AdminTable } from "@/components/admin/AdminTable";
import { useAdminModal } from "@/context/AdminModalContext";
import { OrderQuickView } from "@/components/admin/orders/OrderQuickView";
import type { PaymentWithOrder } from "@/lib/services/finance.service";

interface FinanceRecordsProps {
    allPayments: PaymentWithOrder[];
    fmt: (n: number) => string;
}

export function FinanceRecords({ allPayments, fmt }: FinanceRecordsProps) {
    const { openModal, closeModal } = useAdminModal();

    const judgedPayments = useMemo(
        () => allPayments.filter((p) => p.status !== "pending"),
        [allPayments]
    );

    const handleOrderQuickView = (order: any) => {
        openModal(<OrderQuickView order={order} onClose={closeModal} />, {
            title: "Order Information",
            description: `Quick overview of order ${order.orderRef}`,
            maxWidth: "4xl",
        });
    };

    return (
        <div className="flex flex-col gap-5 animate-fade-in-up">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="h-1 w-6 bg-rw-crimson rounded-full" />
                    <h2 className="font-display font-bold text-xl text-rw-ink uppercase tracking-tight">
                        Audit Trail: Judged Payments
                    </h2>
                </div>
                <div className="text-xs font-bold text-rw-muted">
                    {judgedPayments.length} Processed
                </div>
            </div>

            <AdminTable<PaymentWithOrder>
                data={judgedPayments}
                pageSize={10}
                keyExtractor={(p) => p.id}
                emptyMessage="No payments have been processed yet."
                columns={[
                    {
                        label: "Order Ref",
                        key: "orderRef",
                        render: (p) => (
                            <button
                                onClick={() => handleOrderQuickView(p.order)}
                                className="font-mono font-bold text-rw-crimson border-b border-rw-crimson/20 hover:border-rw-crimson transition-all"
                            >
                                {p.order.orderRef}
                            </button>
                        ),
                    },
                    {
                        label: "Payer Contact",
                        key: "customerName",
                        render: (p) => (
                            <div className="flex flex-col">
                                <span className="font-bold text-rw-ink">
                                    {p.order.customerName}
                                </span>
                                <span className="text-[10px] text-rw-muted font-bold tracking-tight">
                                    {p.order.customerPhone}
                                </span>
                            </div>
                        ),
                    },
                    {
                        label: "Transfer Info",
                        key: "bankInfo",
                        render: (p) => (
                            <div className="flex flex-col">
                                <span className="font-bold text-rw-ink text-xs uppercase">
                                    {p.extractedBank || "Unknown Bank"}
                                </span>
                                {p.extractedTransactionRef && (
                                    <span className="text-[9px] text-rw-muted font-mono break-all">
                                        Ref: {p.extractedTransactionRef}
                                    </span>
                                )}
                            </div>
                        ),
                    },
                    {
                        label: "Confirmed Value",
                        key: "amount",
                        align: "right",
                        render: (p) => (
                            <span className="font-display font-black text-rw-ink">
                                {fmt(p.amountConfirmed ?? p.extractedAmount)}
                            </span>
                        ),
                    },
                    {
                        label: "Judgment",
                        key: "status",
                        render: (p) => (
                            <div className="flex flex-col items-start gap-1">
                                <span
                                    className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                                        p.status === "approved"
                                            ? "bg-green-50 text-green-700 border-green-200"
                                            : "bg-rw-crimson/10 text-rw-crimson border-rw-crimson/25"
                                    }`}
                                >
                                    {p.status}
                                </span>
                                <span className="text-[9px] text-rw-muted">
                                    by {p.moderatorName || "System"}
                                </span>
                            </div>
                        ),
                    },
                    {
                        label: "Date",
                        key: "date",
                        className: "hidden md:table-cell text-right",
                        render: (p) => (
                            <div className="flex flex-col items-end">
                                <span className="text-xs font-bold text-rw-ink">
                                    {new Date(p.createdAt).toLocaleDateString()}
                                </span>
                                <span className="text-[9px] text-rw-muted">
                                    {new Date(p.createdAt).toLocaleTimeString()}
                                </span>
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    );
}
