/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useMemo } from "react";
import { AdminTable } from "@/components/admin/AdminTable";
import { useAdminModal } from "@/context/AdminModalContext";
import { OrderQuickView } from "@/components/admin/orders/OrderQuickView";

interface FinanceRecordsProps {
    allPayments: any[];
    fmt: (n: number) => string;
}

export function FinanceRecords({ allPayments, fmt }: FinanceRecordsProps) {
    const { openModal, closeModal } = useAdminModal();

    // Only show payments that have been judged (not pending)
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
            <div className="flex items-center gap-2">
                <span className="h-1 w-6 bg-rw-crimson rounded-full" />
                <h2 className="font-display font-bold text-xl text-rw-ink uppercase tracking-tight">
                    Audit Trail: Judged Payments
                </h2>
            </div>

            <AdminTable<any>
                data={judgedPayments}
                keyExtractor={(p) => p.id}
                emptyMessage="No payments have been processed yet."
                columns={[
                    {
                        label: "Order",
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
                        label: "Payer/Claimant",
                        key: "customerName",
                        render: (p) => (
                            <div className="flex flex-col">
                                <span className="font-bold text-rw-ink">
                                    {p.customerName}
                                </span>
                                <span className="text-[10px] text-rw-muted font-bold uppercase tracking-tighter">
                                    {p.extractedBank || "Unknown Bank"}
                                </span>
                            </div>
                        ),
                    },
                    {
                        label: "Value",
                        key: "amountClaimed",
                        align: "right",
                        render: (p) => (
                            <span className="font-display font-black text-rw-ink">
                                {fmt(p.amountClaimed)}
                            </span>
                        ),
                    },
                    {
                        label: "Moderator",
                        key: "moderator",
                        render: (p) => (
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-rw-ink">
                                    {p.moderatorName || "System Auto"}
                                </span>
                            </div>
                        ),
                    },
                    {
                        label: "Status",
                        key: "status",
                        render: (p) => (
                            <span
                                className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                                    p.status === "approved"
                                        ? "bg-green-50 text-green-700 border-green-200"
                                        : "bg-rw-crimson/10 text-rw-crimson border-rw-crimson/25"
                                }`}
                            >
                                {p.status}
                            </span>
                        ),
                    },
                    {
                        label: "Date Processed",
                        key: "date",
                        className: "hidden md:table-cell text-right",
                        render: (p) => (
                            <span className="text-[10px] font-bold text-rw-muted">
                                {p.date || "Today"}
                            </span>
                        ),
                    },
                ]}
            />
        </div>
    );
}
