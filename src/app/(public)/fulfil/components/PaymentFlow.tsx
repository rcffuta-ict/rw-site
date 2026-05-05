"use client";

import { useState } from "react";
import { Button } from "@/components/ui/forms/Button";
import type { Order } from "@/lib/data/types";
import { PAYMENT_CONFIG, MOCK_EXTRACTION } from "./constants";

function RadioCard({
    selected,
    onClick,
    title,
    desc,
}: {
    selected: boolean;
    onClick: () => void;
    title: string;
    desc: string;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`radio-card text-left w-full ${selected ? "selected" : ""}`}
        >
            <span className="radio-dot" />
            <div>
                <p className="font-semibold text-sm text-rw-ink">{title}</p>
                <p className="text-xs text-rw-muted mt-0.5">{desc}</p>
            </div>
        </button>
    );
}

interface PaymentFlowProps {
    order: Order;
    onResetOrder: () => void;
    onStageChange?: (stage: "idle" | "analysing" | "preview" | "done") => void;
}

export function PaymentFlow({ order, onResetOrder, onStageChange }: PaymentFlowProps) {
    const [paymentType, setPaymentType] = useState<"full" | "partial" | null>(null);
    const [partialPercent, setPartialPercent] = useState(PAYMENT_CONFIG.minPercent);
    const [file, setFile] = useState<File | null>(null);
    const [stage, setStage] = useState<"idle" | "analysing" | "preview" | "done">("idle");
    const [extraction, setExtraction] = useState<typeof MOCK_EXTRACTION | null>(null);
    const [accurate, setAccurate] = useState<boolean | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const remaining = order.totalAmount - order.amountPaid;
    const payAmount =
        paymentType === "full"
            ? remaining
            : Math.ceil((remaining * partialPercent) / 100);

    const percentChoices = [
        PAYMENT_CONFIG.minPercent,
        PAYMENT_CONFIG.minPercent + Math.floor((100 - PAYMENT_CONFIG.minPercent) / 2),
        100,
    ];

    function updateStage(newStage: typeof stage) {
        setStage(newStage);
        onStageChange?.(newStage);
    }

    async function handleUpload() {
        if (!file) return;
        updateStage("analysing");
        await new Promise((r) => setTimeout(r, 1800));
        setExtraction({ ...MOCK_EXTRACTION, amount: payAmount || null });
        updateStage("preview");
    }

    async function handleConfirm() {
        if (accurate === null) return;
        setSubmitting(true);
        await new Promise((r) => setTimeout(r, 1200));
        setSubmitting(false);
        updateStage("done");
    }

    function resetUpload() {
        setFile(null);
        updateStage("idle");
        setExtraction(null);
        setAccurate(null);
    }

    // Done state
    if (stage === "done") {
        return (
            <div className="rw-card p-12 text-center flex flex-col items-center gap-6 animate-scale-in border-green-200 bg-gradient-to-b from-green-50 to-white">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-100 border-4 border-white shadow-lg">
                    <svg
                        className="h-12 w-12 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={3}
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m4.5 12.75 6 6 9-13.5"
                        />
                    </svg>
                </div>
                <div>
                    <h2 className="font-display font-bold text-3xl text-rw-ink">
                        Payment Submitted!
                    </h2>
                    <p className="mt-3 text-rw-text-2 text-lg max-w-[36ch] mx-auto leading-relaxed">
                        Thank you. Your receipt is under review. An email confirmation
                        will be sent to{" "}
                        <span className="font-semibold text-rw-ink">
                            {order.customerEmail}
                        </span>{" "}
                        once approved.
                    </p>
                </div>
                <Button variant="outlined" className="mt-4" onClick={onResetOrder}>
                    Pay another order
                </Button>
            </div>
        );
    }

    // Preview state
    if (stage === "preview" && extraction) {
        return (
            <div className="rw-card p-8 flex flex-col gap-8 animate-fade-in-up shadow-rw-shadow-md border-t-[3px] border-t-rw-crimson">
                <div className="flex items-center justify-between pb-5 border-b border-[var(--rw-border)]">
                    <div>
                        <h2 className="font-display font-bold text-2xl text-rw-ink">
                            Extraction Result
                        </h2>
                        <p className="text-sm text-rw-muted mt-1">
                            Please verify the details below
                        </p>
                    </div>
                    <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold border ${
                            extraction.confidence === "high"
                                ? "bg-green-50 text-green-700 border-green-200"
                                : extraction.confidence === "medium"
                                  ? "bg-amber-50 text-amber-700 border-amber-200"
                                  : "bg-red-50 text-red-700 border-red-200"
                        }`}
                    >
                        <span className="h-2 w-2 rounded-full bg-current animate-pulse" />
                        {extraction.confidence.toUpperCase()} CONFIDENCE
                    </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {[
                        ["Sender Name", extraction.senderName ?? "—"],
                        [
                            "Amount Found",
                            extraction.amount
                                ? `₦${extraction.amount.toLocaleString()}`
                                : "—",
                        ],
                        ["Date of Tx", extraction.date ?? "—"],
                        ["Time of Tx", extraction.time ?? "—"],
                        ["Bank Name", extraction.bank ?? "—"],
                    ].map(([k, v]) => (
                        <div
                            key={k}
                            className="p-4 rounded-2xl bg-rw-bg-alt border border-[var(--rw-border)]"
                        >
                            <p className="text-xs text-rw-muted font-medium uppercase tracking-wider mb-1">
                                {k}
                            </p>
                            <p
                                className="font-bold text-base text-rw-ink truncate"
                                title={v as string}
                            >
                                {v}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Accuracy check */}
                <div className="bg-rw-surface-2 p-6 rounded-2xl border border-[var(--rw-border-mid)]">
                    <p className="text-base font-bold text-rw-ink mb-4">
                        Is this information accurate?
                    </p>
                    <div className="grid sm:grid-cols-2 gap-4">
                        <RadioCard
                            selected={accurate === true}
                            onClick={() => setAccurate(true)}
                            title="Yes, looks good"
                            desc="Matches my payment"
                        />
                        <RadioCard
                            selected={accurate === false}
                            onClick={() => setAccurate(false)}
                            title="No, it's incorrect"
                            desc="Admin will review manually"
                        />
                    </div>

                    {accurate === false && (
                        <div className="mt-5 p-4 rounded-xl bg-amber-50 border border-amber-200 animate-fade-in-down">
                            <p className="text-sm text-amber-800 font-medium mb-3">
                                We&rsquo;ll flag this for manual review. You can also try
                                uploading a clearer image.
                            </p>
                            <Button
                                variant="outlined"
                                size="sm"
                                onClick={resetUpload}
                                className="bg-white border-amber-200 text-amber-900 hover:bg-amber-100"
                            >
                                Re-upload Receipt
                            </Button>
                        </div>
                    )}
                </div>

                <Button
                    variant="primary"
                    size="lg"
                    onClick={handleConfirm}
                    disabled={accurate === null || submitting}
                    loading={submitting}
                    id="confirm-receipt-btn"
                    className="w-full !h-16 text-lg rounded-2xl"
                >
                    Confirm & Complete
                </Button>
            </div>
        );
    }

    // Analysing state
    if (stage === "analysing") {
        return (
            <div className="rw-card p-16 text-center flex flex-col items-center justify-center gap-6 min-h-[400px] shadow-rw-shadow-md border-t-[3px] border-t-rw-crimson">
                <div className="relative">
                    <span className="h-20 w-20 rounded-full border-4 border-rw-bg-alt border-t-rw-crimson animate-spin absolute inset-0" />
                    <div className="h-20 w-20 flex items-center justify-center">
                        <svg
                            className="h-8 w-8 text-rw-crimson animate-pulse"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                        </svg>
                    </div>
                </div>
                <div>
                    <h3 className="font-display font-bold text-2xl text-rw-ink">
                        Analysing Document
                    </h3>
                    <p className="text-rw-muted mt-2 text-lg">
                        Extracting payment data using AI...
                    </p>
                </div>
            </div>
        );
    }

    // Idle state
    return (
        <div className="rw-card p-6 sm:p-8 flex flex-col gap-8 shadow-rw-shadow-md border-t-[3px] border-t-rw-crimson">
            <div>
                <h2 className="font-display font-bold text-2xl text-rw-ink mb-2">
                    Submit Receipt
                </h2>
                <p className="text-rw-muted text-sm">
                    Upload your proof of payment once the transfer is successful.
                </p>
            </div>

            {/* Payment type selection */}
            <div>
                <p className="text-sm font-semibold text-rw-ink mb-4 uppercase tracking-wider">
                    1. Select Payment Type
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                    <RadioCard
                        selected={paymentType === "full"}
                        onClick={() => setPaymentType("full")}
                        title="Pay in Full"
                        desc={`₦${remaining.toLocaleString()}`}
                    />
                    <RadioCard
                        selected={paymentType === "partial"}
                        onClick={() => setPaymentType("partial")}
                        title="Pay in Part"
                        desc={`Min ${PAYMENT_CONFIG.minPercent}%`}
                    />
                </div>
            </div>

            {/* Partial percentage picker */}
            {paymentType === "partial" && (
                <div className="p-6 rounded-2xl bg-rw-bg-alt border border-[var(--rw-border)] animate-fade-in-down">
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-sm font-semibold text-rw-ink">
                            Select Percentage
                        </p>
                    </div>

                    <div className="flex gap-3 mt-2">
                        {percentChoices.map((percent) => (
                            <button
                                key={percent}
                                type="button"
                                onClick={() => setPartialPercent(percent)}
                                className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                                    partialPercent === percent
                                        ? "bg-rw-ink text-white shadow-md scale-105"
                                        : "bg-white text-rw-text-2 border border-[var(--rw-border-mid)] hover:border-rw-crimson hover:text-rw-crimson"
                                }`}
                            >
                                {percent}%
                            </button>
                        ))}
                    </div>

                    <div className="mt-6 pt-5 border-t border-[var(--rw-border)] flex items-end justify-between">
                        <span className="text-sm font-medium text-rw-text-2">
                            Amount to pay:
                        </span>
                        <span className="font-bold text-3xl text-rw-crimson">
                            ₦{payAmount.toLocaleString()}
                        </span>
                    </div>
                </div>
            )}

            {/* Upload receipt */}
            {paymentType && (
                <div className="animate-fade-in-down">
                    <p className="text-sm font-semibold text-rw-ink mb-4 uppercase tracking-wider">
                        2. Upload Proof
                    </p>
                    <label
                        htmlFor="receipt-upload"
                        className="flex flex-col items-center justify-center gap-4 rounded-[2rem] border-2 border-dashed border-[var(--rw-border-strong)] bg-rw-bg-warm p-12 cursor-pointer hover:border-rw-crimson hover:bg-rw-crimson/5 transition-all group"
                    >
                        {file ? (
                            <div className="text-center">
                                <div className="h-16 w-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                    <svg
                                        className="h-8 w-8"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth={2.5}
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                        />
                                    </svg>
                                </div>
                                <p className="text-base font-bold text-rw-ink">
                                    {file.name}
                                </p>
                                <p className="text-sm font-medium text-rw-crimson mt-2">
                                    Click to replace file
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="h-16 w-16 bg-white border border-[var(--rw-border)] text-rw-muted rounded-2xl flex items-center justify-center shadow-sm group-hover:text-rw-crimson group-hover:border-rw-crimson/30 group-hover:-translate-y-2 transition-all">
                                    <svg
                                        className="h-8 w-8"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth={1.5}
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
                                        />
                                    </svg>
                                </div>
                                <div className="text-center">
                                    <p className="text-base font-semibold text-rw-ink">
                                        Click to upload receipt
                                    </p>
                                    <p className="text-sm text-rw-muted mt-1">
                                        or drag and drop it here
                                    </p>
                                </div>
                                <p className="text-xs font-medium px-3 py-1 bg-white rounded-md text-rw-muted border border-[var(--rw-border)]">
                                    JPG, PNG, PDF (Max 6MB)
                                </p>
                            </>
                        )}
                        <input
                            id="receipt-upload"
                            type="file"
                            accept="image/*,application/pdf"
                            className="sr-only"
                            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                        />
                    </label>
                </div>
            )}

            {paymentType && (
                <div className="pt-4 border-t border-[var(--rw-border)] animate-fade-in-down">
                    <Button
                        variant="primary"
                        size="lg"
                        onClick={handleUpload}
                        disabled={!file}
                        id="submit-receipt-btn"
                        className="w-full !h-16 text-lg rounded-2xl shadow-rw-shadow-crimson"
                    >
                        Analyse & Submit Receipt
                    </Button>
                </div>
            )}
        </div>
    );
}
