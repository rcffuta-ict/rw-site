"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import type { Order } from "@/lib/data/types";

import { LookupForm } from "./components/LookupForm";
import { OrderSummary } from "./components/OrderSummary";
import { PaymentHistory } from "./components/PaymentHistory";
import { TransferDetails } from "./components/TransferDetails";
import { PaymentFlow } from "./components/PaymentFlow";
import { PaymentTutorialModal } from "@/components/public/PaymentTutorialModal";
import { PAYMENT_CONFIG } from "@/lib/config";
import type { GlobalSettings } from "@/lib/services/settings.service";

function WhatsAppIcon({ className = "w-5 h-5" }: { className?: string }) {
    return (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
    );
}

const NEXT_STEPS = [
    {
        n: "1",
        title: "Transfer & upload",
        desc: "Send your transfer to the account above, then upload your receipt right here on this page.",
    },
    {
        n: "2",
        title: "We verify it",
        desc: "Our finance admin, Sis. Mercy, reviews every payment by hand — so approval isn't instant.",
    },
    {
        n: "3",
        title: "You're approved",
        desc: "Once confirmed, your order status updates. Track it anytime under My Orders.",
    },
];

function FulfilContent({ settings }: { settings: GlobalSettings }) {
    const params = useSearchParams();
    const router = useRouter();
    const [order, setOrder] = useState<Order | null>(null);
    const [refInput, setRefInput] = useState(params.get("ref") ?? "");
    const [paymentStage, setPaymentStage] = useState<
        "idle" | "analysing" | "preview" | "done"
    >("idle");
    const REDIRECT_SECONDS = 6;
    const [countdown, setCountdown] = useState(REDIRECT_SECONDS);
    const [tutorialOpen, setTutorialOpen] = useState(false);

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
                }, REDIRECT_SECONDS * 1000);

                return () => {
                    clearInterval(interval);
                    clearTimeout(timer);
                };
            } else {
                setCountdown(REDIRECT_SECONDS);
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

                <p className="text-rw-muted font-medium text-lg max-w-[460px] mb-4 leading-relaxed">
                    Your receipt is uploaded and now{" "}
                    <strong className="text-rw-ink">awaiting approval</strong>. Sis. Mercy
                    reviews each payment by hand, so it may take a little while — you can
                    track the status under{" "}
                    <strong className="text-rw-ink">My Orders</strong>.
                </p>
                <p className="text-rw-muted/80 text-sm max-w-[420px] mb-8 leading-relaxed">
                    No need to send your receipt anywhere else — we never collect receipts
                    in DMs.
                </p>

                <div className="flex flex-col items-center gap-6 w-full max-w-sm">
                    {/* Visual Progress Bar */}
                    <div className="w-48 h-1 bg-[var(--rw-border)] rounded-full overflow-hidden relative">
                        <div
                            className="h-full bg-emerald-500 transition-all duration-1000 ease-linear rounded-full"
                            style={{ width: `${(countdown / REDIRECT_SECONDS) * 100}%` }}
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
                    <TransferDetails orderRef={order.orderRef} settings={settings} />

                    {/* Payment form */}
                    <PaymentFlow
                        order={order}
                        onResetOrder={handleResetOrder}
                        onStageChange={setPaymentStage}
                        settings={settings}
                    />
                </div>
            </div>

            {/* Payment Tutorial Modal */}
            <PaymentTutorialModal
                isOpen={tutorialOpen}
                onClose={() => setTutorialOpen(false)}
            />

            {/* ── Guidance + Support ──────────────────────────────────────── */}
            <div className="my-16 border-t border-[var(--rw-border)] pt-12 space-y-10">
                {/* What happens next */}
                <div>
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
                        <div>
                            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#FF6A00] mb-2">
                                After your transfer
                            </p>
                            <h3 className="font-display font-bold text-2xl text-rw-ink">
                                What happens next?
                            </h3>
                        </div>
                        <button
                            onClick={() => setTutorialOpen(true)}
                            className="inline-flex items-center gap-2 px-5 h-11 rounded-xl font-bold text-sm
                                       border-2 border-rw-ink text-rw-ink bg-white
                                       hover:bg-rw-ink hover:text-white transition-all whitespace-nowrap self-start sm:self-auto"
                        >
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"
                                />
                            </svg>
                            Watch the walkthrough
                        </button>
                    </div>

                    <div data-reveal-group className="grid sm:grid-cols-3 gap-4">
                        {NEXT_STEPS.map((s) => (
                            <div
                                key={s.n}
                                data-reveal="up"
                                className="rw-card p-5 flex flex-col gap-3"
                            >
                                <span className="h-9 w-9 rounded-xl bg-[#FF0015]/10 text-rw-crimson font-display font-extrabold flex items-center justify-center">
                                    {s.n}
                                </span>
                                <div>
                                    <p className="font-bold text-rw-ink text-sm mb-1">
                                        {s.title}
                                    </p>
                                    <p className="text-sm text-rw-muted leading-relaxed">
                                        {s.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Manual approval + no-DM-receipts note */}
                <div className="rounded-2xl border border-[#FF6A00]/30 bg-[#fff8f0] p-6 md:p-7">
                    <div className="flex items-start gap-4">
                        <span className="shrink-0 h-10 w-10 rounded-xl bg-[#FF6A00]/15 text-[#FF6A00] flex items-center justify-center">
                            <svg
                                className="h-5 w-5"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={1.8}
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                />
                            </svg>
                        </span>
                        <div className="min-w-0">
                            <p className="font-bold text-rw-ink mb-1.5">
                                Approvals are done manually — kindly be patient
                            </p>
                            <p className="text-sm text-rw-text-2 leading-relaxed">
                                Once you upload your receipt, your payment joins a review
                                queue. Our finance admin{" "}
                                <strong className="text-rw-ink">Sis. Mercy</strong>{" "}
                                verifies each one by hand, so it won&rsquo;t be approved
                                instantly. If it&rsquo;s taking unusually long, message
                                her on WhatsApp below and she&rsquo;ll help.
                            </p>

                            <div className="mt-4 rounded-xl bg-[#FF0015]/5 border border-[#FF0015]/15 p-4">
                                <p className="text-sm font-bold text-rw-crimson flex items-center gap-2">
                                    <span aria-hidden>⚠️</span>
                                    We never collect payment receipts in DMs
                                </p>
                                <p className="text-sm text-rw-text-2 leading-relaxed mt-1.5">
                                    Please upload your receipt here on this page —{" "}
                                    <strong className="text-rw-ink">never</strong> send it
                                    over WhatsApp or social media DMs. For the full
                                    process, read our{" "}
                                    <Link
                                        href="/docs"
                                        className="font-semibold text-rw-crimson underline underline-offset-2 hover:text-rw-ink transition-colors"
                                    >
                                        Payment Guide
                                    </Link>{" "}
                                    and{" "}
                                    <Link
                                        href="/terms"
                                        className="font-semibold text-rw-crimson underline underline-offset-2 hover:text-rw-ink transition-colors"
                                    >
                                        Terms of Use
                                    </Link>
                                    .
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* WhatsApp contacts */}
                <div>
                    <p className="text-center text-sm text-rw-muted font-medium mb-4">
                        Have a question or your approval is delayed? Reach our team on
                        WhatsApp.
                    </p>
                    <div className="flex flex-col sm:flex-row items-stretch justify-center gap-3 max-w-2xl mx-auto">
                        {/* Primary — Sis. Mercy (approvals) */}
                        <a
                            href={`https://wa.me/${PAYMENT_CONFIG.supportContacts[0].phone}?text=${encodeURIComponent(
                                `Hi Sis. Mercy, I made a payment for my Redemption Week order (Ref: ${order.orderRef}) and wanted to follow up on the approval.`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex-1 flex items-center gap-3 rounded-2xl bg-[#1C0003] text-white px-5 py-4
                                       shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
                        >
                            <span className="shrink-0 h-10 w-10 rounded-xl bg-[#25D366]/20 text-[#25D366] flex items-center justify-center">
                                <WhatsAppIcon />
                            </span>
                            <span className="min-w-0">
                                <span className="block text-[11px] font-semibold uppercase tracking-wider text-white/50">
                                    Payment approvals
                                </span>
                                <span className="block font-bold leading-tight text-rw-bg-alt">
                                    Chat with Sis. Mercy
                                </span>
                            </span>
                            <svg
                                className="ml-auto h-5 w-5 text-white/40 group-hover:text-white transition-colors shrink-0"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M9 5l7 7-7 7"
                                />
                            </svg>
                        </a>

                        {/* Secondary — technical help */}
                        <a
                            href={`https://wa.me/${PAYMENT_CONFIG.supportContacts[1].phone}?text=${encodeURIComponent(
                                `Hi, I need technical help with my Redemption Week payment (Ref: ${order.orderRef}).`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex-1 flex items-center gap-3 rounded-2xl bg-white text-rw-ink px-5 py-4
                                       border border-[var(--rw-border)] shadow-sm hover:border-rw-ink hover:-translate-y-0.5 transition-all"
                        >
                            <span className="shrink-0 h-10 w-10 rounded-xl bg-[#25D366]/15 text-[#25D366] flex items-center justify-center">
                                <WhatsAppIcon />
                            </span>
                            <span className="min-w-0">
                                <span className="block text-[11px] font-semibold uppercase tracking-wider text-rw-muted">
                                    Technical help
                                </span>
                                <span className="block font-bold leading-tight">
                                    ICT Support
                                </span>
                            </span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function FulfilClient({ settings }: { settings: GlobalSettings }) {
    return (
        <Suspense
            fallback={
                <div className="min-h-[80vh] flex items-center justify-center">
                    <span className="h-10 w-10 rounded-full border-3 border-[var(--rw-border)] border-t-rw-crimson animate-spin" />
                </div>
            }
        >
            <FulfilContent settings={settings} />
        </Suspense>
    );
}
