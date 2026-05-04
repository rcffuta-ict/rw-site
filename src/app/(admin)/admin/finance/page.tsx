import { DEMO_ORDERS } from "@/lib/data/orders";
import { OrderStatusBadge } from "@/components/ui/Badge";
import type { Metadata } from "next";
import { ExportCsvButton } from "./component";

export const metadata: Metadata = { title: "Finance — RW'26 Admin" };

function fmt(n: number) {
    return `₦${n.toLocaleString()}`;
}

export default function FinancePage() {
    // Aggregate payment data from all demo orders
    const allPayments = DEMO_ORDERS.flatMap((o) =>
        o.payments.map((p) => ({ ...p, order: o }))
    );

    const collected = allPayments
        .filter((p) => p.status === "approved")
        .reduce((s, p) => s + p.amountClaimed, 0);

    const pending = allPayments
        .filter((p) => p.status === "pending")
        .reduce((s, p) => s + p.amountClaimed, 0);

    const flagged = allPayments
        .filter((p) => p.status === "flagged")
        .reduce((s, p) => s + p.amountClaimed, 0);

    const totalOrdered = DEMO_ORDERS.reduce((s, o) => s + o.totalAmount, 0);
    const outstanding = totalOrdered - collected;

    const summaryCards = [
        {
            label: "Collected",
            value: fmt(collected),
            sub: "Approved payments",
            color: "text-green-700",
            bg: "bg-green-50",
            border: "border-green-200",
        },
        {
            label: "Pending",
            value: fmt(pending),
            sub: "Awaiting review",
            color: "text-amber-700",
            bg: "bg-amber-50",
            border: "border-amber-200",
        },
        {
            label: "Flagged",
            value: fmt(flagged),
            sub: "Needs manual check",
            color: "text-rw-crimson",
            bg: "bg-rw-crimson/5",
            border: "border-rw-crimson/20",
        },
        {
            label: "Outstanding",
            value: fmt(outstanding),
            sub: "Remaining across all orders",
            color: "text-rw-text-2",
            bg: "bg-rw-bg-alt",
            border: "border-[var(--rw-border)]",
        },
    ];

    return (
        <div className="flex flex-col gap-8">
            <div className="flex items-end justify-between flex-wrap gap-4">
                <div>
                    <h1 className="section-heading text-2xl text-rw-ink">Finance</h1>
                    <p className="mt-1 text-sm text-rw-muted">
                        Payment overview — Redemption Week &apos;26
                    </p>
                </div>
                <ExportCsvButton />
            </div>

            {/* Summary cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {summaryCards.map((c) => (
                    <div
                        key={c.label}
                        className={`rounded-2xl border p-5 ${c.bg} ${c.border}`}
                    >
                        <p className="text-xs font-semibold uppercase tracking-wider text-rw-muted">
                            {c.label}
                        </p>
                        <p className={`mt-2 font-display font-bold text-2xl ${c.color}`}>
                            {c.value}
                        </p>
                        <p className="mt-0.5 text-xs text-rw-muted">{c.sub}</p>
                    </div>
                ))}
            </div>

            {/* All payments table */}
            <div>
                <h2 className="text-sm font-bold text-rw-ink uppercase tracking-wider mb-3">
                    All Payments
                </h2>
                <div className="rw-card overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-[var(--rw-border)] bg-rw-bg-alt text-rw-muted">
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                                    Order
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider hidden sm:table-cell">
                                    Customer
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider">
                                    Amount
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider hidden md:table-cell">
                                    Bank
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider hidden lg:table-cell">
                                    Date
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {allPayments.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="px-4 py-10 text-center text-rw-muted text-sm"
                                    >
                                        No payments yet
                                    </td>
                                </tr>
                            ) : (
                                allPayments.map((p) => (
                                    <tr
                                        key={p.id}
                                        className="border-b border-[var(--rw-border)] last:border-0 hover:bg-rw-bg-alt transition-colors"
                                    >
                                        <td className="px-4 py-3">
                                            <a
                                                href={`/admin/orders/${p.order.orderRef}`}
                                                className="font-mono font-bold text-rw-crimson hover:underline text-sm"
                                            >
                                                {p.order.orderRef}
                                            </a>
                                        </td>
                                        <td className="px-4 py-3 hidden sm:table-cell text-rw-ink">
                                            {p.order.customerName}
                                        </td>
                                        <td className="px-4 py-3 text-right font-semibold text-rw-ink">
                                            {fmt(p.amountClaimed)}
                                            <span className="block text-xs text-rw-muted font-normal">
                                                {p.percentOfTotal}% of total
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 hidden md:table-cell text-rw-text-2 text-sm">
                                            {p.extractedBank ?? "—"}
                                        </td>
                                        <td className="px-4 py-3">
                                            <PaymentStatusPill status={p.status} />
                                        </td>
                                        <td className="px-4 py-3 text-right text-xs text-rw-muted hidden lg:table-cell">
                                            {new Date(p.createdAt).toLocaleDateString(
                                                "en-NG",
                                                { day: "numeric", month: "short" }
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Order breakdown */}
            <div>
                <h2 className="text-sm font-bold text-rw-ink uppercase tracking-wider mb-3">
                    Order Breakdown
                </h2>
                <div className="rw-card overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-[var(--rw-border)] bg-rw-bg-alt text-rw-muted">
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                                    Ref
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider hidden sm:table-cell">
                                    Customer
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider">
                                    Order Total
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider">
                                    Paid
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider hidden md:table-cell">
                                    Balance
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {DEMO_ORDERS.map((o) => (
                                <tr
                                    key={o.id}
                                    className="border-b border-[var(--rw-border)] last:border-0 hover:bg-rw-bg-alt transition-colors"
                                >
                                    <td className="px-4 py-3">
                                        <a
                                            href={`/admin/orders/${o.orderRef}`}
                                            className="font-mono font-bold text-rw-crimson hover:underline"
                                        >
                                            {o.orderRef}
                                        </a>
                                    </td>
                                    <td className="px-4 py-3 hidden sm:table-cell text-rw-ink">
                                        {o.customerName}
                                    </td>
                                    <td className="px-4 py-3 text-right font-semibold text-rw-ink">
                                        {fmt(o.totalAmount)}
                                    </td>
                                    <td className="px-4 py-3 text-right text-green-700 font-semibold">
                                        {fmt(o.amountPaid)}
                                    </td>
                                    <td className="px-4 py-3 text-right text-rw-text-2 hidden md:table-cell">
                                        {fmt(o.totalAmount - o.amountPaid)}
                                    </td>
                                    <td className="px-4 py-3">
                                        <OrderStatusBadge status={o.status} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr className="bg-rw-bg-alt border-t border-[var(--rw-border-mid)]">
                                <td
                                    colSpan={2}
                                    className="px-4 py-3 font-bold text-rw-ink text-sm"
                                >
                                    Totals
                                </td>
                                <td className="px-4 py-3 text-right font-bold text-rw-ink">
                                    {fmt(totalOrdered)}
                                </td>
                                <td className="px-4 py-3 text-right font-bold text-green-700">
                                    {fmt(collected)}
                                </td>
                                <td className="px-4 py-3 text-right font-bold text-rw-text-2 hidden md:table-cell">
                                    {fmt(outstanding)}
                                </td>
                                <td className="px-4 py-3"></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    );
}

function PaymentStatusPill({ status }: { status: string }) {
    const map: Record<string, string> = {
        pending: "bg-amber-50 text-amber-700 border-amber-200",
        approved: "bg-green-50 text-green-700 border-green-200",
        flagged: "bg-rw-crimson/10 text-rw-crimson border-rw-crimson/25",
        rejected: "bg-red-50 text-red-600 border-red-200",
    };
    return (
        <span
            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${map[status] ?? "bg-gray-100 text-gray-600 border-gray-200"}`}
        >
            {status}
        </span>
    );
}
