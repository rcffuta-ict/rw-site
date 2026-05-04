"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import type { Order } from "@/lib/data/types";

import { LookupForm } from "./components/LookupForm";
import { OrderSummary } from "./components/OrderSummary";
import { PaymentHistory } from "./components/PaymentHistory";
import { TransferDetails } from "./components/TransferDetails";
import { PaymentFlow } from "./components/PaymentFlow";

function FulfilContent() {
    const params = useSearchParams();
    const router = useRouter();
    const [order, setOrder] = useState<Order | null>(null);
    const [refInput, setRefInput] = useState(params.get("ref") ?? "");
    const [paymentStage, setPaymentStage] = useState<
        "idle" | "analysing" | "preview" | "done"
    >("idle");

    // We can auto-lookup via effect if there's a ref in URL, but LookupForm doesn't auto-fetch inside itself unless triggered.
    // Actually, LookupForm will handle its own ref. We can let the user trigger it, or trigger it via the effect.
    // For simplicity, we just pass the initialRef to LookupForm.

    const handleOrderFound = (foundOrder: Order, ref: string) => {
        setOrder(foundOrder);
        setRefInput(ref);
    };

    const handleResetOrder = () => {
        setOrder(null);
        setRefInput("");
        setPaymentStage("idle");
        router.replace("/fulfil");
    };

    if (!order) {
        return <LookupForm initialRef={refInput} onOrderFound={handleOrderFound} />;
    }

    return (
        <div className="section-container py-8 lg:py-12 relative min-h-[85vh]">
            {/* Sticky Cancellable Pill */}
            <div className="sticky top-20  z-50 flex justify-end mb-8 pointer-events-none">
                <div className="pointer-events-auto flex items-center gap-3 bg-rw-ink/90 backdrop-blur-md text-white rounded-full pl-5 pr-2 py-2 shadow-xl border border-white/10 animate-fade-in-down hover:bg-rw-ink transition-colors">
                    <span className="text-xs sm:text-sm font-medium opacity-70">
                        Order Ref:
                    </span>
                    <span className="font-mono font-bold tracking-widest text-rw-crimson">
                        {order.orderRef}
                    </span>
                    <button
                        onClick={handleResetOrder}
                        className="ml-2 h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all hover:rotate-90"
                        aria-label="Cancel and lookup another order"
                        title="Cancel"
                    >
                        <svg
                            className="h-4 w-4 sm:h-5 sm:w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>
            </div>

            <div className="grid lg:grid-cols-[1fr_1.3fr] gap-8 xl:gap-16 items-start relative">
                {/* LEFT COLUMN: Order Details & History */}
                <div className="flex flex-col gap-6 lg:sticky lg:top-28 animate-fade-in">
                    <OrderSummary order={order} />

                    {/* Payment history */}
                    {paymentStage !== "preview" && paymentStage !== "analysing" && (
                        <PaymentHistory payments={order.payments} />
                    )}
                </div>

                {/* RIGHT COLUMN: Transfer & Submit */}
                <div className="flex flex-col gap-6 animate-slide-in-right">
                    {/* Bank details */}
                    <TransferDetails />

                    {/* Payment form */}
                    <PaymentFlow
                        order={order}
                        onResetOrder={handleResetOrder}
                        onStageChange={setPaymentStage}
                    />
                </div>
            </div>
        </div>
    );
}

export function FulfilClient() {
    return (
        <Suspense
            fallback={
                <div className="min-h-[80vh] flex items-center justify-center">
                    <span className="h-10 w-10 rounded-full border-3 border-[var(--rw-border)] border-t-rw-crimson animate-spin" />
                </div>
            }
        >
            <FulfilContent />
        </Suspense>
    );
}
