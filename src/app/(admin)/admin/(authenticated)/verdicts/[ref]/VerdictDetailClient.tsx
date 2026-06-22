"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAdminModal } from "@/context/AdminModalContext";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import { VerdictPdfPreview } from "@/components/admin/verdicts/VerdictPdfPreview";
import { DeliverDialog } from "@/components/admin/verdicts/DeliverDialog";
import { PickupOrderRow } from "@/components/admin/verdicts/PickupOrderRow";
import { fulfilVerdict } from "@/lib/services/verdicts.service";
import { formatNaira } from "@/lib/utils/functions";
import type { Order, Verdict } from "@/lib/data/types";

// Self-contained confirm dialog so its loading state is reactive (the modal
// stores a snapshot of its content, so parent state can't drive the spinner).
function FulfilConfirmDialog({
    verdictRef,
    orderCount,
    onConfirm,
    onClose,
}: {
    verdictRef: string;
    orderCount: number;
    onConfirm: () => Promise<boolean>;
    onClose: () => void;
}) {
    const [submitting, setSubmitting] = useState(false);

    async function go() {
        setSubmitting(true);
        const ok = await onConfirm();
        setSubmitting(false);
        if (ok) onClose();
    }

    return (
        <div className="flex flex-col gap-5">
            <p className="text-sm text-rw-ink leading-relaxed">
                Mark <span className="font-mono font-black">{verdictRef}</span> as{" "}
                <strong>fulfilled</strong>? This means production is complete. All{" "}
                <strong>{orderCount}</strong> order(s) will become{" "}
                <strong>ready for pickup</strong> and each customer will be emailed a
                personal pickup code.
            </p>
            <div className="flex gap-3">
                <button
                    onClick={onClose}
                    disabled={submitting}
                    className="btn-secondary !h-12 flex-1 text-[11px] font-bold uppercase tracking-widest disabled:opacity-40"
                >
                    Cancel
                </button>
                <button
                    onClick={go}
                    disabled={submitting}
                    className="h-12 flex-1 rounded-xl bg-rw-crimson text-white font-display font-black uppercase tracking-widest text-xs hover:scale-[1.02] transition-transform disabled:opacity-40 disabled:scale-100 flex items-center justify-center gap-2"
                >
                    {submitting ? (
                        <>
                            <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                            Working…
                        </>
                    ) : (
                        "Confirm Fulfil"
                    )}
                </button>
            </div>
        </div>
    );
}

function formatWhen(iso: string | null) {
    if (!iso) return "—";
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "—";
    return d.toLocaleString("en-NG", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });
}

