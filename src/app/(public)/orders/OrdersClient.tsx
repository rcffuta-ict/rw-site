"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { DEMO_ORDERS } from "@/lib/data/orders";
import { OrderStatusBadge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/forms/Input";
import type { Order } from "@/lib/data/types";
import { SearchInput } from "@/components/ui/SearchInput";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-NG", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

function formatTime(iso: string) {
    return new Date(iso).toLocaleTimeString("en-NG", {
        hour: "2-digit",
        minute: "2-digit",
    });
}

function fmtNgn(amount: number) {
    return `₦${amount.toLocaleString("en-NG")}`;
}

/** Merge demo orders + localStorage orders, deduplicated by orderRef */
function getAllOrders(): Order[] {
    const combined: Order[] = [...DEMO_ORDERS];
    try {
        const raw = localStorage.getItem("rw_demo_orders");
        if (raw) {
            const local = JSON.parse(raw) as Order[];
            for (const o of local) {
                if (!combined.some((x) => x.orderRef === o.orderRef)) {
                    combined.push(o);
                }
            }
        }
    } catch {}
    return combined.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}

/** Refs this device created */
function getDeviceRefs(): string[] {
    try {
        return JSON.parse(localStorage.getItem("rw_order_refs") ?? "[]") as string[];
    } catch {
        return [];
    }
}

function searchOrders(all: Order[], query: string): Order[] {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return all.filter(
        (o) =>
            o.customerPhone.replace(/\s/g, "").includes(q.replace(/\s/g, "")) ||
            o.customerEmail.toLowerCase().includes(q) ||
            o.orderRef.toLowerCase().includes(q)
    );
}

// ─── Order List Item ──────────────────────────────────────────────────────────

function OrderListItem({
    order,
    selected,
    onClick,
    isDevice,
}: {
    order: Order;
    selected: boolean;
    onClick: () => void;
    isDevice: boolean;
}) {
    const paidPct =
        order.totalAmount > 0
            ? Math.min(100, Math.round((order.amountPaid / order.totalAmount) * 100))
            : 0;

    return (
        <button
            onClick={onClick}
            className={`w-full text-left rounded-2xl border p-4 transition-all duration-200 group ${
                selected
                    ? "border-rw-crimson bg-rw-bg-warm shadow-[0_0_0_2px_rgba(196,18,48,0.12)]"
                    : "border-[var(--rw-border)] bg-white hover:border-[var(--rw-border-mid)] hover:shadow-sm"
            }`}
        >
            <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 min-w-0">
                    <span className="font-mono text-[13px] font-bold text-rw-ink tracking-widest">
                        {order.orderRef}
                    </span>
                    {isDevice && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-rw-crimson/8 px-2 py-0.5 text-[10px] font-bold text-rw-crimson uppercase tracking-wide">
                            <svg
                                className="h-2.5 w-2.5"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path d="M13 7H7v6h6V7z" />
                                <path
                                    fillRule="evenodd"
                                    d="M7 2a1 1 0 0 1 2 0v1h2V2a1 1 0 1 1 2 0v1h2a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h2V2a1 1 0 0 1 2 0v1zm-2 5a1 1 0 0 0 0 2h8a1 1 0 1 0 0-2H5z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            This device
                        </span>
                    )}
                </div>
                <OrderStatusBadge status={order.status} />
            </div>

            <p className="text-sm font-semibold text-rw-ink truncate">
                {order.customerName}
            </p>
            <p className="text-xs text-rw-muted mt-0.5 truncate">
                {order.items.length} item{order.items.length !== 1 ? "s" : ""} ·{" "}
                {formatDate(order.createdAt)}
            </p>

            <div className="mt-3">
                <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs text-rw-muted">Paid</span>
                    <span className="text-xs font-semibold text-rw-ink">
                        {fmtNgn(order.amountPaid)} / {fmtNgn(order.totalAmount)}
                    </span>
                </div>
                <div className="progress-bar-track">
                    <div className="progress-bar-fill" style={{ width: `${paidPct}%` }} />
                </div>
            </div>
        </button>
    );
}

// ─── Order Detail Panel ───────────────────────────────────────────────────────

