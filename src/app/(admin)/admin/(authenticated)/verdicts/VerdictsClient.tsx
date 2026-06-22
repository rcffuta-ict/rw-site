"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAdminModal } from "@/context/AdminModalContext";
import { AdminStats, AdminStatItem } from "@/components/admin/AdminStats";
import { RefreshButton } from "@/components/admin/RefreshButton";
import { DeliverDialog } from "@/components/admin/verdicts/DeliverDialog";
import { PickupOrderRow } from "@/components/admin/verdicts/PickupOrderRow";
import { formatNaira } from "@/lib/utils/functions";
import type { VerdictsOverview } from "@/lib/services/verdicts.service";
import type { Order, Verdict } from "@/lib/data/types";

function formatIssued(iso: string) {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "—";
    return d.toLocaleDateString("en-NG", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

export default function VerdictsClient({
    verdicts,
    overview,
    isAdmin,
}: {
    verdicts: Verdict[];
    overview: VerdictsOverview;
    isAdmin: boolean;
}) {
    const router = useRouter();
    const { openModal, closeModal } = useAdminModal();
    const [pickups, setPickups] = useState(overview.pickupOrders);

    function openDeliver(order: Order) {
        openModal(
            <DeliverDialog
                order={order}
                onDelivered={(updated) => {
                    // Drop it from the desk once collected.
                    setPickups((prev) => prev.filter((o) => o.id !== updated.id));
                    router.refresh();
                }}
                onClose={closeModal}
            />,
            {
                title: "Confirm Pickup",
                description: "Verify the customer's code",
                maxWidth: "md",
            }
        );
    }

    const stats = React.useMemo<AdminStatItem[]>(() => {
        const totalUnits = verdicts.reduce((s, v) => s + v.totalUnits, 0);
        const totalDebited = verdicts.reduce((s, v) => s + v.totalAmount, 0);
        const sIcon = (d: string) => (
            <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
            >
                <path strokeLinecap="round" strokeLinejoin="round" d={d} />
            </svg>
        );
        return [
            {
                label: "Awaiting Verdict",
                value: overview.eligibleCount,
                sub: "Fully-paid · ready to produce",
                icon: sIcon(
                    "M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                ),
            },
            {
                label: "In Production",
                value: overview.inProductionCount,
                sub: "Across active verdicts",
                icon: sIcon(
                    "M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085"
                ),
            },
            {
                label: "Ready for Pickup",
                value: pickups.length,
                sub: "Awaiting collection",
                icon: sIcon(
                    "M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"
                ),
            },
            {
                label: "Collected",
                value: overview.deliveredCount,
                sub: "Handed over to customers",
                icon: sIcon(
                    "M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                ),
            },
            {
                label: "Verdicts Issued",
                value: verdicts.length,
                sub: `${totalUnits} units directed`,
                icon: sIcon(
                    "M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25Z"
                ),
            },
            {
                label: "Total Authorized",
                value: formatNaira(totalDebited),
                sub: "Cumulative debit directive",
                icon: sIcon(
                    "M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z"
                ),
            },
        ];
    }, [verdicts, overview, pickups.length]);

    return (
        <div className="flex flex-col gap-8 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-[var(--rw-border)] pb-6">
                <div className="flex flex-col gap-2">
                    <h1 className="font-display font-black text-3xl sm:text-4xl text-rw-ink tracking-tight uppercase">
                        Production Verdicts
                    </h1>
                    <p className="text-sm text-rw-muted font-medium max-w-xl">
                        The official record of what to produce and how much to debit — the
                        single source of truth for the house.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <RefreshButton />
                    {isAdmin && (
                        <Link
                            href="/admin/verdicts/new"
                            className="h-12 px-7 rounded-2xl bg-rw-crimson text-white font-display font-black uppercase tracking-widest text-xs hover:scale-[1.02] active:scale-[0.98] transition-transform flex items-center gap-2 shadow-lg shadow-rw-crimson/20"
                        >
                            <svg
                                className="h-4 w-4"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={3}
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 4v16m8-8H4"
                                />
                            </svg>
                            Issue Verdict
                        </Link>
                    )}
                </div>
            </div>

            {/* Non-admin notice */}
            {!isAdmin && (
                <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4">
                    <svg
                        className="h-5 w-5 text-amber-500 shrink-0 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                        />
                    </svg>
                    <p className="text-sm font-medium text-amber-800">
                        <span className="font-bold">Admin access required.</span> Only
                        administrators can issue verdicts. You can view and download
                        existing ones below.
                    </p>
                </div>
            )}

            <AdminStats stats={stats} />

            {/* Pickup desk — orders awaiting collection across all verdicts */}
            {pickups.length > 0 && (
                <section className="rw-card p-5 sm:p-6 flex flex-col gap-4 bg-amber-50/40 border border-amber-200">
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                                <svg
                                    className="h-5 w-5"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"
                                    />
                                </svg>
                            </span>
                            <div>
                                <h2 className="font-display font-black text-lg text-rw-ink uppercase tracking-tight">
                                    Pickup Desk
                                </h2>
                                <p className="text-[11px] text-rw-muted font-medium">
                                    {pickups.length} order
                                    {pickups.length === 1 ? "" : "s"} awaiting collection
                                    · verify the pickup code to hand over
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-2.5">
                        {pickups.map((o) => (
                            <PickupOrderRow
                                key={o.id}
                                order={o}
                                onDeliverClick={openDeliver}
                            />
                        ))}
                    </div>
                </section>
            )}

            {/* Grid */}
            {verdicts.length === 0 ? (
                <div className="rw-card flex flex-col items-center gap-5 py-20 text-center border-dashed bg-rw-bg-alt/30">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white border border-[var(--rw-border)] shadow-sm">
                        <svg
                            className="h-8 w-8 text-rw-muted"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={1.4}
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"
                            />
                        </svg>
                    </div>
                    <div>
                        <p className="font-display font-black text-xl text-rw-ink tracking-tight uppercase">
                            No verdicts yet
                        </p>
                        <p className="text-rw-muted mt-1.5 font-medium text-sm max-w-sm">
                            Issue a verdict to lock fully-paid orders into production and
                            generate the official directive.
                        </p>
                    </div>
                    {isAdmin && (
                        <Link
                            href="/admin/verdicts/new"
                            className="btn-secondary !h-11 px-7 text-[11px] font-bold uppercase tracking-widest mt-2"
                        >
                            Issue First Verdict
                        </Link>
                    )}
                </div>
            ) : (
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 stagger-children">
                    {verdicts.map((v) => (
                        <Link
                            key={v.id}
                            href={`/admin/verdicts/${encodeURIComponent(v.verdictRef)}`}
                            className="text-left rw-card p-6 flex flex-col gap-5 bg-white shadow-sm ring-1 ring-[var(--rw-border)] hover:ring-rw-crimson/50 hover:shadow-xl transition-all duration-300 group cursor-pointer"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <span
                                    className={`inline-flex items-center rounded-lg px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.18em] border ${
                                        v.status === "active"
                                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                            : v.status === "fulfilled"
                                              ? "bg-amber-50 text-amber-700 border-amber-200"
                                              : "bg-rw-bg-alt text-rw-muted border-[var(--rw-border)]"
                                    }`}
                                >
                                    {v.status}
                                </span>
                                <span className="font-mono text-xs font-black text-rw-ink">
                                    {v.verdictRef}
                                </span>
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                                <div>
                                    <p className="text-[8px] font-black text-rw-muted uppercase tracking-[0.15em] opacity-70">
                                        Orders
                                    </p>
                                    <p className="font-display font-black text-lg text-rw-ink">
                                        {v.orderCount}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[8px] font-black text-rw-muted uppercase tracking-[0.15em] opacity-70">
                                        Units
                                    </p>
                                    <p className="font-display font-black text-lg text-rw-ink">
                                        {v.totalUnits}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[8px] font-black text-rw-muted uppercase tracking-[0.15em] opacity-70">
                                        Value
                                    </p>
                                    <p className="font-display font-black text-lg text-rw-crimson">
                                        {formatNaira(v.totalAmount)}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between border-t border-[var(--rw-border)] border-dashed pt-4">
                                <div className="min-w-0">
                                    <p className="text-[8px] font-black text-rw-muted uppercase tracking-[0.15em] opacity-60">
                                        Authorized by
                                    </p>
                                    <p className="text-xs font-bold text-rw-ink truncate">
                                        {v.issuedByName}
                                    </p>
                                    <p className="text-[10px] text-rw-muted font-medium">
                                        {formatIssued(v.createdAt)}
                                    </p>
                                </div>
                                <span className="flex items-center gap-1.5 text-rw-crimson font-black text-[10px] uppercase tracking-[0.18em] group-hover:translate-x-1 transition-transform shrink-0">
                                    View
                                    <svg
                                        className="h-3.5 w-3.5"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth={3}
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                                        />
                                    </svg>
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
