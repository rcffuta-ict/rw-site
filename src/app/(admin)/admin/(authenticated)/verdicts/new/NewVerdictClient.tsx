"use client";

import { useState, useTransition, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createVerdict } from "@/lib/services/verdicts.service";
import type { Order } from "@/lib/data/types";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { formatNaira } from "@/lib/utils/functions";

interface NewVerdictClientProps {
    orders: Order[];
}

export function NewVerdictClient({ orders }: NewVerdictClientProps) {
    const { user } = useAdminAuth();
    const confirmedOrders = orders.filter(
        (o) =>
            (o.status === "confirmed" ||
                o.status === "paid" ||
                o.status === "in_production" ||
                o.status === "delivered") &&
            o.items &&
            o.items.length > 0
    );

    const router = useRouter();
    const [selected, setSelected] = useState<Set<string>>(new Set());
    const [isPending, startTransition] = useTransition();
    const [searchQuery, setSearchQuery] = useState("");

    const currentAdminName = user?.name || "Authorized Admin";
    const currentAdminContact = user?.email || "";
    const currentAdmin = currentAdminContact
        ? `${currentAdminName} (${currentAdminContact})`
        : currentAdminName;

    const filteredOrders = useMemo(() => {
        if (!searchQuery.trim()) return confirmedOrders;
        const q = searchQuery.toLowerCase();
        return confirmedOrders.filter(
            (o) =>
                o.orderRef.toLowerCase().includes(q) ||
                o.customerName.toLowerCase().includes(q)
        );
    }, [confirmedOrders, searchQuery]);

    const isAllFilteredSelected =
        filteredOrders.length > 0 && filteredOrders.every((o) => selected.has(o.id));

    function toggleSelectAllFiltered() {
        setSelected((prev) => {
            const next = new Set(prev);
            if (isAllFilteredSelected) {
                // deselect all filtered
                filteredOrders.forEach((o) => next.delete(o.id));
            } else {
                // select all filtered
                filteredOrders.forEach((o) => next.add(o.id));
            }
            return next;
        });
    }

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
        if (selected.size === 0) return;

        const toastId = toast.loading("Processing verdict creation...");

        startTransition(async () => {
            const selectedIds = Array.from(selected);
            const res = await createVerdict({
                issuedBy: currentAdmin,
                orderIds: selectedIds,
            });

            if (res.success && res.data) {
                toast.success("Verdict created successfully!", { id: toastId });
                router.push(`/admin/verdicts/${res.data.id}`);
            } else {
                toast.error("Failed to create verdict", {
                    id: toastId,
                    description: res.error,
                });
            }
        });
    }

    return (
        <div className="flex flex-col gap-8 animate-fade-in pb-32 max-w-6xl mx-auto">
            {/* Header Area */}
            <div>
                <h1 className="section-heading text-2xl lg:text-3xl font-display font-black uppercase tracking-tight">
                    Generate Verdict
                </h1>
                <p className="text-sm text-rw-muted mt-1 font-medium italic">
                    Select eligible orders to batch into a formalized production directive
                </p>
            </div>

            {/* Top Cards: Authorization & Integrity Info */}
            <div className="grid lg:grid-cols-2 gap-6">
                <div className="rw-card p-6 flex flex-col justify-between bg-white border border-[var(--rw-border)] shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="h-10 w-10 rounded-full bg-rw-bg-alt flex items-center justify-center shrink-0 border border-[var(--rw-border)]">
                            <svg
                                className="h-5 w-5 text-rw-crimson"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2.5}
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
                                />
                            </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-black text-rw-muted uppercase tracking-[0.2em]">
                                Authorized Issuer
                            </p>
                            <p
                                className="font-display font-black text-rw-ink uppercase text-lg tracking-wider truncate"
                                title={currentAdminName}
                            >
                                {currentAdminName}
                            </p>
                            {currentAdminContact && (
                                <p className="text-xs font-bold text-rw-crimson mt-0.5 truncate">
                                    {currentAdminContact}
                                </p>
                            )}
                        </div>
                    </div>
                    <p className="text-[10px] text-rw-muted font-bold uppercase tracking-widest italic opacity-50">
                        This authenticated identity will be permanently stamped on the
                        manifest.
                    </p>
                </div>
                <div className="rw-card p-6 bg-blue-50/50 border border-blue-100 flex flex-col justify-between shadow-sm">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                            <svg
                                className="h-5 w-5 text-blue-600"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2.5}
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0zm-9-3.75h.008v.008H12V8.25z"
                                />
                            </svg>
                        </div>
                        <p className="text-xs font-black text-blue-900 uppercase tracking-widest">
                            Document Integrity
                        </p>
                    </div>
                    <p className="text-xs text-blue-800/80 font-medium leading-relaxed mt-2">
                        Generating a verdict consolidates all selected orders into a
                        single unified production and financial ledger. This action cannot
                        be reversed.
                    </p>
                </div>
            </div>

            {/* Selection Table Area */}
            <div className="rw-card bg-white overflow-hidden flex flex-col shadow-sm border border-[var(--rw-border)]">
                {/* Search & Actions Bar */}
                <div className="p-4 border-b border-[var(--rw-border)] bg-rw-bg-alt/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="relative w-full sm:max-w-md">
                        <svg
                            className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-rw-muted"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                            />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search by order ref or customer name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-white border border-[var(--rw-border)] rounded-xl text-sm font-medium focus:border-rw-crimson focus:ring-1 focus:ring-rw-crimson outline-none transition-all shadow-sm"
                        />
                    </div>
                    <div className="flex items-center gap-6 self-end sm:self-auto">
                        <div className="flex flex-col text-right hidden sm:flex">
                            <span className="text-[10px] font-black text-rw-muted uppercase tracking-widest">
                                Showing
                            </span>
                            <span className="text-sm font-black text-rw-ink">
                                {filteredOrders.length} Orders
                            </span>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto max-h-[600px] scrollbar-thin scrollbar-thumb-rw-border scrollbar-track-transparent">
                    <table className="w-full text-left border-collapse">
                        <thead className="sticky top-0 bg-rw-bg-alt/95 backdrop-blur z-10 shadow-sm">
                            <tr>
                                <th className="p-4 pl-6 w-12 border-b border-[var(--rw-border)]">
                                    <input
                                        type="checkbox"
                                        checked={isAllFilteredSelected}
                                        onChange={toggleSelectAllFiltered}
                                        className="h-4 w-4 rounded-md accent-rw-crimson cursor-pointer"
                                    />
                                </th>
                                <th className="p-4 text-[10px] font-black text-rw-muted uppercase tracking-widest whitespace-nowrap border-b border-[var(--rw-border)]">
                                    Order Ref
                                </th>
                                <th className="p-4 text-[10px] font-black text-rw-muted uppercase tracking-widest whitespace-nowrap border-b border-[var(--rw-border)]">
                                    Customer
                                </th>
                                <th className="p-4 text-[10px] font-black text-rw-muted uppercase tracking-widest whitespace-nowrap border-b border-[var(--rw-border)]">
                                    Items
                                </th>
                                <th className="p-4 text-[10px] font-black text-rw-muted uppercase tracking-widest whitespace-nowrap border-b border-[var(--rw-border)]">
                                    Status
                                </th>
                                <th className="p-4 pr-6 text-[10px] font-black text-rw-muted uppercase tracking-widest whitespace-nowrap border-b border-[var(--rw-border)] text-right">
                                    Valuation
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--rw-border)]">
                            {filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-16 text-center">
                                        <p className="text-sm font-bold text-rw-muted italic">
                                            No matching orders found.
                                        </p>
                                    </td>
                                </tr>
                            ) : (
                                filteredOrders.map((o) => (
                                    <tr
                                        key={o.id}
                                        onClick={() => toggle(o.id)}
                                        className={`transition-colors cursor-pointer group ${selected.has(o.id) ? "bg-rw-crimson/5 hover:bg-rw-crimson/10" : "hover:bg-rw-bg-alt/50"}`}
                                    >
                                        <td
                                            className="p-4 pl-6 w-12"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selected.has(o.id)}
                                                onChange={() => toggle(o.id)}
                                                className="h-4 w-4 rounded-md accent-rw-crimson cursor-pointer"
                                            />
                                        </td>
                                        <td className="p-4">
                                            <span className="font-mono font-black text-sm text-rw-ink group-hover:text-rw-crimson transition-colors">
                                                {o.orderRef}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <p className="text-sm font-bold text-rw-ink whitespace-nowrap">
                                                {o.customerName}
                                            </p>
                                        </td>
                                        <td className="p-4">
                                            <span className="text-[10px] font-bold uppercase tracking-wider bg-rw-bg-alt px-2 py-1 rounded-md text-rw-muted border border-[var(--rw-border)]">
                                                {o.items.length} unit
                                                {o.items.length !== 1 ? "s" : ""}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span
                                                className={`text-[9px] font-black uppercase tracking-[0.2em] px-2 py-1 rounded-md border ${o.status === "paid" ? "bg-green-50 text-green-700 border-green-200" : o.status === "confirmed" ? "bg-purple-50 text-purple-700 border-purple-200" : "bg-gray-50 text-gray-700 border-gray-200"}`}
                                            >
                                                {o.status.replace("_", " ")}
                                            </span>
                                        </td>
                                        <td className="p-4 pr-6 text-right">
                                            <span className="text-xs font-black font-mono text-rw-ink">
                                                {formatNaira(o.totalAmount)}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Bottom Floating Bar */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-5xl px-6">
                <div className="rw-card p-4 sm:p-6 bg-rw-ink text-white border-none shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-8 rounded-[32px]">
                    <div className="flex items-center gap-6">
                        <div className="flex flex-col">
                            <span className="text-[9px] font-black uppercase tracking-[0.3em] opacity-40">
                                Selected
                            </span>
                            <span className="text-xl sm:text-2xl font-display font-black tracking-tighter">
                                {selected.size}
                            </span>
                        </div>
                        <div className="h-8 w-[1px] bg-white/10" />
                        <div className="flex flex-col">
                            <span className="text-[9px] font-black uppercase tracking-[0.3em] opacity-40">
                                Total Valuation
                            </span>
                            <span className="text-xl sm:text-2xl font-display font-black tracking-tighter text-rw-gold">
                                {formatNaira(
                                    selectedOrdersData.reduce(
                                        (s, o) => s + o.totalAmount,
                                        0
                                    )
                                )}
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={handleGenerate}
                        disabled={selected.size === 0 || isPending}
                        className="h-12 sm:h-14 px-8 sm:px-10 rounded-2xl bg-rw-crimson text-white font-display font-black uppercase tracking-widest text-xs sm:text-sm hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-30 disabled:grayscale disabled:scale-100 flex items-center gap-3 shadow-xl shadow-rw-crimson/20 w-full sm:w-auto justify-center"
                    >
                        {isPending ? (
                            <>
                                <span className="h-5 w-5 rounded-full border-3 border-white border-t-transparent animate-spin" />{" "}
                                Processing...
                            </>
                        ) : (
                            <>
                                Register Verdict
                                <svg
                                    className="h-4 w-4 sm:h-5 sm:w-5"
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
