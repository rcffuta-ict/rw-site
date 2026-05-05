"use client";

import React, { useState } from "react";
import { Payment } from "@/lib/data/types";
import { PaymentStatusBadge } from "../ui/Badge";
import { Card } from "../ui/cards/Card";
import { Button } from "../ui/forms/Button";

interface PaymentReviewCardProps {
    payment: Payment;
    onApprove: (id: string) => void;
    onFlag: (id: string, note: string) => void;
    onReject: (id: string, note: string) => void;
}

export function PaymentReviewCard({ payment, onApprove, onFlag, onReject }: PaymentReviewCardProps) {
    const [note, setNote] = useState(payment.reviewNote || "");
    const [isActioning, setIsActioning] = useState(false);

    const handleAction = async (action: () => void) => {
        setIsActioning(true);
        // Simulate network delay
        await new Promise(r => setTimeout(r, 600));
        action();
        setIsActioning(false);
    };

    return (
        <Card className="overflow-hidden border-[var(--rw-border-mid)] shadow-md">
            <div className="p-5 flex flex-col gap-5">
                {/* Header Info */}
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="font-mono font-bold text-xl text-rw-crimson">₦{payment.amountClaimed.toLocaleString()}</p>
                        <p className="text-[10px] font-bold text-rw-muted uppercase tracking-wider mt-1">
                            {payment.percentOfTotal}% of order total · {new Date(payment.createdAt).toLocaleString("en-NG", { dateStyle: "medium", timeStyle: "short" })}
                        </p>
                    </div>
                    <PaymentStatusBadge status={payment.status} />
                </div>

                <div className="grid md:grid-cols-[160px_1fr] gap-5">
                    {/* Receipt Image Placeholder */}
                    <div className="img-placeholder h-32 rounded-xl border border-[var(--rw-border)] relative group cursor-pointer overflow-hidden">
                        <span className="relative z-10 text-[10px] font-bold text-rw-muted/40 uppercase tracking-widest group-hover:text-rw-crimson/50 transition-colors">Receipt View</span>
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                    </div>

                    {/* AI Extraction Results */}
                    <div className="rounded-xl border border-[var(--rw-border)] bg-rw-bg-alt/40 p-4">
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                            <span className="text-[10px] font-bold text-rw-muted uppercase tracking-widest">AI Extraction Analysis</span>
                            <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold border uppercase tracking-tight
                                ${payment.extractionConfidence === "high" ? "bg-green-50 text-green-700 border-green-200"
                                : payment.extractionConfidence === "medium" ? "bg-amber-50 text-amber-700 border-amber-200"
                                : "bg-red-50 text-red-700 border-red-200"}
                            `}>
                                {payment.extractionConfidence} Confidence
                            </span>
                            {payment.userConfirmedAccuracy === false && (
                                <span className="rounded-full px-2 py-0.5 text-[9px] font-bold border border-red-200 bg-red-50 text-red-600 uppercase tracking-tight animate-pulse">
                                    User Flagged Error
                                </span>
                            )}
                        </div>

                        <dl className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-3 text-[13px]">
                            {[
                                { k: "Sender", v: payment.extractedSenderName },
                                { k: "Extracted Amount", v: payment.extractedAmount ? `₦${payment.extractedAmount.toLocaleString()}` : null },
                                { k: "Bank", v: payment.extractedBank },
                                { k: "Date", v: payment.extractedDate },
                                { k: "Time", v: payment.extractedTime },
                                { k: "Amount Match", v: payment.amountMatch ? "✓ Yes" : "× No", isError: !payment.amountMatch },
                            ].map((item, i) => (
                                <div key={i}>
                                    <dt className="text-[10px] font-bold text-rw-muted uppercase tracking-tight mb-0.5">{item.k}</dt>
                                    <dd className={`font-semibold truncate ${item.isError ? "text-rw-crimson" : "text-rw-ink"}`}>
                                        {item.v ?? "—"}
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                </div>

                {/* Status-specific actions and notes */}
                <div className="pt-4 border-t border-[var(--rw-border)] flex flex-col gap-4">
                    {payment.status === "pending" || payment.status === "flagged" ? (
                        <>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-bold text-rw-muted uppercase tracking-widest">Admin Note</label>
                                <textarea
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    placeholder="Add a note for the review..."
                                    className="w-full h-16 rounded-lg border border-[var(--rw-border-mid)] bg-rw-bg px-3 py-2 text-xs text-rw-ink focus:outline-none focus:border-rw-crimson transition-all resize-none"
                                />
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <Button
                                    variant="primary"
                                    size="sm"
                                    className="bg-green-600 hover:bg-green-700"
                                    disabled={isActioning}
                                    onClick={() => handleAction(() => onApprove(payment.id))}
                                >
                                    Approve Payment
                                </Button>
                                <Button
                                    variant="outlined"
                                    size="sm"
                                    className="text-amber-700 border-amber-300 hover:bg-amber-50"
                                    disabled={isActioning}
                                    onClick={() => handleAction(() => onFlag(payment.id, note))}
                                >
                                    Flag for Review
                                </Button>
                                <Button
                                    variant="outlined"
                                    size="sm"
                                    className="text-red-600 border-red-200 hover:bg-red-50"
                                    disabled={isActioning}
                                    onClick={() => handleAction(() => onReject(payment.id, note))}
                                >
                                    Reject Payment
                                </Button>
                            </div>
                        </>
                    ) : (
                        <div className="bg-rw-bg-alt/50 rounded-lg px-4 py-3 border border-[var(--rw-border)]">
                            <p className="text-[10px] font-bold text-rw-muted uppercase tracking-widest mb-1">Final Decision Note</p>
                            <p className="text-sm text-rw-text-2 italic">
                                {payment.reviewNote || "No decision note provided."}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
}