export function VerdictDetailClient({
    verdict: initialVerdict,
    orders: initialOrders,
}: {
    verdict: Verdict;
    orders: Order[];
}) {
    const router = useRouter();
    const { openModal, closeModal } = useAdminModal();

    const [verdict, setVerdict] = useState(initialVerdict);
    const [orders, setOrders] = useState(initialOrders);

    const isActive = verdict.status === "active";
    const isFulfilled = verdict.status === "fulfilled";

    const collected = useMemo(
        () => orders.filter((o) => o.status === "delivered").length,
        [orders]
    );

    function applyDelivered(updated: Order) {
        setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
        router.refresh();
    }

    function openDeliver(order: Order) {
        openModal(
            <DeliverDialog
                order={order}
                onDelivered={applyDelivered}
                onClose={closeModal}
            />,
            { title: "Confirm Pickup", description: "Verify the customer's code", maxWidth: "md" }
        );
    }

    // Returns true on success so the dialog can close itself.
    async function doFulfil(): Promise<boolean> {
        try {
            const res = await fulfilVerdict(verdict.id);
            if (res.success && res.data) {
                setVerdict(res.data);
                // Immediately reflect the new state: every covered order (that
                // isn't already collected) becomes ready for pickup.
                setOrders((prev) =>
                    prev.map((o) =>
                        o.status === "delivered"
                            ? o
                            : { ...o, status: "ready_for_pickup" }
                    )
                );
                toast.success("Verdict fulfilled", {
                    description:
                        "Pickup codes sent — orders are now ready for collection.",
                });
                router.refresh();
                return true;
            }
            toast.error("Could not fulfil verdict", { description: res.error });
            return false;
        } catch (err) {
            toast.error("Could not fulfil verdict", {
                description: (err as Error).message,
            });
            return false;
        }
    }

    function confirmFulfil() {
        openModal(
            <FulfilConfirmDialog
                verdictRef={verdict.verdictRef}
                orderCount={verdict.orderCount}
                onConfirm={doFulfil}
                onClose={closeModal}
            />,
            { title: "Mark Fulfilled", description: "Production complete", maxWidth: "md" }
        );
    }

    return (
        <div className="flex flex-col gap-8 animate-fade-in pb-16">
            {/* Header */}
            <div className="flex flex-col gap-4">
                <AdminBreadcrumb
                    items={[
                        { label: "Verdicts", href: "/admin/verdicts" },
                        { label: verdict.verdictRef },
                    ]}
                />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 border-b border-[var(--rw-border)] pb-6">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3">
                            <h1 className="font-display font-black text-2xl sm:text-3xl text-rw-ink tracking-tight">
                                {verdict.verdictRef}
                            </h1>
                            <span
                                className={`inline-flex items-center rounded-lg px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.18em] border ${
                                    isActive
                                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                        : isFulfilled
                                          ? "bg-amber-50 text-amber-700 border-amber-200"
                                          : "bg-rw-bg-alt text-rw-muted border-[var(--rw-border)]"
                                }`}
                            >
                                {verdict.status}
                            </span>
                        </div>
                        <p className="text-sm text-rw-muted font-medium">
                            Issued by {verdict.issuedByName} · {formatWhen(verdict.createdAt)}
                        </p>
                        {isFulfilled && verdict.fulfilledByName && (
                            <p className="text-xs text-rw-muted">
                                Fulfilled by {verdict.fulfilledByName} ·{" "}
                                {formatWhen(verdict.fulfilledAt)}
                            </p>
                        )}
                    </div>

                    {isActive && (
                        <button
                            onClick={confirmFulfil}
                            className="h-12 px-7 rounded-2xl bg-rw-crimson text-white font-display font-black uppercase tracking-widest text-xs hover:scale-[1.02] active:scale-[0.98] transition-transform flex items-center gap-2 shadow-lg shadow-rw-crimson/20"
                        >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                            Mark Fulfilled
                        </button>
                    )}
                </div>
            </div>

            {/* Stat strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                    { label: "Orders", value: verdict.orderCount },
                    { label: "Units", value: verdict.totalUnits },
                    { label: "Total To Debit", value: formatNaira(verdict.totalAmount) },
                    {
                        label: "Collected",
                        value: isFulfilled ? `${collected}/${orders.length}` : "—",
                    },
                ].map((s) => (
                    <div key={s.label} className="rw-card p-4">
                        <p className="text-[9px] font-black text-rw-muted uppercase tracking-[0.18em] opacity-70">
                            {s.label}
                        </p>
                        <p className="font-display font-black text-xl text-rw-ink mt-1">
                            {s.value}
                        </p>
                    </div>
                ))}
            </div>

            <div className="grid lg:grid-cols-[1.1fr_1fr] gap-8 items-start">
                {/* Document */}
                <div className="rw-card p-5">
                    <h3 className="text-[10px] font-black text-rw-muted uppercase tracking-[0.25em] mb-4">
                        Official Document
                    </h3>
                    <VerdictPdfPreview verdict={verdict} height={560} />
                </div>

                {/* Pickup / orders */}
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-[10px] font-black text-rw-muted uppercase tracking-[0.25em]">
                            {isFulfilled ? "Pickup Desk" : "Locked-in Orders"}
                        </h3>
                        {isActive && (
                            <span className="text-[10px] font-bold text-rw-muted">
                                Fulfil to enable pickup
                            </span>
                        )}
                    </div>

                    {isActive && (
                        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-medium text-amber-800">
                            These orders are in production. Mark the verdict fulfilled to
                            send pickup codes and start collections.
                        </div>
                    )}

                    <div className="flex flex-col gap-2.5 max-h-[480px] overflow-y-auto scrollbar-hide pr-1">
                        {orders.map((o) => (
                            <PickupOrderRow
                                key={o.id}
                                order={o}
                                onDeliverClick={openDeliver}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
