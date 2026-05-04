"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { getDemoOrder } from "@/lib/data/orders";
import type { Order } from "@/lib/data/types";

const PAYMENT_CONFIG = { bank: "First Bank", accountName: "RCF FUTA", accountNumber: "3012345678", minPercent: 50 };

// Mock extraction result for demo
const MOCK_EXTRACTION = {
    senderName: "Adewale Ogundimu",
    amount: null as number | null,
    date: new Date().toISOString().split("T")[0],
    time: new Date().toTimeString().slice(0,5),
    bank: "GTBank",
    confidence: "high" as const,
};

function ProgressBar({ paid, total }: { paid: number; total: number }) {
    const pct = total > 0 ? Math.min(100, Math.round((paid / total) * 100)) : 0;
    return (
        <div>
            <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-rw-ink">Payment Progress</span>
                <span className="font-bold text-rw-crimson">{pct}%</span>
            </div>
            <div className="h-2.5 w-full rounded-full bg-gray-100 border border-[var(--rw-border)]">
                <div
                    className="h-full rounded-full bg-rw-crimson transition-all duration-500"
                    style={{ width: `${pct}%` }}
                />
            </div>
            <div className="flex justify-between text-xs text-rw-muted mt-1.5">
                <span>₦{paid.toLocaleString()} paid</span>
                <span>₦{(total - paid).toLocaleString()} remaining</span>
            </div>
        </div>
    );
}

