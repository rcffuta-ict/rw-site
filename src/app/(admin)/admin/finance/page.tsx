import { DEMO_ORDERS } from "@/lib/data/orders";
import { OrderStatusBadge } from "@/components/ui/Badge";
import type { Metadata } from "next";
import { ExportCsvButton } from "./component";

export const metadata: Metadata = { title: "Finance — RW'26 Admin" };

function fmt(n: number) { return `₦${n.toLocaleString()}`; }

export default function FinancePage() {
    const allPayments = DEMO_ORDERS.flatMap((o) => o.payments.map((p) => ({ ...p, order: o })));
    const collected = allPayments.filter((p) => p.status === "approved").reduce((s, p) => s + p.amountClaimed, 0);
    const pending   = allPayments.filter((p) => p.status === "pending").reduce((s, p) => s + p.amountClaimed, 0);
    const flagged   = allPayments.filter((p) => p.status === "flagged").reduce((s, p) => s + p.amountClaimed, 0);
    const totalOrdered = DEMO_ORDERS.reduce((s, o) => s + o.totalAmount, 0);
    const outstanding = totalOrdered - collected;

    const summaryCards = [
        { label: "Collected", value: fmt(collected), sub: "Approved payments", color: "text-green-700", bg: "bg-green-50", border: "border-green-200", icon: "M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" },
        { label: "Pending",   value: fmt(pending),   sub: "Awaiting review",   color: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200", icon: "M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" },
        { label: "Flagged",   value: fmt(flagged),   sub: "Needs manual check", color: "text-rw-crimson", bg: "bg-rw-crimson/5", border: "border-rw-crimson/20", icon: "M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" },
        { label: "Outstanding", value: fmt(outstanding), sub: "Remaining balance", color: "text-rw-text-2", bg: "bg-rw-bg-alt", border: "border-[var(--rw-border)]", icon: "M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" },
    ];

    return (
        <div className="flex flex-col gap-8">
            <div className="flex items-end justify-between flex-wrap gap-4">
                <div>
                    <h1 className="section-heading text-2xl lg:text-3xl">Finance</h1>
                    <p className="mt-1 text-sm text-rw-muted">Payment overview — Redemption Week &apos;26</p>
                </div>
                <ExportCsvButton />
            </div>

            {/* Summary cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {summaryCards.map((c) => (
                    <div key={c.label} className={`rounded-2xl border p-6 ${c.bg} ${c.border} relative overflow-hidden`}>
                        <svg className="absolute top-4 right-4 h-8 w-8 opacity-10" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d={c.icon} /></svg>
                        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-rw-muted">{c.label}</p>
                        <p className={`mt-2 font-display font-bold text-3xl ${c.color}`}>{c.value}</p>
                        <p className="mt-1 text-xs text-rw-muted">{c.sub}</p>
                    </div>
                ))}
            </div>

            {/* Revenue chart placeholder */}
            <div className="rw-card p-6">
                <div className="flex items-center justify-between mb-5">
                    <p className="font-display font-bold text-rw-ink">Collection Progress</p>
                    <span className="text-sm text-rw-muted">{Math.round(collected/totalOrdered*100)}% collected</span>
                </div>
                <div className="progress-bar-track !h-4">
                    <div className="progress-bar-fill !h-4" style={{ width: `${Math.round(collected/totalOrdered*100)}%` }} />
                </div>
                <div className="flex justify-between text-xs text-rw-muted mt-3">
                    <span>{fmt(collected)} collected</span>
                    <span>{fmt(totalOrdered)} total</span>
                </div>
            </div>

            {/* All payments table */}
            <div>
                <h2 className="font-display font-bold text-rw-ink mb-4">All Payments</h2>
                <div className="rw-card overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-[var(--rw-border)] bg-rw-bg-alt text-rw-muted">
                                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider">Order</th>
                                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider hidden sm:table-cell">Customer</th>
                                <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wider">Amount</th>
                                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider hidden md:table-cell">Bank</th>
                                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider">Status</th>
                                <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wider hidden lg:table-cell">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allPayments.length === 0 ? (
                                <tr><td colSpan={6} className="px-5 py-16 text-center text-rw-muted">No payments yet</td></tr>
                            ) : (
                                allPayments.map((p) => (
                                    <tr key={p.id} className="border-b border-[var(--rw-border)] last:border-0 hover:bg-rw-bg-alt/50 transition-colors">
                                        <td className="px-5 py-4">
                                            <a href={`/admin/orders/${p.order.orderRef}`} className="font-mono font-bold text-rw-crimson hover:underline">{p.order.orderRef}</a>
                                        </td>
                                        <td className="px-5 py-4 hidden sm:table-cell text-rw-ink">{p.order.customerName}</td>
                                        <td className="px-5 py-4 text-right">
                                            <span className="font-semibold text-rw-ink">{fmt(p.amountClaimed)}</span>
                                            <span className="block text-xs text-rw-muted">{p.percentOfTotal}% of total</span>
                                        </td>
                                        <td className="px-5 py-4 hidden md:table-cell text-rw-text-2">{p.extractedBank ?? "—"}</td>
                                        <td className="px-5 py-4"><PaymentStatusPill status={p.status} /></td>
                                        <td className="px-5 py-4 text-right text-xs text-rw-muted hidden lg:table-cell">
                                            {new Date(p.createdAt).toLocaleDateString("en-NG", { day: "numeric", month: "short" })}
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
                <h2 className="font-display font-bold text-rw-ink mb-4">Order Breakdown</h2>
                <div className="rw-card overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-[var(--rw-border)] bg-rw-bg-alt text-rw-muted">
                                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider">Ref</th>
                                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider hidden sm:table-cell">Customer</th>
                                <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wider">Total</th>
                                <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wider">Paid</th>
                                <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wider hidden md:table-cell">Balance</th>
                                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {DEMO_ORDERS.map((o) => (
                                <tr key={o.id} className="border-b border-[var(--rw-border)] last:border-0 hover:bg-rw-bg-alt/50 transition-colors">
                                    <td className="px-5 py-4"><a href={`/admin/orders/${o.orderRef}`} className="font-mono font-bold text-rw-crimson hover:underline">{o.orderRef}</a></td>
                                    <td className="px-5 py-4 hidden sm:table-cell text-rw-ink">{o.customerName}</td>
                                    <td className="px-5 py-4 text-right font-semibold text-rw-ink">{fmt(o.totalAmount)}</td>
                                    <td className="px-5 py-4 text-right text-green-700 font-semibold">{fmt(o.amountPaid)}</td>
                                    <td className="px-5 py-4 text-right text-rw-text-2 hidden md:table-cell">{fmt(o.totalAmount - o.amountPaid)}</td>
                                    <td className="px-5 py-4"><OrderStatusBadge status={o.status} /></td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr className="bg-rw-bg-alt border-t border-[var(--rw-border-mid)]">
                                <td colSpan={2} className="px-5 py-4 font-bold text-rw-ink">Totals</td>
                                <td className="px-5 py-4 text-right font-bold text-rw-ink">{fmt(totalOrdered)}</td>
                                <td className="px-5 py-4 text-right font-bold text-green-700">{fmt(collected)}</td>
                                <td className="px-5 py-4 text-right font-bold text-rw-text-2 hidden md:table-cell">{fmt(outstanding)}</td>
                                <td className="px-5 py-4" />
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
        pending:  "bg-amber-50 text-amber-700 border-amber-200",
        approved: "bg-green-50 text-green-700 border-green-200",
        flagged:  "bg-rw-crimson/10 text-rw-crimson border-rw-crimson/25",
        rejected: "bg-red-50 text-red-600 border-red-200",
    };
    return (
        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${map[status] ?? "bg-gray-100 text-gray-600 border-gray-200"}`}>
            {status}
        </span>
    );
}
