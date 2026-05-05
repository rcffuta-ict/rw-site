"use client";

import React from "react";
import Link from "next/link";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import { VerdictDownloadButton } from "./component";

const MOCK_VERDICTS = [
    { id: "v-001", type: "Withdrawal Permit",    orderRefs: ["FF891E", "FFAA52"],           generatedAt: "2026-05-03T11:00:00Z", generatedBy: "Admin", customerCount: 2 },
    { id: "v-002", type: "Production Manifest",  orderRefs: ["FF3A9C", "FF891E", "FFAA52"], generatedAt: "2026-05-03T12:30:00Z", generatedBy: "Admin", customerCount: 3 },
    { id: "v-003", type: "Combined",             orderRefs: ["FFAA52"],                     generatedAt: "2026-05-04T08:15:00Z", generatedBy: "Admin", customerCount: 1 },
];

const TYPE_COLORS: Record<string, string> = {
    "Withdrawal Permit":   "bg-blue-50 text-blue-700 border-blue-200",
    "Production Manifest": "bg-violet-50 text-violet-700 border-violet-200",
    Combined:              "bg-rw-crimson/10 text-rw-crimson border-rw-crimson/20",
};

export default function VerdictsClient() {
    return (
        <div className="flex flex-col gap-10 animate-fade-in">
            <AdminBreadcrumb items={[{ label: "Verdicts" }]} />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-[var(--rw-border)] pb-10">
                <div className="flex flex-col gap-2">
                    <h1 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-rw-ink tracking-tight">Verdicts</h1>
                    <p className="text-sm text-rw-muted font-medium italic">Official fulfillment and production manifests for confirmed orders</p>
                </div>
                <Link href="/admin/verdicts/new" className="btn-primary !h-12 !px-8 text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-rw-crimson/10">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                    Generate New Verdict
                </Link>
            </div>

            {/* Info banner */}
            <div className="rw-card p-6 flex items-start gap-4 border-blue-200 bg-blue-50/50 shadow-sm">
                <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                    <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0zm-9-3.75h.008v.008H12V8.25z" /></svg>
                </div>
                <div className="flex flex-col gap-1">
                    <p className="text-sm font-bold text-blue-900 uppercase tracking-tight">Logistics Policy</p>
                    <p className="text-sm text-blue-700/80 leading-relaxed font-medium">
                        <strong>Verdicts</strong> are formal documents required for order withdrawal and production scheduling.
                        Only orders with <strong>Confirmed</strong> status appear in the generation pool. 
                        <span className="opacity-60 block mt-1">Demo build: PDF engine is simulated.</span>
                    </p>
                </div>
            </div>

            {/* Verdicts grid */}
            {MOCK_VERDICTS.length === 0 ? (
                <div className="rw-card flex flex-col items-center gap-6 py-24 text-center border-dashed bg-rw-bg-alt/30">
                    <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white border border-[var(--rw-border)] shadow-sm">
                        <svg className="h-10 w-10 text-rw-muted" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>
                    </div>
                    <div>
                        <p className="font-display font-bold text-2xl text-rw-ink tracking-tight">No verdicts found</p>
                        <p className="text-rw-muted mt-2 font-medium">Start by generating a document for your recent orders</p>
                    </div>
                    <Link href="/admin/verdicts/new" className="btn-secondary !h-11 px-8 text-[11px] font-bold uppercase tracking-widest mt-4">Generate Verdict</Link>
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 stagger-children">
                    {MOCK_VERDICTS.map((v) => (
                        <div key={v.id} className="rw-card p-6 flex flex-col gap-6 bg-white border-none shadow-lg ring-1 ring-[var(--rw-border)] hover:ring-rw-crimson/30 hover:shadow-xl transition-all duration-300 group">
                            {/* Header */}
                            <div className="flex items-start justify-between gap-4">
                                <span className={`inline-flex items-center rounded-lg border px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest ${TYPE_COLORS[v.type] ?? "bg-gray-100 text-gray-600 border-gray-200"}`}>
                                    {v.type}
                                </span>
                                <span className="text-[10px] font-mono text-rw-muted font-bold group-hover:text-rw-ink transition-colors">{v.id.toUpperCase()}</span>
                            </div>

                            {/* Order refs */}
                            <div className="flex-1">
                                <p className="text-[9px] font-bold text-rw-muted mb-3 uppercase tracking-[0.2em] opacity-60">Consolidated Orders</p>
                                <div className="flex flex-wrap gap-2">
                                    {v.orderRefs.map((ref) => (
                                        <Link key={ref} href={`/admin/orders/${ref}`}
                                            className="font-mono text-[11px] font-black text-rw-crimson bg-rw-crimson/5 border border-rw-crimson/10 rounded-xl px-3 py-1.5 hover:bg-rw-crimson hover:text-white hover:border-rw-crimson transition-all duration-200"
                                        >{ref}</Link>
                                    ))}
                                </div>
                            </div>

                            {/* Meta */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between text-[11px] font-bold text-rw-muted border-t border-[var(--rw-border)] pt-5 uppercase tracking-tighter">
                                    <div className="flex items-center gap-1.5">
                                        <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                                        <span>{new Date(v.generatedAt).toLocaleDateString("en-NG", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" /></svg>
                                        <span>{v.customerCount} Unit{v.customerCount !== 1 ? "s" : ""}</span>
                                    </div>
                                </div>

                                <VerdictDownloadButton />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
