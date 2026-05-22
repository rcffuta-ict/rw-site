"use client";

import React from "react";
import Link from "next/link";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import { VerdictDownloadButton, VerdictDocument } from "./component";
import { useAdminModal } from "@/context/AdminModalContext";
import { DEMO_ORDERS } from "@/lib/data/orders";
import { AdminStats, AdminStatItem } from "@/components/admin/AdminStats";

const MOCK_VERDICTS = [
    {
        id: "v-8912",
        orderRefs: ["FF3A9C", "FF7B2D"],
        generatedAt: "2026-05-03T11:00:00Z",
        generatedBy: "Admin Sarah",
        customerCount: 2,
    },
    {
        id: "v-4421",
        orderRefs: ["FFCD01", "FF892E", "FFBB31"],
        generatedAt: "2026-05-03T12:30:00Z",
        generatedBy: "Logistics Lead",
        customerCount: 3,
    },
    {
        id: "v-1092",
        orderRefs: ["FFAA11"],
        generatedAt: "2026-05-04T08:15:00Z",
        generatedBy: "System Auto",
        customerCount: 1,
    },
];

export default function VerdictsClient() {
    const { openModal } = useAdminModal();

    const handleViewVerdict = (v: (typeof MOCK_VERDICTS)[0]) => {
        const orders = DEMO_ORDERS.filter((o) => v.orderRefs.includes(o.orderRef));
        openModal(
            <div className="pb-10">
                <VerdictDocument
                    id={v.id}
                    orders={orders}
                    generatedBy={v.generatedBy}
                    generatedAt={v.generatedAt}
                />
                <div className="max-w-4xl mx-auto px-4 mt-6">
                    <VerdictDownloadButton />
                </div>
            </div>,
            {
                title: "Production Manifest View",
                description: `Official Directive ${v.id.toUpperCase()}`,
                maxWidth: "5xl",
            }
        );
    };

    const stats = React.useMemo(() => {
        const total = MOCK_VERDICTS.length;
        const units = MOCK_VERDICTS.reduce((s, v) => s + v.customerCount, 0);

        const items: AdminStatItem[] = [
            {
                label: "Total Verdicts",
                value: total,
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
                label: "Consolidated Units",
                value: units,
                sub: "Total items in verdicts",
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
        ];
        return items;
    }, []);

    return (
        <div className="flex flex-col gap-10 animate-fade-in">
            {/* <AdminBreadcrumb items={[{ label: "Verdicts" }]} /> */}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-[var(--rw-border)] pb-10">
                <div className="flex flex-col gap-2">
                    <h1 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-rw-ink tracking-tight uppercase">
                        Verdicts Archive
                    </h1>
                    <p className="text-sm text-rw-muted font-medium italic">
                        Official administrative documents for approved order bundles
                    </p>
                </div>
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
            </div>

            {/* <AdminStats stats={stats} /> */}

            {/* Verdicts grid */}
            {MOCK_VERDICTS.length === 0 ? (
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
                    <Link
                        href="/admin/verdicts/new"
                        className="btn-secondary !h-11 px-8 text-[11px] font-bold uppercase tracking-widest mt-4"
                    >
                        Generate Verdict
                    </Link>
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 stagger-children">
                    {MOCK_VERDICTS.map((v) => (
                        <div
                            key={v.id}
                            onClick={() => handleViewVerdict(v)}
                            className="rw-card p-8 flex flex-col gap-8 bg-white border-none shadow-lg ring-1 ring-[var(--rw-border)] hover:ring-rw-crimson/50 hover:shadow-2xl transition-all duration-500 group cursor-pointer relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-125 transition-transform duration-700">
                                <svg
                                    className="h-32 w-32"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                                </svg>
                            </div>

                            {/* Header */}
                            <div className="flex items-start justify-between gap-4 relative z-10">
                                <span className="inline-flex items-center rounded-lg border px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] bg-rw-crimson/10 text-rw-crimson border-rw-crimson/20">
                                    Official Verdict
                                </span>
                                <span className="text-[10px] font-mono text-rw-muted font-black group-hover:text-rw-ink transition-colors uppercase">
                                    {v.id}
                                </span>
                            </div>

                            {/* Order refs */}
                            <div className="flex-1 relative z-10">
                                <p className="text-[9px] font-black text-rw-muted mb-4 uppercase tracking-[0.3em] opacity-60">
                                    Consolidated Batches
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {v.orderRefs.map((ref) => (
                                        <span
                                            key={ref}
                                            className="font-mono text-[11px] font-black text-rw-ink bg-rw-bg-alt border border-[var(--rw-border)] rounded-lg px-3 py-1.5"
                                        >
                                            {ref}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Meta */}
                            <div className="space-y-6 relative z-10">
                                <div className="flex items-center justify-between text-[10px] font-black text-rw-muted border-t border-[var(--rw-border)] border-dashed pt-6 uppercase tracking-widest">
                                    <div className="flex flex-col gap-1">
                                        <span className="opacity-40 tracking-[0.2em]">
                                            Issued On
                                        </span>
                                        <span className="text-rw-ink">
                                            {new Date(v.generatedAt).toLocaleDateString(
                                                "en-NG",
                                                { day: "numeric", month: "short" }
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <span className="opacity-40 tracking-[0.2em]">
                                            Volume
                                        </span>
                                        <span className="text-rw-crimson">
                                            {v.customerCount} Unit
                                            {v.customerCount !== 1 ? "s" : ""}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 text-rw-crimson font-black text-[10px] uppercase tracking-[0.3em] group-hover:translate-x-2 transition-transform">
                                    View Formal Verdict
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
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
