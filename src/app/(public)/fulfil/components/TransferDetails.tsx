import { Button } from "@/components/ui/forms/Button";
import { PAYMENT_CONFIG } from "@/lib/config";

export function TransferDetails({ orderRef }: { orderRef: string }) {
    const prescribedNarration = `RW26-${orderRef}`;

    return (
        <div className="rw-card overflow-hidden border-t-[3px] border-t-rw-ink shadow-rw-shadow-md">
            <div className="bg-gradient-to-br from-rw-ink to-gray-900 text-white px-6 py-5">
                <h2 className="font-display font-bold text-lg">Transfer Details</h2>
                <p className="text-white/60 text-sm mt-1">
                    Make your payment to the official account below.
                </p>
            </div>
            <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-5 rounded-2xl bg-rw-bg-alt border border-[var(--rw-border)]">
                        <p className="text-xs text-rw-muted font-medium uppercase tracking-wider mb-2">
                            Bank Name
                        </p>
                        <p className="font-bold text-rw-ink text-lg">
                            {PAYMENT_CONFIG.bank}
                        </p>
                    </div>
                    <div className="p-5 rounded-2xl bg-rw-bg-alt border border-[var(--rw-border)]">
                        <p className="text-xs text-rw-muted font-medium uppercase tracking-wider mb-2">
                            Account Name
                        </p>
                        <p
                            className="font-bold text-rw-ink text-lg truncate"
                            title={PAYMENT_CONFIG.accountName}
                        >
                            {PAYMENT_CONFIG.accountName}
                        </p>
                    </div>
                    <div className="p-5 rounded-2xl bg-rw-crimson/5 border border-rw-crimson/20 sm:col-span-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <p className="text-xs text-rw-crimson font-bold uppercase tracking-wider mb-2">
                                Account Number
                            </p>
                            <p className="font-mono font-bold text-3xl text-rw-ink tracking-widest">
                                {PAYMENT_CONFIG.accountNumber}
                            </p>
                        </div>
                        <Button
                            variant="outlined"
                            onClick={() =>
                                navigator.clipboard.writeText(
                                    PAYMENT_CONFIG.accountNumber
                                )
                            }
                            className="shrink-0 bg-white"
                        >
                            Copy Number
                        </Button>
                    </div>

                    <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 sm:col-span-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <p className="text-xs text-amber-800 font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                Prescribed Narration
                            </p>
                            <p className="font-mono font-bold text-2xl text-rw-ink tracking-widest">
                                {prescribedNarration}
                            </p>
                            <p className="text-xs text-amber-700 mt-1 max-w-[35ch]">
                                Please use this exact text in your transfer
                                description/narration.
                            </p>
                        </div>
                        <Button
                            variant="outlined"
                            onClick={() =>
                                navigator.clipboard.writeText(prescribedNarration)
                            }
                            className="shrink-0 bg-white border-amber-300 text-amber-900 hover:bg-amber-100"
                        >
                            Copy Narration
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
