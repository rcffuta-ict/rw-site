"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { getDemoOrder } from "@/lib/data/orders";
import type { Order } from "@/lib/data/types";

const PAYMENT_CONFIG = { bank: "First Bank", accountName: "RCF FUTA", accountNumber: "3012345678", minPercent: 50 };

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
            <div className="progress-bar-track">
                <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
            </div>
            <div className="flex justify-between text-xs text-rw-muted mt-2">
                <span>₦{paid.toLocaleString()} paid</span>
                <span>₦{(total - paid).toLocaleString()} remaining</span>
            </div>
        </div>
    );
}

function RadioCard({ selected, onClick, title, desc }: { selected: boolean; onClick: () => void; title: string; desc: string }) {
    return (
        <button type="button" onClick={onClick} className={`radio-card text-left w-full ${selected ? "selected" : ""}`}>
            <span className="radio-dot" />
            <div>
                <p className="font-semibold text-sm text-rw-ink">{title}</p>
                <p className="text-xs text-rw-muted mt-0.5">{desc}</p>
            </div>
        </button>
    );
}

function FulfilContent() {
    const params = useSearchParams();
    const [refInput, setRefInput] = useState(params.get("ref") ?? "");
    const [order, setOrder] = useState<Order | null>(null);
    const [notFound, setNotFound] = useState(false);

    // Payment form state
    const [paymentType, setPaymentType] = useState<"full" | "partial" | null>(null);
    const [partialPercent, setPartialPercent] = useState(50);
    const [file, setFile] = useState<File | null>(null);
    const [stage, setStage] = useState<"idle" | "analysing" | "preview" | "done">("idle");
    const [extraction, setExtraction] = useState<typeof MOCK_EXTRACTION | null>(null);
    const [accurate, setAccurate] = useState<boolean | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const remaining = order ? order.totalAmount - order.amountPaid : 0;
    const payAmount = paymentType === "full" ? remaining : Math.ceil(remaining * partialPercent / 100);

    function lookup(ref: string) {
        setNotFound(false);
        try {
            const stored = JSON.parse(localStorage.getItem("rw_demo_orders") ?? "[]") as Order[];
            const local = stored.find((o: Order) => o.orderRef.toUpperCase() === ref.toUpperCase());
            if (local) { setOrder(local); return; }
        } catch {}
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
        await new Promise(r => setTimeout(r, 1800));
        setExtraction({ ...MOCK_EXTRACTION, amount: payAmount || null });
        setStage("preview");
    }

    async function handleConfirm() {
        if (accurate === null) return;
        setSubmitting(true);
        await new Promise(r => setTimeout(r, 800));
        setSubmitting(false);
        setStage("done");
    }

    function resetUpload() {
        setFile(null);
        setStage("idle");
        setExtraction(null);
        setAccurate(null);
    }

    return (
        <div className="section-container py-12 lg:py-16">
            <div className="max-w-3xl mx-auto">
                <div className="mb-8">
                    <p className="eyebrow mb-2">Order Payment</p>
                    <h1 className="section-heading text-3xl lg:text-4xl">Fulfil an Order</h1>
                    <p className="mt-2 text-rw-muted">You can pay for someone else&apos;s order — just enter their order reference.</p>
                </div>

                {/* Ref lookup */}
                {!order && (
                    <div className="rw-card p-6 sm:p-8">
                        <label htmlFor="order-ref-input" className="block text-sm font-semibold text-rw-ink mb-3">Order Reference</label>
                        <div className="flex gap-3">
                            <input id="order-ref-input" value={refInput}
                                onChange={e => setRefInput(e.target.value.toUpperCase())}
                                placeholder="e.g. FF3A9C" maxLength={6}
                                className="rw-input flex-1 font-mono uppercase tracking-widest"
                            />
                            <Button variant="primary" onClick={() => lookup(refInput)} disabled={refInput.length < 4} id="lookup-order-btn">
                                Look up
                            </Button>
                        </div>
                        {notFound && <p className="mt-3 text-sm text-red-500">Order not found. Check the reference and try again.</p>}
                    </div>
                )}

                {/* Order loaded */}
                {order && stage !== "done" && (
                    <div className="flex flex-col gap-6">
                        {/* Order summary with item previews */}
                        <div className="rw-card p-6 sm:p-8">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <p className="text-xs text-rw-muted font-semibold uppercase tracking-wider">Order</p>
                                    <p className="font-mono font-bold text-3xl text-rw-crimson tracking-wider">{order.orderRef}</p>
                                </div>
                                <span className={`badge-${order.status} inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide`}>
                                    {order.status.replace("_", " ")}
                                </span>
                            </div>
                            <p className="text-sm font-semibold text-rw-ink mb-4">{order.customerName}</p>

                            {/* Item previews */}
                            <div className="flex flex-col gap-3 mb-6">
                                {order.items.map(i => (
                                    <div key={i.id} className="flex items-center gap-3 p-3 rounded-xl bg-rw-bg-alt">
                                        <img src={`https://placehold.co/56x56?text=${encodeURIComponent(i.productName.slice(0,6))}`} alt={i.productName} className="h-14 w-14 rounded-lg object-cover shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-sm text-rw-ink truncate">{i.productName}</p>
                                            <p className="text-xs text-rw-muted">{i.variantLabel} × {i.quantity}</p>
                                        </div>
                                        <span className="font-semibold text-sm text-rw-ink shrink-0">₦{(i.unitPrice * i.quantity).toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>

                            <ProgressBar paid={order.amountPaid} total={order.totalAmount} />
                        </div>

                        {/* Bank details */}
                        <div className="rw-card p-6 sm:p-8">
                            <p className="font-semibold text-rw-ink mb-4">Transfer to</p>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="p-4 rounded-xl bg-rw-bg-alt">
                                    <p className="text-xs text-rw-muted mb-1">Bank</p>
                                    <p className="font-semibold text-rw-ink">{PAYMENT_CONFIG.bank}</p>
                                </div>
                                <div className="p-4 rounded-xl bg-rw-bg-alt">
                                    <p className="text-xs text-rw-muted mb-1">Account Name</p>
                                    <p className="font-semibold text-rw-ink">{PAYMENT_CONFIG.accountName}</p>
                                </div>
                                <div className="p-4 rounded-xl bg-rw-bg-alt">
                                    <p className="text-xs text-rw-muted mb-1">Account Number</p>
                                    <div className="flex items-center gap-2">
                                        <span className="font-mono font-bold text-rw-ink tracking-widest">{PAYMENT_CONFIG.accountNumber}</span>
                                        <button onClick={() => navigator.clipboard.writeText(PAYMENT_CONFIG.accountNumber)} className="text-xs text-rw-crimson hover:underline">Copy</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment form */}
                        {stage === "idle" && (
                            <div className="rw-card p-6 sm:p-8 flex flex-col gap-6">
                                <h2 className="font-display font-bold text-lg text-rw-ink">Submit payment</h2>

                                {/* Payment type selection */}
                                <div>
                                    <p className="text-sm font-semibold text-rw-ink mb-3">How are you paying?</p>
                                    <div className="flex flex-col gap-3">
                                        <RadioCard
                                            selected={paymentType === "full"}
                                            onClick={() => setPaymentType("full")}
                                            title="Pay in full"
                                            desc={`Pay the entire remaining balance of ₦${remaining.toLocaleString()}`}
                                        />
                                        <RadioCard
                                            selected={paymentType === "partial"}
                                            onClick={() => setPaymentType("partial")}
                                            title="Pay in part"
                                            desc={`Pay a portion (minimum ${PAYMENT_CONFIG.minPercent}% of remaining)`}
                                        />
                                    </div>
                                </div>

                                {/* Partial percentage picker */}
                                {paymentType === "partial" && (
                                    <div className="p-5 rounded-xl bg-rw-bg-alt border border-[var(--rw-border)]">
                                        <div className="flex items-center justify-between mb-3">
                                            <p className="text-sm font-medium text-rw-ink">Payment percentage</p>
                                            <span className="font-mono font-bold text-rw-crimson text-lg">{partialPercent}%</span>
                                        </div>
                                        <input
                                            type="range"
                                            min={PAYMENT_CONFIG.minPercent}
                                            max={100}
                                            value={partialPercent}
                                            onChange={e => setPartialPercent(Number(e.target.value))}
                                            className="w-full accent-rw-crimson h-2 rounded-full cursor-pointer"
                                        />
                                        <div className="flex justify-between text-xs text-rw-muted mt-2">
                                            <span>{PAYMENT_CONFIG.minPercent}% min</span>
                                            <span>100%</span>
                                        </div>
                                        <p className="mt-3 text-sm font-semibold text-rw-ink">
                                            Amount: <span className="text-rw-crimson">₦{payAmount.toLocaleString()}</span>
                                        </p>
                                    </div>
                                )}

                                {/* Upload receipt */}
                                {paymentType && (
                                    <div>
                                        <p className="text-sm font-semibold text-rw-ink mb-3">
                                            Upload receipt for ₦{payAmount.toLocaleString()}
                                        </p>
                                        <label htmlFor="receipt-upload"
                                            className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-[var(--rw-border-mid)] bg-rw-bg-alt p-10 cursor-pointer hover:border-rw-crimson/40 transition-colors"
                                        >
                                            {file ? (
                                                <div className="text-center">
                                                    <svg className="h-8 w-8 text-green-500 mx-auto mb-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                                                    <p className="text-sm font-medium text-rw-ink">{file.name}</p>
                                                    <p className="text-xs text-rw-muted mt-1">Click to change</p>
                                                </div>
                                            ) : (
                                                <>
                                                    <svg className="h-10 w-10 text-rw-muted" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" /></svg>
                                                    <div className="text-center">
                                                        <p className="text-sm font-medium text-rw-ink">Drop your receipt here</p>
                                                        <p className="text-xs text-rw-muted mt-1">or <span className="text-rw-crimson font-semibold">browse files</span></p>
                                                    </div>
                                                    <p className="text-xs text-rw-muted">JPG, PNG, PDF — max 6 MB</p>
                                                </>
                                            )}
                                            <input id="receipt-upload" type="file" accept="image/*,application/pdf" className="sr-only" onChange={e => setFile(e.target.files?.[0] ?? null)} />
                                        </label>
                                    </div>
                                )}

                                {paymentType && (
                                    <Button variant="primary" size="lg" onClick={handleUpload} disabled={!file} id="submit-receipt-btn" className="w-full">
                                        Submit Receipt
                                    </Button>
                                )}
                            </div>
                        )}

                        {/* Analysing */}
                        {stage === "analysing" && (
                            <div className="rw-card p-10 text-center flex flex-col items-center gap-4">
                                <span className="h-10 w-10 rounded-full border-3 border-rw-crimson border-t-transparent animate-spin" />
                                <p className="font-semibold text-rw-ink text-lg">Analysing receipt…</p>
                                <p className="text-sm text-rw-muted">Extracting payment details from your receipt</p>
                            </div>
                        )}

                        {/* Preview extraction */}
                        {stage === "preview" && extraction && (
                            <div className="rw-card p-6 sm:p-8 flex flex-col gap-6 animate-fade-in-up">
                                <div className="flex items-center justify-between">
                                    <h2 className="font-display font-bold text-lg text-rw-ink">Receipt Analysis</h2>
                                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold border ${
                                        extraction.confidence === "high" ? "bg-green-50 text-green-700 border-green-200"
                                        : extraction.confidence === "medium" ? "bg-amber-50 text-amber-700 border-amber-200"
                                        : "bg-red-50 text-red-700 border-red-200"
                                    }`}>
                                        {extraction.confidence} confidence
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    {[
                                        ["Sender", extraction.senderName ?? "—"],
                                        ["Amount", extraction.amount ? `₦${extraction.amount.toLocaleString()}` : "—"],
                                        ["Date", extraction.date ?? "—"],
                                        ["Time", extraction.time ?? "—"],
                                        ["Bank", extraction.bank ?? "—"],
                                    ].map(([k, v]) => (
                                        <div key={k} className="p-3 rounded-xl bg-rw-bg-alt">
                                            <p className="text-xs text-rw-muted mb-1">{k}</p>
                                            <p className="font-semibold text-sm text-rw-ink">{v}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Accuracy check — custom radio cards */}
                                <div>
                                    <p className="text-sm font-semibold text-rw-ink mb-3">Is this information accurate?</p>
                                    <div className="flex flex-col gap-3">
                                        <RadioCard
                                            selected={accurate === true}
                                            onClick={() => setAccurate(true)}
                                            title="Yes, this looks correct"
                                            desc="The extracted details match my payment"
                                        />
                                        <RadioCard
                                            selected={accurate === false}
                                            onClick={() => setAccurate(false)}
                                            title="No, something looks wrong"
                                            desc="The admin will still review the payment proof manually"
                                        />
                                    </div>
                                </div>

                                {accurate === false && (
                                    <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                                        <p className="text-sm text-amber-800 mb-3">You can upload a better receipt, or proceed anyway — the admin will review manually.</p>
                                        <Button variant="outlined" size="sm" onClick={resetUpload}>Upload a different receipt</Button>
                                    </div>
                                )}

                                <Button variant="primary" size="lg" onClick={handleConfirm} disabled={accurate === null || submitting} loading={submitting} id="confirm-receipt-btn" className="w-full">
                                    Confirm Submission
                                </Button>
                            </div>
                        )}

                        {/* Payment history */}
                        {order.payments.length > 0 && stage !== "preview" && stage !== "analysing" && (
                            <div className="rw-card p-6">
                                <p className="font-semibold text-rw-ink mb-4">Previous payments</p>
                                <ul className="flex flex-col gap-3">
                                    {order.payments.map(p => (
                                        <li key={p.id} className="flex items-center justify-between p-3 rounded-xl bg-rw-bg-alt">
                                            <div>
                                                <span className="font-semibold text-sm text-rw-ink">₦{p.amountClaimed.toLocaleString()}</span>
                                                <span className="text-xs text-rw-muted ml-2">— {new Date(p.createdAt).toLocaleDateString("en-NG")}</span>
                                            </div>
                                            <span className={`badge-${p.status} inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold`}>
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
                    <div className="rw-card p-10 text-center flex flex-col items-center gap-5 animate-fade-in-up">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-50 border-2 border-green-200">
                            <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                        </div>
                        <div>
                            <h2 className="font-display font-bold text-2xl text-rw-ink">Receipt submitted</h2>
                            <p className="mt-2 text-rw-muted max-w-[36ch] mx-auto">
                                Your payment is being reviewed. We&apos;ll notify {order?.customerEmail} once it&apos;s confirmed.
                            </p>
                        </div>
                    </div>
                )}
            </div>
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
