"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/components/public/CartContext";
import { Button } from "@/components/ui/Button";

type Step = 1 | 2 | 3;

function generateRef(): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    return "FF" + Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

function StepIndicator({ step }: { step: Step }) {
    const steps = ["Your Info", "Review", "Confirmed"];
    return (
        <div className="flex items-center gap-0 mb-10">
            {steps.map((label, i) => {
                const n = (i + 1) as Step;
                const active = n === step;
                const done   = n < step;
                return (
                    <div key={label} className="flex items-center">
                        <div className="flex items-center gap-2">
                            <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold border transition-colors ${
                                done  ? "bg-rw-crimson border-rw-crimson text-white"
                                : active ? "border-rw-crimson text-rw-crimson"
                                : "border-gray-300 text-gray-400"
                            }`}>
                                {done ? "✓" : n}
                            </span>
                            <span className={`text-sm font-medium ${active ? "text-rw-ink" : "text-rw-muted"}`}>{label}</span>
                        </div>
                        {i < steps.length - 1 && <div className={`h-px w-12 sm:w-20 mx-3 ${done ? "bg-rw-crimson" : "bg-gray-200"}`} />}
                    </div>
                );
            })}
        </div>
    );
}

export function CheckoutClient() {
    const { items, total, clearCart } = useCart();
    const [step, setStep] = useState<Step>(1);
    const [orderRef, setOrderRef] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [form, setForm] = useState({ name: "", email: "", phone: "", note: "" });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [submitting, setSubmitting] = useState(false);

    function validate() {
        const e: Record<string, string> = {};
        if (!form.name.trim())  e.name  = "Name is required";
        if (!form.email.trim()) e.email = "Email is required";
        if (!form.phone.trim()) e.phone = "Phone is required";
        setErrors(e);
        return Object.keys(e).length === 0;
    }

    async function handleSubmit() {
        if (!validate()) return;
        setSubmitting(true);
        await new Promise(r => setTimeout(r, 1200)); // demo delay
        const ref = generateRef();
        // Store demo order in localStorage
        try {
            const existing = JSON.parse(localStorage.getItem("rw_demo_orders") ?? "[]") as unknown[];
            existing.push({
                orderRef: ref,
                customerName: form.name,
                customerEmail: form.email,
                customerPhone: form.phone,
                customerNote: form.note || null,
                status: "pending",
                totalAmount: total,
                amountPaid: 0,
                items: items.map(i => ({
                    id: crypto.randomUUID(),
                    variantId: i.variantId,
                    productName: i.productName,
                    variantLabel: i.variantLabel,
                    quantity: i.quantity,
                    unitPrice: i.unitPrice,
                })),
                payments: [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            });
            localStorage.setItem("rw_demo_orders", JSON.stringify(existing));
        } catch {}
        setOrderRef(ref);
        clearCart();
        setSubmitting(false);
        setStep(3);
    }

    async function copyRef() {
        if (!orderRef) return;
        await navigator.clipboard.writeText(orderRef);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    function field(id: string, label: string, type = "text", placeholder = "") {
        const key = id as keyof typeof form;
        return (
            <div>
                <label htmlFor={id} className="block text-sm font-medium text-rw-ink mb-1.5">{label}</label>
                <input
                    id={id}
                    type={type}
                    value={form[key]}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    placeholder={placeholder}
                    className={`w-full h-11 rounded-xl border px-4 text-sm bg-rw-surface text-rw-ink placeholder:text-rw-muted/60 focus:outline-none focus:ring-2 focus:ring-rw-crimson/30 focus:border-rw-crimson transition-colors ${
                        errors[id] ? "border-red-400" : "border-[var(--rw-border-mid)]"
                    }`}
                />
                {errors[id] && <p className="mt-1 text-xs text-red-500">{errors[id]}</p>}
            </div>
        );
    }

    return (
        <div className="section-container py-12 max-w-2xl">
            <div className="mb-8">
                <h1 className="section-heading text-3xl text-rw-ink">Checkout</h1>
            </div>

            <StepIndicator step={step} />

            {/* Step 1 — Info */}
            {step === 1 && (
                <div className="rw-card p-6 flex flex-col gap-4">
                    <h2 className="font-display font-bold text-rw-ink">Your details</h2>
                    {field("name",  "Full name",    "text",  "e.g. Adewale Ogundimu")}
                    {field("email", "Email address","email", "you@example.com")}
                    {field("phone", "Phone number", "tel",   "080...")}
                    <div>
                        <label htmlFor="note" className="block text-sm font-medium text-rw-ink mb-1.5">
                            Note <span className="font-normal text-rw-muted">(optional)</span>
                        </label>
                        <textarea
                            id="note"
                            rows={2}
                            value={form.note}
                            onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
                            placeholder="e.g. Hold for Sunday pickup"
                            className="w-full rounded-xl border border-[var(--rw-border-mid)] px-4 py-3 text-sm bg-rw-surface text-rw-ink placeholder:text-rw-muted/60 focus:outline-none focus:ring-2 focus:ring-rw-crimson/30 focus:border-rw-crimson resize-none transition-colors"
                        />
                    </div>
                    <Button variant="primary" size="lg" onClick={() => { if (validate()) setStep(2); }} className="mt-2">
                        Review Order →
                    </Button>
                </div>
            )}

            {/* Step 2 — Review */}
            {step === 2 && (
                <div className="flex flex-col gap-4">
                    <div className="rw-card p-6">
                        <h2 className="font-display font-bold text-rw-ink mb-4">Order summary</h2>
                        {items.length === 0 ? (
                            <p className="text-sm text-rw-muted">Your cart is empty. <Link href="/shop" className="text-rw-crimson hover:underline">Go to shop</Link></p>
                        ) : (
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-[var(--rw-border)] text-rw-muted">
                                        <th className="pb-2 text-left font-semibold">Item</th>
                                        <th className="pb-2 text-right font-semibold">Qty</th>
                                        <th className="pb-2 text-right font-semibold">Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map(i => (
                                        <tr key={i.variantId} className="border-b border-[var(--rw-border)] last:border-0">
                                            <td className="py-3">
                                                <p className="font-semibold text-rw-ink">{i.productName}</p>
                                                <p className="text-xs text-rw-muted">{i.variantLabel}</p>
                                            </td>
                                            <td className="py-3 text-right text-rw-text-2">{i.quantity}</td>
                                            <td className="py-3 text-right font-semibold text-rw-ink">₦{(i.unitPrice * i.quantity).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td colSpan={2} className="pt-4 font-semibold text-rw-ink">Total</td>
                                        <td className="pt-4 text-right font-bold text-rw-crimson text-lg">₦{total.toLocaleString()}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        )}
                    </div>

                    <div className="rw-card p-5 flex flex-col sm:flex-row gap-4 justify-between items-start">
                        <div className="text-sm text-rw-text-2">
                            <p><span className="font-semibold text-rw-ink">Name:</span> {form.name}</p>
                            <p><span className="font-semibold text-rw-ink">Email:</span> {form.email}</p>
                            <p><span className="font-semibold text-rw-ink">Phone:</span> {form.phone}</p>
                            {form.note && <p><span className="font-semibold text-rw-ink">Note:</span> {form.note}</p>}
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => setStep(1)}>Edit</Button>
                    </div>

                    <div className="flex gap-3">
                        <Button variant="outlined" size="lg" onClick={() => setStep(1)}>Back</Button>
                        <Button variant="primary" size="lg" loading={submitting} onClick={handleSubmit} className="flex-1" id="confirm-order-btn">
                            {submitting ? "Placing order…" : "Place Order"}
                        </Button>
                    </div>
                </div>
            )}

            {/* Step 3 — Confirmed */}
            {step === 3 && orderRef && (
                <div className="flex flex-col gap-6 animate-fade-in-up">
                    <div className="rw-card p-8 text-center flex flex-col items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-50 border border-green-200">
                            <svg className="h-7 w-7 text-green-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                        </div>
                        <div>
                            <h2 className="font-display font-bold text-2xl text-rw-ink">Order placed!</h2>
                            <p className="mt-1 text-sm text-rw-muted">Your order reference is:</p>
                        </div>

                        {/* The order ref — styled deliberately */}
                        <div className="w-full rounded-2xl border-2 border-rw-crimson/30 bg-rw-bg-alt px-8 py-6 text-center">
                            <p className="font-mono text-5xl font-bold text-rw-ink tracking-[0.12em]">
                                {orderRef}
                            </p>
                            <p className="mt-2 text-xs text-rw-muted">Like a CSS colour code — keep it safe, share it with whoever is paying.</p>
                        </div>

                        <div className="flex flex-wrap gap-3 justify-center">
                            <Button variant="outlined" size="md" onClick={copyRef} id="copy-order-ref">
                                {copied ? "Copied!" : "Copy Ref"}
                            </Button>
                            <Link href={`/fulfil?ref=${orderRef}`} id="go-to-fulfil">
                                <Button variant="primary" size="md">
                                    Go to Payment →
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <p className="text-center text-xs text-rw-muted">
                        You can also pay later by going to <Link href="/fulfil" className="text-rw-crimson hover:underline">/fulfil</Link> and entering your reference.
                    </p>
                </div>
            )}
        </div>
    );
}
