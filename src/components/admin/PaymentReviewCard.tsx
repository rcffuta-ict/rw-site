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

export function PaymentReviewCard({ payment }: PaymentReviewCardProps) {
    const amountMatch = payment.extractedAmount === payment.amountConfirmed;

    return (
        <Card className="overflow-hidden border-[var(--rw-border-mid)] shadow-md">
            <div className="p-5 flex flex-col gap-5">
                {/* Header Info */}
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="font-mono font-bold text-xl text-rw-crimson">
                            ₦{payment.extractedAmount.toLocaleString()}
                        </p>
                        <p className="text-[10px] font-bold text-rw-muted uppercase tracking-wider mt-1">
                            {new Date(payment.createdAt).toLocaleString("en-NG", {
                                dateStyle: "medium",
                                timeStyle: "short",
                            })}
                        </p>
                    </div>
                    <PaymentStatusBadge status={payment.status} />
                </div>

                <div className="grid md:grid-cols-[160px_1fr] gap-5">
                    {/* Receipt Image Placeholder */}
                    <div className="img-placeholder h-32 rounded-xl border border-[var(--rw-border)] relative group cursor-pointer overflow-hidden">
                        <span className="relative z-10 text-[10px] font-bold text-rw-muted/40 uppercase tracking-widest group-hover:text-rw-crimson/50 transition-colors">
                            Receipt View
                        </span>
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                    </div>

                    {/* AI Extraction Results */}
                    <div className="rounded-xl border border-[var(--rw-border)] bg-rw-bg-alt/40 p-4">
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                            <span className="text-[10px] font-bold text-rw-muted uppercase tracking-widest">
                                AI Extraction Analysis
                            </span>
                            <span
                                className={`rounded-full px-2 py-0.5 text-[9px] font-bold border uppercase tracking-tight
                                ${
                                    payment.extractionConfidence === "high"
                                        ? "bg-green-50 text-green-700 border-green-200"
                                        : payment.extractionConfidence === "medium"
                                          ? "bg-amber-50 text-amber-700 border-amber-200"
                                          : "bg-red-50 text-red-700 border-red-200"
                                }
                            `}
                            >
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
                                {
                                    k: "Extracted Amount",
                                    v: payment.extractedAmount
                                        ? `₦${payment.extractedAmount.toLocaleString()}`
                                        : null,
                                },
                                { k: "Bank", v: payment.extractedBank },
                                { k: "Date", v: payment.extractedDate },
                                { k: "Time", v: payment.extractedTime },
                                {
                                    k: "Amount Match",
                                    v: amountMatch ? "✓ Yes" : "× No",
                                    isError: !amountMatch,
                                },
                            ].map((item, i) => (
                                <div key={i}>
                                    <dt className="text-[10px] font-bold text-rw-muted uppercase tracking-tight mb-0.5">
                                        {item.k}
                                    </dt>
                                    <dd
                                        className={`font-semibold truncate ${item.isError ? "text-rw-crimson" : "text-rw-ink"}`}
                                    >
                                        {item.v ?? "—"}
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                </div>
            </div>
        </Card>
    );
}
