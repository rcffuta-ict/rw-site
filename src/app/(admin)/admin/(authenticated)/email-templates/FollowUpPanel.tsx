"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AdminTable } from "@/components/admin/AdminTable";
import { OrderRefCell } from "@/components/admin/OrderRefCell";
import { FOLLOW_UP_DEFAULT_DAYS } from "./constants";
import { sendFollowUpAction } from "@/app/actions/email-templates";
import type { Order } from "@/lib/data/types";

interface FollowUpPanelProps {
    staleOrders: Order[];
}

interface FollowRow {
    order: Order;
    daysStale: number;
    balance: number;
}

const STATUS_LABELS: Record<string, string> = {
    pending: "Awaiting payment",
    partially_paid: "Partially paid",
};

const PAGE_SIZE = 12;
const BULK = "__bulk__";

const naira = (amount: number) =>
    `₦${new Intl.NumberFormat("en-NG", { maximumFractionDigits: 0 }).format(amount)}`;

const lastActivityOf = (o: Order): string => {
    const lastPayment = o.payments.reduce<string>(
        (latest, p) => (p.createdAt > latest ? p.createdAt : latest),
        ""
    );
    return [o.updatedAt, lastPayment].filter(Boolean).sort().pop() ?? o.createdAt;
};

const daysSince = (iso: string) =>
    Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);

const timeAgo = (iso: string): string => {
    const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60_000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
};

const sentToday = (iso: string | null) =>
    !!iso && Date.now() - new Date(iso).getTime() < 86_400_000;

export function FollowUpPanel({ staleOrders }: FollowUpPanelProps) {
    const router = useRouter();
    const [days, setDays] = useState(FOLLOW_UP_DEFAULT_DAYS);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [busy, setBusy] = useState<string | null>(null);

    const rows = useMemo<FollowRow[]>(() => {
        const threshold = Math.max(0, days);
        return staleOrders
            .map((order) => ({
                order,
                daysStale: daysSince(lastActivityOf(order)),
                balance: order.totalAmount - order.amountPaid,
            }))
            .filter((r) => r.daysStale >= threshold)
            .sort((a, b) => b.daysStale - a.daysStale);
    }, [staleOrders, days]);

    const visibleIds = rows.map((r) => r.order.id);
    const allSelected =
        visibleIds.length > 0 && visibleIds.every((id) => selectedIds.includes(id));

    const toggle = (id: string) =>
        setSelectedIds((ids) =>
            ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]
        );

    const toggleAll = () => setSelectedIds(allSelected ? [] : visibleIds);

    const send = async (orderIds: string[], token: string) => {
        if (orderIds.length === 0) return;
        setBusy(token);
        const toastId = toast.loading("Sending follow-up…");
        const res = await sendFollowUpAction({ orderIds });
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
                        <span className="font-semibold text-rw-ink">{rows.length}</span>{" "}
                        order{rows.length === 1 ? "" : "s"}
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

            <AdminTable<FollowRow>
                data={rows}
                keyExtractor={(r) => r.order.id}
                pageSize={PAGE_SIZE}
                emptyMessage="No stale orders — every pending order has had recent activity. 🎉"
                footer={
                    rows.length > 0 ? (
                        <span className="text-xs text-rw-muted">
                            Reminders go out once a day per order — re-sending is allowed,
                            but the count shows how many have already been sent.
                        </span>
                    ) : undefined
                }
                columns={[
                    {
                        key: "select",
                        label: (
                            <input
                                type="checkbox"
                                checked={allSelected}
                                onChange={toggleAll}
                                aria-label="Select all"
                            />
                        ),
                        className: "w-10",
                        render: (r) => (
                            <input
                                type="checkbox"
                                checked={selectedIds.includes(r.order.id)}
                                onChange={() => toggle(r.order.id)}
                                aria-label={`Select ${r.order.customerName}`}
                            />
                        ),
                    },
                    {
                        key: "ref",
                        label: "Order",
                        render: (r) => <OrderRefCell order={r.order} />,
                    },
                    {
                        key: "customer",
                        label: "Customer",
                        render: (r) => (
                            <div className="flex flex-col">
                                <span className="font-bold text-rw-ink">
                                    {r.order.customerName}
                                </span>
                                <span className="text-[10px] text-rw-muted truncate max-w-[200px]">
                                    {r.order.customerEmail}
                                </span>
                            </div>
                        ),
                    },
                    {
                        key: "status",
                        label: "Status",
                        render: (r) => (
                            <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-700">
                                {STATUS_LABELS[r.order.status] ?? r.order.status}
                            </span>
                        ),
                    },
                    {
                        key: "stale",
                        label: "Stale for",
                        render: (r) => (
                            <span className="text-rw-text-2 whitespace-nowrap">
                                {r.daysStale} day{r.daysStale === 1 ? "" : "s"}
                            </span>
                        ),
                    },
                    {
                        key: "followups",
                        label: "Follow-ups",
                        render: (r) => {
                            const count = r.order.followUpCount;
                            const last = r.order.lastFollowUpAt;
                            if (count === 0)
                                return <span className="text-rw-muted">—</span>;
                            return (
                                <div className="flex flex-col">
                                    <span className="font-semibold text-rw-ink tabular-nums">
                                        {count}× sent
                                    </span>
                                    {last && (
                                        <span
                                            className={`text-[10px] ${
                                                sentToday(last)
                                                    ? "text-amber-600 font-semibold"
                                                    : "text-rw-muted"
                                            }`}
                                        >
                                            {sentToday(last)
                                                ? `sent ${timeAgo(last)}`
                                                : timeAgo(last)}
                                        </span>
                                    )}
                                </div>
                            );
                        },
                    },
                    {
                        key: "balance",
                        label: "Balance",
                        align: "right",
                        render: (r) => (
                            <span className="font-display font-black text-rw-ink tabular-nums whitespace-nowrap">
                                {naira(r.balance)}
                            </span>
                        ),
                    },
                    {
                        key: "action",
                        label: "",
                        align: "right",
                        render: (r) => (
                            <button
                                onClick={() => send([r.order.id], r.order.id)}
                                disabled={busy !== null}
                                className="text-xs font-semibold text-rw-crimson hover:underline disabled:opacity-50 whitespace-nowrap"
                                title={
                                    sentToday(r.order.lastFollowUpAt)
                                        ? "A follow-up already went out today"
                                        : undefined
                                }
                            >
                                {busy === r.order.id
                                    ? "Sending…"
                                    : r.order.followUpCount > 0
                                      ? "Send again"
                                      : "Send follow-up"}
                            </button>
                        ),
                    },
                ]}
            />
        </div>
    );
}
