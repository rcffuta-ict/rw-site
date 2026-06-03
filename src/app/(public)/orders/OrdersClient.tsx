"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import type { Order } from "@/lib/data/types";
import { OrderStatusBadge } from "@/components/ui/Badge";
import { SearchInput } from "@/components/ui/SearchInput";
import { searchOrdersAction, getOrdersByRefsAction } from "@/app/actions/orders";
import { formatDate, formatNaira, formatTime, ph } from "@/lib/utils/functions";
import { StatusTimeline } from "@/components/ui/StatusTimeline";
import { ProductImage } from "@/components/common/ProductImage";
import { CopyButton } from "@/components/common/CopyButton";
import { VariantLabelDisplay } from "@/components/common/VariantDisplay";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getDeviceRefs(): string[] {
    try {
        return JSON.parse(localStorage.getItem("rw_order_refs") ?? "[]") as string[];
    } catch {
        return [];
    }
}

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
    string,
    { label: string; icon: string; color: string; bg: string; message: string }
> = {
    pending: {
        label: "Pending",
        icon: "⏳",
        color: "#9a8085",
        bg: "#fdf5f5",
        message: "Your order is registered. Please make payment to proceed.",
    },
    partially_paid: {
        label: "Partial",
        icon: "💳",
        color: "#b84500",
        bg: "#fff5ee",
        message: "Partial payment received. Complete payment to confirm your order.",
    },
    paid: {
        label: "Paid",
        icon: "✅",
        color: "#015500",
        bg: "#f0fff5",
        message: "Payment confirmed! Your order is being processed.",
    },
    confirmed: {
        label: "Queued",
        icon: "📋",
        color: "#004cb8",
        bg: "#f0f4ff",
        message: "Order confirmed and queued for production.",
    },
    in_production: {
        label: "In Production",
        icon: "🏭",
        color: "#5010aa",
        bg: "#f8f0ff",
        message: "Your merch is being produced — hang tight!",
    },
    delivered: {
        label: "Delivered",
        icon: "🎉",
        color: "#015500",
        bg: "#f0fff5",
        message: "Order delivered. Enjoy your merch!",
    },
    flagged: {
        label: "Flagged",
        icon: "⚠️",
        color: "#cc0011",
        bg: "#fff0f0",
        message: "There's an issue with your payment. Please reach out to the team.",
    },
    cancelled: {
        label: "Cancelled",
        icon: "✖",
        color: "#9a8085",
        bg: "#fdf5f5",
        message: "This order has been cancelled.",
    },
};

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
    const payments = order.payments || [];
    const approvedSum = payments
        .filter((p) => p.status === "approved")
        .reduce((sum, p) => sum + (p.amountConfirmed ?? p.extractedAmount), 0);
    const pendingSum = payments
        .filter((p) => p.status === "pending")
        .reduce((sum, p) => sum + p.extractedAmount, 0);
    const approvedPct =
        order.totalAmount > 0
            ? Math.min(100, Math.round((approvedSum / order.totalAmount) * 100))
            : 0;
    const pendingPct =
        order.totalAmount > 0
            ? Math.min(
                  100 - approvedPct,
                  Math.round((pendingSum / order.totalAmount) * 100)
              )
            : 0;
    const cfg = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending;

    return (
        <button
            onClick={onClick}
            className={`w-full text-left rounded-2xl border transition-all duration-200 overflow-hidden group ${
                selected
                    ? "border-rw-crimson shadow-[0_0_0_3px_rgba(255,0,21,0.08)] bg-white"
                    : "border-[#e8d0d4] bg-white hover:border-[#c9a0a8] hover:shadow-md"
            }`}
        >
            {/* Top accent bar when selected */}
            <div
                className={`h-0.5 w-full transition-all duration-300 ${
                    selected ? "bg-rw-crimson" : "bg-transparent"
                }`}
            />
            <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2 min-w-0 flex-wrap">
                        <span className="font-mono text-[13px] font-black text-[#1C0003] tracking-[0.12em] flex items-center">
                            {order.orderRef}
                            <CopyButton textToCopy={order.orderRef} />
                        </span>
                        {isDevice && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-rw-crimson/8 px-2 py-0.5 text-[9px] font-black text-rw-crimson uppercase tracking-widest border border-rw-crimson/15">
                                This device
                            </span>
                        )}
                    </div>
                    <span
                        className="shrink-0 text-sm px-2 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wide"
                        style={{ color: cfg.color, background: cfg.bg }}
                    >
                        {cfg.icon} {cfg.label}
                    </span>
                </div>

                <p className="text-sm font-bold text-[#1C0003] truncate leading-tight">
                    {order.customerName}
                </p>
                <p className="text-[11px] text-[#9a8085] mt-0.5 truncate">
                    {order.items.length} item{order.items.length !== 1 ? "s" : ""} ·{" "}
                    {formatDate(order.createdAt)}
                </p>

                {/* Payment bar */}
                <div className="mt-3">
                    <div className="flex justify-between items-center mb-1.5">
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#9a8085]">
                            Payment
                        </span>
                        <span className="text-[10px] font-bold text-[#1C0003]">
                            {formatNaira(approvedSum)}
                            {pendingSum > 0 && (
                                <span className="text-amber-500 font-bold">
                                    {" "}
                                    +{formatNaira(pendingSum)} pending
                                </span>
                            )}{" "}
                            <span className="text-[#9a8085] font-medium">
                                / {formatNaira(order.totalAmount)}
                            </span>
                        </span>
                    </div>
                    <div className="h-1.5 w-full bg-[#f4e6e8] rounded-full overflow-hidden flex">
                        <div
                            className="h-full bg-gradient-to-r from-emerald-500 to-green-400 transition-all duration-500"
                            style={{ width: `${approvedPct}%` }}
                        />
                        <div
                            className="h-full bg-amber-400 animate-pulse transition-all duration-500"
                            style={{ width: `${pendingPct}%` }}
                        />
                    </div>
                </div>
            </div>
        </button>
    );
}

