"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
    FOLLOW_UP_BODY,
    FOLLOW_UP_DEFAULT_DAYS,
    FOLLOW_UP_SUBJECT,
} from "./constants";
import { sendCustomEmailAction } from "@/app/actions/email-templates";
import type { StaleOrder } from "./types";

interface FollowUpPanelProps {
    staleOrders: StaleOrder[];
}

const STATUS_LABELS: Record<string, string> = {
    pending: "Awaiting payment",
    partially_paid: "Partially paid",
};

const naira = (amount: number) =>
    `₦${new Intl.NumberFormat("en-NG", { maximumFractionDigits: 0 }).format(amount)}`;

const daysSince = (iso: string) =>
    Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);

export function FollowUpPanel({ staleOrders }: FollowUpPanelProps) {
    const router = useRouter();
    const [days, setDays] = useState(FOLLOW_UP_DEFAULT_DAYS);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    // Token of the in-flight send: a row id, "__bulk__", or null when idle.
    const [busy, setBusy] = useState<string | null>(null);
    const BULK = "__bulk__";

    // Orders quiet for at least `days`, oldest first.
    const stale = useMemo(() => {
        const threshold = Math.max(0, days);
        return staleOrders
            .map((o) => ({ ...o, daysStale: daysSince(o.lastActivityAt) }))
            .filter((o) => o.daysStale >= threshold)
            .sort((a, b) => b.daysStale - a.daysStale);
    }, [staleOrders, days]);

    const visibleIds = stale.map((o) => o.id);
    const allSelected =
        visibleIds.length > 0 && visibleIds.every((id) => selectedIds.includes(id));

    const toggle = (id: string) =>
        setSelectedIds((ids) =>
            ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]
        );

    const toggleAll = () =>
        setSelectedIds(allSelected ? [] : visibleIds);

    const send = async (orderIds: string[], token: string) => {
        if (orderIds.length === 0) return;
        setBusy(token);
        const toastId = toast.loading("Sending follow-up…");
        const res = await sendCustomEmailAction({
            orderIds,
            subject: FOLLOW_UP_SUBJECT,
            bodyHtml: FOLLOW_UP_BODY,
        });
        if (res.success) {
            const n = res.sent ?? orderIds.length;
            toast.success(
                n === 1 ? "Follow-up sent" : `Follow-up sent to ${n} customers`,
                { id: toastId }
            );
            setSelectedIds((ids) => ids.filter((id) => !orderIds.includes(id)));
            router.refresh();
        } else {
            toast.error(res.error || "Failed to send follow-up", { id: toastId });
        }
        setBusy(null);
    };

    return (
        <div className="flex flex-col gap-5">
            {/* Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-sm">
                    <span className="text-rw-muted">No engagement for at least</span>
                    <input
                        type="number"
                        min={0}
                        value={days}
                        onChange={(e) =>
                            setDays(Math.max(0, Number(e.currentTarget.value) || 0))
                        }
                        className="w-16 rounded-lg border border-(--rw-border) bg-white px-2.5 py-1.5 text-sm text-rw-ink focus:outline-none focus:border-rw-crimson"
                    />
                    <span className="text-rw-muted">
                        day{days === 1 ? "" : "s"} ·{" "}
                        <span className="font-semibold text-rw-ink">
                            {stale.length}
                        </span>{" "}
                        order{stale.length === 1 ? "" : "s"}
                    </span>
                </div>

                {selectedIds.length > 0 && (
                    <button
                        onClick={() => send(selectedIds, BULK)}
                        disabled={busy !== null}
                        className="px-5 py-2 rounded-xl text-sm font-bold bg-rw-crimson text-white hover:bg-rw-crimson/90 shadow-lg shadow-rw-crimson/20 transition-all disabled:opacity-60"
                    >
                        {busy === BULK
                            ? "Sending…"
                            : `Send follow-up to ${selectedIds.length}`}
                    </button>
                )}
            </div>

            {stale.length === 0 ? (
                <div className="rounded-xl border border-(--rw-border) bg-rw-bg-alt/40 px-6 py-12 text-center">
                    <p className="text-sm text-rw-muted">
                        No stale orders — every pending order has had recent activity. 🎉
                    </p>
                </div>
            ) : (
                <div className="overflow-x-auto rounded-2xl border border-(--rw-border) bg-white">
                    <table className="w-full text-sm">
                        <thead className="bg-rw-bg-alt/50 border-b border-(--rw-border)">
                            <tr className="text-left">
                                <th className="px-4 py-3 w-10">
                                    <input
                                        type="checkbox"
                                        checked={allSelected}
                                        onChange={toggleAll}
                                        aria-label="Select all"
                                    />
                                </th>
                                {["Customer", "Status", "Stale for", "Balance", ""].map(
                                    (h) => (
                                        <th
                                            key={h}
                                            className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-rw-muted"
                                        >
                                            {h}
                                        </th>
                                    )
                                )}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-(--rw-border)">
                            {stale.map((o) => (
                                <tr
                                    key={o.id}
                                    className="hover:bg-rw-bg-alt/30 transition-colors"
                                >
                                    <td className="px-4 py-3">
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.includes(o.id)}
                                            onChange={() => toggle(o.id)}
                                            aria-label={`Select ${o.customerName}`}
                                        />
                                    </td>
                                    <td className="px-4 py-3">
                                        <p className="text-sm font-medium text-rw-ink">
                                            {o.customerName}{" "}
                                            <span className="font-mono text-xs text-rw-muted">
                                                #{o.orderRef}
                                            </span>
                                        </p>
                                        <p className="text-xs text-rw-muted truncate max-w-[220px]">
                                            {o.customerEmail}
                                        </p>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-700">
                                            {STATUS_LABELS[o.status] ?? o.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-rw-text-2 whitespace-nowrap">
                                        {o.daysStale} day{o.daysStale === 1 ? "" : "s"}
                                    </td>
                                    <td className="px-4 py-3 text-rw-ink tabular-nums whitespace-nowrap">
                                        {naira(o.balance)}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <button
                                            onClick={() => send([o.id], o.id)}
                                            disabled={busy !== null}
                                            className="text-xs font-semibold text-rw-crimson hover:underline disabled:opacity-50 whitespace-nowrap"
                                        >
                                            {busy === o.id
                                                ? "Sending…"
                                                : "Send follow-up"}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
