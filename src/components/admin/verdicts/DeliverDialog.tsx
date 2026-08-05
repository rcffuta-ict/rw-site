"use client";

// Delivery confirmation. When pickupTokenRequired is on, the customer presents
// the pickup code from their email and the moderator types it here — a
// mismatch is rejected. When off, a plain staff confirmation is enough.

import { useState } from "react";
import { toast } from "sonner";
import { markOrderDelivered } from "@/lib/services/verdicts.service";
import { formatNaira } from "@/lib/utils/functions";
import type { Order } from "@/lib/data/types";

export function DeliverDialog({
    order,
    onDelivered,
    onClose,
    pickupTokenRequired,
}: {
    order: Order;
    onDelivered: (delivered: Order) => void;
    onClose: () => void;
    pickupTokenRequired: boolean;
}) {
    const [code, setCode] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function submit() {
        if ((pickupTokenRequired && !code.trim()) || submitting) return;
        setSubmitting(true);
        setError(null);
        try {
            const res = await markOrderDelivered(
                pickupTokenRequired
                    ? { orderId: order.id, token: code }
                    : { orderId: order.id }
            );
            if (res.success && res.data) {
                toast.success(`Order ${order.orderRef} collected`, {
                    description: `Handed over to ${order.customerName}.`,
                });
                onDelivered(res.data);
                onClose();
            } else {
                setError(res.error ?? "Could not verify the pickup code.");
            }
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="flex flex-col gap-5">
            <div className="rounded-2xl bg-rw-bg-alt/50 border border-[var(--rw-border)] p-4">
                <div className="flex items-center justify-between gap-3">
                    <span className="font-mono font-black text-rw-crimson">
                        {order.orderRef}
                    </span>
                    <span className="font-display font-black text-rw-ink">
                        {formatNaira(order.totalAmount)}
                    </span>
                </div>
                <p className="text-sm font-bold text-rw-ink mt-1">{order.customerName}</p>
                <p className="text-xs text-rw-muted">{order.customerEmail}</p>
            </div>

            {pickupTokenRequired ? (
                <div>
                    <label className="text-[10px] font-black text-rw-muted uppercase tracking-[0.25em]">
                        Pickup code
                    </label>
                    <input
                        autoFocus
                        value={code}
                        onChange={(e) => {
                            setCode(e.target.value);
                            setError(null);
                        }}
                        onKeyDown={(e) => e.key === "Enter" && submit()}
                        placeholder="e.g. GRACE-7K2"
                        className={`mt-2 w-full h-14 rounded-xl border-2 bg-white px-4 font-mono font-black text-lg uppercase tracking-widest text-rw-ink outline-none transition-colors ${
                            error ? "border-rw-crimson" : "border-[var(--rw-border)] focus:border-rw-crimson"
                        }`}
                    />
                    <p className="mt-2 text-[11px] text-rw-muted">
                        Ask the customer to read out the code from their pickup email. Spacing
                        and case don&apos;t matter.
                    </p>
                    {error && (
                        <p className="mt-2 text-xs font-bold text-rw-crimson">{error}</p>
                    )}
                </div>
            ) : (
                <div>
                    <p className="text-sm text-rw-ink leading-relaxed">
                        Confirm this order has been handed to the customer.
                    </p>
                    {error && (
                        <p className="mt-2 text-xs font-bold text-rw-crimson">{error}</p>
                    )}
                </div>
            )}

            <div className="flex items-center gap-3">
                <button
                    onClick={onClose}
                    className="btn-secondary !h-12 flex-1 text-[11px] font-bold uppercase tracking-widest"
                >
                    Cancel
                </button>
                <button
                    onClick={submit}
                    disabled={(pickupTokenRequired && !code.trim()) || submitting}
                    className="h-12 flex-1 rounded-xl bg-rw-ink text-white font-display font-black uppercase tracking-widest text-xs hover:bg-rw-crimson transition-colors disabled:opacity-40 flex items-center justify-center gap-2"
                >
                    {submitting ? (
                        <>
                            <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                            Verifying…
                        </>
                    ) : (
                        "Confirm Pickup"
                    )}
                </button>
            </div>
        </div>
    );
}
