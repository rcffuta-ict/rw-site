"use client";

import React from "react";
import type { OrderStatus } from "@/lib/data/types";

const STATUS_CONFIG: Record<
    string,
    { label: string; icon: string; color: string; bg: string; message: string }
> = {
    pending: {
        label: "Pending",
        icon: "⏳",
        color: "#9a8085",
        bg: "#fdf5f5",
        message: "Your order is registered. Please make payment to proceed.",
    },
    partially_paid: {
        label: "Partial",
        icon: "💳",
        color: "#b84500",
        bg: "#fff5ee",
        message: "Partial payment received. Complete payment to confirm your order.",
    },
    paid: {
        label: "Paid",
        icon: "✅",
        color: "#015500",
        bg: "#f0fff5",
        message: "Payment confirmed! Your order is being processed.",
    },
    confirmed: {
        label: "Queued",
        icon: "📋",
        color: "#004cb8",
        bg: "#f0f4ff",
        message: "Order confirmed and queued for production.",
    },
    in_production: {
        label: "In Production",
        icon: "🏭",
        color: "#5010aa",
        bg: "#f8f0ff",
        message: "Your merch is being produced — hang tight!",
    },
    ready: {
        label: "Ready",
        icon: "📦",
        color: "#0891b2",
        bg: "#ecfeff",
        message: "Your merch is ready! Await collection instructions.",
    },
    delivered: {
        label: "Delivered",
        icon: "🎉",
        color: "#015500",
        bg: "#f0fff5",
        message: "Order delivered. Enjoy your merch!",
    },
    flagged: {
        label: "Flagged",
        icon: "⚠️",
        color: "#cc0011",
        bg: "#fff0f0",
        message: "There's an issue with your payment. Please reach out to the team.",
    },
    cancelled: {
        label: "Cancelled",
        icon: "✖",
        color: "#9a8085",
        bg: "#fdf5f5",
        message: "This order has been cancelled.",
    },
};

const STATUS_STEPS: OrderStatus[] = [
    "pending",
    "partially_paid",
    "paid",
    "confirmed",
    "in_production",
    "ready",
    "delivered",
];

const STEP_LABELS = [
    "Placed",
    "Part-Paid",
    "Paid",
    "Queued",
    "Production",
    "Ready",
    "Delivered",
];

interface StatusTimelineProps {
    status: OrderStatus;
    className?: string;
}

export function StatusTimeline({ status, className = "" }: StatusTimelineProps) {
    const currentIdx = STATUS_STEPS.indexOf(status);
    const isCancelled = status === "cancelled";
    const isFlagged = status === "flagged";

    if (isCancelled || isFlagged) {
        const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
        return (
            <div
                className={`rounded-2xl p-5 text-sm font-semibold flex items-center gap-3 border shadow-sm ${className}`}
                style={{
                    backgroundColor: cfg.bg,
                    color: cfg.color,
                    borderColor: `${cfg.color}25`,
                }}
            >
                <span className="text-2xl shrink-0">{cfg.icon}</span>
                <span>{cfg.message}</span>
            </div>
        );
    }

    return (
        <div
            className={`rounded-2xl border border-[var(--rw-border)] bg-white p-6 shadow-sm hover:shadow-md transition-shadow duration-300 ${className}`}
        >
            <div className="flex items-center gap-2 mb-6">
                <span className="h-1.5 w-1.5 rounded-full bg-rw-crimson animate-ping" />
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-rw-muted">
                    Order Status Progress
                </p>
            </div>
            <div className="flex items-center w-full">
                {STATUS_STEPS.map((step, i) => {
                    const done = i <= currentIdx;
                    const active = i === currentIdx;
                    const isLast = i === STATUS_STEPS.length - 1;
                    return (
                        <div
                            key={step}
                            className="flex items-center flex-1 last:flex-initial"
                        >
                            <div className="flex flex-col items-center gap-2 group relative">
                                <div
                                    className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                                        done
                                            ? "bg-rw-crimson text-white shadow-[0_2px_8px_rgba(255,0,21,0.25)]"
                                            : "bg-rw-bg-alt text-rw-muted border border-[var(--rw-border)]"
                                    } ${
                                        active
                                            ? "ring-4 ring-rw-crimson/15 scale-110"
                                            : ""
                                    }`}
                                >
                                    {done && !active ? (
                                        <svg
                                            className="h-4 w-4"
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
                                    ) : (
                                        <span>{i + 1}</span>
                                    )}
                                </div>
                                <span
                                    className={`text-[9px] font-bold uppercase tracking-wide text-center absolute -bottom-5 whitespace-nowrap left-1/2 -translate-x-1/2 transition-colors duration-300 ${
                                        done
                                            ? "text-rw-crimson font-extrabold"
                                            : "text-rw-muted"
                                    }`}
                                >
                                    {STEP_LABELS[i]}
                                </span>
                            </div>
                            {!isLast && (
                                <div
                                    className="flex-1 h-0.5 -mt-3.5 mx-2 rounded transition-all duration-500"
                                    style={{
                                        background:
                                            i < currentIdx
                                                ? "var(--rw-crimson)"
                                                : "var(--rw-border)",
                                    }}
                                />
                            )}
                        </div>
                    );
                })}
            </div>
            {/* Spacing element for the absolute positioned labels */}
            <div className="h-4" />
        </div>
    );
}
