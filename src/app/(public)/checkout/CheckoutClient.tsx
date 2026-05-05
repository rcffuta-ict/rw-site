"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/public/CartContext";
import { Button } from "@/components/ui/Button";
import { ph } from "@/lib/utils/functions";

type Step = 1 | 2 | 3;

function generateRef(): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    return (
        "FF" +
        Array.from(
            { length: 4 },
            () => chars[Math.floor(Math.random() * chars.length)]
        ).join("")
    );
}

function StepIndicator({ step }: { step: Step }) {
    const steps = ["Your Info", "Review", "Confirmed"];
    return (
        <div className="flex items-center gap-0 mb-8">
            {steps.map((label, i) => {
                const n = (i + 1) as Step;
                const active = n === step;
                const done = n < step;
                return (
                    <div key={label} className="flex items-center">
                        <div className="flex items-center gap-2.5">
                            <span
                                className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-all ${
                                    done
                                        ? "bg-rw-crimson text-white"
                                        : active
                                          ? "border-2 border-rw-crimson text-rw-crimson"
                                          : "border-2 border-gray-200 text-gray-400"
                                }`}
                            >
                                {done ? "✓" : n}
                            </span>
                            <span
                                className={`text-sm font-medium hidden sm:block ${active ? "text-rw-ink" : done ? "text-rw-ink" : "text-rw-muted"}`}
                            >
                                {label}
                            </span>
                        </div>
                        {i < steps.length - 1 && (
                            <div
                                className={`h-px w-10 sm:w-16 mx-3 ${done ? "bg-rw-crimson" : "bg-gray-200"}`}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
}

function OrderSummaryPanel({
    items,
    total,
}: {
    items: ReturnType<typeof useCart>["items"];
    total: number;
}) {
    return (
        <div className="rw-card p-6 sticky top-24">
            <h3 className="font-display font-bold text-rw-ink mb-5">Order Summary</h3>
            <ul className="flex flex-col gap-4 mb-6">
                {items.map((i) => (
                    <li key={i.variantId} className="flex gap-3">
                        <div className="h-16 w-16 rounded-xl overflow-hidden shrink-0 bg-rw-bg-alt">
                            <img
                                src={ph(64, 64, i.productName.slice(0, 6))}
                                alt={i.productName}
                                className="h-full w-full object-cover"
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm text-rw-ink truncate">
                                {i.productName}
                            </p>
                            <p className="text-xs text-rw-muted truncate">
                                {i.variantLabel}
                            </p>
                            <div className="flex justify-between mt-1">
                                <span className="text-xs text-rw-muted">
                                    Qty: {i.quantity}
                                </span>
                                <span className="text-sm font-semibold text-rw-ink">
                                    ₦{(i.unitPrice * i.quantity).toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
            <div className="border-t border-[var(--rw-border)] pt-4 flex justify-between items-center">
                <span className="font-medium text-rw-text-2">Total</span>
                <span className="font-display font-bold text-2xl text-rw-crimson">
                    ₦{total.toLocaleString()}
                </span>
            </div>
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
        if (!form.name.trim()) e.name = "Name is required";
        if (!form.email.trim()) e.email = "Email is required";
        if (!form.phone.trim()) e.phone = "Phone is required";
        setErrors(e);
        return Object.keys(e).length === 0;
    }

    async function handleSubmit() {
        if (!validate()) return;
        setSubmitting(true);
        await new Promise((r) => setTimeout(r, 1200));
        const ref = generateRef();
        try {
            const existing = JSON.parse(
                localStorage.getItem("rw_demo_orders") ?? "[]"
            ) as unknown[];
            existing.push({
                orderRef: ref,
                customerName: form.name,
                customerEmail: form.email,
                customerPhone: form.phone,
                customerNote: form.note || null,
                status: "pending",
                totalAmount: total,
                amountPaid: 0,
                items: items.map((i) => ({
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
            // Store order ref for device-linked order history
            const refs = JSON.parse(
                localStorage.getItem("rw_order_refs") ?? "[]"
            ) as string[];
            refs.push(ref);
            localStorage.setItem("rw_order_refs", JSON.stringify(refs));
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
                <label
                    htmlFor={id}
                    className="block text-sm font-medium text-rw-ink mb-2"
                >
                    {label}
                </label>
                <input
                    id={id}
                    type={type}
                    value={form[key]}
                    onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                    placeholder={placeholder}
                    className={`rw-input ${errors[id] ? "error" : ""}`}
                />
                {errors[id] && (
                    <p className="mt-1.5 text-xs text-red-500">{errors[id]}</p>
                )}
            </div>
        );
    }

    if (items.length === 0 && step !== 3) {
        return (
            <div className="section-container py-20 text-center">
                <div className="max-w-md mx-auto">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-rw-bg-alt mx-auto mb-6">
                        <svg
                            className="h-8 w-8 text-rw-muted"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={1.5}
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                            />
                        </svg>
                    </div>
                    <h1 className="section-heading text-2xl mb-2">Your cart is empty</h1>
                    <p className="text-rw-muted mb-6">
                        Add some merch before checking out.
                    </p>
                    <Link href="/shop">
                        <Button variant="primary" size="lg">
                            Browse Merch
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="section-container py-12 lg:py-16">
            <h1 className="section-heading text-3xl mb-2">Checkout</h1>
            <p className="text-rw-muted mb-8">Complete your order in a few steps.</p>

            <StepIndicator step={step} />

            {step !== 3 ? (
                <div className="grid lg:grid-cols-[1fr_380px] gap-8 items-start">
                    {/* Left — form area */}
                    <div>
                        {step === 1 && (
                            <div className="rw-card p-6 sm:p-8 flex flex-col gap-5">
                                <h2 className="font-display font-bold text-lg text-rw-ink">
                                    Your details
                                </h2>
                                {field(
                                    "name",
                                    "Full name",
                                    "text",
                                    "e.g. Adewale Ogundimu"
                                )}
                                {field(
                                    "email",
                                    "Email address",
                                    "email",
                                    "you@example.com"
                                )}
                                {field("phone", "Phone number", "tel", "080...")}
                                <div>
                                    <label
                                        htmlFor="note"
                                        className="block text-sm font-medium text-rw-ink mb-2"
                                    >
                                        Note{" "}
                                        <span className="font-normal text-rw-muted">
                                            (optional)
                                        </span>
                                    </label>
                                    <textarea
                                        id="note"
                                        rows={2}
                                        value={form.note}
                                        onChange={(e) =>
                                            setForm((f) => ({
                                                ...f,
                                                note: e.target.value,
                                            }))
                                        }
                                        placeholder="e.g. Hold for Sunday pickup"
                                        className="rw-textarea"
                                    />
                                </div>
                                <Button
                                    variant="primary"
                                    size="lg"
                                    onClick={() => {
                                        if (validate()) setStep(2);
                                    }}
                                    className="mt-2"
                                >
                                    Review Order →
                                </Button>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="flex flex-col gap-5">
                                <div className="rw-card p-6 sm:p-8">
                                    <h2 className="font-display font-bold text-lg text-rw-ink mb-5">
                                        Order Review
                                    </h2>
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-[var(--rw-border)] text-rw-muted">
                                                <th className="pb-3 text-left font-semibold">
                                                    Item
                                                </th>
                                                <th className="pb-3 text-right font-semibold">
                                                    Qty
                                                </th>
                                                <th className="pb-3 text-right font-semibold">
                                                    Price
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {items.map((i) => (
                                                <tr
                                                    key={i.variantId}
                                                    className="border-b border-[var(--rw-border)] last:border-0"
                                                >
                                                    <td className="py-4">
                                                        <p className="font-semibold text-rw-ink">
                                                            {i.productName}
                                                        </p>
                                                        <p className="text-xs text-rw-muted">
                                                            {i.variantLabel}
                                                        </p>
                                                    </td>
                                                    <td className="py-4 text-right text-rw-text-2">
                                                        {i.quantity}
                                                    </td>
                                                    <td className="py-4 text-right font-semibold text-rw-ink">
                                                        ₦
                                                        {(
                                                            i.unitPrice * i.quantity
                                                        ).toLocaleString()}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="rw-card p-5 flex flex-col sm:flex-row gap-4 justify-between items-start">
                                    <div className="text-sm text-rw-text-2 space-y-1">
                                        <p>
                                            <span className="font-semibold text-rw-ink">
                                                Name:
                                            </span>{" "}
                                            {form.name}
                                        </p>
                                        <p>
                                            <span className="font-semibold text-rw-ink">
                                                Email:
                                            </span>{" "}
                                            {form.email}
                                        </p>
                                        <p>
                                            <span className="font-semibold text-rw-ink">
                                                Phone:
                                            </span>{" "}
                                            {form.phone}
                                        </p>
                                        {form.note && (
                                            <p>
                                                <span className="font-semibold text-rw-ink">
                                                    Note:
                                                </span>{" "}
                                                {form.note}
                                            </p>
                                        )}
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setStep(1)}
                                    >
                                        Edit
                                    </Button>
                                </div>

                                <div className="flex gap-3">
                                    <Button
                                        variant="outlined"
                                        size="lg"
                                        onClick={() => setStep(1)}
                                    >
                                        Back
                                    </Button>
                                    <Button
                                        variant="primary"
                                        size="lg"
                                        loading={submitting}
                                        onClick={handleSubmit}
                                        className="flex-1"
                                        id="confirm-order-btn"
                                    >
                                        {submitting ? "Placing order…" : "Place Order"}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right — order summary */}
                    <div className="hidden lg:block">
                        <OrderSummaryPanel items={items} total={total} />
                    </div>
                </div>
            ) : (
                /* Step 3 — Confirmed */
                orderRef && (
                    <div className="max-w-lg mx-auto flex flex-col gap-6 animate-fade-in-up">
                        <div className="rw-card p-10 text-center flex flex-col items-center gap-5">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-50 border-2 border-green-200">
                                <svg
                                    className="h-8 w-8 text-green-600"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="m4.5 12.75 6 6 9-13.5"
                                    />
                                </svg>
                            </div>
                            <div>
                                <h2 className="font-display font-bold text-2xl text-rw-ink">
                                    Order placed!
                                </h2>
                                <p className="mt-1 text-sm text-rw-muted">
                                    Your order reference is:
                                </p>
                            </div>
                            <div className="w-full rounded-2xl border-2 border-rw-crimson/20 bg-rw-bg-alt px-8 py-6 text-center">
                                <p className="font-mono text-5xl font-bold text-rw-ink tracking-[0.12em]">
                                    {orderRef}
                                </p>
                                <p className="mt-2 text-xs text-rw-muted">
                                    Keep it safe — share it with whoever is paying.
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-3 justify-center">
                                <Button
                                    variant="outlined"
                                    size="md"
                                    onClick={copyRef}
                                    id="copy-order-ref"
                                >
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
                            You can also pay later at{" "}
                            <Link
                                href="/fulfil"
                                className="text-rw-crimson hover:underline"
                            >
                                /fulfil
                            </Link>
                        </p>
                    </div>
                )
            )}
        </div>
    );
}