function FulfilContent() {
    const params = useSearchParams();
    const [refInput, setRefInput] = useState(params.get("ref") ?? "");
    const [order, setOrder] = useState<Order | null>(null);
    const [notFound, setNotFound] = useState(false);
    const [amount, setAmount] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [stage, setStage] = useState<"idle" | "analysing" | "preview" | "done">("idle");
    const [extraction, setExtraction] = useState<typeof MOCK_EXTRACTION | null>(null);
    const [accurate, setAccurate] = useState<boolean | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const minAmount = order ? Math.ceil(order.totalAmount * PAYMENT_CONFIG.minPercent / 100) : 0;

    function lookup(ref: string) {
        setNotFound(false);
        // Check demo orders first (localStorage)
        try {
            const stored = JSON.parse(localStorage.getItem("rw_demo_orders") ?? "[]") as Order[];
            const local = stored.find((o: Order) => o.orderRef.toUpperCase() === ref.toUpperCase());
            if (local) { setOrder(local); return; }
        } catch {}
        // Fall back to seeded demo data
        const found = getDemoOrder(ref);
        if (found) { setOrder(found); } else { setNotFound(true); }
    }

    useEffect(() => {
        const ref = params.get("ref");
        if (ref) lookup(ref);
    }, []);

    async function handleUpload() {
        if (!file) return;
        setStage("analysing");
        await new Promise(r => setTimeout(r, 1800)); // mock delay
        setExtraction({ ...MOCK_EXTRACTION, amount: Number(amount) || null });
        setStage("preview");
    }

    async function handleConfirm() {
        if (accurate === null) return;
        setSubmitting(true);
        await new Promise(r => setTimeout(r, 800));
        setSubmitting(false);
        setStage("done");
    }

    const amountNum = Number(amount.replace(/,/g, ""));
    const amountValid = order && amountNum >= minAmount && amountNum <= (order.totalAmount - order.amountPaid);

    return (
        <div className="section-container py-12 max-w-2xl">
            <div className="mb-8">
                <p className="eyebrow mb-2">Order Payment</p>
                <h1 className="section-heading text-3xl text-rw-ink">Fulfil an Order</h1>
                <p className="mt-2 text-sm text-rw-muted">You can pay for someone else&apos;s order — just enter their order reference.</p>
            </div>

            {/* Ref lookup */}
            {!order && (
                <div className="rw-card p-6">
                    <label htmlFor="order-ref-input" className="block text-sm font-semibold text-rw-ink mb-2">Order Reference</label>
                    <div className="flex gap-2">
                        <input
                            id="order-ref-input"
                            value={refInput}
                            onChange={e => setRefInput(e.target.value.toUpperCase())}
                            placeholder="e.g. FF3A9C"
                            maxLength={6}
                            className="flex-1 h-11 rounded-xl border border-[var(--rw-border-mid)] px-4 font-mono text-sm text-rw-ink bg-rw-surface focus:outline-none focus:ring-2 focus:ring-rw-crimson/30 focus:border-rw-crimson uppercase tracking-widest"
                        />
                        <Button variant="primary" onClick={() => lookup(refInput)} disabled={refInput.length < 4} id="lookup-order-btn">
                            Look up
                        </Button>
                    </div>
                    {notFound && <p className="mt-2 text-sm text-red-500">Order not found. Check the reference and try again.</p>}
                </div>
            )}

            {/* Order loaded */}
            {order && stage !== "done" && (
                <div className="flex flex-col gap-5">
                    {/* Order summary */}
                    <div className="rw-card p-5">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <p className="text-xs text-rw-muted font-semibold uppercase tracking-wider">Order</p>
                                <p className="font-mono font-bold text-2xl text-rw-crimson tracking-wider">{order.orderRef}</p>
                            </div>
                            <span className={`badge-${order.status} inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wide`}>
                                {order.status.replace("_", " ")}
                            </span>
                        </div>
                        <p className="text-sm font-semibold text-rw-ink mb-3">{order.customerName}</p>
                        <ul className="flex flex-col gap-2 mb-4">
                            {order.items.map(i => (
                                <li key={i.id} className="flex justify-between text-sm">
                                    <span className="text-rw-text-2">{i.productName} <span className="text-rw-muted text-xs">· {i.variantLabel} × {i.quantity}</span></span>
                                    <span className="font-semibold text-rw-ink">₦{(i.unitPrice * i.quantity).toLocaleString()}</span>
                                </li>
                            ))}
                        </ul>
                        <ProgressBar paid={order.amountPaid} total={order.totalAmount} />
                    </div>

                    {/* Bank details */}
                    <div className="rw-card p-5">
                        <p className="text-sm font-semibold text-rw-ink mb-3">Transfer to</p>
                        <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                            <dt className="text-rw-muted">Bank</dt>
                            <dd className="font-semibold text-rw-ink">{PAYMENT_CONFIG.bank}</dd>
                            <dt className="text-rw-muted">Account name</dt>
                            <dd className="font-semibold text-rw-ink">{PAYMENT_CONFIG.accountName}</dd>
                            <dt className="text-rw-muted">Account number</dt>
                            <dd className="flex items-center gap-2">
                                <span className="font-mono font-bold text-rw-ink tracking-widest">{PAYMENT_CONFIG.accountNumber}</span>
                                <button
                                    onClick={() => navigator.clipboard.writeText(PAYMENT_CONFIG.accountNumber)}
                                    className="text-xs text-rw-crimson hover:underline"
                                    aria-label="Copy account number"
                                >Copy</button>
                            </dd>
                        </dl>
                        <p className="mt-3 text-xs text-rw-muted border-t border-[var(--rw-border)] pt-3">
                            Minimum payment: ₦{minAmount.toLocaleString()} ({PAYMENT_CONFIG.minPercent}% of total)
                        </p>
                    </div>

                    {/* Payment form */}
                    {stage === "idle" && (
                        <div className="rw-card p-5 flex flex-col gap-4">
                            <h2 className="font-display font-bold text-rw-ink">Submit payment</h2>

                            <div>
                                <label htmlFor="payment-amount" className="block text-sm font-medium text-rw-ink mb-1.5">
                                    Amount you&apos;re paying (₦)
                                </label>
                                <input
                                    id="payment-amount"
                                    type="number"
                                    min={minAmount}
                                    value={amount}
                                    onChange={e => setAmount(e.target.value)}
                                    placeholder={`Min ₦${minAmount.toLocaleString()}`}
                                    className="w-full h-11 rounded-xl border border-[var(--rw-border-mid)] px-4 text-sm bg-rw-surface text-rw-ink focus:outline-none focus:ring-2 focus:ring-rw-crimson/30 focus:border-rw-crimson"
                                />
                                {amount && !amountValid && (
                                    <p className="mt-1 text-xs text-red-500">
                                        Minimum amount is ₦{minAmount.toLocaleString()} ({PAYMENT_CONFIG.minPercent}%)
                                    </p>
                                )}
                            </div>

                            {/* Upload */}
                            <div>
                                <label htmlFor="receipt-upload" className="block text-sm font-medium text-rw-ink mb-1.5">Receipt</label>
                                <label
                                    htmlFor="receipt-upload"
                                    className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[var(--rw-border-mid)] bg-rw-bg-alt p-8 cursor-pointer hover:border-rw-crimson/40 transition-colors"
                                >
                                    {file ? (
                                        <p className="text-sm font-medium text-rw-ink">{file.name}</p>
                                    ) : (
                                        <>
                                            <svg className="h-8 w-8 text-rw-muted" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" /></svg>
                                            <p className="text-sm text-rw-muted">Drop your receipt here, or <span className="text-rw-crimson font-medium">browse</span></p>
                                            <p className="text-xs text-rw-muted">JPG, PNG, PDF — max 6 MB</p>
                                        </>
                                    )}
                                    <input id="receipt-upload" type="file" accept="image/*,application/pdf" className="sr-only" onChange={e => setFile(e.target.files?.[0] ?? null)} />
                                </label>
                            </div>

                            <Button variant="primary" size="lg" onClick={handleUpload} disabled={!file || !amountValid} id="submit-receipt-btn">
                                Submit Receipt
                            </Button>
                        </div>
                    )}

                    {/* Analysing */}
                    {stage === "analysing" && (
                        <div className="rw-card p-8 text-center flex flex-col items-center gap-3">
                            <span className="h-8 w-8 rounded-full border-2 border-rw-crimson border-t-transparent animate-spin" />
                            <p className="font-medium text-rw-ink">Analysing receipt…</p>
                            <p className="text-xs text-rw-muted">Extracting payment details</p>
                        </div>
                    )}

                    {/* Preview extraction */}
                    {stage === "preview" && extraction && (
                        <div className="rw-card p-5 flex flex-col gap-4 animate-fade-in-up">
                            <div className="flex items-center justify-between">
                                <h2 className="font-display font-bold text-rw-ink">Receipt analysis</h2>
                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold border ${
                                    extraction.confidence === "high" ? "bg-green-50 text-green-700 border-green-200"
                                    : extraction.confidence === "medium" ? "bg-amber-50 text-amber-700 border-amber-200"
                                    : "bg-red-50 text-red-700 border-red-200"
                                }`}>
                                    {extraction.confidence} confidence
                                </span>
                            </div>

                            <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm border border-[var(--rw-border)] rounded-xl p-4 bg-rw-bg-alt">
                                {[
                                    ["Sender", extraction.senderName ?? "—"],
                                    ["Amount", extraction.amount ? `₦${extraction.amount.toLocaleString()}` : "—"],
                                    ["Date", extraction.date ?? "—"],
                                    ["Time", extraction.time ?? "—"],
                                    ["Bank", extraction.bank ?? "—"],
                                ].map(([k, v]) => (
                                    <div key={k}>
                                        <dt className="text-rw-muted text-xs">{k}</dt>
                                        <dd className="font-semibold text-rw-ink">{v}</dd>
                                    </div>
                                ))}
                            </dl>

                            <div className="border border-[var(--rw-border)] rounded-xl p-4">
                                <p className="text-sm font-semibold text-rw-ink mb-3">Is this information accurate?</p>
                                <div className="flex flex-col gap-2">
                                    {[
                                        { val: true,  label: "Yes, this looks correct" },
                                        { val: false, label: "No, something looks wrong — please review manually" },
                                    ].map(opt => (
                                        <label key={String(opt.val)} className="flex items-start gap-3 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="accuracy"
                                                checked={accurate === opt.val}
                                                onChange={() => setAccurate(opt.val)}
                                                className="mt-0.5 accent-rw-crimson"
                                            />
                                            <span className="text-sm text-rw-ink">{opt.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <Button
                                variant="primary" size="lg"
                                onClick={handleConfirm}
                                disabled={accurate === null || submitting}
                                loading={submitting}
                                id="confirm-receipt-btn"
                            >
                                Confirm Submission
                            </Button>
                        </div>
                    )}

                    {/* Payment history */}
                    {order.payments.length > 0 && stage !== "preview" && stage !== "analysing" && (
                        <div className="rw-card p-5">
                            <p className="text-sm font-semibold text-rw-ink mb-3">Previous payments</p>
                            <ul className="flex flex-col gap-2">
                                {order.payments.map(p => (
                                    <li key={p.id} className="flex items-center justify-between text-sm border-b border-[var(--rw-border)] pb-2 last:border-0 last:pb-0">
                                        <div>
                                            <span className="font-semibold text-rw-ink">₦{p.amountClaimed.toLocaleString()}</span>
                                            <span className="text-rw-muted ml-2">— {new Date(p.createdAt).toLocaleDateString("en-NG")}</span>
                                        </div>
                                        <span className={`badge-${p.status} inline-flex items-center rounded-full px-2 py-0.5 text-xs font-bold`}>
                                            {p.status}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}

            {/* Done */}
            {stage === "done" && (
                <div className="rw-card p-8 text-center flex flex-col items-center gap-4 animate-fade-in-up">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-50 border border-green-200">
                        <svg className="h-7 w-7 text-green-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                    </div>
                    <div>
                        <h2 className="font-display font-bold text-xl text-rw-ink">Receipt submitted</h2>
                        <p className="mt-2 text-sm text-rw-muted max-w-[36ch] mx-auto">
                            Your payment is being reviewed. We&apos;ll notify {order?.customerEmail} once it&apos;s confirmed.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

export function FulfilClient() {
    return (
        <Suspense fallback={<div className="section-container py-12"><p className="text-rw-muted">Loading…</p></div>}>
            <FulfilContent />
        </Suspense>
    );
}
