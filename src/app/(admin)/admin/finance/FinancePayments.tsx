/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/forms/Button";
import { Input } from "@/components/ui/forms/Input";
import { useAdminModal } from "@/context/AdminModalContext";
import { ApprovalForm, FlagForm, RevertConfirmationForm } from "./component";
import { OrderQuickView } from "@/components/admin/orders/OrderQuickView";

interface FinancePaymentsProps {
    allPayments: any[];
    fmt: (n: number) => string;
    PaymentStatusPill: (props: { status: string }) => React.ReactNode;
}

export function FinancePayments({
    allPayments,
    fmt,
    PaymentStatusPill,
}: FinancePaymentsProps) {
    const { openModal, closeModal } = useAdminModal();
    const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null);
    const [filter, setFilter] = useState<string>("pending");

    // Moderation workflow state
    const [modAmount] = useState<string>("");
    const [modReason] = useState<string>("");

    const filteredPayments = useMemo(() => {
        if (filter === "all") return allPayments;
        return allPayments.filter((p) => p.status === filter);
    }, [allPayments, filter]);

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

    // Handle Zoom
    const handleZoom = () => {
        if (!selectedPayment) return;
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

    // Effect to update modal content when local state changes (important because React won't re-render modal content unless we call openModal again or use a sub-component that uses the state)
    // Actually, passing a component to openModal that CLOSES OVER the state works if we re-call openModal or if we use a technique where the modal renders a children provider.
    // However, for simplicity, I'll re-call openModal when state changes OR define the content as a stable component that uses the parent's state.
    // Wait, the content passed to openModal is rendered by AdminModalProvider. If I pass JSX that depends on local state, I need to re-call openModal to "refresh" it.

    const openApproveModal = () => {
        if (!selectedPayment) return;

        openModal(
            <ApprovalForm
                initialAmount={selectedPayment.amountClaimed.toString()}
                orderRef={selectedPayment.order.orderRef}
                onCancel={closeModal}
                onConfirm={(finalAmount) => {
                    console.log("Confirmed Amount:", finalAmount);
                    // Trigger your API call here
                    closeModal();
                }}
            />,
            {
                maxWidth: "md", // Changed from "xl" to "md" for moderate sizing
                title: "Confirm Approval",
                description: `Verify funds for Order ${selectedPayment.order.orderRef}`,
            }
        );
    };

    const openFlagModal = () => {
        if (!selectedPayment) return;

        openModal(
            <FlagForm
                orderRef={selectedPayment.order.orderRef}
                onCancel={closeModal}
                onConfirm={(reason) => {
                    console.log("Flagging with reason:", reason);
                    // Execute your API call or state update here
                    closeModal();
                }}
            />,
            {
                maxWidth: "md", // Balanced sizing
                title: "Flag Submission",
                description: `Order ${selectedPayment.order.orderRef} requires revision`,
            }
        );
    };

    const openRevertModal = () => {
        if (!selectedPayment) return;

        openModal(
            <RevertConfirmationForm
                orderRef={selectedPayment.order.orderRef}
                onCancel={closeModal}
                onConfirm={() => {
                    console.log("Reverted payment to pending:", selectedPayment.id);
                    // Actual state update logic would go here
                    closeModal();
                }}
            />,
            {
                maxWidth: "md",
                title: "Revert Status",
                description: `Move Order ${selectedPayment.order.orderRef} back to queue`,
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

    // We need to refresh the modal if the inputs change
    useEffect(() => {
        if (modAmount && selectedPayment) {
            // This is a bit hacky but works for global modals that don't share state easily
            // A better way would be to move the MODAL STATE into the global context if we want it truly reactive,
            // OR just use local state for the form inside the modal content.
        }
    }, [modAmount, modReason]);

    return (
        <div className="flex flex-col gap-6 animate-fade-in-up">
            {/* Review Header & Filters */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-rw-gold/10 flex items-center justify-center text-rw-gold">
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
                                d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                            />
                        </svg>
                    </div>
                    <div>
                        <h2 className="font-display font-bold text-xl text-rw-ink">
                            Payment Review Queue
                        </h2>
                        <p className="text-xs text-rw-muted font-medium uppercase tracking-wider">
                            Address pending submissions
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
            <div className="grid lg:grid-cols-5 gap-0 rounded-3xl overflow-hidden border border-[var(--rw-border)] bg-rw-bg-alt/20 min-h-[750px] shadow-2xl shadow-rw-ink/5">
                {/* Left: List */}
                <div
                    className={`${selectedPaymentId && "hidden lg:block"} lg:col-span-2 border-r border-[var(--rw-border)] bg-white flex flex-col`}
                >
                    <div className="p-4 border-b border-[var(--rw-border)] bg-rw-bg-alt/30">
                        <Input
                            placeholder="Search by order or name..."
                            className="!rounded-xl border-none shadow-sm"
                            containerClassName="w-full"
                        />
                    </div>
                    <div className="overflow-y-auto flex-1 scrollbar-hide">
                        {filteredPayments.length === 0 ? (
                            <div className="p-20 text-center flex flex-col items-center gap-3">
                                <div className="h-12 w-12 rounded-full bg-rw-bg-alt flex items-center justify-center text-rw-muted">
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
                                            d="m4.5 12.75 6 6 9-13.5"
                                        />
                                    </svg>
                                </div>
                                <p className="text-xs font-bold text-rw-muted uppercase tracking-widest">
                                    No payments found
                                </p>
                            </div>
                        ) : (
                            filteredPayments.map((p) => (
                                <button
                                    key={p.id}
                                    onClick={() => setSelectedPaymentId(p.id)}
                                    className={`w-full text-left p-6 border-b border-[var(--rw-border)] last:border-0 transition-all hover:bg-rw-bg-alt/30 group relative ${
                                        selectedPaymentId === p.id
                                            ? "bg-rw-bg-alt/50"
                                            : ""
                                    }`}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-mono font-bold text-rw-crimson text-xs">
                                            {p.order.orderRef}
                                        </span>
                                        <PaymentStatusPill status={p.status} />
                                    </div>
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="font-bold text-rw-ink text-sm leading-tight mb-1">
                                                {p.order.customerName}
                                            </p>
                                            <p className="text-[10px] font-bold text-rw-muted uppercase tracking-tight">
                                                {p.extractedBank || "Unknown Bank"}
                                            </p>
                                        </div>
                                        <p className="font-display font-black text-rw-ink text-xl">
                                            {fmt(p.amountClaimed)}
                                        </p>
                                    </div>

                                    {/* Visual active indicator */}
                                    {selectedPaymentId === p.id && (
                                        <>
                                            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-rw-crimson animate-fade-in" />
                                            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-4 h-4 bg-white rotate-45 border-l border-b border-[var(--rw-border)] z-10 hidden lg:block" />
                                        </>
                                    )}
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* Right: Details */}
                <div
                    className={`${!selectedPaymentId && "hidden lg:flex"} lg:col-span-3 flex flex-col bg-white overflow-hidden relative`}
                >
                    {selectedPayment ? (
                        <div className="flex flex-col h-full animate-fade-in">
                            {/* Detail Header */}
                            <div className="px-8 py-6 border-b border-[var(--rw-border)] flex items-center justify-between bg-rw-bg-alt/10">
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => setSelectedPaymentId(null)}
                                        className="lg:hidden h-10 w-10 rounded-full bg-white border border-[var(--rw-border)] flex items-center justify-center text-rw-ink active:scale-95 transition-transform"
                                    >
                                        <svg
                                            className="h-5 w-5"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M15.75 19.5L8.25 12l7.5-7.5"
                                            />
                                        </svg>
                                    </button>
                                    <div>
                                        <h3 className="font-display font-bold text-2xl text-rw-ink">
                                            Payment Details
                                        </h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <button
                                                onClick={handleOrderQuickView}
                                                className="text-xs font-mono font-bold text-rw-crimson hover:underline bg-rw-crimson/5 px-2 py-0.5 rounded cursor-pointer"
                                            >
                                                Order {selectedPayment.order.orderRef}
                                            </button>
                                            <span className="text-rw-muted text-xs">
                                                •
                                            </span>
                                            <span className="text-xs font-medium text-rw-muted italic">
                                                Submitted{" "}
                                                {new Date(
                                                    selectedPayment.createdAt
                                                ).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <PaymentStatusPill status={selectedPayment.status} />
                                    {selectedPayment.moderatorName && (
                                        <span className="text-[9px] font-bold text-rw-muted uppercase tracking-tighter">
                                            by {selectedPayment.moderatorName}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-10 scrollbar-hide">
                                {/* Core Info Row */}
                                <div className="grid sm:grid-cols-2 gap-10">
                                    <div className="flex flex-col gap-4">
                                        <div className="p-4 rounded-2xl bg-rw-bg-alt/30 border border-[var(--rw-border)]">
                                            <span className="text-[10px] font-bold text-rw-muted uppercase tracking-[0.2em] block mb-2">
                                                Payer Identity
                                            </span>
                                            <p className="font-bold text-rw-ink text-base">
                                                {selectedPayment.order.customerName}
                                            </p>
                                            <p className="text-xs text-rw-muted font-medium mb-3">
                                                {selectedPayment.order.customerEmail}
                                            </p>
                                            <div className="flex items-center gap-2 text-[10px] font-bold text-rw-muted">
                                                <span className="px-2 py-1 bg-white border border-[var(--rw-border)] rounded-md">
                                                    {selectedPayment.extractedBank ||
                                                        "Unknown Bank"}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="p-4 rounded-2xl bg-rw-bg-alt/30 border border-[var(--rw-border)]">
                                            <span className="text-[10px] font-bold text-rw-muted uppercase tracking-[0.2em] block mb-2">
                                                Claimed Value
                                            </span>
                                            <p className="font-display font-black text-3xl text-rw-ink">
                                                {fmt(selectedPayment.amountClaimed)}
                                            </p>
                                            <p className="text-[10px] font-bold text-rw-muted uppercase mt-1">
                                                {selectedPayment.percentOfTotal}% of total
                                                order valuation
                                            </p>
                                        </div>

                                        <div className="p-4 rounded-2xl bg-white border-2 border-dashed border-[var(--rw-border)]">
                                            <span className="text-[10px] font-bold text-rw-muted uppercase tracking-[0.2em] block mb-2">
                                                Order Summary
                                            </span>
                                            <div className="flex justify-between items-center text-sm font-medium">
                                                <span className="text-rw-muted">
                                                    Total Order
                                                </span>
                                                <span className="text-rw-ink">
                                                    {fmt(
                                                        selectedPayment.order.totalAmount
                                                    )}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm font-bold mt-1">
                                                <span className="text-rw-muted">
                                                    Already Paid
                                                </span>
                                                <span className="text-green-600">
                                                    {fmt(
                                                        selectedPayment.order.amountPaid
                                                    )}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm font-black mt-3 pt-3 border-t border-[var(--rw-border)]">
                                                <span className="text-rw-ink uppercase text-[10px]">
                                                    Remaining Balance
                                                </span>
                                                <span className="text-rw-crimson">
                                                    {fmt(
                                                        selectedPayment.order
                                                            .totalAmount -
                                                            selectedPayment.order
                                                                .amountPaid
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Proof Image */}
                                    <div className="flex flex-col gap-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-bold text-rw-muted uppercase tracking-[0.2em]">
                                                Transaction Receipt
                                            </span>
                                            <button
                                                onClick={handleZoom}
                                                className="text-xs font-bold text-rw-crimson hover:underline flex items-center gap-1"
                                            >
                                                Zoom view
                                                <svg
                                                    className="h-3.5 w-3.5"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth={2}
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                        <div
                                            className="aspect-[3/4] rounded-2xl bg-rw-bg-alt border border-[var(--rw-border)] overflow-hidden relative group cursor-zoom-in shadow-inner"
                                            onClick={handleZoom}
                                        >
                                            <img
                                                src={selectedPayment.receiptUrl}
                                                alt="Proof of Payment"
                                                className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-6">
                                                <span className="text-white text-[10px] font-black uppercase tracking-[0.2em] bg-rw-crimson px-6 py-2 rounded-full shadow-lg">
                                                    Click for convenient view
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Area */}
                                <div className="mt-auto pt-8 border-t border-[var(--rw-border)]">
                                    <div className="flex flex-col gap-6">
                                        <p className="text-[10px] font-bold text-rw-muted uppercase tracking-[0.3em] text-center">
                                            Decision Console
                                        </p>

                                        {selectedPayment.status === "pending" ? (
                                            <div className="grid grid-cols-2 gap-4">
                                                <Button
                                                    onClick={openApproveModal}
                                                    className="h-20 bg-green-600 hover:bg-green-700 !rounded-[1.5rem] shadow-xl shadow-green-600/20"
                                                >
                                                    <div className="flex flex-col items-center">
                                                        <span className="font-display font-black text-lg uppercase tracking-widest leading-none">
                                                            Approve
                                                        </span>
                                                        <span className="text-[9px] font-bold opacity-70 uppercase tracking-tighter mt-1">
                                                            Mark as valid funds
                                                        </span>
                                                    </div>
                                                </Button>
                                                <Button
                                                    variant="outlined"
                                                    onClick={openFlagModal}
                                                    className="h-20 border-2 border-amber-200 text-amber-700 hover:bg-amber-50 !rounded-[1.5rem]"
                                                >
                                                    <div className="flex flex-col items-center">
                                                        <span className="font-display font-black text-lg uppercase tracking-widest leading-none">
                                                            Flag
                                                        </span>
                                                        <span className="text-[9px] font-bold opacity-70 uppercase tracking-tighter mt-1">
                                                            Requires review
                                                        </span>
                                                    </div>
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="p-6 rounded-3xl bg-rw-bg-alt/50 border border-dashed border-[var(--rw-border)] w-full text-center">
                                                    <p className="text-sm font-bold text-rw-ink italic">
                                                        This payment was processed by{" "}
                                                        {selectedPayment.moderatorName ||
                                                            "System"}
                                                    </p>
                                                    <p className="text-[10px] text-rw-muted uppercase mt-1">
                                                        Status: {selectedPayment.status}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={openRevertModal}
                                                    className="text-xs font-bold text-rw-muted hover:text-rw-crimson underline transition-colors"
                                                >
                                                    Revert to Pending status
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center gap-6 p-20 text-center opacity-40">
                            <div className="h-24 w-24 rounded-full bg-rw-bg-alt flex items-center justify-center text-rw-muted">
                                <svg
                                    className="h-12 w-12"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={1}
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M9 12.75L11.25 15L15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-display font-bold text-xl text-rw-ink uppercase tracking-wider">
                                    Queue Empty
                                </h3>
                                <p className="text-sm text-rw-muted mt-2 font-medium">
                                    Select a submission from the queue to start review
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
