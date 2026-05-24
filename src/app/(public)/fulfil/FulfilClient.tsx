"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import type { Order } from "@/lib/data/types";

import { LookupForm } from "./components/LookupForm";
import { OrderSummary } from "./components/OrderSummary";
import { PaymentHistory } from "./components/PaymentHistory";
import { TransferDetails } from "./components/TransferDetails";
import { PaymentFlow } from "./components/PaymentFlow";
import { PAYMENT_CONFIG } from "@/lib/config";

function FulfilContent() {
    const params = useSearchParams();
    const router = useRouter();
    const [order, setOrder] = useState<Order | null>(null);
    const [refInput, setRefInput] = useState(params.get("ref") ?? "");
    const [paymentStage, setPaymentStage] = useState<
        "idle" | "analysing" | "preview" | "done"
    >("idle");
    const [countdown, setCountdown] = useState(3);

    useEffect(() => {
        (() => {
            if (paymentStage === "done") {
                const interval = setInterval(() => {
                    setCountdown((prev) => (prev > 1 ? prev - 1 : 1));
                }, 1000);

                const timer = setTimeout(() => {
                    // Clear state
                    setOrder(null);
                    setRefInput("");
                    setPaymentStage("idle");
                    // Redirect to /fulfil
                    router.replace("/fulfil");
                }, 3000);

                return () => {
                    clearInterval(interval);
                    clearTimeout(timer);
                };
            } else {
                setCountdown(3);
            }
        })();
    }, [paymentStage, router]);

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

    if (paymentStage === "done") {
        return (
            <div className="fixed inset-0 z-[100] bg-rw-surface-1/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-fade-in select-none">
                <div className="relative mb-8">
                    {/* Glowing outer ring */}
                    <div className="absolute inset-0 rounded-[2.5rem] bg-green-500/10 blur-xl animate-pulse" />
                    {/* Satisfying check badge */}
                    <div className="relative h-24 w-24 bg-gradient-to-tr from-green-500 to-emerald-400 text-white rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-green-500/30 border border-white/20 transform hover:scale-105 transition-transform duration-300">
                        <svg
                            className="h-12 w-12 animate-scale-in"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={3.5}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    </div>
                </div>

                <h1 className="font-display font-black text-4xl sm:text-5xl text-rw-ink mb-4 tracking-tight">
                    Payment Submitted!
                </h1>

                <p className="text-rw-muted font-medium text-lg max-w-[420px] mb-8 leading-relaxed">
                    Your receipt has been successfully uploaded. Redemption Week
                    administrators will review and approve it shortly.
                </p>

                <div className="flex flex-col items-center gap-6 w-full max-w-sm">
                    {/* Visual Progress Bar */}
                    <div className="w-48 h-1 bg-[var(--rw-border)] rounded-full overflow-hidden relative">
                        <div
                            className="h-full bg-emerald-500 transition-all duration-1000 ease-linear rounded-full"
                            style={{ width: `${(countdown / 3) * 100}%` }}
                        />
                    </div>

                    <p className="text-sm font-bold text-rw-text-2 flex items-center gap-2.5 uppercase tracking-widest">
                        Redirecting in {countdown}s...
                    </p>

                    <button
                        onClick={() => {
                            setOrder(null);
                            setRefInput("");
                            setPaymentStage("idle");
                            router.replace("/fulfil");
                        }}
                        className="mt-2 px-6 py-2.5 bg-rw-ink text-white hover:bg-rw-crimson rounded-full font-bold text-sm tracking-wide shadow-md transition-all duration-300 transform hover:-translate-y-0.5"
                    >
                        Return to Lookup
                    </button>
                </div>
            </div>
        );
    }

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
                    <TransferDetails orderRef={order.orderRef} />

                    {/* Payment form */}
                    <PaymentFlow
                        order={order}
                        onResetOrder={handleResetOrder}
                        onStageChange={setPaymentStage}
                    />
                </div>
            </div>

            {/* Support Contacts */}
            <div className="mt-16 text-center text-rw-muted text-sm font-medium border-t border-[var(--rw-border)] pt-8">
                <p className="mb-3">
                    Need help or facing issues with your payment? Contact our support team
                    via WhatsApp:
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                    {PAYMENT_CONFIG.supportContacts.map((c) => (
                        <a
                            key={c.phone}
                            href={`https://wa.me/${c.phone}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-rw-ink hover:text-rw-crimson transition-colors bg-rw-surface-1 px-4 py-2 rounded-full border border-[var(--rw-border)] shadow-sm font-semibold"
                        >
                            <svg
                                className="w-5 h-5 text-green-500"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                            </svg>
                            {c.name}
                        </a>
                    ))}
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
