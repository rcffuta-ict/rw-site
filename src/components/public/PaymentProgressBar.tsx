interface PaymentProgressBarProps {
    amountPaid: number;
    totalAmount: number;
    minPercent?: number;
}

export function PaymentProgressBar({ amountPaid, totalAmount, minPercent = 50 }: PaymentProgressBarProps) {
    const percent = totalAmount > 0 ? Math.min(100, Math.round((amountPaid / totalAmount) * 100)) : 0;
    const remaining = Math.max(0, totalAmount - amountPaid);
    const minAmount = Math.ceil((minPercent / 100) * totalAmount);

    return (
        <div className="flex flex-col gap-3">
            {/* Label row */}
            <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-rw-ink">Payment Progress</span>
                <span className="font-bold text-rw-crimson">{percent}%</span>
            </div>

            {/* Bar */}
            <div className="relative h-3 rounded-full bg-rw-bg-alt border border-[var(--rw-border)] overflow-hidden">
                {/* Min marker */}
                {minPercent > 0 && minPercent < 100 && (
                    <div
                        className="absolute top-0 bottom-0 w-0.5 bg-rw-orange/70 z-10"
                        style={{ left: `${minPercent}%` }}
                        title={`Minimum ${minPercent}%`}
                    />
                )}
                {/* Fill */}
                <div
                    className="h-full rounded-full bg-fire-gradient transition-all duration-700 ease-out"
                    style={{ width: `${percent}%` }}
                />
            </div>

            {/* Stats row */}
            <div className="flex items-center justify-between text-xs text-rw-muted">
                <span>
                    <span className="font-semibold text-rw-ink">₦{amountPaid.toLocaleString()}</span> paid
                    {" "}of ₦{totalAmount.toLocaleString()} total
                </span>
                {remaining > 0 ? (
                    <span>₦{remaining.toLocaleString()} remaining</span>
                ) : (
                    <span className="font-semibold text-green-700">Fully paid ✓</span>
                )}
            </div>

            {/* Min payment note */}
            {percent < minPercent && (
                <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-2.5 text-xs text-amber-700">
                    Minimum payment: <strong>₦{minAmount.toLocaleString()}</strong> ({minPercent}% of total)
                </div>
            )}
        </div>
    );
}
