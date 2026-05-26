"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createVerdict } from "@/lib/services/verdicts.service";
import type { Order } from "@/lib/data/types";

interface NewVerdictClientProps {
    orders: Order[];
}

export function NewVerdictClient({ orders }: NewVerdictClientProps) {
    const confirmedOrders = orders.filter(
        (o) =>
            o.status === "confirmed" ||
            o.status === "paid" ||
            o.status === "in_production" ||
            o.status === "delivered"
    );

    const router = useRouter();
    const [selected, setSelected] = useState<Set<string>>(new Set());
    const [signature, setSignature] = useState("");
    const [isPending, startTransition] = useTransition();

    function toggle(ref: string) {
        setSelected((prev) => {
            const next = new Set(prev);
            if (next.has(ref)) next.delete(ref);
            else next.add(ref);
            return next;
        });
    }

    const selectedOrdersData = confirmedOrders.filter((o) => selected.has(o.id));

    function handleGenerate() {
        if (!signature || selected.size === 0) return;

        const toastId = toast.loading("Processing verdict creation...");

        startTransition(async () => {
            const selectedIds = Array.from(selected);
            const res = await createVerdict({
                issuedBy: signature,
                orderIds: selectedIds,
            });

            if (res.success && res.data) {
                toast.success("Verdict created successfully!", { id: toastId });
                router.push(`/admin/verdicts/${res.data.id}`);
            } else {
                toast.error("Failed to create verdict", { id: toastId, description: res.error });
            }
        });
    }

    return (
        <div className="flex flex-col gap-10 animate-fade-in max-w-4xl pb-20">
            <div>
                <h1 className="section-heading text-2xl lg:text-3xl font-display font-black uppercase tracking-tight">
                    Generate Verdict
                </h1>
                <p className="text-sm text-rw-muted mt-1 font-medium italic">
                    Create official administrative documents for confirmed orders
                </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-10">
                <div className="space-y-10">
                    <section className="space-y-4">
                        <h4 className="text-[10px] font-black text-rw-muted uppercase tracking-[0.3em] opacity-60">
                            1. Authorizing Signature
                        </h4>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Enter your full name..."
                                value={signature}
                                onChange={(e) => setSignature(e.target.value)}
                                className="w-full h-20 bg-rw-bg-alt/40 border border-[var(--rw-border)] rounded-2xl px-8 font-display font-black text-rw-ink uppercase tracking-wider outline-none focus:bg-white focus:border-rw-crimson transition-all shadow-inner text-lg"
                            />
                            <div className="absolute right-8 top-1/2 -translate-y-1/2">
                                <svg
                                    className="h-6 w-6 text-rw-muted opacity-40"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                                    />
                                </svg>
                            </div>
                        </div>
                        <p className="text-[10px] text-rw-muted font-bold uppercase tracking-widest italic opacity-50">
                            This name will appear on the formal document as the
                            authorizing officer.
                        </p>
                    </section>

                    <div className="rw-card p-6 bg-blue-50/50 border-blue-100 flex gap-4">
                        <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                            <svg
                                className="h-5 w-5 text-blue-600"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0zm-9-3.75h.008v.008H12V8.25z"
                                />
                            </svg>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-blue-900 uppercase tracking-widest">
                                Document Integrity
                            </p>
                            <p className="text-xs text-blue-700/70 font-medium leading-relaxed">
                                Generating a verdict will consolidate selected orders into
                                a single production and withdrawal manifest. This process
                                is irreversible for the selected batch.
                            </p>
                        </div>
                    </div>
                </div>

                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h4 className="text-[10px] font-black text-rw-muted uppercase tracking-[0.3em] opacity-60">
                            2. Select Orders ({selected.size})
                        </h4>
                        <div className="flex gap-4">
                            <button
                                onClick={() =>
                                    setSelected(new Set(confirmedOrders.map((o) => o.id)))
                                }
                                className="text-[10px] font-black text-rw-crimson uppercase tracking-widest hover:underline"
                            >
                                Select all
                            </button>
                            <button
                                onClick={() => setSelected(new Set())}
                                className="text-[10px] font-black text-rw-muted uppercase tracking-widest hover:text-rw-ink"
                            >
                                Clear
                            </button>
                        </div>
                    </div>

                    <div className="rw-card p-2 space-y-2 max-h-[500px] overflow-y-auto scrollbar-hide bg-rw-bg-alt/30 border-dashed">
                        {confirmedOrders.length === 0 ? (
                            <div className="py-20 text-center">
                                <p className="text-sm font-bold text-rw-muted italic">
                                    No confirmed orders available
                                </p>
                            </div>
                        ) : (
                            confirmedOrders.map((o) => (
                                <label
                                    key={o.id}
                                    className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all border-2 ${selected.has(o.id) ? "border-rw-crimson bg-white shadow-md scale-[1.01]" : "border-transparent hover:bg-white/50"}`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={selected.has(o.id)}
                                        onChange={() => toggle(o.id)}
                                        className="h-5 w-5 rounded-lg accent-rw-crimson"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <span className="font-mono font-black text-sm text-rw-crimson">
                                                {o.orderRef}
                                            </span>
                                            <span className="text-[10px] font-black text-rw-ink uppercase bg-rw-bg-alt px-2 py-0.5 rounded-md border border-[var(--rw-border)]">
                                                ₦{o.totalAmount.toLocaleString()}
                                            </span>
                                        </div>
                                        <p className="text-xs text-rw-ink font-black mt-1 truncate">
                                            {o.customerName}
                                        </p>
                                        <p className="text-[9px] text-rw-muted font-bold uppercase tracking-tighter mt-0.5">
                                            {o.items.length} item
                                            {o.items.length !== 1 ? "s" : ""}
                                        </p>
                                    </div>
                                </label>
                            ))
                        )}
                    </div>
                </section>
            </div>

            <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 w-full max-w-4xl px-6">
                <div className="rw-card p-6 bg-rw-ink text-white border-none shadow-2xl flex items-center justify-between gap-8 rounded-[32px]">
                    <div className="flex items-center gap-6">
                        <div className="flex flex-col">
                            <span className="text-[9px] font-black uppercase tracking-[0.3em] opacity-40">
                                Orders Selected
                            </span>
                            <span className="text-2xl font-display font-black tracking-tighter">
                                {selected.size}
                            </span>
                        </div>
                        <div className="h-8 w-[1px] bg-white/10" />
                        <div className="flex flex-col">
                            <span className="text-[9px] font-black uppercase tracking-[0.3em] opacity-40">
                                Total Valuation
                            </span>
                            <span className="text-2xl font-display font-black tracking-tighter text-rw-gold">
                                ₦
                                {selectedOrdersData
                                    .reduce((s, o) => s + o.totalAmount, 0)
                                    .toLocaleString()}
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={handleGenerate}
                        disabled={selected.size === 0 || !signature || isPending}
                        className="h-14 px-10 rounded-2xl bg-rw-crimson text-white font-display font-black uppercase tracking-widest text-sm hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-30 disabled:grayscale disabled:scale-100 flex items-center gap-3 shadow-xl shadow-rw-crimson/20"
                    >
                        {isPending ? (
                            <>
                                <span className="h-5 w-5 rounded-full border-3 border-white border-t-transparent animate-spin" />{" "}
                                Processing...
                            </>
                        ) : (
                            <>
                                Register & View
                                <svg
                                    className="h-5 w-5"
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
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
