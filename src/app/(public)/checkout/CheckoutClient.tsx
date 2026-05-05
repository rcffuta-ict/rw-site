"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/forms/Button";
import { Input } from "@/components/ui/forms/Input";
import { Textarea } from "@/components/ui/forms/Textarea";
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
        <div className="flex items-center gap-0 mb-12">
            {steps.map((label, i) => {
                const n = (i + 1) as Step;
                const active = n === step;
                const done = n < step;
                return (
                    <React.Fragment key={label}>
                        <div className="flex items-center gap-3">
                            <div
                                className={`flex h-10 w-10 items-center justify-center rounded-2xl text-sm font-black transition-all duration-300 ${
                                    done
                                        ? "bg-rw-crimson text-white shadow-lg shadow-rw-crimson/20"
                                        : active
                                          ? "bg-rw-ink text-white shadow-xl scale-110"
                                          : "bg-rw-bg-alt border border-[var(--rw-border-mid)] text-rw-muted"
                                }`}
                            >
                                {done ? (
                                    <svg
                                        className="h-5 w-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={3}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                ) : (
                                    n
                                )}
                            </div>
                            <span
                                className={`text-xs font-black uppercase tracking-widest hidden md:block ${active ? "text-rw-ink" : done ? "text-rw-crimson" : "text-rw-muted"}`}
                            >
                                {label}
                            </span>
                        </div>
                        {i < steps.length - 1 && (
                            <div className="flex-1 mx-4 max-w-[80px]">
                                <div
                                    className={`h-1 rounded-full transition-all duration-500 ${done ? "bg-rw-crimson" : "bg-rw-bg-alt border border-[var(--rw-border)]"}`}
                                />
                            </div>
                        )}
                    </React.Fragment>
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
        <div className="rw-card overflow-hidden shadow-2xl shadow-rw-ink/5 border-rw-crimson/5">
            <div className="bg-rw-bg-warm/50 px-6 py-5 border-b border-[var(--rw-border)]">
                <h3 className="font-display font-black text-rw-ink uppercase tracking-tight">
                    Order Summary
                </h3>
            </div>
            <div className="p-6">
                <ul className="flex flex-col gap-5 mb-8 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                    {items.map((i) => (
                        <li key={i.variantId} className="flex gap-4 group">
                            <div className="h-16 w-16 rounded-xl overflow-hidden shrink-0 bg-rw-bg-alt border border-[var(--rw-border)] relative">
                                <img
                                    src={ph(80, 80, i.productName.slice(0, 6))}
                                    alt={i.productName}
                                    className="h-full w-full object-cover transition-transform group-hover:scale-110"
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-sm text-rw-ink leading-tight truncate">
                                    {i.productName}
                                </p>
                                <p className="text-[10px] text-rw-muted font-bold uppercase tracking-wide mt-0.5 truncate">
                                    {i.variantLabel}
                                </p>
                                <div className="flex justify-between items-center mt-2">
                                    <span className="text-[10px] font-bold text-rw-text-2 px-2 py-0.5 rounded bg-rw-bg-alt border border-[var(--rw-border)]">
                                        Qty: {i.quantity}
                                    </span>
                                    <span className="text-sm font-bold text-rw-ink">
                                        ₦{(i.unitPrice * i.quantity).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>

                <div className="space-y-3 pt-6 border-t border-[var(--rw-border)] border-dashed">
                    <div className="flex justify-between text-sm">
                        <span className="text-rw-muted font-medium">Subtotal</span>
                        <span className="text-rw-ink font-bold">
                            ₦{total.toLocaleString()}
                        </span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-rw-muted font-medium">Processing Fee</span>
                        <span className="text-rw-ink font-bold">₦0</span>
                    </div>
                    <div className="flex justify-between items-end pt-4">
                        <span className="text-xs font-black text-rw-crimson uppercase tracking-widest">
                            Total Amount
                        </span>
                        <span className="text-2xl font-display font-black text-rw-ink leading-none">
                            ₦{total.toLocaleString()}
                        </span>
                    </div>
                </div>
            </div>
            <div className="px-6 py-4 bg-rw-ink text-white/60 text-[10px] font-bold uppercase tracking-widest text-center">
                Secure Commerce Checkout
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
            <div className="section-container py-20 text-center min-h-[25vh] md:min-h-[60vh] flex items-center justify-center">
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
        <div className="section-container py-12 lg:py-20 animate-fade-in">
            <div className="flex flex-col gap-2 mb-10">
                <p className="eyebrow">Checkout Process</p>
                <h1 className="section-heading text-4xl lg:text-5xl text-gradient-crimson">
                    Finalize Order
                </h1>
                <div className="crimson-line mt-2" />
            </div>

            <StepIndicator step={step} />

            {step !== 3 ? (
                <div className="grid lg:grid-cols-[1fr_400px] gap-12 items-start">
                    {/* Left — content area */}
                    <div className="space-y-8">
                        {step === 1 && (
                            <div className="rw-card p-6 sm:p-10 flex flex-col gap-6 animate-fade-in-up">
                                <div className="flex flex-col gap-1">
                                    <h2 className="font-display font-extrabold text-2xl text-rw-ink">
                                        Personal Information
                                    </h2>
                                    <p className="text-sm text-rw-muted font-medium">
                                        We&#39;ll use these details to contact you about
                                        your order.
                                    </p>
                                </div>

                                <div className="grid sm:grid-cols-2 gap-6">
                                    <Input
                                        label="Full name"
                                        value={form.name}
                                        onChange={(e) =>
                                            setForm({ ...form, name: e.target.value })
                                        }
                                        error={errors.name}
                                        placeholder="e.g. Adewale Ogundimu"
                                        containerClassName="sm:col-span-2"
                                    />
                                    <Input
                                        label="Email address"
                                        type="email"
                                        value={form.email}
                                        onChange={(e) =>
                                            setForm({ ...form, email: e.target.value })
                                        }
                                        error={errors.email}
                                        placeholder="you@example.com"
                                    />
                                    <Input
                                        label="Phone number"
                                        type="tel"
                                        value={form.phone}
                                        onChange={(e) =>
                                            setForm({ ...form, phone: e.target.value })
                                        }
                                        error={errors.phone}
                                        placeholder="080..."
                                    />
                                </div>

                                <Textarea
                                    label="Order Note (optional)"
                                    value={form.note}
                                    onChange={(e) =>
                                        setForm({ ...form, note: e.target.value })
                                    }
                                    placeholder="e.g. Hold for Sunday pickup or specific size preferences"
                                    rows={3}
                                />

                                <Button
                                    variant="primary"
                                    size="lg"
                                    onClick={() => {
                                        if (validate()) setStep(2);
                                    }}
                                    className="mt-4 h-14 text-lg shadow-lg hover:shadow-rw-crimson/20"
                                >
                                    Proceed to Review →
                                </Button>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="flex flex-col gap-8 animate-fade-in-up">
                                {/* Items Review */}
                                <div className="rw-card overflow-hidden border-rw-crimson/10 shadow-xl shadow-rw-ink/5">
                                    <div className="px-8 py-5 border-b border-[var(--rw-border)] flex justify-between items-center bg-rw-bg-warm/50">
                                        <h2 className="font-display font-extrabold text-xl text-rw-ink">
                                            Order Contents
                                        </h2>
                                        <span className="tag-pill bg-rw-crimson/10 text-rw-crimson font-bold">
                                            {items.length} Item
                                            {items.length !== 1 ? "s" : ""}
                                        </span>
                                    </div>
                                    <div className="divide-y divide-[var(--rw-border)]">
                                        {items.map((i) => (
                                            <div
                                                key={i.variantId}
                                                className="p-6 sm:p-8 flex gap-6 sm:gap-8 items-center group"
                                            >
                                                <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-2xl overflow-hidden shrink-0 border border-[var(--rw-border)] bg-rw-bg-alt relative">
                                                    <img
                                                        src={ph(
                                                            140,
                                                            140,
                                                            i.productName.slice(0, 6)
                                                        )}
                                                        alt={i.productName}
                                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-display font-bold text-rw-ink text-lg sm:text-xl leading-tight">
                                                        {i.productName}
                                                    </p>
                                                    <p className="text-sm text-rw-muted font-bold mt-1.5 uppercase tracking-wide">
                                                        {i.variantLabel}
                                                    </p>
                                                    <div className="flex items-center gap-4 mt-4">
                                                        <span className="text-xs font-extrabold px-3 py-1.5 rounded-full bg-rw-bg-alt text-rw-ink border border-[var(--rw-border-mid)] shadow-sm">
                                                            Quantity: {i.quantity}
                                                        </span>
                                                        <span className="text-lg font-bold text-rw-crimson">
                                                            ₦
                                                            {(
                                                                i.unitPrice * i.quantity
                                                            ).toLocaleString()}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="bg-rw-ink p-8 flex justify-between items-center text-white">
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-xs font-bold text-rw-muted uppercase tracking-widest">
                                                Total Payable
                                            </span>
                                            <span className="text-2xl sm:text-3xl font-display font-black">
                                                ₦{total.toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="h-10 w-10 rounded-full border border-white/20 flex items-center justify-center">
                                            <svg
                                                className="h-5 w-5"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth={2.5}
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M5 13l4 4L19 7"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Customer Info */}
                                <div className="rw-card overflow-hidden">
                                    <div className="px-8 py-5 border-b border-[var(--rw-border)] flex justify-between items-center bg-rw-bg-alt/30">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-1.5 rounded-full bg-rw-gold" />
                                            <h2 className="font-display font-extrabold text-xl text-rw-ink">
                                                Verification Details
                                            </h2>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setStep(1)}
                                            className="text-rw-crimson hover:bg-rw-crimson/5 font-black uppercase tracking-widest text-[10px]"
                                        >
                                            Change Information
                                        </Button>
                                    </div>
                                    <div className="p-8 sm:p-10 bg-rw-bg-warm/20">
                                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
                                            <div className="flex flex-col gap-2">
                                                <p className="eyebrow !text-[10px] !text-rw-muted">
                                                    Full Name
                                                </p>
                                                <p className="font-bold text-rw-ink text-xl">
                                                    {form.name}
                                                </p>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <p className="eyebrow !text-[10px] !text-rw-muted">
                                                    Email Address
                                                </p>
                                                <p className="font-bold text-rw-ink text-xl break-all">
                                                    {form.email}
                                                </p>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <p className="eyebrow !text-[10px] !text-rw-muted">
                                                    Phone Number
                                                </p>
                                                <p className="font-bold text-rw-ink text-xl">
                                                    {form.phone}
                                                </p>
                                            </div>
                                            {form.note && (
                                                <div className="sm:col-span-2 lg:col-span-3 flex flex-col gap-3 pt-6 border-t border-[var(--rw-border-mid)] border-dashed">
                                                    <p className="eyebrow !text-[10px] !text-rw-muted">
                                                        Order Instructions
                                                    </p>
                                                    <div className="relative">
                                                        <div className="absolute -left-4 top-0 bottom-0 w-1 bg-rw-gold/30 rounded-full" />
                                                        <p className="text-rw-text font-medium text-lg italic leading-relaxed pl-2">
                                                            &ldquo;{form.note}&ldquo;
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Confirmation Buttons */}
                                <div className="flex flex-col sm:flex-row gap-5">
                                    <Button
                                        variant="outlined"
                                        size="lg"
                                        onClick={() => setStep(1)}
                                        className="sm:w-1/3 h-16 text-rw-muted border-[var(--rw-border-strong)]"
                                    >
                                        ← Return to Edit
                                    </Button>
                                    <Button
                                        variant="primary"
                                        size="lg"
                                        loading={submitting}
                                        onClick={handleSubmit}
                                        className="flex-1 h-16 text-xl font-display font-black uppercase tracking-wider shadow-2xl hover:shadow-rw-crimson/30"
                                        id="confirm-order-btn"
                                    >
                                        {submitting
                                            ? "Processing Order..."
                                            : "Confirm & Place Order"}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right — order summary */}
                    <div className="hidden lg:block sticky top-28">
                        <OrderSummaryPanel items={items} total={total} />
                    </div>
                </div>
            ) : (
                /* Step 3 — Confirmed */
                orderRef && (
                    <div className="max-w-3xl mx-auto flex flex-col gap-10 animate-fade-in-up py-8 lg:py-12">
                        {/* The Cinematic Ticket Card */}
                        <div className="relative group">
                            {/* Decorative background glow */}
                            <div className="absolute -inset-2 bg-rw-crimson/5 blur-2xl rounded-[3rem] transition-opacity group-hover:opacity-100 opacity-50" />

                            <div className="relative rw-card overflow-hidden border-rw-crimson/10 shadow-2xl bg-white flex flex-col md:flex-row min-h-[500px]">
                                {/* Left Section — Confirmation & Summary */}
                                <div className="flex-1 p-8 lg:p-12 flex flex-col gap-8 border-b md:border-b-0 md:border-r border-dashed border-[var(--rw-border-mid)] relative">
                                    {/* Success Badge */}
                                    <div className="flex items-center gap-3">
                                        <div className="h-12 w-12 rounded-2xl bg-green-50 border border-green-100 flex items-center justify-center text-green-600 shadow-sm">
                                            <svg
                                                className="h-6 w-6"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth={2.5}
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M5 13l4 4L19 7"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        <p className="eyebrow !text-rw-gold">
                                            Order Successful
                                        </p>
                                        <h2 className="font-display font-black text-4xl lg:text-5xl text-rw-ink tracking-tight">
                                            Thank You!
                                        </h2>
                                        <p className="mt-2 text-rw-text-2 font-medium max-w-sm mx-auto leading-relaxed">
                                            Your order is confirmed. Share the reference
                                            code below to finalize payment or pickup.
                                        </p>
                                    </div>

                                    {/* Instructions */}
                                    <div className="mt-auto bg-rw-bg-warm/50 p-5 rounded-2xl border border-rw-crimson/5">
                                        <p className="text-xs text-rw-text-2 leading-relaxed font-medium">
                                            This reference code is your digital receipt.
                                            Share it with friends if they&lsquo;re paying
                                            for you, or use it yourself at pickup.
                                        </p>
                                    </div>

                                    {/* Ticket Notch Decorations */}
                                    <div className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-rw-bg border-r border-[var(--rw-border-mid)] shadow-[inset_-8px_0_12px_rgba(0,0,0,0.03)]" />
                                </div>

                                {/* Right Section — The Voucher */}
                                <div className="w-full md:w-[320px] bg-rw-bg-alt/40 p-8 lg:p-12 flex flex-col items-center justify-center gap-8 relative overflow-hidden">
                                    {/* Branding accent */}
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-rw-crimson/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />

                                    <div className="text-center relative z-10">
                                        <p className="text-[10px] font-black text-rw-muted uppercase tracking-[0.3em] mb-4">
                                            Reference Code
                                        </p>
                                        <div className="bg-white p-6 rounded-[2rem] shadow-xl shadow-rw-ink/5 border-2 border-rw-crimson/10 group-hover:border-rw-crimson/30 transition-colors">
                                            <p className="font-mono text-5xl font-black text-rw-crimson tracking-[0.1em] select-all">
                                                {orderRef}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-3 w-full relative z-10">
                                        <Button
                                            variant="primary"
                                            size="lg"
                                            onClick={copyRef}
                                            className="w-full h-14 font-black tracking-wider uppercase text-xs shadow-lg shadow-rw-crimson/20"
                                        >
                                            {copied
                                                ? "Reference Copied!"
                                                : "Copy Reference"}
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            size="lg"
                                            onClick={() => {
                                                const url = `${window.location.origin}/fulfil?ref=${orderRef}`;
                                                navigator.clipboard.writeText(
                                                    `Hi! Could you help me pay for my Redemption Week merch? Ref: ${orderRef}. Pay here: ${url}`
                                                );
                                                setCopied(true);
                                                setTimeout(() => setCopied(false), 2000);
                                            }}
                                            className="w-full h-14 font-bold text-xs bg-white border-[var(--rw-border-strong)] hover:border-rw-crimson"
                                        >
                                            {copied
                                                ? "Share Text Copied!"
                                                : "Share Payment Link"}
                                        </Button>
                                    </div>

                                    <Link
                                        href={`/fulfil?ref=${orderRef}`}
                                        className="text-xs font-black text-rw-crimson hover:underline uppercase tracking-widest mt-2 relative z-10"
                                    >
                                        Pay for it yourself →
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-6 text-center">
                            <p className="text-rw-muted font-medium text-sm">
                                Lost your code? Find it anytime in{" "}
                                <Link
                                    href="/orders"
                                    className="text-rw-crimson font-black hover:underline"
                                >
                                    My Orders
                                </Link>
                            </p>
                            <Link
                                href="/"
                                className="inline-flex items-center justify-center gap-2 text-sm font-bold text-rw-ink hover:text-rw-crimson transition-colors group"
                            >
                                <svg
                                    className="h-4 w-4 transition-transform group-hover:-translate-x-1"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2.5}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                                    />
                                </svg>
                                Return to Storefront
                            </Link>
                        </div>
                    </div>
                )
            )}
        </div>
    );
}
