import Link from "next/link";
import { DEMO_ORDERS, getDemoStats } from "@/lib/data/orders";
import { OrderStatusBadge } from "@/components/ui/Badge";
import { StatsCard } from "@/components/ui/cards/StatsCard";
import { AdminStats } from "@/components/admin/AdminStats";

import { RevenueBreakdown } from "@/components/admin/finance/RevenueBreakdown";

export const metadata = { title: "Admin Dashboard — RW'26" };

function fmt(n: number) { return `₦${n.toLocaleString()}`; }

export default function AdminDashboard() {
    const stats = getDemoStats();
    const totalPossibleRevenue = DEMO_ORDERS.reduce((s, o) => s + o.totalAmount, 0);
    const actualCollected = DEMO_ORDERS.reduce((s, o) => s + o.amountPaid, 0);
    const collectionRate = totalPossibleRevenue > 0 ? Math.round((actualCollected / totalPossibleRevenue) * 100) : 0;
    const outstandingBalance = totalPossibleRevenue - actualCollected;

    // Status distribution for chart
    const statusCounts: Record<string, number> = {};
    DEMO_ORDERS.forEach(o => { statusCounts[o.status] = (statusCounts[o.status] || 0) + 1; });

    return (
        <div className="flex flex-col gap-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div>
                    <h1 className="section-heading text-2xl lg:text-3xl">Dashboard</h1>
                    <p className="mt-1 text-sm text-rw-muted">Redemption Week &apos;26 — RCF FUTA Admin</p>
                </div>
                <div className="flex gap-3">
                    <Link href="/admin/orders" className="btn-secondary !h-10 !px-5 text-sm">View Orders</Link>
                    <Link href="/admin/finance" className="btn-primary !h-10 !px-5 text-sm">Finance →</Link>
                </div>
            </div>

            <AdminStats 
                stats={[
                    {
                        label: "Total Orders",
                        value: stats.total,
                        trend: { value: 12, isUp: true },
                        icon: <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007Z" /></svg>
                    },
                    {
                        label: "Collection Rate",
                        value: `${collectionRate}%`,
                        sub: `${fmt(actualCollected)} of ${fmt(totalPossibleRevenue)}`,
                        trend: { value: 5, isUp: true },
                        icon: <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" /></svg>
                    },
                    {
                        label: "Outstanding",
                        value: fmt(outstandingBalance),
                        sub: "Remaining to be collected",
                        icon: <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                    },
                    {
                        label: "Pending Review",
                        value: stats.pending,
                        sub: "Payments awaiting approval",
                        icon: <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                    },
                    {
                        label: "Flagged Orders",
                        value: stats.flagged,
                        sub: "Require attention",
                        icon: <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" /></svg>
                    }
                ]} 
            />

            {/* Financial Analysis row */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Revenue trend */}
                <div className="rw-card p-6 lg:col-span-2">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <p className="text-xs font-bold text-rw-muted uppercase tracking-wider">Revenue Trend (Weekly)</p>
                            <p className="font-display font-bold text-2xl text-rw-ink mt-1">{fmt(actualCollected)}</p>
                        </div>
                        <span className="text-xs font-bold px-2 py-1 rounded-lg bg-green-50 text-green-600">+{collectionRate}%</span>
                    </div>
                    <div className="chart-placeholder h-48 flex items-end justify-around px-4 pb-4 gap-2">
                        {[35, 55, 45, 70, 60, 85, 75].map((h, i) => (
                            <div key={i} className="flex-1 rounded-t-lg relative z-10 transition-all hover:opacity-80" style={{ height: `${h}%`, background: i === 6 ? '#c41230' : '#e5e7eb' }} />
                        ))}
                    </div>
                    <div className="flex justify-between text-[10px] text-rw-muted mt-2 px-4 font-bold uppercase tracking-widest">
                        {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d => <span key={d}>{d}</span>)}
                    </div>
                </div>

                {/* Revenue Breakdown */}
                <RevenueBreakdown />
            </div>

            {/* Recent orders */}
            <div>
                <div className="flex items-center justify-between mb-5">
                    <h2 className="font-display font-bold text-lg text-rw-ink">Recent Orders</h2>
                    <Link href="/admin/orders" className="text-sm text-rw-crimson hover:text-rw-crimson-dk font-medium transition-colors">View all →</Link>
                </div>

                <div className="rw-card overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-[var(--rw-border)] bg-rw-bg-alt text-rw-muted">
                                <th className="px-5 py-3.5 text-left font-semibold text-xs uppercase tracking-wider">Ref</th>
                                <th className="px-5 py-3.5 text-left font-semibold text-xs uppercase tracking-wider">Customer</th>
                                <th className="px-5 py-3.5 text-right font-semibold text-xs uppercase tracking-wider">Total</th>
                                <th className="px-5 py-3.5 text-right font-semibold text-xs uppercase tracking-wider">Paid</th>
                                <th className="px-5 py-3.5 text-left font-semibold text-xs uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {DEMO_ORDERS.slice(0, 6).map(o => (
                                <tr key={o.id} className="border-b border-[var(--rw-border)] last:border-0 hover:bg-rw-bg-alt/50 transition-colors">
                                    <td className="px-5 py-4">
                                        <Link href={`/admin/orders/${o.orderRef}`} className="font-mono font-bold text-rw-crimson hover:underline">{o.orderRef}</Link>
                                    </td>
                                    <td className="px-5 py-4">
                                        <p className="font-medium text-rw-ink">{o.customerName}</p>
                                        <p className="text-xs text-rw-muted">{o.customerEmail}</p>
                                    </td>
                                    <td className="px-5 py-4 text-right font-semibold text-rw-ink">{fmt(o.totalAmount)}</td>
                                    <td className="px-5 py-4 text-right text-rw-text-2">{fmt(o.amountPaid)}</td>
                                    <td className="px-5 py-4"><OrderStatusBadge status={o.status} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Quick actions */}
            <div className="grid sm:grid-cols-3 gap-4">
                <Link href="/admin/orders" className="rw-card p-6 hover:border-rw-crimson/30 hover:-translate-y-0.5 transition-all flex flex-col gap-2">
                    <svg className="h-6 w-6 text-rw-crimson" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" /></svg>
                    <p className="font-semibold text-rw-ink">All Orders</p>
                    <p className="text-sm text-rw-muted">View, search, and manage orders</p>
                </Link>
                <Link href="/admin/finance" className="rw-card p-6 hover:border-rw-crimson/30 hover:-translate-y-0.5 transition-all flex flex-col gap-2">
                    <svg className="h-6 w-6 text-rw-crimson" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" /></svg>
                    <p className="font-semibold text-rw-ink">Finance</p>
                    <p className="text-sm text-rw-muted">Revenue, payments, and reports</p>
                </Link>
                <Link href="/admin/settings" className="rw-card p-6 hover:border-rw-crimson/30 hover:-translate-y-0.5 transition-all flex flex-col gap-2">
                    <svg className="h-6 w-6 text-rw-crimson" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
                    <p className="font-semibold text-rw-ink">Settings</p>
                    <p className="text-sm text-rw-muted">Bank details and payment config</p>
                </Link>
            </div>
        </div>
    );
}
