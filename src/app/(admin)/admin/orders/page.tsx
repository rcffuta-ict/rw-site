import Link from "next/link";
import { DEMO_ORDERS } from "@/lib/data/orders";
import { OrderStatusBadge } from "@/components/ui/Badge";
import type { OrderStatus } from "@/lib/data/types";

export const metadata = { title: "Orders — RW'26 Admin" };

function fmt(n: number) { return `₦${n.toLocaleString()}`; }

const STATUS_TABS: { key: OrderStatus | "all"; label: string }[] = [
    { key: "all",            label: "All" },
    { key: "pending",        label: "Pending" },
    { key: "partially_paid", label: "Partial" },
    { key: "paid",           label: "Paid" },
    { key: "confirmed",      label: "Confirmed" },
    { key: "flagged",        label: "Flagged" },
];

export default function AdminOrdersPage() {
    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <h1 className="section-heading text-2xl lg:text-3xl">Orders</h1>
                    <p className="mt-1 text-sm text-rw-muted">{DEMO_ORDERS.length} total orders across all statuses</p>
                </div>
                <button className="btn-secondary !h-10 !px-5 text-sm">Export All</button>
            </div>

            {/* Status tabs + search */}
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="flex flex-wrap gap-1.5 p-1 rounded-2xl bg-rw-bg-alt border border-[var(--rw-border)]">
                    {STATUS_TABS.map(t => (
                        <button
                            key={t.key}
                            className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                                t.key === "all"
                                    ? "bg-rw-crimson text-white shadow-sm"
                                    : "text-rw-muted hover:text-rw-ink hover:bg-white"
                            }`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>
                <div className="w-full md:w-64">
                    <input
                        placeholder="Search ref or name…"
                        className="rw-input !h-10 !rounded-xl text-sm"
                    />
                </div>
            </div>

            {/* Orders table */}
            <div className="rw-card overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-[var(--rw-border)] bg-rw-bg-alt text-rw-muted">
                            <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider">Ref</th>
                            <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider">Customer</th>
                            <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wider hidden sm:table-cell">Items</th>
                            <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wider">Total</th>
                            <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wider hidden md:table-cell">Paid</th>
                            <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider">Status</th>
                            <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wider hidden lg:table-cell">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {DEMO_ORDERS.map(o => (
                            <tr key={o.id} className="border-b border-[var(--rw-border)] last:border-0 hover:bg-rw-bg-alt/50 transition-colors group">
                                <td className="px-5 py-4">
                                    <Link href={`/admin/orders/${o.orderRef}`} className="font-mono font-bold text-rw-crimson hover:underline">{o.orderRef}</Link>
                                </td>
                                <td className="px-5 py-4">
                                    <p className="font-medium text-rw-ink">{o.customerName}</p>
                                    <p className="text-xs text-rw-muted">{o.customerEmail}</p>
                                </td>
                                <td className="px-5 py-4 text-right text-rw-text-2 hidden sm:table-cell">{o.items.length}</td>
                                <td className="px-5 py-4 text-right font-semibold text-rw-ink">{fmt(o.totalAmount)}</td>
                                <td className="px-5 py-4 text-right text-rw-text-2 hidden md:table-cell">{fmt(o.amountPaid)}</td>
                                <td className="px-5 py-4"><OrderStatusBadge status={o.status} /></td>
                                <td className="px-5 py-4 text-right text-xs text-rw-muted hidden lg:table-cell">
                                    {new Date(o.createdAt).toLocaleDateString("en-NG", { day: "numeric", month: "short" })}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
