"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Order, Payment } from "@/lib/data/types";
import { PaymentStatusBadge } from "@/components/ui/Badge";
import { StatusTimeline } from "@/components/ui/StatusTimeline";
import { toast } from "sonner";
import { formatNaira, productImageUrl } from "@/lib/utils/functions";
import { ProductImage } from "@/components/common/ProductImage";

interface OrderDetailSheetClientProps {
    order: Order;
}

function parseColorHex(label: string): string | null {
    const colors: Record<string, string> = {
        black: "#1C0003",
        white: "#FDF8F8",
        burgundy: "#7A0C31",
        "wine red": "#940011",
        navy: "#0A1628",
        orange: "#FF6A00",
        gold: "#E0A96D",
    };
    const lower = label.toLowerCase();
    for (const key of Object.keys(colors)) {
        if (lower.includes(key)) return colors[key];
    }
    return null;
}

export default function OrderDetailSheetClient({ order }: OrderDetailSheetClientProps) {
    const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

    const approvedSum = order.payments
        .filter((p) => p.status === "approved")
        .reduce((sum, p) => sum + (p.amountConfirmed ?? p.extractedAmount), 0);

    const pendingSum = order.payments
        .filter((p) => p.status === "pending")
        .reduce((sum, p) => sum + p.extractedAmount, 0);

    const balanceDue = Math.max(0, order.totalAmount - approvedSum);

    const totalUnits = order.items.reduce((s, i) => s + i.quantity, 0);

    // Calculate percentage bounds for the visual progress bar
    const approvedPercent = Math.min(100, (approvedSum / order.totalAmount) * 100);
    const pendingPercent = Math.min(
        100 - approvedPercent,
        (pendingSum / order.totalAmount) * 100
    );

    function handleCopyTrackingLink() {
        if (typeof window !== "undefined") {
            navigator.clipboard.writeText(window.location.href);
            toast.success("Secure statement link copied to clipboard!");
        }
    }

    function handleExportJSON() {
        const dataStr =
            "data:text/json;charset=utf-8," +
            encodeURIComponent(JSON.stringify(order, null, 2));
        const downloadAnchor = document.createElement("a");
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", `receipt-${order.orderRef}.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
        toast.success("Order manifest schema exported successfully");
    }

    return (
        <div className="min-h-screen bg-rw-bg text-rw-ink py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden animate-fade-in print:bg-white print:py-0 print:text-black print:overflow-visible">
            <style
                dangerouslySetInnerHTML={{
                    __html: `
                @media print {
                    @page {
                        size: auto;
                        margin: 15mm !important;
                    }

                    /* Global print style overrides */
                    html, body {
                        background: #ffffff !important;
                        color: #000000 !important;
                        font-size: 10pt !important;
                        line-height: 1.4 !important;
                        margin: 0 !important;
                    }

                    /* Suppress background blur decorations */
                    .absolute {
                        display: none !important;
                    }

                    /* Strip all card styling in print */
                    .rw-card {
                        background: transparent !important;
                        border: none !important;
                        box-shadow: none !important;
                        border-radius: 0 !important;
                        padding: 0 !important;
                        margin-bottom: 20px !important;
                        break-inside: avoid !important;
                        page-break-inside: avoid !important;
                    }

                    .rw-card:hover {
                        transform: none !important;
                        box-shadow: none !important;
                        border-color: transparent !important;
                    }

                    /* Flatten columns layout */
                    .grid {
                        display: block !important;
                    }

                    /* Section spacing & headings */
                    h3 {
                        font-size: 11pt !important;
                        border-bottom: 2px solid #000000 !important;
                        padding-bottom: 4px !important;
                        margin-top: 0 !important;
                        margin-bottom: 12px !important;
                        text-transform: uppercase !important;
                        letter-spacing: 0.05em !important;
                        font-weight: 800 !important;
                        color: #000000 !important;
                    }

                    /* Clean columns for registry info block */
                    .grid-cols-1.sm\\:grid-cols-2 {
                        display: grid !important;
                        grid-template-columns: 1fr 1fr !important;
                        gap: 12px 24px !important;
                    }

                    /* Tables rendering optimization */
                    table {
                        width: 100% !important;
                        border-collapse: collapse !important;
                        margin-top: 8px !important;
                    }

                    th {
                        border-bottom: 2px solid #000000 !important;
                        font-weight: 800 !important;
                        text-transform: uppercase !important;
                        font-size: 8pt !important;
                        padding: 6px 0 !important;
                        color: #000000 !important;
                    }

                    td {
                        border-bottom: 1px solid #e0e0e0 !important;
                        padding: 6px 0 !important;
                        font-size: 9pt !important;
                        color: #000000 !important;
                    }

                    /* Hide decorative timeline, back links and Schema buttons */
                    .print\\:hidden {
                        display: none !important;
                    }

                    /* Specific element overrides to ensure black ink readability */
                    span, p, div, a, time {
                        color: #000000 !important;
                    }

                    .text-rw-crimson, .text-rw-ink, .text-rw-muted, .text-rw-text-2, .text-amber-600, .text-green-700 {
                        color: #000000 !important;
                    }
                }
            `,
                }}
            />
            {/* Print-Only Formal Letterhead Header */}
            <div className="hidden print:flex items-center justify-between border-b-2 border-black pb-6 mb-8 text-black shrink-0">
                <div className="space-y-1">
                    <h2 className="text-xl font-black tracking-tight uppercase">
                        Redemption Week &lsquo;26
                    </h2>
                    <p className="text-[10px] font-black text-gray-600 uppercase">
                        Rw&apos;26 Sales Committee
                    </p>
                    <p className="text-[9px] text-gray-500 font-medium">
                        RCF FUTA, Ondo State, Nigeria.
                    </p>
                </div>
                <div className="text-right space-y-1">
                    <h3 className="text-sm font-black uppercase tracking-wider text-rw-crimson">
                        Official Invoice
                    </h3>
                    <p className="font-mono text-xs font-bold text-black">
                        Ref: {order.orderRef}
                    </p>
                    <p className="text-[9px] text-gray-600 font-bold uppercase">
                        Issued:{" "}
                        {new Date(order.createdAt).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                        })}
                    </p>
                </div>
            </div>

            {/* Cinematic Background Decoration */}
            <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-rw-bg-alt/40 rounded-full blur-3xl -z-10 pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-rw-bg-warm/30 rounded-full blur-3xl -z-10 pointer-events-none" />

            <div className="max-w-5xl mx-auto space-y-8 print:space-y-4">
                {/* Back Link & Navigation */}
                <div className="flex items-center justify-between border-b border-[var(--rw-border)] pb-6 print:hidden">
                    <Link
                        href={`/orders?ref=${order.orderRef}`}
                        className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-rw-muted hover:text-rw-crimson transition-colors"
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
                                d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                            />
                        </svg>
                        Back to Finder
                    </Link>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleCopyTrackingLink}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rw-bg-alt border border-[var(--rw-border)] hover:border-rw-crimson/30 hover:bg-white text-[10px] font-bold text-rw-muted hover:text-rw-crimson transition-all"
                        >
                            <svg
                                className="h-3 w-3"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"
                                />
                            </svg>
                            Copy Statement Link
                        </button>
                        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-bold text-rw-muted uppercase tracking-wider">
                            Verified Secure Access
                        </span>
                    </div>
                </div>

                {/* Hero Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <span className="px-2.5 py-0.5 rounded bg-rw-crimson/10 text-[9px] font-black text-rw-crimson uppercase tracking-widest">
                                Official Statement
                            </span>
                            <span className="font-mono text-xs font-bold text-rw-muted">
                                REF:{" "}
                                <span className="text-rw-crimson font-black">
                                    {order.orderRef}
                                </span>
                            </span>
                        </div>
                        <h1 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-tight text-rw-ink">
                            Order Account
                        </h1>
                        <p className="text-xs sm:text-sm text-rw-muted font-medium">
                            Registered to{" "}
                            <span className="text-rw-ink font-bold">
                                {order.customerName}
                            </span>{" "}
                            &middot; {order.customerEmail}
                        </p>
                    </div>

                    <div className="flex gap-3 print:hidden">
                        <button
                            onClick={() => window.print()}
                            className="btn-secondary !h-11 px-6 text-[10px] font-black uppercase tracking-widest transition-all hover:border-rw-crimson hover:text-rw-crimson"
                        >
                            Print Invoice
                        </button>
                        {/* <button
                            onClick={handleExportJSON}
                            className="btn-secondary !h-11 px-6 text-[10px] font-black uppercase tracking-widest"
                        >
                            Download Schema
                        </button> */}
                    </div>
                </div>

                {/* Progress Timeline */}
                <StatusTimeline
                    status={order.status}
                    className="shadow-lg print:hidden"
                />

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 print:grid-cols-1 print:gap-4">
                    {/* Left Column: Items, Manifest, and Payment History */}
                    <div className="lg:col-span-2 space-y-8 print:space-y-4">
                        {/* Customer Registry & Statement Metadata Card */}
                        <div className="rw-card p-6 bg-white border border-[var(--rw-border)] shadow-md rounded-2xl space-y-4 transition-all hover:shadow-lg print:border-none print:shadow-none print:bg-transparent print:p-0 print:rounded-none">
                            <h3 className="font-display font-black text-rw-ink uppercase tracking-wider text-xs border-b border-[var(--rw-border)] pb-4 flex items-center justify-between">
                                <span>Customer Registry</span>
                                <span className="text-[10px] text-rw-muted font-mono uppercase">
                                    Official Record
                                </span>
                            </h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold">
                                <div className="space-y-1">
                                    <span className="text-[9px] font-black text-rw-muted uppercase tracking-wider block">
                                        Primary Name
                                    </span>
                                    <p className="text-sm font-black text-rw-ink uppercase tracking-wide">
                                        {order.customerName}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[9px] font-black text-rw-muted uppercase tracking-wider block">
                                        Registered Email Address
                                    </span>
                                    <p className="text-sm font-bold text-rw-ink font-mono">
                                        {order.customerEmail}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[9px] font-black text-rw-muted uppercase tracking-wider block">
                                        Primary Contact Phone
                                    </span>
                                    <p className="text-sm font-bold text-rw-ink font-mono">
                                        {order.customerPhone || "N/A"}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[9px] font-black text-rw-muted uppercase tracking-wider block">
                                        Order Reference Number
                                    </span>
                                    <p className="text-sm font-black text-rw-crimson font-mono">
                                        {order.orderRef}
                                    </p>
                                </div>
                                <div className="space-y-1 sm:col-span-2">
                                    <span className="text-[9px] font-black text-rw-muted uppercase tracking-wider block">
                                        Customer Delivery Instruction / Note
                                    </span>
                                    <p className="text-xs text-rw-text-2 font-medium bg-rw-bg-alt/30 p-2.5 rounded-xl border border-[var(--rw-border)] mt-1 whitespace-pre-wrap max-w-full leading-relaxed print:bg-transparent print:p-0 print:border-none">
                                        {order.customerNote ||
                                            "No instructions provided."}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[9px] font-black text-rw-muted uppercase tracking-wider block">
                                        Date & Time Purchased
                                    </span>
                                    <p className="text-sm font-bold text-rw-ink">
                                        {new Date(order.createdAt).toLocaleDateString(
                                            "en-GB",
                                            {
                                                day: "numeric",
                                                month: "short",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            }
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Purchased Merchandise Card */}
                        <div className="rw-card p-6 bg-white border border-[var(--rw-border)] shadow-md rounded-2xl relative overflow-hidden transition-all hover:shadow-lg print:border-none print:shadow-none print:bg-transparent print:p-0 print:rounded-none">
                            <h3 className="font-display font-black text-rw-ink uppercase tracking-wider text-xs mb-6 flex items-center gap-2 border-b border-[var(--rw-border)] pb-4">
                                <span className="h-1.5 w-1.5 rounded-full bg-rw-crimson" />
                                Order Details & Breakdown
                            </h3>

                            <div className="divide-y divide-[var(--rw-border)]">
                                {order.items.map((item) => {
                                    const swatchColor = parseColorHex(item.variantLabel);
                                    const fallbackImg = productImageUrl(
                                        item.productName,
                                        null
                                    );

                                    return (
                                        <div
                                            key={item.id}
                                            className="py-5 flex items-start justify-between gap-4 group"
                                        >
                                            <div className="flex items-start gap-4">
                                                {/* Line Item Image Preview */}
                                                <div className="group-hover:border-rw-crimson/30 transition-colors">
                                                    <ProductImage
                                                        imageUrl={
                                                            item.imageUrl || fallbackImg
                                                        }
                                                        alt={item.productName}
                                                        minimal={true}
                                                        config={{
                                                            h: "h-16",
                                                            w: "w-12",
                                                        }}
                                                        size="192px"
                                                    />
                                                </div>

                                                <div className="space-y-1.5">
                                                    <p className="font-bold text-sm sm:text-base text-rw-ink group-hover:text-rw-crimson transition-colors">
                                                        {item.productName}
                                                    </p>
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <span className="text-[10px] text-rw-muted font-mono uppercase font-bold bg-rw-bg-alt px-1.5 py-0.5 rounded">
                                                            {item.variantId}
                                                        </span>
                                                        <span className="text-rw-muted/30 font-bold">
                                                            &middot;
                                                        </span>
                                                        <span className="text-[10px] bg-rw-bg-alt/50 border border-[var(--rw-border)] px-2 py-0.5 rounded font-medium text-rw-muted flex items-center gap-1.5">
                                                            {swatchColor && (
                                                                <span
                                                                    className="h-2.5 w-2.5 rounded-full border border-black/10 inline-block shrink-0 shadow-sm"
                                                                    style={{
                                                                        backgroundColor:
                                                                            swatchColor,
                                                                    }}
                                                                />
                                                            )}
                                                            {item.variantLabel}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="text-right shrink-0">
                                                <p className="font-mono text-xs text-rw-muted font-bold">
                                                    {item.quantity} &times;{" "}
                                                    {formatNaira(item.unitPrice)}
                                                </p>
                                                <p className="font-mono text-sm sm:text-base text-rw-ink font-black mt-0.5">
                                                    {formatNaira(
                                                        item.unitPrice * item.quantity
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="mt-6 pt-4 border-t border-[var(--rw-border)] flex justify-between items-center bg-rw-bg-alt/10 p-4 rounded-xl">
                                <div className="space-y-0.5">
                                    <span className="text-[10px] uppercase tracking-widest text-rw-muted font-black block">
                                        Total Units
                                    </span>
                                    <span className="font-mono font-bold text-xs text-rw-ink">
                                        {totalUnits} Items
                                    </span>
                                </div>
                                <div className="text-right space-y-0.5">
                                    <span className="text-[10px] uppercase tracking-widest text-rw-muted font-black block">
                                        Grand Total
                                    </span>
                                    <span className="font-display font-black text-2xl text-rw-crimson">
                                        {formatNaira(order.totalAmount)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Payment Transactions Receipt Logs */}
                        <div className="rw-card p-6 bg-white border border-[var(--rw-border)] shadow-md rounded-2xl transition-all hover:shadow-lg print:border-none print:shadow-none print:bg-transparent print:p-0 print:rounded-none">
                            <h3 className="font-display font-black text-rw-ink uppercase tracking-wider text-xs mb-6 flex items-center gap-2 border-b border-[var(--rw-border)] pb-4">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                Payment Receipts Log
                            </h3>

                            {order.payments.length === 0 ? (
                                <div className="text-center py-10 space-y-3 bg-rw-bg-alt/10 rounded-xl border border-dashed border-[var(--rw-border)]">
                                    <span className="text-3xl block animate-bounce">
                                        💸
                                    </span>
                                    <p className="text-xs font-bold text-rw-muted uppercase tracking-widest">
                                        No payments submitted yet
                                    </p>
                                    <Link
                                        href={`/fulfil?ref=${order.orderRef}`}
                                        className="inline-flex items-center gap-1.5 text-[10px] font-black text-rw-crimson hover:underline uppercase tracking-wider"
                                    >
                                        Submit first installment &rarr;
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <p className="text-[10px] text-rw-muted font-bold uppercase tracking-wider print:hidden">
                                        Tip: Click any transaction card to view full
                                        extraction & receipt lightbox
                                    </p>
                                    {order.payments.map((pay) => (
                                        <div
                                            key={pay.id}
                                            onClick={() => setSelectedPayment(pay)}
                                            className="p-4 rounded-xl bg-rw-bg-alt/20 border border-[var(--rw-border)] hover:border-rw-crimson/20 hover:bg-rw-bg-alt/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer group shadow-sm hover:shadow print:cursor-default print:hover:border-[var(--rw-border)] print:bg-white"
                                        >
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-3">
                                                    <span className="font-mono font-black text-sm text-rw-ink group-hover:text-rw-crimson transition-colors">
                                                        {formatNaira(
                                                            pay.amountConfirmed ??
                                                                pay.extractedAmount
                                                        )}
                                                    </span>
                                                    <PaymentStatusBadge
                                                        status={pay.status}
                                                    />
                                                </div>
                                                <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-[10px] font-bold text-rw-muted">
                                                    <div className="flex items-center gap-1">
                                                        <span>🏦</span>
                                                        <span className="text-rw-ink truncate max-w-[120px]">
                                                            {pay.extractedBank ||
                                                                "Unknown"}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <span>👤</span>
                                                        <span className="text-rw-ink truncate max-w-[120px]">
                                                            {pay.extractedSenderName ||
                                                                "Unknown"}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <span>📅</span>
                                                        <span className="text-rw-ink">
                                                            {pay.extractedDate || "N/A"}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <span>🔑</span>
                                                        <span className="text-rw-ink font-mono truncate max-w-[120px]">
                                                            {pay.extractedTransactionRef ||
                                                                "N/A"}
                                                        </span>
                                                    </div>
                                                </div>
                                                {pay.reviewNote && (
                                                    <p className="text-[10px] text-rw-crimson font-semibold italic bg-rw-crimson/5 p-2 rounded-lg border border-rw-crimson/10 mt-2">
                                                        Note: {pay.reviewNote}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center print:hidden">
                                                <span className="text-[10px] font-black text-rw-muted uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                                                    Inspect details &rarr;
                                                </span>
                                                {pay.receiptUrl && (
                                                    <div className="h-12 w-12 rounded-lg overflow-hidden border border-[var(--rw-border)] bg-white shadow-inner relative shrink-0">
                                                        <img
                                                            src={pay.receiptUrl}
                                                            alt="Receipt thumbnail"
                                                            className="h-full w-full object-cover"
                                                        />
                                                        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Order Accounting Ledger, Logistics and CTAs */}
                    <div className="space-y-8 print:space-y-4">
                        {/* Financial Ledger Balance */}
                        <div className="rw-card p-6 bg-rw-bg-alt/30 border border-[var(--rw-border)] shadow-md rounded-2xl space-y-6 transition-all hover:shadow-lg print:border-none print:shadow-none print:bg-transparent print:p-0 print:rounded-none">
                            <h3 className="font-display font-black text-rw-ink uppercase tracking-wider text-xs border-b border-[var(--rw-border)] pb-4">
                                Account Ledger
                            </h3>

                            {/* Dual Segment Payment Coverage visual bar */}
                            <div className="space-y-2 print:hidden">
                                <div className="flex items-center justify-between text-[10px] font-bold text-rw-muted uppercase tracking-wider">
                                    <span>Payment Coverage</span>
                                    <span>{Math.round(approvedPercent)}% Sec.</span>
                                </div>
                                <div className="h-3 w-full rounded-full bg-rw-bg-alt border border-[var(--rw-border)] overflow-hidden flex">
                                    <div
                                        className="h-full bg-emerald-500 transition-all duration-500"
                                        style={{ width: `${approvedPercent}%` }}
                                        title={`Approved: ${formatNaira(approvedSum)}`}
                                    />
                                    <div
                                        className="h-full bg-amber-400 animate-pulse transition-all duration-500"
                                        style={{ width: `${pendingPercent}%` }}
                                        title={`Pending: ${formatNaira(pendingSum)}`}
                                    />
                                </div>
                            </div>

                            <div className="space-y-3.5 text-xs font-bold">
                                <div className="flex justify-between">
                                    <span className="text-rw-muted uppercase text-[10px] tracking-wider">
                                        Total Charge
                                    </span>
                                    <span className="text-rw-ink">
                                        {formatNaira(order.totalAmount)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-green-600 uppercase text-[10px] tracking-wider">
                                        Confirmed Paid
                                    </span>
                                    <span className="text-green-700">
                                        {formatNaira(approvedSum)}
                                    </span>
                                </div>
                                {pendingSum > 0 && (
                                    <div className="flex justify-between">
                                        <span className="text-amber-500 uppercase text-[10px] tracking-wider">
                                            Pending Review
                                        </span>
                                        <span className="text-amber-600 animate-pulse">
                                            {formatNaira(pendingSum)}
                                        </span>
                                    </div>
                                )}
                                <div className="h-px bg-[var(--rw-border)] my-2" />
                                <div className="flex justify-between items-baseline">
                                    <span className="text-rw-ink uppercase text-[10px] tracking-widest font-black">
                                        Outstanding Balance
                                    </span>
                                    <span
                                        className={`text-lg font-black ${balanceDue > 0 ? "text-rw-crimson animate-pulse" : "text-emerald-600"}`}
                                    >
                                        {balanceDue > 0
                                            ? formatNaira(balanceDue)
                                            : "PAID"}
                                    </span>
                                </div>
                            </div>

                            {/* Main CTA: Complete balance payment */}
                            {/* Main CTA: Full Self-Service Fulfill Link */}
                            {balanceDue > 0 ? (
                                <div className="space-y-2 mt-2 pt-2 border-t border-[var(--rw-border)] border-dashed print:hidden">
                                    <span className="text-[9px] font-black text-rw-muted uppercase tracking-wider block">
                                        Fulfillment & Payment Link
                                    </span>
                                    <div className="p-3 bg-white rounded-xl border border-[var(--rw-border)] flex items-center justify-between gap-3 group/link hover:border-rw-crimson/30 transition-all">
                                        <a
                                            href={`/fulfil?ref=${order.orderRef}`}
                                            className="font-mono text-[10px] text-rw-crimson break-all select-all font-black hover:underline"
                                            title="Click to go to payment terminal"
                                        >
                                            {typeof window !== "undefined"
                                                ? `${window.location.origin}/fulfil?ref=${order.orderRef}`
                                                : `https://rw.rcffuta.org/fulfil?ref=${order.orderRef}`}
                                        </a>
                                        <button
                                            onClick={() => {
                                                const url = `${window.location.origin}/fulfil?ref=${order.orderRef}`;
                                                navigator.clipboard.writeText(url);
                                                toast.success("Fulfillment link copied!");
                                            }}
                                            className="shrink-0 px-2.5 py-1 rounded bg-rw-bg-alt hover:bg-rw-bg-alt/80 text-[9px] font-black uppercase tracking-widest text-rw-muted hover:text-rw-crimson transition-all border border-[var(--rw-border)]"
                                        >
                                            Copy
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center gap-2 p-3 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-100 font-black uppercase text-[9px] tracking-widest text-center shadow-sm">
                                    <svg
                                        className="h-4 w-4 shrink-0 text-emerald-600"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth={3}
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="m4.5 12.75 6 6 9-13.5"
                                        />
                                    </svg>
                                    All Dues Fully Settled
                                </div>
                            )}
                        </div>

                        {/* Logistics Details */}
                        <div className="rw-card p-6 bg-white border border-[var(--rw-border)] shadow-md rounded-2xl space-y-4 transition-all hover:shadow-lg print:border-none print:shadow-none print:bg-transparent print:p-0 print:rounded-none">
                            <h3 className="font-display font-black text-rw-ink uppercase tracking-wider text-xs border-b border-[var(--rw-border)] pb-4 flex items-center justify-between">
                                <span>Fulfillment & Collection</span>
                                <span className="h-1.5 w-1.5 rounded-full bg-rw-crimson" />
                            </h3>

                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <span className="text-[9px] font-black text-rw-muted uppercase tracking-wider block">
                                        Pickup Venue
                                    </span>
                                    <p className="text-xs font-bold text-rw-ink">
                                        RCF FUTA Fellowship Auditorium
                                    </p>
                                    <p className="text-[10px] text-rw-muted font-medium">
                                        FUTA Campus, Akure, Nigeria.
                                    </p>
                                </div>

                                <div className="space-y-1">
                                    <span className="text-[9px] font-black text-rw-muted uppercase tracking-wider block">
                                        Fulfillment Window
                                    </span>
                                    <p className="text-xs font-bold text-rw-ink">
                                        Redemption Week 2026
                                    </p>
                                    <p className="text-[10px] text-rw-muted font-medium">
                                        July 13th – July 19th, 2026
                                    </p>
                                </div>

                                <div className="space-y-1">
                                    <span className="text-[9px] font-black text-rw-muted uppercase tracking-wider block">
                                        Eligibility Status
                                    </span>
                                    {balanceDue <= 0 ? (
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-[10px] font-black uppercase tracking-wider border border-emerald-100 mt-0.5">
                                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                            Ready for Collection
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 text-[10px] font-black uppercase tracking-wider border border-amber-100 mt-0.5 leading-tight">
                                            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                                            Pending Balance Settlement
                                        </span>
                                    )}
                                </div>

                                <div className="space-y-2 border-t border-[var(--rw-border)] border-dashed pt-3">
                                    <span className="text-[9px] font-black text-rw-muted uppercase tracking-wider block">
                                        Collection Checklist
                                    </span>
                                    <ul className="text-[10px] text-rw-text-2 space-y-1 font-semibold">
                                        <li className="flex items-center gap-1.5">
                                            <span className="text-rw-crimson">✓</span>{" "}
                                            Present Order Ref:{" "}
                                            <span className="font-mono text-rw-ink">
                                                {order.orderRef}
                                            </span>
                                        </li>
                                        <li className="flex items-center gap-1.5">
                                            <span className="text-rw-crimson">✓</span>{" "}
                                            Matching Student ID or Photo ID
                                        </li>
                                        <li className="flex items-center gap-1.5">
                                            <span className="text-rw-crimson">✓</span>{" "}
                                            Outstanding Balance must be ₦0
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Support Card */}
                        <div className="rw-card p-6 bg-rw-ink text-rw-muted border-none shadow-lg rounded-2xl space-y-4 relative overflow-hidden group print:hidden">
                            <div className="absolute -bottom-10 -right-10 h-32 w-32 bg-white/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                            <h3 className="font-display font-black text-rw-muted uppercase tracking-wider text-xs border-b border-white/10 pb-4 relative z-10">
                                Need Assistance?
                            </h3>
                            <p className="text-[11px] text-rw-muted font-medium leading-relaxed relative z-10">
                                Have issues with your payment validation, receipt
                                extraction, or need to request size alterations? Reach out
                                to our ICT & Merchandise Support team.
                            </p>
                            <a
                                href={`mailto:merch@rcffuta.org?subject=Order%20Inquiry%20-%20${order.orderRef}`}
                                className="inline-flex w-full h-11 items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 border border-rw-ink text-[10px] font-black uppercase tracking-widest text-white transition-all relative z-10"
                            >
                                Contact Support
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Premium Payment Details Lightbox Modal */}
            {selectedPayment && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-rw-ink/65 backdrop-blur-md animate-fade-in print:hidden">
                    <div
                        onClick={() => setSelectedPayment(null)}
                        className="absolute inset-0"
                    />

                    <div className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-[var(--rw-border)] w-full max-w-2xl relative z-10 animate-scale-up max-h-[90vh] flex flex-col">
                        {/* Modal Header */}
                        <div className="px-6 py-4 border-b border-[var(--rw-border)] flex items-center justify-between bg-rw-bg-alt/30 shrink-0">
                            <div className="space-y-0.5">
                                <h4 className="font-display font-black text-rw-ink text-sm sm:text-base uppercase tracking-wider">
                                    Receipt Validation Sheet
                                </h4>
                                <p className="text-[10px] text-rw-muted font-bold uppercase tracking-wider">
                                    Txn ID:{" "}
                                    {selectedPayment.id.split("-")[1].toUpperCase()}
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedPayment(null)}
                                className="h-8 w-8 rounded-full bg-rw-bg-alt border border-[var(--rw-border)] flex items-center justify-center text-rw-muted hover:text-rw-crimson hover:border-rw-crimson/20 transition-all font-bold"
                            >
                                &times;
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 overflow-y-auto space-y-6 flex-1">
                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Left Side: Receipt Image Lightbox Viewport */}
                                <div className="space-y-3">
                                    <span className="text-[9px] font-black text-rw-muted uppercase tracking-widest block">
                                        Uploaded Document
                                    </span>
                                    {selectedPayment.receiptUrl ? (
                                        <div className="rounded-2xl overflow-hidden border border-[var(--rw-border)] bg-rw-bg-alt shadow-inner relative group h-64 md:h-72">
                                            <img
                                                src={selectedPayment.receiptUrl}
                                                alt="Physical Bank Receipt"
                                                className="h-full w-full object-contain p-2"
                                            />
                                            <a
                                                href={selectedPayment.receiptUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold uppercase tracking-widest gap-2 backdrop-blur-xs"
                                            >
                                                <svg
                                                    className="h-4 w-4"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth={2}
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                                                    />
                                                </svg>
                                                Open Fullscreen
                                            </a>
                                        </div>
                                    ) : (
                                        <div className="rounded-2xl border border-dashed border-[var(--rw-border)] h-64 flex flex-col items-center justify-center text-rw-muted text-xs">
                                            <span>📷</span>
                                            <span>No receipt scan uploaded</span>
                                        </div>
                                    )}
                                </div>

                                {/* Right Side: Validation & Auditing Metadata */}
                                <div className="space-y-5">
                                    <div className="space-y-1">
                                        <span className="text-[9px] font-black text-rw-muted uppercase tracking-widest block">
                                            Audit Inflow Status
                                        </span>
                                        <div className="flex items-center gap-2.5">
                                            <PaymentStatusBadge
                                                status={selectedPayment.status}
                                            />
                                            {selectedPayment.extractionConfidence && (
                                                <span
                                                    className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                                                        selectedPayment.extractionConfidence ===
                                                        "high"
                                                            ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                                                            : selectedPayment.extractionConfidence ===
                                                                "medium"
                                                              ? "bg-amber-50 text-amber-700 border border-amber-100"
                                                              : "bg-rose-50 text-rose-700 border border-rose-100"
                                                    }`}
                                                >
                                                    AI:{" "}
                                                    {selectedPayment.extractionConfidence}{" "}
                                                    Conf.
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-3.5 border-t border-[var(--rw-border)] pt-4">
                                        <div className="flex justify-between text-xs font-bold">
                                            <span className="text-rw-muted uppercase text-[9px] tracking-wider">
                                                Extracted Amount
                                            </span>
                                            <span className="text-rw-ink font-mono">
                                                {formatNaira(
                                                    selectedPayment.extractedAmount
                                                )}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-xs font-bold">
                                            <span className="text-rw-muted uppercase text-[9px] tracking-wider">
                                                Confirmed Inflow
                                            </span>
                                            <span className="text-emerald-600 font-mono">
                                                {selectedPayment.amountConfirmed !== null
                                                    ? formatNaira(
                                                          selectedPayment.amountConfirmed
                                                      )
                                                    : "Unconfirmed"}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-xs font-bold">
                                            <span className="text-rw-muted uppercase text-[9px] tracking-wider">
                                                Sender Name
                                            </span>
                                            <span className="text-rw-ink truncate max-w-[160px]">
                                                {selectedPayment.extractedSenderName ||
                                                    "N/A"}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-xs font-bold">
                                            <span className="text-rw-muted uppercase text-[9px] tracking-wider">
                                                Originating Bank
                                            </span>
                                            <span className="text-rw-ink">
                                                {selectedPayment.extractedBank || "N/A"}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-xs font-bold">
                                            <span className="text-rw-muted uppercase text-[9px] tracking-wider">
                                                Bank Reference
                                            </span>
                                            <span className="text-rw-ink font-mono truncate max-w-[160px]">
                                                {selectedPayment.extractedTransactionRef ||
                                                    "N/A"}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-xs font-bold">
                                            <span className="text-rw-muted uppercase text-[9px] tracking-wider">
                                                Transaction Time
                                            </span>
                                            <span className="text-rw-ink">
                                                {selectedPayment.extractedDate
                                                    ? `${selectedPayment.extractedDate} ${selectedPayment.extractedTime || ""}`
                                                    : "N/A"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Moderator Feedback Alert Area */}
                            {selectedPayment.reviewNote && (
                                <div className="p-4 rounded-xl bg-rw-crimson/5 border border-rw-crimson/10 space-y-1">
                                    <span className="text-[9px] font-black text-rw-crimson uppercase tracking-widest block">
                                        Auditor Feedback Note
                                    </span>
                                    <p className="text-xs font-medium text-rw-text leading-relaxed">
                                        &ldquo;{selectedPayment.reviewNote}&rdquo;
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="px-6 py-4 border-t border-[var(--rw-border)] bg-rw-bg-alt/30 flex items-center justify-end shrink-0">
                            <button
                                onClick={() => setSelectedPayment(null)}
                                className="btn-secondary !h-10 px-5 text-[10px] font-black uppercase tracking-widest"
                            >
                                Dismiss Sheet
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
