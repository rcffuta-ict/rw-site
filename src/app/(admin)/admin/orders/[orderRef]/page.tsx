import { notFound } from "next/navigation";
import Link from "next/link";
import { getDemoOrder } from "@/lib/data/orders";
import { ph } from "@/lib/utils/functions";
import { PaymentReviewCard } from "@/components/admin/PaymentReviewCard";
import { OrderStatusBadge } from "@/components/ui/Badge";

interface Props {
    params: Promise<{ orderRef: string }>;
}

function fmt(n: number) {
    return `₦${n.toLocaleString()}`;
}

export default async function AdminOrderDetailPage({ params }: Props) {
    const { orderRef } = await params;
    const order = getDemoOrder(orderRef);
    if (!order) notFound();

    const pct =
        order.totalAmount > 0
            ? Math.round((order.amountPaid / order.totalAmount) * 100)
            : 0;

    return (
        <div className="flex flex-col gap-8">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-rw-muted">
                <Link
                    href="/admin/orders"
                    className="hover:text-rw-crimson transition-colors"
                >
                    Orders
                </Link>
                <svg
                    className="h-3.5 w-3.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m8.25 4.5 7.5 7.5-7.5 7.5"
                    />
                </svg>
                <span className="font-mono font-bold text-rw-ink">{order.orderRef}</span>
            </nav>

            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <h1 className="font-mono font-bold text-3xl lg:text-4xl text-rw-ink">
                            {order.orderRef}
                        </h1>
                        <OrderStatusBadge status={order.status} />
                    </div>
                    <p className="text-sm text-rw-muted">
                        Created{" "}
                        {new Date(order.createdAt).toLocaleString("en-NG", {
                            dateStyle: "medium",
                            timeStyle: "short",
                        })}
                    </p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <button className="btn-secondary !h-10 !px-5 text-sm">
                        Confirm Order
                    </button>
                    <button className="rounded-xl border border-red-200 px-5 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors">
                        Cancel
                    </button>
                </div>
            </div>

            <div className="grid lg:grid-cols-[1fr_320px] gap-8 items-start">
                <div className="flex flex-col gap-6">
                    {/* Customer */}
                    <div className="rw-card p-6">
                        <p className="text-[10px] font-bold text-rw-muted uppercase tracking-[0.15em] mb-3">
                            Customer
                        </p>
                        <p className="font-semibold text-rw-ink text-lg">
                            {order.customerName}
                        </p>
                        <div className="flex flex-wrap gap-4 text-sm text-rw-text-2 mt-2">
                            <span className="flex items-center gap-2">
                                <svg
                                    className="h-4 w-4 text-rw-muted"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                                    />
                                </svg>
                                {order.customerEmail}
                            </span>
                            <span className="flex items-center gap-2">
                                <svg
                                    className="h-4 w-4 text-rw-muted"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
                                    />
                                </svg>
                                {order.customerPhone}
                            </span>
                        </div>
                        {order.customerNote && (
                            <p className="mt-4 text-sm italic text-rw-muted bg-rw-bg-alt rounded-xl p-3 border border-[var(--rw-border)]">
                                &ldquo;{order.customerNote}&rdquo;
                            </p>
                        )}
                    </div>

                    {/* Items */}
                    <div className="rw-card overflow-hidden">
                        <div className="px-6 py-4 border-b border-[var(--rw-border)]">
                            <p className="text-[10px] font-bold text-rw-muted uppercase tracking-[0.15em]">
                                Line Items
                            </p>
                        </div>
                        <div className="divide-y divide-[var(--rw-border)]">
                            {order.items.map((i) => (
                                <div
                                    key={i.id}
                                    className="flex items-center gap-4 px-6 py-4"
                                >
                                    <div className="h-14 w-14 rounded-xl bg-rw-bg-alt overflow-hidden shrink-0">
                                        <img
                                            src={ph(56, 56, i.productName.slice(0, 6))}
                                            alt={i.productName}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-rw-ink text-sm">
                                            {i.productName}
                                        </p>
                                        <p className="text-xs text-rw-muted">
                                            {i.variantLabel}
                                        </p>
                                    </div>
                                    <span className="text-sm text-rw-text-2 shrink-0">
                                        × {i.quantity}
                                    </span>
                                    <span className="font-semibold text-rw-ink text-sm shrink-0">
                                        {fmt(i.unitPrice * i.quantity)}
                                    </span>
                                </div>
                            ))}
                            <div className="flex justify-between px-6 py-4 bg-rw-bg-alt">
                                <span className="font-semibold text-rw-ink">Total</span>
                                <span className="font-bold text-rw-crimson text-lg">
                                    {fmt(order.totalAmount)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Payments */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <p className="font-display font-bold text-rw-ink">
                                Payment History{" "}
                                {order.payments.length > 0 &&
                                    `(${order.payments.length})`}
                            </p>
                        </div>
                        {order.payments.length === 0 ? (
                            <div className="rw-card p-10 text-center">
                                <p className="text-rw-muted">
                                    No payments submitted yet.
                                </p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-4">
                                {order.payments.map((p) => (
                                    <PaymentReviewCard
                                        key={p.id}
                                        payment={p}
                                        onApprove={() => console.log("Approve", p.id)}
                                        onFlag={(id, note) =>
                                            console.log("Flag", id, note)
                                        }
                                        onReject={(id, note) =>
                                            console.log("Reject", id, note)
                                        }
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="flex flex-col gap-6">
                    <div className="rw-card p-6 flex flex-col gap-5">
                        <p className="text-[10px] font-bold text-rw-muted uppercase tracking-[0.15em]">
                            Payment Summary
                        </p>
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-rw-text-2">Progress</span>
                                <span className="font-bold text-rw-crimson">{pct}%</span>
                            </div>
                            <div className="progress-bar-track">
                                <div
                                    className="progress-bar-fill"
                                    style={{ width: `${pct}%` }}
                                />
                            </div>
                        </div>
                        <dl className="flex flex-col gap-3 text-sm">
                            <div className="flex justify-between">
                                <dt className="text-rw-muted">Total</dt>
                                <dd className="font-semibold text-rw-ink">
                                    {fmt(order.totalAmount)}
                                </dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-rw-muted">Paid</dt>
                                <dd className="font-semibold text-green-700">
                                    {fmt(order.amountPaid)}
                                </dd>
                            </div>
                            <div className="flex justify-between border-t border-[var(--rw-border)] pt-3">
                                <dt className="text-rw-muted">Remaining</dt>
                                <dd className="font-bold text-rw-crimson">
                                    {fmt(order.totalAmount - order.amountPaid)}
                                </dd>
                            </div>
                        </dl>
                        <Link
                            href={`/fulfil?ref=${order.orderRef}`}
                            target="_blank"
                            className="text-xs text-center text-rw-crimson hover:underline font-medium"
                        >
                            Open payment page ↗
                        </Link>
                    </div>

                    {/* Quick info */}
                    <div className="rw-card p-6 flex flex-col gap-3">
                        <p className="text-[10px] font-bold text-rw-muted uppercase tracking-[0.15em]">
                            Timeline
                        </p>
                        <div className="text-sm text-rw-text-2 space-y-2">
                            <div className="flex items-center gap-3">
                                <span className="h-2 w-2 rounded-full bg-green-500 shrink-0" />
                                <span>
                                    Created{" "}
                                    {new Date(order.createdAt).toLocaleDateString(
                                        "en-NG",
                                        {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric",
                                        }
                                    )}
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="h-2 w-2 rounded-full bg-blue-500 shrink-0" />
                                <span>
                                    Updated{" "}
                                    {new Date(order.updatedAt).toLocaleDateString(
                                        "en-NG",
                                        {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric",
                                        }
                                    )}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
