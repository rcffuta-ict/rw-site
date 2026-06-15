"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/forms/Button";
import { Input } from "@/components/ui/forms/Input";
import { useAdminModal } from "@/context/AdminModalContext";
import { ApprovalForm, FlagForm } from "./component";
import { OrderQuickView } from "@/components/admin/orders/OrderQuickView";
import type { PaymentWithOrder } from "@/lib/services/finance.service";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { toast } from "sonner";
import { reviewPayment } from "@/lib/services/orders.service";
import { formatNaira } from "@/lib/utils/functions";
import { useRouter } from "next/navigation";

interface FinancePaymentsProps {
    allPayments: PaymentWithOrder[];
    PaymentStatusPill: (props: { status: string }) => React.ReactNode;
}

export function FinancePayments({
    allPayments,
    PaymentStatusPill,
}: FinancePaymentsProps) {
    const { openModal, closeModal } = useAdminModal();
    const { user } = useAdminAuth();
    const router = useRouter();
    const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null);
    const [filter, setFilter] = useState<string>("pending");
    const [searchTerm, setSearchTerm] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const filteredPayments = useMemo(() => {
        let res = allPayments;
        if (filter !== "all") res = res.filter((p) => p.status === filter);
        if (searchTerm) {
            const q = searchTerm.toLowerCase();
            res = res.filter(
                (p) =>
                    p.order.orderRef.toLowerCase().includes(q) ||
                    p.order.customerName.toLowerCase().includes(q)
            );
        }
        return res;
    }, [allPayments, filter, searchTerm]);

    const selectedPayment = useMemo(
        () => allPayments.find((p) => p.id === selectedPaymentId),
        [allPayments, selectedPaymentId]
    );

    const statusCounts = useMemo(
        () => ({
            pending: allPayments.filter((p) => p.status === "pending").length,
            approved: allPayments.filter((p) => p.status === "approved").length,
            flagged: allPayments.filter((p) => p.status === "flagged").length,
            all: allPayments.length,
        }),
        [allPayments]
    );

    const handleZoom = () => {
        if (!selectedPayment?.receiptUrl) return;
        openModal(
            <div className="w-full h-full bg-rw-ink flex items-center justify-center p-4">
                <img
                    src={selectedPayment.receiptUrl}
                    alt="Receipt Zoom"
                    className="max-h-full max-w-full object-contain shadow-2xl bg-white"
                />
            </div>,
            { fullScreen: true, noPadding: true }
        );
    };

    const handleDecision = async (
        decision: "approved" | "flagged" | "rejected",
        amountConfirmed?: number,
        note?: string
    ) => {
        if (!selectedPayment || !user) return;
        setIsSubmitting(true);
        const res = await reviewPayment({
            paymentId: selectedPayment.id,
            decision,
            actorEmail: user.email || "Unknown",
            actorName: user.name || "Admin",
            amountConfirmed: amountConfirmed ?? selectedPayment.extractedAmount,
            reviewNote: note,
        });
        setIsSubmitting(false);
        closeModal();

        if (res.success) {
            toast.success(`Payment ${decision} successfully`);
            setSelectedPaymentId(null);
            router.refresh();
        } else {
            toast.error(res.error || "Failed to update payment");
        }
    };

    const openApproveModal = () => {
        if (!selectedPayment) return;
        openModal(
            <ApprovalForm
                initialAmount={(
                    selectedPayment.amountConfirmed ?? selectedPayment.extractedAmount
                ).toString()}
                // orderRef={selectedPayment.order.orderRef}
                onCancel={closeModal}
                onConfirm={(amount) => handleDecision("approved", Number(amount))}
            />,
            {
                maxWidth: "md",
                title: "Confirm Funds",
                description: `Verify bank inflow for ${selectedPayment.order.orderRef}`,
            }
        );
    };

    const openFlagModal = () => {
        if (!selectedPayment) return;
        openModal(
            <FlagForm
                orderRef={selectedPayment.order.orderRef}
                onCancel={closeModal}
                onConfirm={(reason) => handleDecision("flagged", undefined, reason)}
            />,
            {
                maxWidth: "md",
                title: "Flag Issue",
                description: `Mark ${selectedPayment.order.orderRef} payment for review`,
            }
        );
    };

    const handleOrderQuickView = () => {
        if (!selectedPayment) return;
        openModal(<OrderQuickView order={selectedPayment.order} onClose={closeModal} />, {
            title: "Order Information",
            description: `Quick overview of order ${selectedPayment.order.orderRef}`,
            maxWidth: "4xl",
        });
    };

    return (
        <div className="flex flex-col gap-6 animate-fade-in-up">
            {/* Header & Filters */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                        <svg
                            className="h-6 w-6"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={1.5}
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                            />
                        </svg>
                    </div>
                    <div>
                        <h2 className="font-display font-bold text-xl text-rw-ink">
                            Payment Monitor
                        </h2>
                        <p className="text-xs text-rw-muted font-medium uppercase tracking-wider">
                            Process incoming transfers
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-1 p-1 bg-rw-bg-alt border border-[var(--rw-border)] rounded-xl self-start">
                    {["pending", "approved", "flagged", "all"].map((s) => (
                        <button
                            key={s}
                            onClick={() => {
                                setFilter(s);
                                if (s !== "all" && selectedPayment?.status !== s)
                                    setSelectedPaymentId(null);
                            }}
                            className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
                                filter === s
                                    ? "bg-white text-rw-ink shadow-sm ring-1 ring-[var(--rw-border)]"
                                    : "text-rw-muted hover:text-rw-ink"
                            }`}
                        >
                            {s} ({statusCounts[s as keyof typeof statusCounts]})
                        </button>
                    ))}
                </div>
            </div>

            {/* Split View */}
            <div className="grid lg:grid-cols-5 gap-0 rounded-3xl overflow-hidden border border-[var(--rw-border)] bg-rw-bg-alt/20 h-[calc(100vh-19rem)] min-h-[600px] max-h-[860px] shadow-2xl shadow-rw-ink/5">
                {/* Left List */}
                <div
                    className={`${selectedPaymentId ? "hidden lg:block" : ""} lg:col-span-2 border-r border-[var(--rw-border)] bg-white flex flex-col min-h-0 overflow-hidden`}
                >
                    <div className="p-4 border-b border-[var(--rw-border)] bg-rw-bg-alt/30 shrink-0">
                        <Input
                            placeholder="Search by order or name..."
                            className="!rounded-xl border-none shadow-sm"
                            containerClassName="w-full"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <p className="mt-2 px-1 text-[10px] font-bold text-rw-muted uppercase tracking-[0.15em]">
                            {filteredPayments.length}{" "}
                            {filter === "all" ? "total" : filter}{" "}
                            {filteredPayments.length === 1 ? "payment" : "payments"}
                        </p>
                    </div>
                    <div className="overflow-y-auto flex-1 scrollbar-hide">
                        {filteredPayments.length === 0 ? (
                            <div className="p-20 text-center text-rw-muted opacity-50">
                                No Payment to Review
                            </div>
                        ) : (
                            filteredPayments.map((p) => (
                                <button
                                    key={p.id}
                                    onClick={() => setSelectedPaymentId(p.id)}
                                    className={`w-full text-left p-5 border-b border-[var(--rw-border)] transition-all hover:bg-rw-bg-alt/30 relative ${
                                        selectedPaymentId === p.id
                                            ? "bg-rw-bg-alt/50"
                                            : ""
                                    }`}
                                >
                                    <div className="flex items-center justify-between mb-1.5">
                                        <span className="font-mono font-bold text-rw-crimson text-xs">
                                            {p.order.orderRef}
                                        </span>
                                        <PaymentStatusPill status={p.status} />
                                    </div>
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="font-bold text-rw-ink text-sm">
                                                {p.order.customerName}
                                            </p>
                                            <p className="text-[10px] text-rw-muted uppercase font-bold tracking-tight">
                                                {p.extractedBank || "Unknown Bank"}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-display font-black text-rw-ink text-lg">
                                                {formatNaira(
                                                    p.amountConfirmed ?? p.extractedAmount
                                                )}
                                            </p>
                                            <p className="text-[10px] text-rw-muted">
                                                {new Date(
                                                    p.createdAt
                                                ).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    {selectedPaymentId === p.id && (
                                        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-rw-crimson" />
                                    )}
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* Right Details */}
                <div
                    className={`${!selectedPaymentId ? "hidden lg:flex" : "flex"} lg:col-span-3 flex-col bg-white overflow-hidden relative`}
                >
                    {selectedPayment ? (
                        <div className="flex flex-col h-full animate-fade-in">
                            <div className="px-6 py-5 border-b border-[var(--rw-border)] flex items-center justify-between bg-rw-bg-alt/10">
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => setSelectedPaymentId(null)}
                                        className="lg:hidden p-2 rounded-full border"
                                    >
                                        ← Back
                                    </button>
                                    <div>
                                        <h3 className="font-display font-bold text-xl text-rw-ink">
                                            Payment Details
                                        </h3>
                                        <button
                                            onClick={handleOrderQuickView}
                                            className="text-xs font-mono font-bold text-rw-crimson hover:underline cursor-pointer"
                                        >
                                            Order {selectedPayment.order.orderRef}
                                        </button>
                                    </div>
                                </div>
                                <PaymentStatusPill status={selectedPayment.status} />
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8 scrollbar-hide">
                                {/* Grid details */}
                                <div className="grid sm:grid-cols-2 gap-8">
                                    {/* Info Panel */}
                                    <div className="flex flex-col gap-4">
                                        <div className="p-4 rounded-2xl bg-rw-bg-alt/30 border border-[var(--rw-border)]">
                                            <span className="text-[10px] font-bold text-rw-muted uppercase tracking-[0.2em] block mb-2">
                                                Customer & Contact
                                            </span>
                                            <p className="font-bold text-rw-ink">
                                                {selectedPayment.order.customerName}
                                            </p>
                                            <p className="text-xs font-mono text-rw-muted mt-1">
                                                {selectedPayment.order.customerEmail}
                                            </p>
                                            <p className="text-xs font-mono text-rw-muted">
                                                {selectedPayment.order.customerPhone}
                                            </p>
                                            <div className="mt-3 pt-3 border-t border-[var(--rw-border)] grid grid-cols-2 gap-3">
                                                <div>
                                                    <span className="text-[10px] font-bold text-rw-muted uppercase tracking-[0.2em] block mb-1">
                                                        Sender (on receipt)
                                                    </span>
                                                    <p
                                                        className="font-bold text-sm text-rw-ink truncate"
                                                        title={
                                                            selectedPayment.extractedSenderName ||
                                                            "Unknown"
                                                        }
                                                    >
                                                        {selectedPayment.extractedSenderName ||
                                                            "Unknown"}
                                                    </p>
                                                </div>
                                                <div>
                                                    <span className="text-[10px] font-bold text-rw-muted uppercase tracking-[0.2em] block mb-1">
                                                        Transfer Bank
                                                    </span>
                                                    <p className="font-bold text-sm text-rw-ink truncate">
                                                        {selectedPayment.extractedBank ||
                                                            "Unknown"}
                                                    </p>
                                                </div>
                                            </div>
                                            {selectedPayment.extractedTransactionRef && (
                                                <div className="mt-3 pt-3 border-t border-[var(--rw-border)]">
                                                    <span className="text-[10px] font-bold text-rw-muted uppercase tracking-[0.2em] block mb-1">
                                                        Transaction Ref
                                                    </span>
                                                    <p
                                                        className="font-mono text-xs text-rw-ink break-all"
                                                        title={
                                                            selectedPayment.extractedTransactionRef
                                                        }
                                                    >
                                                        {
                                                            selectedPayment.extractedTransactionRef
                                                        }
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        <div className="p-4 rounded-2xl bg-white border-2 border-dashed border-[var(--rw-border)] shadow-sm">
                                            <span className="text-[10px] font-bold text-rw-muted uppercase tracking-[0.2em] block mb-2">
                                                Transaction Values
                                            </span>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-rw-muted">
                                                    Order Total
                                                </span>
                                                <span className="font-medium">
                                                    {formatNaira(
                                                        selectedPayment.order.totalAmount
                                                    )}
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-sm mb-2">
                                                <span className="text-rw-muted">
                                                    Previously Paid
                                                </span>
                                                <span className="font-medium text-green-600">
                                                    {formatNaira(
                                                        selectedPayment.order.amountPaid
                                                    )}
                                                </span>
                                            </div>
                                            <div className="pt-2 border-t flex justify-between items-center">
                                                <span className="text-xs font-bold text-rw-ink uppercase">
                                                    Claimed Deposit
                                                </span>
                                                <span className="font-display font-black text-2xl text-blue-600">
                                                    {formatNaira(
                                                        selectedPayment.amountConfirmed ??
                                                            selectedPayment.extractedAmount
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Receipt */}
                                    <div className="flex flex-col gap-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] font-bold text-rw-muted uppercase tracking-[0.2em]">
                                                Receipt Proof
                                            </span>
                                            <button
                                                onClick={handleZoom}
                                                className="text-[10px] font-bold text-blue-600 hover:underline"
                                            >
                                                ZOOM
                                            </button>
                                        </div>
                                        {selectedPayment.receiptUrl ? (
                                            <div
                                                onClick={handleZoom}
                                                className="aspect-[3/4] bg-rw-bg-alt border rounded-2xl overflow-hidden cursor-zoom-in group relative shadow-inner"
                                            >
                                                <img
                                                    src={selectedPayment.receiptUrl}
                                                    className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                                                />
                                            </div>
                                        ) : (
                                            <div className="aspect-[3/4] bg-gray-50 border rounded-2xl flex items-center justify-center text-gray-400 text-xs">
                                                No image uploaded
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Judgment Action */}
                                <div className="mt-auto pt-6 border-t border-[var(--rw-border)]">
                                    {selectedPayment.status === "pending" ? (
                                        <div className="grid grid-cols-2 gap-4">
                                            <Button
                                                onClick={openApproveModal}
                                                disabled={isSubmitting}
                                                className="h-16 bg-green-600 hover:bg-green-700 !rounded-2xl"
                                            >
                                                <span className="font-display font-black tracking-widest uppercase">
                                                    Confirm Inflow
                                                </span>
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                onClick={openFlagModal}
                                                disabled={isSubmitting}
                                                className="h-16 border-2 border-amber-200 text-amber-700 hover:bg-amber-50 !rounded-2xl"
                                            >
                                                <span className="font-display font-black tracking-widest uppercase">
                                                    Flag Issue
                                                </span>
                                            </Button>
                                        </div>
                                    ) : (
                                        (() => {
                                            const verdict = {
                                                approved: {
                                                    label: "Approved",
                                                    accent: "text-green-700",
                                                    ring: "border-green-200 bg-green-50/60",
                                                    dot: "bg-green-500",
                                                },
                                                flagged: {
                                                    label: "Flagged",
                                                    accent: "text-amber-700",
                                                    ring: "border-amber-200 bg-amber-50/60",
                                                    dot: "bg-amber-500",
                                                },
                                                rejected: {
                                                    label: "Rejected",
                                                    accent: "text-red-700",
                                                    ring: "border-red-200 bg-red-50/60",
                                                    dot: "bg-red-500",
                                                },
                                            }[selectedPayment.status] ?? {
                                                label: selectedPayment.status,
                                                accent: "text-gray-700",
                                                ring: "border-gray-200 bg-gray-50",
                                                dot: "bg-gray-400",
                                            };

                                            const moderator =
                                                selectedPayment.moderatorName || "System";
                                            const initials = moderator
                                                .split(/\s+/)
                                                .map((w) => w[0])
                                                .filter(Boolean)
                                                .slice(0, 2)
                                                .join("")
                                                .toUpperCase();

                                            return (
                                                <div
                                                    className={`rounded-2xl border ${verdict.ring} p-5`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-11 w-11 shrink-0 rounded-full bg-white border border-[var(--rw-border)] flex items-center justify-center font-display font-black text-sm text-rw-ink shadow-sm">
                                                            {initials || "SY"}
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <div className="flex items-center gap-2">
                                                                <span
                                                                    className={`h-1.5 w-1.5 rounded-full ${verdict.dot}`}
                                                                />
                                                                <span
                                                                    className={`text-[10px] font-black uppercase tracking-[0.2em] ${verdict.accent}`}
                                                                >
                                                                    {verdict.label} by
                                                                </span>
                                                            </div>
                                                            <p className="font-bold text-rw-ink text-sm truncate mt-0.5">
                                                                {moderator}
                                                            </p>
                                                            {selectedPayment.moderatorEmail && (
                                                                <p className="text-[11px] font-mono text-rw-muted truncate">
                                                                    {
                                                                        selectedPayment.moderatorEmail
                                                                    }
                                                                </p>
                                                            )}
                                                        </div>
                                                        {selectedPayment.status ===
                                                            "approved" && (
                                                            <div className="text-right shrink-0">
                                                                <p className="text-[9px] font-bold text-rw-muted uppercase tracking-widest">
                                                                    Confirmed
                                                                </p>
                                                                <p className="font-display font-black text-green-700">
                                                                    {formatNaira(
                                                                        selectedPayment.amountConfirmed ??
                                                                            selectedPayment.extractedAmount
                                                                    )}
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="mt-4 pt-3 border-t border-[var(--rw-border)]/60">
                                                        <p className="text-[9px] font-bold text-rw-muted uppercase tracking-[0.2em] mb-1">
                                                            Review Note
                                                        </p>
                                                        <p
                                                            className={`text-xs leading-relaxed ${selectedPayment.reviewNote ? "text-rw-ink" : "text-rw-muted italic"}`}
                                                        >
                                                            {selectedPayment.reviewNote ||
                                                                "No notes were left for this decision."}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })()
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                            <svg
                                className="w-16 h-16 opacity-20 mb-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                ></path>
                            </svg>
                            <p className="font-bold text-sm uppercase tracking-widest opacity-50">
                                Select a payment to review
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
