"use client";

import React from "react";
import Link from "next/link";
import { AdminStats, AdminStatItem } from "@/components/admin/AdminStats";
import type { Verdict } from "@/lib/data/types";
import { formatNaira } from "@/lib/utils/functions";

export default function VerdictsClient({
    verdicts,
    isAdmin,
}: {
    verdicts: Verdict[];
    isAdmin: boolean;
}) {
    const stats = React.useMemo(() => {
        const total = verdicts.length;
        const totalAmount = verdicts.reduce((s, v) => s + v.totalAmount, 0);
        const totalOrders = verdicts.reduce((s, v) => s + v.orders.length, 0);

        const items: AdminStatItem[] = [
            {
                label: "Total Verdicts",
                value: total,
                sub: "All verdicts in system",
                icon: (
                    <svg
                        className="h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                        />
                    </svg>
                ),
            },
            {
                label: "Covered Orders",
                value: totalOrders,
                sub: "Total orders processed",
                icon: (
                    <svg
                        className="h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0Zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0Z"
                        />
                    </svg>
                ),
            },
            {
                label: "Total Valuation",
                value: formatNaira(totalAmount),
                sub: "Value of all verdicts",
                icon: (
                    <svg
                        className="h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                        />
                    </svg>
                ),
            },
        ];
        return items;
    }, [verdicts]);

    return (
        <div className="flex flex-col gap-10 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-[var(--rw-border)] pb-10">
                <div className="flex flex-col gap-2">
                    <h1 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-rw-ink tracking-tight uppercase">
                        Verdicts Archive
                    </h1>
                    <p className="text-sm text-rw-muted font-medium italic">
                        Official administrative documents for approved order bundles
                    </p>
                </div>
                {isAdmin && (
                    <Link
                        href="/admin/verdicts/new"
                        className="h-14 px-10 rounded-2xl bg-rw-crimson text-white font-display font-black uppercase tracking-widest text-sm hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-3 shadow-xl shadow-rw-crimson/20"
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
                        New Verdict
                    </Link>
                )}
            </div>

            {/* Non-admin notice */}
            {!isAdmin && (
                <div className="flex items-center gap-4 rounded-2xl border border-amber-200 bg-amber-50 px-6 py-4">
                    <svg
                        className="h-5 w-5 text-amber-500 shrink-0"
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
                        Admins can issue new production verdicts. Contact your admin to
                        generate one.
                    </p>
                </div>
            )}

            <AdminStats stats={stats} />

            {/* Verdicts grid */}
            {verdicts.length === 0 ? (
                <div className="rw-card flex flex-col items-center gap-6 py-24 text-center border-dashed bg-rw-bg-alt/30">
                    <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white border border-[var(--rw-border)] shadow-sm">
                        <svg
                            className="h-10 w-10 text-rw-muted"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={1}
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                            />
                        </svg>
                    </div>
                    <div>
                        <p className="font-display font-black text-2xl text-rw-ink tracking-tight uppercase">
                            No verdicts found
                        </p>
                        <p className="text-rw-muted mt-2 font-medium">
                            Start by generating a document for your recent orders
                        </p>
                    </div>
                    {isAdmin && (
                        <Link
                            href="/admin/verdicts/new"
                            className="btn-secondary !h-11 px-8 text-[11px] font-bold uppercase tracking-widest mt-4"
                        >
                            Generate Verdict
                        </Link>
                    )}
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 stagger-children">
                    {verdicts.map((v) => (
                        <Link
                            key={v.id}
                            href={`/admin/verdicts/${v.id}`}
                            className="rw-card p-8 flex flex-col gap-8 bg-white border-[var(--rw-border)] shadow-sm hover:border-rw-crimson/50 hover:shadow-xl transition-all duration-300 group relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:scale-125 transition-transform duration-700 pointer-events-none">
                                <svg
                                    className="h-32 w-32 text-rw-crimson"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                                </svg>
                            </div>

                            {/* Header */}
                            <div className="flex items-start justify-between gap-4 relative z-10">
                                <div className="flex flex-col gap-1">
                                    <span
                                        className={`inline-flex items-center rounded-lg border px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] w-fit ${v.status === "ready" ? "bg-cyan-50 text-cyan-600 border-cyan-200" : "bg-purple-50 text-purple-600 border-purple-200"}`}
                                    >
                                        {v.status === "ready"
                                            ? "Ready for Pickup"
                                            : "In Production"}
                                    </span>
                                    <span className="text-xl font-mono text-rw-ink font-black mt-2">
                                        {v.verdictRef}
                                    </span>
                                </div>
                            </div>

                            {/* Order refs */}
                            <div className="flex-1 relative z-10">
                                <p className="text-[9px] font-black text-rw-muted mb-4 uppercase tracking-[0.3em] opacity-60">
                                    Covered Orders ({v.orders.length})
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {v.orders.slice(0, 5).map((o) => (
                                        <span
                                            key={o.id}
                                            className="font-mono text-[10px] font-bold text-rw-ink bg-rw-bg-alt border border-[var(--rw-border)] rounded-md px-2.5 py-1"
                                        >
                                            {o.orderRef}
                                        </span>
                                    ))}
                                    {v.orders.length > 5 && (
                                        <span className="font-mono text-[10px] font-bold text-rw-muted bg-white border border-[var(--rw-border)] border-dashed rounded-md px-2.5 py-1">
                                            +{v.orders.length - 5} more
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Meta */}
                            <div className="space-y-6 relative z-10">
                                <div className="flex items-center justify-between text-[10px] font-black text-rw-muted border-t border-[var(--rw-border)] border-dashed pt-6 uppercase tracking-widest">
                                    <div className="flex flex-col gap-1">
                                        <span className="opacity-40 tracking-[0.2em]">
                                            Issued By
                                        </span>
                                        <span className="text-rw-ink">{v.issuedBy}</span>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <span className="opacity-40 tracking-[0.2em]">
                                            Issued On
                                        </span>
                                        <span className="text-rw-ink">
                                            {new Date(v.issuedAt).toLocaleDateString(
                                                "en-NG",
                                                { day: "numeric", month: "short" }
                                            )}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between gap-4 w-full">
                                    <span className="text-sm font-black text-rw-ink">
                                        {formatNaira(v.totalAmount)}
                                    </span>
                                    <span className="flex items-center gap-2 text-rw-crimson font-black text-[10px] uppercase tracking-[0.3em] group-hover:translate-x-1 transition-transform">
                                        Details
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
                                                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                                            />
                                        </svg>
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