function OrderDetailPanel({ order }: { order: Order }) {
    const paidPct =
        order.totalAmount > 0
            ? Math.min(100, Math.round((order.amountPaid / order.totalAmount) * 100))
            : 0;
    const remaining = order.totalAmount - order.amountPaid;

    const statusMessages: Record<string, string> = {
        pending: "Your order is registered. Please make payment to proceed.",
        partially_paid:
            "Partial payment received. Complete payment to confirm your order.",
        paid: "Payment confirmed! Your order is being processed.",
        confirmed: "Order confirmed and queued for production.",
        in_production: "Your merch is being produced — hang tight!",
        delivered: "Order delivered. Enjoy your merch! 🎉",
        flagged: "There's an issue with your payment. Please reach out to the team.",
        cancelled: "This order has been cancelled.",
    };

    return (
        <div className="flex flex-col gap-5 animate-fade-in-up">
            {/* Header */}
            <div className="rw-card p-6 sm:p-8">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                    <div>
                        <p className="eyebrow mb-1">Order Ref</p>
                        <p className="font-mono text-3xl font-bold text-rw-ink tracking-[0.12em]">
                            {order.orderRef}
                        </p>
                        <p className="text-xs text-rw-muted mt-1">
                            Placed on {formatDate(order.createdAt)} at{" "}
                            {formatTime(order.createdAt)}
                        </p>
                    </div>
                    <OrderStatusBadge status={order.status} />
                </div>

                {/* Status message */}
                <div
                    className={`rounded-xl p-4 mb-6 text-sm ${
                        order.status === "flagged"
                            ? "bg-red-50 border border-red-100 text-red-700"
                            : order.status === "delivered"
                              ? "bg-green-50 border border-green-100 text-green-700"
                              : order.status === "paid" || order.status === "confirmed"
                                ? "bg-blue-50 border border-blue-100 text-blue-700"
                                : "bg-rw-bg-alt border border-[var(--rw-border)] text-rw-text-2"
                    }`}
                >
                    {statusMessages[order.status] ?? "Status unknown."}
                </div>

                {/* Customer info */}
                <div className="grid sm:grid-cols-3 gap-4 text-sm">
                    <div>
                        <p className="text-xs text-rw-muted mb-0.5 uppercase tracking-wide font-semibold">
                            Name
                        </p>
                        <p className="font-medium text-rw-ink">{order.customerName}</p>
                    </div>
                    <div>
                        <p className="text-xs text-rw-muted mb-0.5 uppercase tracking-wide font-semibold">
                            Email
                        </p>
                        <p className="font-medium text-rw-ink break-all">
                            {order.customerEmail}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-rw-muted mb-0.5 uppercase tracking-wide font-semibold">
                            Phone
                        </p>
                        <p className="font-medium text-rw-ink">{order.customerPhone}</p>
                    </div>
                    {order.customerNote && (
                        <div className="sm:col-span-3">
                            <p className="text-xs text-rw-muted mb-0.5 uppercase tracking-wide font-semibold">
                                Note
                            </p>
                            <p className="font-medium text-rw-ink">
                                {order.customerNote}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Items */}
            <div className="rw-card overflow-hidden">
                <div className="px-6 pt-6 pb-3 border-b border-[var(--rw-border)]">
                    <h3 className="font-display font-bold text-rw-ink">Items Ordered</h3>
                </div>
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-[var(--rw-border)] bg-rw-bg-alt">
                            <th className="px-6 py-3 text-left text-xs font-semibold text-rw-muted uppercase tracking-wide">
                                Product
                            </th>
                            <th className="px-3 py-3 text-right text-xs font-semibold text-rw-muted uppercase tracking-wide">
                                Qty
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-semibold text-rw-muted uppercase tracking-wide">
                                Subtotal
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.items.map((item) => (
                            <tr
                                key={item.id}
                                className="border-b border-[var(--rw-border)] last:border-0 hover:bg-rw-bg-alt/50 transition-colors"
                            >
                                <td className="px-6 py-4">
                                    <p className="font-semibold text-rw-ink">
                                        {item.productName}
                                    </p>
                                    <p className="text-xs text-rw-muted mt-0.5">
                                        {item.variantLabel}
                                    </p>
                                </td>
                                <td className="px-3 py-4 text-right text-rw-text-2">
                                    {item.quantity}
                                </td>
                                <td className="px-6 py-4 text-right font-semibold text-rw-ink">
                                    {fmtNgn(item.unitPrice * item.quantity)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Payment summary */}
            <div className="rw-card p-6">
                <h3 className="font-display font-bold text-rw-ink mb-4">
                    Payment Summary
                </h3>
                <div className="space-y-3 mb-5">
                    <div className="flex justify-between text-sm">
                        <span className="text-rw-text-2">Order total</span>
                        <span className="font-semibold text-rw-ink">
                            {fmtNgn(order.totalAmount)}
                        </span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-rw-text-2">Amount paid</span>
                        <span className="font-semibold text-green-600">
                            {fmtNgn(order.amountPaid)}
                        </span>
                    </div>
                    {remaining > 0 && (
                        <div className="flex justify-between text-sm border-t border-[var(--rw-border)] pt-3">
                            <span className="font-semibold text-rw-ink">Balance due</span>
                            <span className="font-bold text-rw-crimson">
                                {fmtNgn(remaining)}
                            </span>
                        </div>
                    )}
                </div>

                {/* Progress */}
                <div>
                    <div className="flex justify-between mb-2">
                        <span className="text-xs text-rw-muted">Payment progress</span>
                        <span className="text-xs font-bold text-rw-ink">{paidPct}%</span>
                    </div>
                    <div className="progress-bar-track">
                        <div
                            className="progress-bar-fill"
                            style={{ width: `${paidPct}%` }}
                        />
                    </div>
                </div>

                {/* CTA to pay */}
                {(order.status === "pending" ||
                    order.status === "partially_paid" ||
                    order.status === "flagged") && (
                    <Link
                        href={`/fulfil?ref=${order.orderRef}`}
                        className="mt-5 flex h-11 w-full items-center justify-center rounded-xl bg-rw-crimson text-[14px] font-semibold text-white hover:bg-rw-crimson-dk transition-all hover:shadow-[var(--rw-shadow-crimson)]"
                    >
                        {order.status === "flagged"
                            ? "Resolve Payment →"
                            : "Complete Payment →"}
                    </Link>
                )}
            </div>
        </div>
    );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({ mode }: { mode: "initial" | "no-results" }) {
    return (
        <div className="flex flex-col items-center justify-center gap-4 py-16 text-center px-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rw-bg-alt border border-[var(--rw-border)]">
                {mode === "initial" ? (
                    <svg
                        className="h-7 w-7 text-rw-muted"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.5}
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 15.803 7.5 7.5 0 0 0 15.803 15.803Z"
                        />
                    </svg>
                ) : (
                    <svg
                        className="h-7 w-7 text-rw-muted"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.5}
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.182 16.318A4.486 4.486 0 0 0 12.016 15a4.486 4.486 0 0 0-3.198 1.318M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z"
                        />
                    </svg>
                )}
            </div>
            {mode === "initial" ? (
                <>
                    <h3 className="font-display font-bold text-lg text-rw-ink">
                        Find your order
                    </h3>
                    <p className="text-sm text-rw-muted max-w-xs">
                        Enter your phone number or email address above to look up orders
                        associated with your account.
                    </p>
                </>
            ) : (
                <>
                    <h3 className="font-display font-bold text-lg text-rw-ink">
                        No orders found
                    </h3>
                    <p className="text-sm text-rw-muted max-w-xs">
                        We couldn&#39;t find any orders matching that phone number or
                        email. Double-check the details you entered.
                    </p>
                </>
            )}
        </div>
    );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function OrdersClient() {
    const [allOrders, setAllOrders] = useState<Order[]>([]);
    const [deviceRefs, setDeviceRefs] = useState<string[]>([]);
    const [query, setQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const [selectedRef, setSelectedRef] = useState<string | null>(null);
    const [hasMounted, setHasMounted] = useState(false);

    // Load localStorage data client-side only
    useEffect(() => {
        (() => {
            const orders = getAllOrders();
            const refs = getDeviceRefs();
            setAllOrders(orders);
            setDeviceRefs(refs);
            setHasMounted(true);

            // Auto-select most recent device order if any
            if (refs.length > 0) {
                const latestRef = refs[refs.length - 1];
                const match = orders.find((o) => o.orderRef === latestRef);
                if (match) {
                    setSelectedRef(match.orderRef);
                }
            }
        })();
    }, []);

    // Debounce search
    useEffect(() => {
        const t = setTimeout(() => setDebouncedQuery(query), 320);
        return () => clearTimeout(t);
    }, [query]);

    const deviceOrders = allOrders.filter((o) => deviceRefs.includes(o.orderRef));
    const searchResults = debouncedQuery ? searchOrders(allOrders, debouncedQuery) : [];

    const selectedOrder = selectedRef
        ? (allOrders.find((o) => o.orderRef === selectedRef) ?? null)
        : null;

    const handleSelect = useCallback((ref: string) => {
        setSelectedRef(ref);
    }, []);

    const showEmptyState = !debouncedQuery && deviceOrders.length === 0;

    return (
        <div className="min-h-screen bg-rw-bg-alt">
            {/* Page header */}
            <div className="bg-white border-b border-[var(--rw-border)]">
                <div className="section-container py-8 sm:py-10">
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                        <div>
                            <p className="eyebrow mb-1.5">Redemption Week&lsquo;26</p>
                            <h1 className="section-heading text-3xl sm:text-4xl">
                                My Orders
                            </h1>
                            <p className="mt-2 text-sm text-rw-muted">
                                Search by phone number or email to find your merch orders.
                            </p>
                        </div>
                        <Link
                            href="/shop"
                            className="inline-flex h-10 items-center gap-2 rounded-xl bg-rw-crimson px-5 text-sm font-semibold text-white hover:bg-rw-crimson-dk transition-all hover:shadow-[var(--rw-shadow-crimson)] self-start sm:self-auto"
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
                                    d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007Z"
                                />
                            </svg>
                            Shop Merch
                        </Link>
                    </div>

                    {/* Search */}
                    <SearchInput
                        query={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            if (!e.target.value) setSelectedRef(null);
                        }}
                        onClear={() => {
                            setQuery("");
                            setSelectedRef(null);
                            setDebouncedQuery("");
                        }}
                    />
                </div>
            </div>

            {/* Body */}
            <div className="section-container py-8">
                {!hasMounted ? (
                    <div className="grid lg:grid-cols-[380px_1fr] gap-6 items-start">
                        <div className="flex flex-col gap-3">
                            {[1, 2, 3].map((i) => (
                                <div
                                    key={i}
                                    className="h-32 rounded-2xl bg-white border border-[var(--rw-border)] animate-pulse"
                                />
                            ))}
                        </div>
                        <div className="hidden lg:block h-96 rounded-2xl bg-white border border-[var(--rw-border)] animate-pulse" />
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-[380px_1fr] gap-8 items-start">
                        {/* Left — order list */}
                        <div className="flex flex-col gap-6">
                            {/* Group 1: Search Results */}
                            {debouncedQuery && (
                                <div className="flex flex-col gap-3">
                                    <p className="text-xs font-bold uppercase tracking-wide text-rw-crimson px-1">
                                        Search Results ({searchResults.length})
                                    </p>
                                    {searchResults.length === 0 ? (
                                        <div className="rw-card">
                                            <EmptyState mode="no-results" />
                                        </div>
                                    ) : (
                                        searchResults.map((order) => (
                                            <OrderListItem
                                                key={order.orderRef}
                                                order={order}
                                                selected={selectedRef === order.orderRef}
                                                onClick={() =>
                                                    handleSelect(order.orderRef)
                                                }
                                                isDevice={deviceRefs.includes(
                                                    order.orderRef
                                                )}
                                            />
                                        ))
                                    )}
                                </div>
                            )}

                            {/* Group 2: Device Orders (Only show if not searching or if there are results) */}
                            {deviceOrders.length > 0 && (
                                <div className="flex flex-col gap-3">
                                    <p className="text-xs font-bold uppercase tracking-wide text-rw-muted px-1">
                                        Orders from this device ({deviceOrders.length})
                                    </p>
                                    {deviceOrders.map((order) => (
                                        <OrderListItem
                                            key={order.orderRef}
                                            order={order}
                                            selected={selectedRef === order.orderRef}
                                            onClick={() => handleSelect(order.orderRef)}
                                            isDevice={true}
                                        />
                                    ))}
                                </div>
                            )}

                            {showEmptyState && (
                                <div className="rw-card">
                                    <EmptyState mode="initial" />
                                </div>
                            )}
                        </div>

                        {/* Right — detail panel */}
                        <div className="lg:sticky lg:top-24">
                            {selectedOrder ? (
                                <OrderDetailPanel order={selectedOrder} />
                            ) : (
                                <div className="rw-card flex flex-col items-center justify-center gap-4 py-24 text-center px-6">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rw-bg-alt border border-[var(--rw-border)]">
                                        <svg
                                            className="h-7 w-7 text-rw-muted"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth={1.5}
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2"
                                            />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-display font-bold text-lg text-rw-ink">
                                            Select an order
                                        </h3>
                                        <p className="mt-1 text-sm text-rw-muted max-w-xs">
                                            Click any order on the left to see its full
                                            details and current status.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
