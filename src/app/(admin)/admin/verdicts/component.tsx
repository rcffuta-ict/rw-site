"use client";

import React from "react";
import type { Order } from "@/lib/data/types";

export function VerdictDownloadButton() {
    const handleClick = () => {
        alert(
            "PDF generation triggered. In a production environment, this would download the document as a high-quality PDF."
        );
    };
    return (
        <button
            onClick={handleClick}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-rw-ink text-white px-4 py-3 text-sm font-black uppercase tracking-[0.2em] hover:bg-rw-crimson transition-all duration-300 shadow-xl shadow-rw-ink/10"
        >
            <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
            </svg>
            Export as PDF
        </button>
    );
}

interface VerdictDocumentProps {
    id: string;
    orders: Order[];
    generatedBy: string;
    generatedAt: string;
}

export function VerdictDocument({
    id,
    orders,
    generatedBy,
    generatedAt,
}: VerdictDocumentProps) {
    const totalAmount = orders.reduce((sum, o) => sum + o.totalAmount, 0);

    // Consolidate items across all orders for the manifest side
    const consolidatedItems: Record<string, { label: string; quantity: number }> =
        {};
    orders.forEach((order) => {
        order.items.forEach((item) => {
            const key = `${item.productName}-${item.variantLabel}`;
            if (!consolidatedItems[key]) {
                consolidatedItems[key] = {
                    label: `${item.productName} (${item.variantLabel})`,
                    quantity: 0,
                };
            }
            consolidatedItems[key].quantity += item.quantity;
        });
    });

    return (
        <div className="bg-white border border-rw-ink/10 shadow-2xl rounded-sm overflow-hidden animate-fade-in max-w-5xl mx-auto my-10 font-serif">
            {/* Letterhead Header */}
            <div className="p-12 border-b-8 border-rw-crimson bg-rw-bg-alt/5 flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <div className="h-20 w-20 rounded-3xl bg-rw-crimson flex items-center justify-center shadow-2xl shadow-rw-crimson/30">
                        <svg
                            className="h-12 w-12 text-white"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path d="M12 2C9 7 6 9 6 13a6 6 0 0 0 12 0c0-4-3-6-6-11z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="font-display font-black text-3xl text-rw-ink uppercase tracking-tighter leading-none">
                            Redemption Week
                        </h2>
                        <p className="text-[11px] font-black text-rw-muted uppercase tracking-[0.5em] mt-3 opacity-70">
                            Official Administrative Verdict
                        </p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-black text-rw-muted uppercase tracking-widest opacity-40 mb-2">
                        Internal Document Ref
                    </p>
                    <p className="font-mono font-black text-2xl text-rw-ink tracking-tighter">
                        #{id.toUpperCase()}
                    </p>
                </div>
            </div>

            {/* Content Body — Two Column Layout */}
            <div className="grid md:grid-cols-[1.2fr_1fr] divide-x divide-rw-ink/5 border-b border-rw-ink/5">
                {/* Left Side: Manifest */}
                <div className="p-12 bg-white">
                    <div className="flex items-center justify-between mb-8 pb-4 border-b border-rw-ink/10">
                        <h3 className="text-[12px] font-black text-rw-ink uppercase tracking-[0.4em]">
                            Detailed Item Manifest
                        </h3>
                        <span className="text-[10px] font-black bg-rw-ink text-white px-3 py-1 rounded-full uppercase tracking-widest">
                            {Object.values(consolidatedItems).reduce(
                                (s, i) => s + i.quantity,
                                0
                            )}{" "}
                            Units
                        </span>
                    </div>

                    <div className="space-y-6">
                        {Object.values(consolidatedItems).map((item, idx) => (
                            <div key={idx} className="flex items-start gap-5 group">
                                <span className="h-10 w-10 shrink-0 flex items-center justify-center rounded-xl bg-rw-crimson/5 border border-rw-crimson/10 text-rw-crimson font-mono font-black text-sm">
                                    {item.quantity}x
                                </span>
                                <div className="flex-1 pt-1">
                                    <p className="text-[13px] font-black text-rw-ink uppercase tracking-tight leading-tight mb-1 group-hover:text-rw-crimson transition-colors">
                                        {item.label.split(" (")[0]}
                                    </p>
                                    <p className="text-[10px] font-bold text-rw-muted uppercase tracking-widest opacity-60 italic text-wrap">
                                        {item.label.split(" (")[1]?.replace(")", "")}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 p-6 bg-rw-bg-alt/30 rounded-2xl border border-rw-ink/5">
                        <h4 className="text-[9px] font-black text-rw-muted uppercase tracking-widest mb-2 opacity-50">
                            Logistics Advisory
                        </h4>
                        <p className="text-[11px] text-rw-ink leading-relaxed font-medium italic opacity-80">
                            Verify unit counts against physical inventory before
                            distribution. Report discrepancies to Logistics Lead
                            immediately.
                        </p>
                    </div>
                </div>

                {/* Right Side: Financials & Sign-off */}
                <div className="p-12 bg-rw-bg-alt/5 flex flex-col">
                    <div className="mb-10 pb-4 border-b border-rw-ink/10">
                        <h3 className="text-[12px] font-black text-rw-ink uppercase tracking-[0.4em]">
                            Financial Breakdown
                        </h3>
                    </div>

                    <div className="space-y-8 mb-12 flex-1">
                        <div className="space-y-3">
                            <p className="text-[10px] font-black text-rw-muted uppercase tracking-widest opacity-50">
                                Covered Order References
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {orders.map((o) => (
                                    <span
                                        key={o.orderRef}
                                        className="font-mono text-[11px] font-black text-rw-ink bg-white border border-rw-ink/10 rounded-lg px-3 py-1.5 shadow-sm"
                                    >
                                        {o.orderRef}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4 pt-8 border-t border-rw-ink/5">
                            <div className="flex items-center justify-between text-[11px] font-bold text-rw-muted uppercase tracking-widest">
                                <span>Gross Valuation</span>
                                <span>₦{totalAmount.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center justify-between text-[11px] font-bold text-rw-muted uppercase tracking-widest">
                                <span>Handling & Processing</span>
                                <span>INCLUDED</span>
                            </div>
                            <div className="flex items-center justify-between pt-6 border-t-2 border-rw-ink text-rw-ink">
                                <span className="text-[13px] font-black uppercase tracking-[0.4em]">
                                    Total Value
                                </span>
                                <span className="text-2xl font-display font-black tracking-tighter">
                                    ₦{totalAmount.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-auto pt-10 border-t-2 border-rw-crimson border-dashed">
                        <p className="text-[10px] font-black text-rw-muted uppercase tracking-[0.4em] mb-12 opacity-50 text-center">
                            Authorization & Sign-off
                        </p>

                        <div className="flex flex-col items-center gap-4">
                            <div className="h-1 bg-rw-ink w-3/4 mb-1" />
                            <div className="text-center">
                                <p className="font-display font-black text-rw-ink text-xl uppercase tracking-tighter leading-none italic">
                                    {generatedBy}
                                </p>
                                <p className="text-[10px] font-black text-rw-crimson uppercase tracking-[0.3em] mt-3">
                                    Logistics Directorate Authorized
                                </p>
                                <p className="text-[9px] font-bold text-rw-muted mt-1 uppercase tracking-widest opacity-40">
                                    {new Date(generatedAt).toLocaleDateString("en-NG", {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="p-8 bg-rw-ink text-white/40 text-[9px] font-black text-center uppercase tracking-[0.5em]">
                Official Redemption Week &copy; 2026 Admin Dashboard Internal Document
            </div>
        </div>
    );
}