// ─── Order Detail Panel ───────────────────────────────────────────────────────

function OrderDetailPanel({ order }: { order: Order }) {
    const payments = order.payments || [];
    const approvedSum = payments
        .filter((p) => p.status === "approved")
        .reduce((sum, p) => sum + (p.amountConfirmed ?? p.extractedAmount), 0);
    const pendingSum = payments
        .filter((p) => p.status === "pending")
        .reduce((sum, p) => sum + p.extractedAmount, 0);

    const approvedPct =
        order.totalAmount > 0
            ? Math.min(100, Math.round((approvedSum / order.totalAmount) * 100))
            : 0;
    const pendingPct =
        order.totalAmount > 0
            ? Math.min(
                  100 - approvedPct,
                  Math.round((pendingSum / order.totalAmount) * 100)
              )
            : 0;
    const remaining = Math.max(0, order.totalAmount - approvedSum - pendingSum);
    const cfg = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending;

    return (
        <div className="flex flex-col gap-4 animate-fade-in-up">
            {/* Header card */}
            <div className="rw-card overflow-hidden">
                {/* Dark header strip */}
                <div className="bg-rw-ink px-6 py-5 flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em] mb-2">
                            Order Reference
                        </p>
                        <p className="font-mono text-3xl sm:text-4xl font-black text-white tracking-[0.12em] leading-none flex items-center">
                            {order.orderRef}
                            <CopyButton textToCopy={order.orderRef} />
                        </p>
                        <p className="text-[11px] text-white/30 mt-2 font-medium">
                            Placed {formatDate(order.createdAt)} at{" "}
                            {formatTime(order.createdAt)}
                        </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        <OrderStatusBadge status={order.status} />
                        {(order.status === "pending" ||
                            order.status === "partially_paid" ||
                            order.status === "flagged") && (
                            <Link
                                href={`/fulfil?ref=${order.orderRef}`}
                                className="text-[10px] font-black text-rw-crimson hover:underline uppercase tracking-widest"
                            >
                                {order.status === "flagged" ? "Resolve →" : "Pay Now →"}
                            </Link>
                        )}
                    </div>
                </div>

                {/* Status message */}
                <div
                    className="px-6 py-3 text-sm flex items-center gap-3 border-b border-[#e8d0d4]"
                    style={{ background: cfg.bg, color: cfg.color }}
                >
                    <span className="text-base shrink-0">{cfg.icon}</span>
                    <span className="font-semibold leading-snug">{cfg.message}</span>
                </div>

                {/* Customer info */}
                <div className="p-6 grid sm:grid-cols-3 gap-5 text-sm">
                    {[
                        { label: "Name", value: order.customerName },
                        { label: "Email", value: order.customerEmail },
                        { label: "Phone", value: order.customerPhone },
                        ...(order.customerNote
                            ? [{ label: "Note", value: order.customerNote }]
                            : []),
                    ].map((f) => (
                        <div
                            key={f.label}
                            className={
                                f.label === "Note"
                                    ? "sm:col-span-3 pt-4 border-t border-dashed border-[#e8d0d4]"
                                    : ""
                            }
                        >
                            <p className="text-[9px] text-[#9a8085] mb-1 uppercase tracking-[0.2em] font-black">
                                {f.label}
                            </p>
                            <p className="font-semibold text-[#1C0003] break-all leading-snug">
                                {f.value}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Status timeline */}
            <StatusTimeline status={order.status} />

            {/* Items table */}
            <div className="rw-card overflow-hidden">
                <div className="px-6 pt-5 pb-3 border-b border-[#e8d0d4]">
                    <h3 className="font-display font-bold text-[#1C0003] text-base">
                        Items Ordered ({order.items.length})
                    </h3>
                </div>
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-[#e8d0d4] bg-[#fdf8f8]">
                            <th className="px-6 py-3 text-left text-[10px] font-bold text-[#9a8085] uppercase tracking-wide">
                                Product
                            </th>
                            <th className="px-3 py-3 text-right text-[10px] font-bold text-[#9a8085] uppercase tracking-wide">
                                Qty
                            </th>
                            <th className="px-6 py-3 text-right text-[10px] font-bold text-[#9a8085] uppercase tracking-wide">
                                Subtotal
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.items.map((item) => (
                            <tr
                                key={item.id}
                                className="border-b border-[#e8d0d4] last:border-0 hover:bg-[#fdf8f8]/50 transition-colors"
                            >
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <ProductImage
                                            imageUrl={
                                                item.imageUrl ||
                                                ph(40, 40, item.productName.slice(0, 6))
                                            }
                                            minimal
                                            alt={item.productName}
                                            size="40px"
                                            config={{
                                                // h: "h-[40px]",
                                                // w: "w-[40px]",
                                                className:
                                                    "rounded-lg overflow-hidden shrink-0 border border-[var(--rw-border)] bg-rw-bg-alt relative",
                                            }}
                                        />
                                        <div>
                                            <p className="font-semibold text-[#1C0003]">
                                                {item.productName}
                                            </p>
                                            <VariantLabelDisplay
                                                variants={item.variantLabel}
                                            />
                                        </div>
                                    </div>
                                </td>
                                <td className="px-3 py-4 text-right text-[#5c4048]">
                                    {item.quantity}
                                </td>
                                <td className="px-6 py-4 text-right font-semibold text-[#1C0003]">
                                    {formatNaira(item.unitPrice * item.quantity)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Payment summary */}
            <div className="rw-card p-6">
                <h3 className="font-display font-bold text-[#1C0003] mb-4">
                    Payment Summary
                </h3>

                <div className="space-y-3 mb-5">
                    <div className="flex justify-between text-sm">
                        <span className="text-[#5c4048]">Order total</span>
                        <span className="font-semibold text-[#1C0003]">
                            {formatNaira(order.totalAmount)}
                        </span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-[#5c4048]">Amount confirmed</span>
                        <span className="font-semibold text-green-600">
                            {formatNaira(approvedSum)}
                        </span>
                    </div>
                    {pendingSum > 0 && (
                        <div className="flex justify-between text-sm">
                            <span className="text-[#5c4048]">Amount pending review</span>
                            <span className="font-semibold text-amber-600 animate-pulse">
                                {formatNaira(pendingSum)}
                            </span>
                        </div>
                    )}
                    {remaining > 0 && (
                        <div className="flex justify-between text-sm border-t border-[#e8d0d4] pt-3">
                            <span className="font-semibold text-[#1C0003]">
                                Balance due
                            </span>
                            <span className="font-bold text-[#FF0015]">
                                {formatNaira(remaining)}
                            </span>
                        </div>
                    )}
                </div>

                {/* Progress bar */}
                <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                        <span className="text-xs text-[#9a8085]">Payment progress</span>
                        <div className="text-right">
                            <span className="text-xs font-bold text-[#1C0003]">
                                {approvedPct}%
                            </span>
                            {pendingPct > 0 && (
                                <span className="text-[10px] font-bold text-amber-500 ml-1">
                                    +{pendingPct}% pending
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="h-3 w-full bg-[#f4e6e8] rounded-full overflow-hidden flex border border-[#f0dedf] relative">
                        <div
                            className="h-full bg-gradient-to-r from-emerald-500 to-green-400 transition-all duration-500 rounded-l-full"
                            style={{ width: `${approvedPct}%` }}
                        />
                        <div
                            className="h-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-500 animate-pulse relative overflow-hidden"
                            style={{
                                width: `${pendingPct}%`,
                                backgroundImage: `linear-gradient(45deg, rgba(255,255,255,0.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.15) 75%, transparent 75%, transparent)`,
                                backgroundSize: "1rem 1rem",
                            }}
                        />
                    </div>
                </div>

                {/* CTA */}
                {/* {(order.status === "pending" ||
                    order.status === "partially_paid" ||
                    order.status === "flagged") && (
                    <Link
                        href={`/fulfil?ref=${order.orderRef}`}
                        className="mt-5 flex h-11 w-full items-center justify-center rounded-xl bg-[#FF0015]
                                   text-[14px] font-semibold text-white hover:bg-[#cc0011] transition-all
                                   hover:shadow-[0_4px_16px_rgba(255,0,21,0.35)]"
                    >
                        {order.status === "flagged"
                            ? "Resolve Payment →"
                            : "Complete Payment →"}
                    </Link>
                )} */}
            </div>
        </div>
    );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({ mode }: { mode: "initial" | "no-results" }) {
    return (
        <div className="flex flex-col items-center justify-center gap-4 py-16 text-center px-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#fdf8f8] border border-[#e8d0d4]">
                <svg
                    className="h-7 w-7 text-[#9a8085]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    viewBox="0 0 24 24"
                >
                    {mode === "initial" ? (
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 15.803 7.5 7.5 0 0 0 15.803 15.803Z"
                        />
                    ) : (
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.182 16.318A4.486 4.486 0 0 0 12.016 15a4.486 4.486 0 0 0-3.198 1.318M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z"
                        />
                    )}
                </svg>
            </div>
            <div>
                <h3 className="font-display font-bold text-lg text-[#1C0003]">
                    {mode === "initial" ? "Find your order" : "No orders found"}
                </h3>
                <p className="text-sm text-[#9a8085] max-w-xs mt-1">
                    {mode === "initial"
                        ? "Enter your phone number, email, or order reference above to look up your orders."
                        : "We couldn't find orders matching that search. Double-check the details."}
                </p>
            </div>
        </div>
    );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function OrdersClient() {
    const [deviceOrders, setDeviceOrders] = useState<Order[]>([]);
    const [searchResults, setSearchResults] = useState<Order[]>([]);
    const [deviceRefs, setDeviceRefs] = useState<string[]>([]);
    const [query, setQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const [selectedRef, setSelectedRef] = useState<string | null>(null);
    const [hasMounted, setHasMounted] = useState(false);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        (() => {
            const refs = getDeviceRefs();
            setDeviceRefs(refs);
            if (refs.length > 0) {
                getOrdersByRefsAction(refs).then((orders) => {
                    setDeviceOrders(orders);
                    if (orders.length > 0 && !selectedRef) {
                        setSelectedRef(orders[0].orderRef);
                    }
                });
            }
            setHasMounted(true);
        })();
    }, []);

    useEffect(() => {
        const t = setTimeout(() => setDebouncedQuery(query), 320);
        return () => clearTimeout(t);
    }, [query]);

    useEffect(() => {
        (() => {
            if (debouncedQuery) {
                setIsSearching(true);
                searchOrdersAction(debouncedQuery).then((results) => {
                    setSearchResults(results);
                    setIsSearching(false);
                });
            } else {
                setSearchResults([]);
                setIsSearching(false);
            }
        })();
    }, [debouncedQuery]);

    const allOrdersToSelectFrom = [...deviceOrders, ...searchResults];
    const selectedOrder = selectedRef
        ? (allOrdersToSelectFrom.find((o) => o.orderRef === selectedRef) ?? null)
        : null;
    const handleSelect = useCallback((ref: string) => setSelectedRef(ref), []);
    const showEmptyState = !debouncedQuery && deviceOrders.length === 0;

    return (
        <div className="min-h-screen bg-[#fdf8f8]">
            {/* Page header */}

            {/* Body */}
            <div className="section-container py-8">
                <div className="max-w-3xl ml-auto my-6">
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
                {!hasMounted ? (
                    <div className="grid lg:grid-cols-[380px_1fr] gap-6 items-start">
                        <div className="flex flex-col gap-3">
                            {[1, 2, 3].map((i) => (
                                <div
                                    key={i}
                                    className="h-32 rounded-2xl bg-white border border-[#e8d0d4] animate-pulse"
                                />
                            ))}
                        </div>
                        <div className="hidden lg:block h-96 rounded-2xl bg-white border border-[#e8d0d4] animate-pulse" />
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-[380px_1fr] gap-8 items-start">
                        {/* Left — order list */}
                        <div className="flex flex-col gap-5">
                            {debouncedQuery && (
                                <div className="flex flex-col gap-3">
                                    <p className="text-xs font-bold uppercase tracking-wide text-[#FF0015] px-1">
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

                            {deviceOrders.length > 0 && (
                                <div className="flex flex-col gap-3">
                                    <p className="text-xs font-bold uppercase tracking-wide text-[#9a8085] px-1">
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
                                <div className="rw-card flex flex-col items-center justify-center gap-6 py-28 text-center px-6 relative overflow-hidden">
                                    {/* Decorative */}
                                    <div
                                        className="absolute inset-0 opacity-[0.03]"
                                        style={{
                                            backgroundImage:
                                                "radial-gradient(circle, #FF0015 1px, transparent 1px)",
                                            backgroundSize: "24px 24px",
                                        }}
                                    />
                                    <div className="relative">
                                        <div className="h-20 w-20 rounded-3xl bg-rw-bg-alt border border-[var(--rw-border-mid)] flex items-center justify-center mx-auto shadow-sm">
                                            <svg
                                                className="h-9 w-9 text-[#9a8085]"
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
                                    </div>
                                    <div className="relative">
                                        <h3 className="font-display font-black text-xl text-[#1C0003]">
                                            Select an order
                                        </h3>
                                        <p className="mt-2 text-sm text-[#9a8085] max-w-xs leading-relaxed">
                                            Pick any order from the list to view its full
                                            details, payment progress, and status
                                            timeline.
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
