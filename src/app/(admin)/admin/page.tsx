import Link from "next/link";
import { DEMO_ORDERS, getDemoStats } from "@/lib/data/orders";
import { OrderStatusBadge } from "@/components/ui/Badge";

import { StatsCard } from "@/components/admin/StatsCard";

export const metadata = { title: "Admin Dashboard — RW'26" };

export default function AdminDashboard() {
    const stats = getDemoStats();

    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="section-heading text-2xl text-rw-ink">Dashboard</h1>
                <p className="mt-1 text-sm text-rw-muted">Redemption Week &apos;26 — RCF FUTA</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatsCard 
                    label="Total Orders"      
                    value={stats.total} 
                    icon={<svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>}
                />
                <StatsCard 
                    label="Revenue Collected" 
                    value={`₦${stats.revenue.toLocaleString()}`} 
                    icon={<svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                />
                <StatsCard 
                    label="Pending Review"    
                    value={stats.pending} 
                    sub="Payments awaiting approval" 
                    icon={<svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
                />
                <StatsCard 
                    label="Flagged Orders"    
                    value={stats.flagged} 
                    sub="Require attention" 
                    icon={<svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>}
                />
            </div>

            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="font-display font-bold text-rw-ink">Recent Orders</h2>
                    <Link href="/admin/orders" className="text-sm text-rw-crimson hover:text-rw-crimson-dk font-medium transition-colors">View all →</Link>
                </div>

                <div className="rw-card overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-[var(--rw-border)] text-rw-muted">
                                <th className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wider">Ref</th>
                                <th className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wider">Customer</th>
                                <th className="px-4 py-3 text-right font-semibold text-xs uppercase tracking-wider">Total</th>
                                <th className="px-4 py-3 text-right font-semibold text-xs uppercase tracking-wider">Paid</th>
                                <th className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {DEMO_ORDERS.slice(0, 6).map(o => (
                                <tr key={o.id} className="border-b border-[var(--rw-border)] last:border-0 hover:bg-rw-bg-alt transition-colors">
                                    <td className="px-4 py-3">
                                        <Link href={`/admin/orders/${o.orderRef}`} className="font-mono font-bold text-rw-crimson hover:underline">{o.orderRef}</Link>
                                    </td>
                                    <td className="px-4 py-3">
                                        <p className="font-medium text-rw-ink">{o.customerName}</p>
                                        <p className="text-xs text-rw-muted">{o.customerEmail}</p>
                                    </td>
                                    <td className="px-4 py-3 text-right font-semibold text-rw-ink">₦{o.totalAmount.toLocaleString()}</td>
                                    <td className="px-4 py-3 text-right text-rw-text-2">₦{o.amountPaid.toLocaleString()}</td>
                                    <td className="px-4 py-3"><OrderStatusBadge status={o.status} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
                <Link href="/admin/orders" className="rw-card p-5 hover:border-rw-crimson/30 hover:-translate-y-0.5 transition-all flex flex-col gap-1">
                    <p className="font-semibold text-rw-ink">All Orders</p>
                    <p className="text-sm text-rw-muted">View, search, and manage orders</p>
                </Link>
                <Link href="/admin/settings" className="rw-card p-5 hover:border-rw-crimson/30 hover:-translate-y-0.5 transition-all flex flex-col gap-1">
                    <p className="font-semibold text-rw-ink">Payment Settings</p>
                    <p className="text-sm text-rw-muted">Bank details and minimum % config</p>
                </Link>
            </div>
        </div>
    );
}
