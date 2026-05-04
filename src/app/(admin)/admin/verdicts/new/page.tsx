"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { DEMO_ORDERS } from "@/lib/data/orders";

const VERDICT_TYPES = [
    { id: "withdrawal", label: "Withdrawal Permit",    description: "Issued to customers to collect their items from the point of distribution." },
    { id: "production", label: "Production Manifest",  description: "Sent to the production / printing team with complete item list and quantities." },
    { id: "combined",   label: "Combined",             description: "A single document combining both Withdrawal Permit and Production Manifest." },
] as const;

type VerdictType = typeof VERDICT_TYPES[number]["id"];

const confirmedOrders = DEMO_ORDERS.filter(o =>
    o.status === "confirmed" || o.status === "paid" || o.status === "in_production" || o.status === "delivered"
);

export default function NewVerdictPage() {
    const router = useRouter();
    const [type, setType] = useState<VerdictType>("withdrawal");
    const [selected, setSelected] = useState<Set<string>>(new Set());
    const [generating, setGenerating] = useState(false);
    const [done, setDone] = useState(false);

    function toggle(ref: string) {
        setSelected(prev => {
            const next = new Set(prev);
            if (next.has(ref)) next.delete(ref); else next.add(ref);
            return next;
        });
    }

    function selectAll() { setSelected(new Set(confirmedOrders.map(o => o.orderRef))); }
    function clearAll()  { setSelected(new Set()); }

    function handleGenerate() {
        if (selected.size === 0) return;
        setGenerating(true);
        setTimeout(() => { setGenerating(false); setDone(true); }, 1800);
    }

    if (done) {
        return (
            <div className="flex flex-col items-center justify-center py-24 gap-6 text-center animate-fade-in-up">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-50 border-2 border-green-200">
                    <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                </div>
                <div>
                    <h2 className="section-heading text-2xl text-rw-ink">Verdict Generated!</h2>
                    <p className="mt-2 text-rw-muted text-sm">
                        {VERDICT_TYPES.find(t => t.id === type)?.label} for {selected.size} order{selected.size !== 1 ? "s" : ""}
                    </p>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => alert("PDF download — stub in demo build")} className="btn-primary !h-10 !px-5 text-sm">Download PDF</button>
                    <Link href="/admin/verdicts" className="btn-secondary !h-10 !px-5 text-sm">Back to Verdicts</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8 max-w-2xl">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-rw-muted">
                <Link href="/admin/verdicts" className="hover:text-rw-crimson transition-colors">Verdicts</Link>
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>
                <span className="font-medium text-rw-ink">Generate</span>
            </nav>

            <div>
                <h1 className="section-heading text-2xl lg:text-3xl">Generate Verdict</h1>
                <p className="text-sm text-rw-muted mt-1">Select type and confirmed orders to include</p>
            </div>

            {/* Step 1 — Type */}
            <section className="flex flex-col gap-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-rw-muted">Step 1 — Verdict Type</p>
                <div className="grid gap-3 sm:grid-cols-3">
                    {VERDICT_TYPES.map(t => (
                        <button key={t.id} onClick={() => setType(t.id)}
                            className={`radio-card text-left !p-5 flex-col !items-start !gap-2 ${type === t.id ? "selected" : ""}`}
                        >
                            <p className={`font-semibold text-sm ${type === t.id ? "text-rw-crimson" : "text-rw-ink"}`}>{t.label}</p>
                            <p className="text-xs text-rw-muted leading-relaxed">{t.description}</p>
                        </button>
                    ))}
                </div>
            </section>

            {/* Step 2 — Orders */}
            <section className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-rw-muted">Step 2 — Select Orders</p>
                    <div className="flex gap-3 text-xs font-semibold">
                        <button onClick={selectAll} className="text-rw-crimson hover:underline">Select all</button>
                        <button onClick={clearAll} className="text-rw-muted hover:text-rw-ink">Clear</button>
                    </div>
                </div>

                {confirmedOrders.length === 0 ? (
                    <div className="rw-card py-12 text-center text-rw-muted text-sm">
                        No confirmed orders available.<br />
                        <Link href="/admin/orders" className="text-rw-crimson font-semibold hover:underline">Go to Orders</Link>
                    </div>
                ) : (
                    <div className="flex flex-col gap-2">
                        {confirmedOrders.map(o => (
                            <label key={o.id}
                                className={`rw-card flex items-center gap-4 p-4 cursor-pointer transition-all ${selected.has(o.orderRef) ? "border-rw-crimson bg-rw-crimson/3" : "hover:border-rw-crimson/25"}`}
                            >
                                <input type="checkbox" checked={selected.has(o.orderRef)} onChange={() => toggle(o.orderRef)} className="h-4 w-4 rounded accent-rw-crimson" />
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="font-mono font-bold text-sm text-rw-crimson">{o.orderRef}</span>
                                        <span className="text-xs text-rw-muted">·</span>
                                        <span className="text-sm text-rw-ink font-medium truncate">{o.customerName}</span>
                                    </div>
                                    <p className="text-xs text-rw-muted mt-0.5">{o.items.length} item{o.items.length !== 1 ? "s" : ""} · ₦{o.totalAmount.toLocaleString()} · {o.status}</p>
                                </div>
                            </label>
                        ))}
                    </div>
                )}
            </section>

            {/* Generate button */}
            <div className="flex items-center gap-4">
                <button onClick={handleGenerate} disabled={selected.size === 0 || generating}
                    className="btn-primary !h-12 !px-6 text-sm flex items-center gap-2 disabled:opacity-50"
                >
                    {generating ? (
                        <><span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" /> Generating…</>
                    ) : "Generate Verdict"}
                </button>
                {selected.size > 0 && !generating && (
                    <span className="text-sm text-rw-muted">{selected.size} order{selected.size !== 1 ? "s" : ""} selected</span>
                )}
            </div>
        </div>
    );
}
