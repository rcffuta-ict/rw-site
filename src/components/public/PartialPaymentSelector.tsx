"use client";

import { formatNaira } from "@/lib/utils/functions";
import { useMemo } from "react";

interface PartialPaymentSelectorProps {
    minPayable: number;
    remaining: number;
    selectedAmount: number | "";
    onAmountSelect: (amount: number) => void;
}

/**
 * Generate recommended payment amounts such that the remaining balance
 * after payment will never be less than minPayable.
 *
 * Logic:
 * - If remaining <= minPayable, return [remaining]
 * - Otherwise, generate multiples of minPayable up to (remaining - minPayable)
 * - Each option ensures: remaining - amount >= minPayable
 */
function generatePaymentRecommendations(minPayable: number, remaining: number): number[] {
    if (remaining <= minPayable) {
        return [remaining];
    }

    const recommendations: number[] = [];
    const maxPayable = remaining - minPayable; // Max we can pay and still have >= minPayable left

    let multiple = 1;
    while (true) {
        const amount = minPayable * multiple;
        if (amount > maxPayable) break;
        recommendations.push(amount);
        multiple++;
    }

    return recommendations;
}

export function PartialPaymentSelector({
    minPayable,
    remaining,
    selectedAmount,
    onAmountSelect,
}: PartialPaymentSelectorProps) {
    const recommendations = useMemo(
        () => generatePaymentRecommendations(minPayable, remaining),
        [minPayable, remaining]
    );

    const afterPaymentBalance = useMemo(() => {
        if (typeof selectedAmount === "number") {
            return remaining - selectedAmount;
        }
        return remaining;
    }, [selectedAmount, remaining]);

    return (
        <div className="p-6 rounded-2xl bg-gradient-to-br from-rw-bg-alt to-rw-bg-alt/50 border border-[var(--rw-border)] animate-fade-in-down">
            {/* Header */}
            <div className="mb-6">
                <p className="text-sm font-semibold text-rw-ink mb-1">
                    Recommended Payment Options
                </p>
                <p className="text-xs text-rw-muted">
                    Select an amount. After payment, your balance must remain at least{" "}
                    <span className="font-bold text-rw-crimson">
                        {formatNaira(minPayable)}
                    </span>
                </p>
            </div>

            {/* Recommendations Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                {recommendations.map((amount) => (
                    <button
                        key={amount}
                        onClick={() => onAmountSelect(amount)}
                        className={`group relative p-4 rounded-xl border-2 transition-all duration-200 ${
                            selectedAmount === amount
                                ? "border-rw-crimson bg-rw-crimson/10 shadow-md shadow-rw-crimson/20"
                                : "border-[var(--rw-border)] bg-white hover:border-rw-crimson/50 hover:bg-white/80"
                        }`}
                    >
                        <div className="flex flex-col items-center gap-2">
                            {/* Amount */}
                            <span
                                className={`font-display font-bold transition-colors ${
                                    selectedAmount === amount
                                        ? "text-rw-crimson text-lg"
                                        : "text-rw-ink text-base"
                                }`}
                            >
                                {formatNaira(amount)}
                            </span>

                            {/* Remaining after payment */}
                            <span className="text-[10px] text-rw-muted font-medium whitespace-nowrap">
                                Leave: {formatNaira(remaining - amount)}
                            </span>

                            {/* Selected indicator */}
                            {selectedAmount === amount && (
                                <div className="absolute -top-2 -right-2 h-5 w-5 bg-rw-crimson rounded-full flex items-center justify-center shadow-md">
                                    <svg
                                        className="h-3 w-3 text-white"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>
                            )}
                        </div>
                    </button>
                ))}
            </div>

            {/* Summary */}
            <div className="pt-6 border-t border-[var(--rw-border)] border-dashed space-y-3">
                <div className="flex items-center justify-between">
                    <span className="text-sm text-rw-muted font-medium">
                        Remaining after payment:
                    </span>
                    <span
                        className={`font-bold text-lg transition-colors ${
                            afterPaymentBalance >= minPayable
                                ? "text-green-600"
                                : "text-rw-crimson"
                        }`}
                    >
                        {formatNaira(Math.max(0, afterPaymentBalance))}
                    </span>
                </div>

                {typeof selectedAmount === "number" && (
                    <div className="pt-2 flex items-center justify-between bg-rw-bg-warm/30 rounded-lg p-3">
                        <span className="text-[11px] font-bold text-rw-muted uppercase tracking-wide">
                            Total to Pay:
                        </span>
                        <span className="font-display font-black text-rw-crimson text-xl">
                            {formatNaira(selectedAmount)}
                        </span>
                    </div>
                )}
            </div>

            {/* Info badge */}
            {recommendations.length === 1 && (
                <div className="mt-4 p-3 rounded-lg bg-blue-50 border border-blue-200 flex items-start gap-2">
                    <svg
                        className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                            clipRule="evenodd"
                        />
                    </svg>
                    <p className="text-xs text-blue-700 font-medium">
                        Only {formatNaira(remaining)} is available for this order
                    </p>
                </div>
            )}
        </div>
    );
}
