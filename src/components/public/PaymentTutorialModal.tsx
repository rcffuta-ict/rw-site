"use client";

import { useState } from "react";
import { Button } from "@/components/ui/forms/Button";

type TutorialStep = "intro" | "transfer" | "upload" | "verify" | "complete";

interface PaymentTutorialModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function PaymentTutorialModal({ isOpen, onClose }: PaymentTutorialModalProps) {
    const [currentStep, setCurrentStep] = useState<TutorialStep>("intro");

    const steps: { id: TutorialStep; label: string }[] = [
        { id: "intro", label: "Overview" },
        { id: "transfer", label: "Transfer" },
        { id: "upload", label: "Upload" },
        { id: "verify", label: "Verify" },
        { id: "complete", label: "Complete" },
    ];

    const stepOrder: TutorialStep[] = [
        "intro",
        "transfer",
        "upload",
        "verify",
        "complete",
    ];
    const currentIndex = stepOrder.indexOf(currentStep);

    const goNext = () => {
        if (currentIndex < stepOrder.length - 1) {
            setCurrentStep(stepOrder[currentIndex + 1]);
        }
    };

    const goPrev = () => {
        if (currentIndex > 0) {
            setCurrentStep(stepOrder[currentIndex - 1]);
        }
    };

    const handleClose = () => {
        setCurrentStep("intro");
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-4">
            <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-rw-crimson/10 to-rw-crimson/5 border-b border-[var(--rw-border)] p-6 flex items-center justify-between">
                    <div>
                        <h2 className="font-display font-bold text-2xl text-rw-ink">
                            Payment Tutorial
                        </h2>
                        <p className="text-sm text-rw-text-2 mt-1">
                            Step {currentIndex + 1} of {stepOrder.length}
                        </p>
                    </div>
                    <button
                        onClick={handleClose}
                        className="text-rw-muted hover:text-rw-ink transition-colors text-2xl leading-none"
                        aria-label="Close"
                    >
                        ✕
                    </button>
                </div>

                {/* Progress */}
                <div className="px-6 pt-6 pb-4">
                    <div className="flex items-center justify-between gap-2 mb-4">
                        {steps.map((step, idx) => (
                            <div key={step.id} className="flex items-center flex-1">
                                <button
                                    onClick={() => setCurrentStep(step.id)}
                                    className={`flex-shrink-0 h-10 w-10 rounded-full font-bold text-xs transition-all ${
                                        currentStep === step.id
                                            ? "bg-rw-crimson text-white shadow-lg ring-4 ring-rw-crimson/20"
                                            : idx < currentIndex
                                              ? "bg-green-500 text-white"
                                              : "bg-rw-bg-alt text-rw-muted border-2 border-[var(--rw-border)]"
                                    }`}
                                >
                                    {idx < currentIndex ? "✓" : idx + 1}
                                </button>
                                {idx < steps.length - 1 && (
                                    <div
                                        className={`h-1 flex-1 mx-1 rounded-full ${
                                            idx < currentIndex
                                                ? "bg-green-500"
                                                : "bg-rw-bg-alt"
                                        }`}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                    <p className="text-xs text-rw-text-2 text-center">
                        {steps[currentIndex]?.label}
                    </p>
                </div>

                {/* Content */}
                <div className="px-6 pb-6 space-y-6">
                    {currentStep === "intro" && (
                        <div className="space-y-6 animate-fade-in">
                            <div>
                                <h3 className="font-display font-bold text-2xl text-rw-ink mb-4">
                                    Payment Tutorial
                                </h3>
                                <p className="text-rw-text-2 leading-relaxed mb-4">
                                    In this tutorial, you&apos;ll learn the complete
                                    process of paying for your order using bank transfer
                                    and submitting proof of payment through our platform.
                                </p>
                                <p className="text-rw-text-2 leading-relaxed">
                                    By the end, you&apos;ll be able to submit your payment
                                    confidently. Let&apos;s get started!
                                </p>
                            </div>

                            <div className="grid gap-4">
                                {[
                                    {
                                        icon: "🏦",
                                        title: "Bank Transfer",
                                        desc: "Learn where and how to send your payment",
                                    },
                                    {
                                        icon: "📸",
                                        title: "Upload Receipt",
                                        desc: "Submit your payment proof as an image",
                                    },
                                    {
                                        icon: "✓",
                                        title: "Verification",
                                        desc: "Understand how we verify your payment",
                                    },
                                ].map((item) => (
                                    <div
                                        key={item.title}
                                        className="flex gap-4 p-4 bg-rw-bg-alt rounded-lg"
                                    >
                                        <div className="text-2xl flex-shrink-0">
                                            {item.icon}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-rw-ink">
                                                {item.title}
                                            </p>
                                            <p className="text-sm text-rw-text-2">
                                                {item.desc}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {currentStep === "transfer" && (
                        <div className="space-y-4 animate-fade-in">
                            <h3 className="font-display font-bold text-2xl text-rw-ink">
                                Step 1: Bank Transfer
                            </h3>
                            <p className="text-rw-text-2">
                                Transfer the required amount to our verified bank account.
                                Here&apos;s where to send your payment:
                            </p>

                            <div className="bg-rw-bg-alt p-6 rounded-lg space-y-3">
                                <div>
                                    <p className="text-xs text-rw-muted uppercase tracking-wide">
                                        Bank
                                    </p>
                                    <p className="font-bold text-rw-ink">
                                        [Whatever was Stated]
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-rw-muted uppercase tracking-wide">
                                        Account Name
                                    </p>
                                    <p className="font-bold text-rw-ink">
                                        [Whatever was Stated]
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-rw-muted uppercase tracking-wide">
                                        Account Number
                                    </p>
                                    <p className="font-mono text-lg font-bold text-rw-crimson">
                                        [Whatever was Stated]
                                    </p>
                                </div>
                            </div>

                            <div className="bg-blue-50 p-4 rounded-lg">
                                <p className="text-sm text-blue-900 font-semibold mb-2">
                                    💡 Pro Tips:
                                </p>
                                <ul className="text-sm text-blue-800 space-y-1">
                                    <li>
                                        • Include your order reference in the transfer
                                        narration
                                    </li>
                                    <li>
                                        • Use banks like OPAY, KUDA, Access Bank, or
                                        GTBank for clear receipts
                                    </li>
                                    <li>• Keep the receipt screenshot for submission</li>
                                </ul>
                            </div>
                        </div>
                    )}

                    {currentStep === "upload" && (
                        <div className="space-y-4 animate-fade-in">
                            <h3 className="font-display font-bold text-2xl text-rw-ink">
                                Step 2: Upload Receipt
                            </h3>
                            <p className="text-rw-text-2">
                                After making your bank transfer, take a screenshot or
                                photo of your receipt and upload it here.
                            </p>

                            <div className="border-2 border-dashed border-rw-crimson/30 rounded-lg p-8 text-center">
                                <div className="text-4xl mb-2">📸</div>
                                <p className="font-semibold text-rw-ink mb-1">
                                    Click to upload or drag &amp; drop
                                </p>
                                <p className="text-sm text-rw-text-2">
                                    JPG, PNG or any common image format (Max 6MB)
                                </p>
                            </div>

                            <div className="bg-green-50 p-4 rounded-lg">
                                <p className="text-sm text-green-900 font-semibold mb-2">
                                    ✓ What makes a good receipt:
                                </p>
                                <ul className="text-sm text-green-800 space-y-1">
                                    <li>• Clear, readable text</li>
                                    <li>• Shows sender, amount, date, and recipient</li>
                                    <li>
                                        • Full screenshot of the transfer confirmation
                                    </li>
                                    <li>• Taken recently (not old receipts)</li>
                                </ul>
                            </div>
                        </div>
                    )}

                    {currentStep === "verify" && (
                        <div className="space-y-4 animate-fade-in">
                            <h3 className="font-display font-bold text-2xl text-rw-ink">
                                Step 3: System Verification
                            </h3>
                            <p className="text-rw-text-2">
                                Once you upload your receipt, our system automatically
                                extracts the payment details.
                            </p>

                            <div className="space-y-3">
                                {[
                                    "Sender name",
                                    "Amount transferred",
                                    "Date and time",
                                    "Bank and reference",
                                ].map((detail) => (
                                    <div
                                        key={detail}
                                        className="flex items-center gap-3 p-3 bg-rw-bg-alt rounded-lg"
                                    >
                                        <div className="text-rw-crimson font-bold">✓</div>
                                        <p className="text-rw-text-2">{detail}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-amber-50 p-4 rounded-lg">
                                <p className="text-sm text-amber-900 font-semibold mb-2">
                                    ⚠️ What we verify:
                                </p>
                                <ul className="text-sm text-amber-800 space-y-1">
                                    <li>
                                        • Amount matches your order (exact for full
                                        payment)
                                    </li>
                                    <li>• Transfer is to the correct account</li>
                                    <li>• Transfer is recent</li>
                                </ul>
                            </div>
                        </div>
                    )}

                    {currentStep === "complete" && (
                        <div className="space-y-4 animate-fade-in">
                            <h3 className="font-display font-bold text-2xl text-rw-ink">
                                Step 4: Confirmation
                            </h3>
                            <p className="text-rw-text-2">
                                After verification, your payment status updates and the
                                Merch Committee is notified.
                            </p>

                            <div className="space-y-3">
                                {[
                                    {
                                        step: "1",
                                        desc: "Receipt submitted for review",
                                    },
                                    {
                                        step: "2",
                                        desc: "Merch Committee verifies your receipt",
                                    },
                                    {
                                        step: "3",
                                        desc: "Order status updates to approved",
                                    },
                                    {
                                        step: "4",
                                        desc: "Confirmation email sent to you",
                                    },
                                ].map((item) => (
                                    <div
                                        key={item.step}
                                        className="flex items-start gap-4 p-3 bg-green-50 rounded-lg"
                                    >
                                        <div className="text-green-600 font-bold flex-shrink-0">
                                            {item.step}
                                        </div>
                                        <p className="text-green-800 text-sm">
                                            {item.desc}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-rw-bg-alt p-4 rounded-lg">
                                <p className="text-sm text-rw-text-2 font-semibold">
                                    💡 <strong>Pro Tip:</strong> Check your email
                                    regularly for order updates. The Merch Committee
                                    typically completes verification within 24 hours.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-white border-t border-[var(--rw-border)] p-6 flex gap-3 justify-between">
                    <Button
                        variant="outlined"
                        disabled={currentIndex === 0}
                        onClick={goPrev}
                    >
                        ← Previous
                    </Button>
                    {currentIndex === stepOrder.length - 1 ? (
                        <Button variant="primary" onClick={handleClose}>
                            Done! Close
                        </Button>
                    ) : (
                        <Button variant="primary" onClick={goNext}>
                            Next →
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
