import Link from "next/link";
import { headers } from "next/headers";
import { RefreshButton } from "@/components/admin/RefreshButton";
import { OrderStatusBadge } from "@/components/ui/Badge";
import { listOrders } from "@/lib/services/orders.service";
import { formatNaira } from "@/lib/utils/functions";
import type { AdminRole } from "@/lib/auth/roles";

export const metadata = { title: "Admin Dashboard — RW'26" };

function fmt(n: number) { return formatNaira(n); }

export default async function AdminDashboard() {
    const [orders, hdrs] = await Promise.all([listOrders(), headers()]);
    const role = (hdrs.get("x-admin-role") ?? "MODERATOR") as AdminRole;

    const totalRevenue = orders.reduce((s, o) => s + o.totalAmount, 0);
    const collected    = orders.reduce((s, o) => s + o.amountPaid, 0);
    const outstanding  = totalRevenue - collected;
    const rate         = totalRevenue > 0 ? Math.round((collected / totalRevenue) * 100) : 0;

    let pendingPayments = 0;
    let flaggedPayments = 0;
    orders.forEach((o) => {
        o.payments.forEach((p) => {
            if (p.status === "pending") pendingPayments++;
            if (p.status === "flagged") flaggedPayments++;
        });
    });

    const ordersByStatus = {
        pending:        orders.filter(o => o.status === "pending").length,
        partially_paid: orders.filter(o => o.status === "partially_paid").length,
        paid:           orders.filter(o => ["paid", "confirmed"].includes(o.status)).length,
        flagged:        orders.filter(o => o.status === "flagged").length,
    };

    const recentOrders = [...orders]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);

    return (
        <div className="flex flex-col gap-8 animate-fade-in-up">

            {/* ── Header ── */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-[var(--rw-border)]">
                <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-rw-muted mb-1">
                        {role === "ADMIN" ? "Administrator" : "Moderator"}
                    </p>
                    <h1 className="font-display font-extrabold text-2xl lg:text-3xl text-rw-ink tracking-tight">
                        Dashboard
                    </h1>
                    <p className="mt-1 text-sm text-rw-muted">
                        Redemption Week &apos;26 — RCF FUTA
                    </p>
                </div>
                <div className="flex gap-3">
                    <RefreshButton />
                    <Link href="/admin/orders" className="btn-secondary !h-10 !px-5 text-sm">
                        All Orders
                    </Link>
                    <Link href="/admin/finance" className="btn-primary !h-10 !px-5 text-sm">
                        Finance →
                    </Link>
                </div>
            </div>

            {/* ── Revenue Overview — hero card ── */}
            <div className="relative overflow-hidden rounded-3xl bg-[#1C0003] p-8 lg:p-10">
                <div className="absolute inset-0 bg-gradient-to-br from-[#FF0015]/10 via-transparent to-[#FF6A00]/8 pointer-events-none" />
                <div className="relative z-10 grid sm:grid-cols-3 gap-8">
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-2">Total Revenue Goal</p>
                        <p className="font-display font-black text-white text-3xl lg:text-4xl">{fmt(totalRevenue)}</p>
                        <p className="text-xs text-white/40 mt-1">{orders.length} orders total</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-2">Collected</p>
                        <p className="font-display font-black text-3xl lg:text-4xl" style={{ color: "#4ade80" }}>{fmt(collected)}</p>
                        <div className="mt-3 h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full rounded-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all" style={{ width: `${rate}%` }} />
                        </div>
                        <p className="text-xs text-white/40 mt-1.5">{rate}% collection rate</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-2">Outstanding</p>
                        <p className="font-display font-black text-[#FF6A00] text-3xl lg:text-4xl">{fmt(outstanding)}</p>
                        <p className="text-xs text-white/40 mt-1">Pending collection</p>
                    </div>
                </div>
            </div>

            {/* ── Stat cards row ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    {
                        label: "Pending Orders",
                        value: ordersByStatus.pending,
                        sub: "Awaiting first payment",
                        color: "#f59e0b",
                        bg: "#fef3c7",
                        icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />,
                    },
                    {
                        label: "Paid / Queued",
                        value: ordersByStatus.paid,
                        sub: "Ready for production",
                        color: "#10b981",
                        bg: "#d1fae5",
                        icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />,
                    },
                    {
                        label: "Pending Payments",
                        value: pendingPayments,
                        sub: "Need payment review",
                        color: "#6366f1",
                        bg: "#ede9fe",
                        icon: <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />,
                    },
                    {
                        label: "Flagged",
                        value: flaggedPayments + ordersByStatus.flagged,
                        sub: "Require attention",
                        color: "#ef4444",
                        bg: "#fee2e2",
                        icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />,
                    },
                ].map((s) => (
                    <div key={s.label} className="rw-card p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
                        <div
                            className="h-10 w-10 rounded-xl flex items-center justify-center"
                            style={{ background: s.bg }}
                        >
                            <svg className="h-5 w-5" fill="none" stroke={s.color} strokeWidth={2} viewBox="0 0 24 24">
                                {s.icon}
                            </svg>
                        </div>
                        <div>
                            <p className="font-display font-black text-2xl text-rw-ink">{s.value}</p>
                            <p className="text-[10px] font-bold text-rw-muted uppercase tracking-wider mt-0.5">{s.label}</p>
                            {s.sub && <p className="text-[10px] text-rw-muted/70 mt-0.5">{s.sub}</p>}
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Recent Orders ── */}
            <div className="rw-card overflow-hidden">
                <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--rw-border)]">
                    <div>
                        <p className="font-display font-bold text-rw-ink text-base">Recent Orders</p>
                        <p className="text-xs text-rw-muted mt-0.5">Latest {recentOrders.length} placements</p>
                    </div>
                    <Link
                        href="/admin/orders"
                        className="text-xs font-bold text-rw-crimson hover:text-rw-crimson-dk transition-colors"
                    >
                        View all →
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-rw-bg-alt text-rw-muted">
                                <th className="px-6 py-3 text-left font-semibold text-[10px] uppercase tracking-wider">Ref</th>
                                <th className="px-6 py-3 text-left font-semibold text-[10px] uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-3 text-right font-semibold text-[10px] uppercase tracking-wider hidden sm:table-cell">Total</th>
                                <th className="px-6 py-3 text-right font-semibold text-[10px] uppercase tracking-wider hidden md:table-cell">Paid</th>
                                <th className="px-6 py-3 text-left font-semibold text-[10px] uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-right font-semibold text-[10px] uppercase tracking-wider hidden lg:table-cell">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--rw-border)]">
                            {recentOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-rw-muted text-sm">
                                        No orders yet
                                    </td>
                                </tr>
                            ) : (
                                recentOrders.map((o) => (
                                    <tr key={o.id} className="hover:bg-rw-bg-alt/40 transition-colors group">
                                        <td className="px-6 py-4">
                                            <Link
                                                href={`/admin/orders/${o.orderRef}`}
                                                className="font-mono font-bold text-rw-crimson hover:underline text-xs"
                                            >
                                                {o.orderRef}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-semibold text-rw-ink text-xs">{o.customerName}</p>
                                            <p className="text-[10px] text-rw-muted truncate max-w-[160px]">{o.customerEmail}</p>
                                        </td>
                                        <td className="px-6 py-4 text-right font-semibold text-rw-ink text-xs hidden sm:table-cell">
                                            {fmt(o.totalAmount)}
                                        </td>
                                        <td className="px-6 py-4 text-right text-xs hidden md:table-cell">
                                            <span className={o.amountPaid >= o.totalAmount ? "text-green-600 font-semibold" : "text-rw-muted"}>
                                                {fmt(o.amountPaid)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <OrderStatusBadge status={o.status} />
                                        </td>
                                        <td className="px-6 py-4 text-right text-[10px] text-rw-muted hidden lg:table-cell">
                                            {new Date(o.createdAt).toLocaleDateString("en-NG", { day: "numeric", month: "short" })}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ── Quick Actions ── */}
            <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-rw-muted mb-4">Quick Actions</p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { href: "/admin/orders", label: "All Orders", desc: "View and manage order list", emoji: "📋" },
                        { href: "/admin/finance", label: "Finance", desc: "Revenue and payment reports", emoji: "💰" },
                        { href: "/admin/products", label: "Products", desc: "Manage merch catalog", emoji: "🛍️" },
                        ...(role === "ADMIN"
                            ? [{ href: "/admin/verdicts", label: "Verdicts", desc: "Issue production manifests", emoji: "📄" }]
                            : [{ href: "/admin/settings", label: "Settings", desc: "Account and configuration", emoji: "⚙️" }]
                        ),
                    ].map((a) => (
                        <Link
                            key={a.href}
                            href={a.href}
                            className="rw-card p-5 hover:border-rw-crimson/30 hover:-translate-y-0.5 transition-all flex items-center gap-4 group"
                        >
                            <span className="text-2xl shrink-0">{a.emoji}</span>
                            <div>
                                <p className="font-semibold text-rw-ink text-sm group-hover:text-rw-crimson transition-colors">{a.label}</p>
                                <p className="text-[10px] text-rw-muted mt-0.5">{a.desc}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

        </div>
    );
}
