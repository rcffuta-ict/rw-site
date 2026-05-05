import { Button } from "@/components/ui/forms/Button";
import { PAYMENT_CONFIG } from "./constants";

export function TransferDetails() {
    return (
        <div className="rw-card overflow-hidden border-t-[3px] border-t-rw-ink shadow-rw-shadow-md">
            <div className="bg-gradient-to-br from-rw-ink to-gray-900 text-white px-6 py-5">
                <h2 className="font-display font-bold text-lg">Transfer Details</h2>
                <p className="text-white/60 text-sm mt-1">Make your payment to the official account below.</p>
            </div>
            <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-5 rounded-2xl bg-rw-bg-alt border border-[var(--rw-border)]">
                        <p className="text-xs text-rw-muted font-medium uppercase tracking-wider mb-2">Bank Name</p>
                        <p className="font-bold text-rw-ink text-lg">{PAYMENT_CONFIG.bank}</p>
                    </div>
                    <div className="p-5 rounded-2xl bg-rw-bg-alt border border-[var(--rw-border)]">
                        <p className="text-xs text-rw-muted font-medium uppercase tracking-wider mb-2">Account Name</p>
                        <p className="font-bold text-rw-ink text-lg truncate" title={PAYMENT_CONFIG.accountName}>
                            {PAYMENT_CONFIG.accountName}
                        </p>
                    </div>
                    <div className="p-5 rounded-2xl bg-rw-crimson/5 border border-rw-crimson/20 sm:col-span-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <p className="text-xs text-rw-crimson font-bold uppercase tracking-wider mb-2">Account Number</p>
                            <p className="font-mono font-bold text-3xl text-rw-ink tracking-widest">
                                {PAYMENT_CONFIG.accountNumber}
                            </p>
                        </div>
                        <Button
                            variant="outlined"
                            onClick={() => navigator.clipboard.writeText(PAYMENT_CONFIG.accountNumber)}
                            className="shrink-0 bg-white"
                        >
                            Copy Number
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
