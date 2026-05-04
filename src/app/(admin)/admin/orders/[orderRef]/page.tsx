import { notFound } from "next/navigation";
import Link from "next/link";
import { getDemoOrder } from "@/lib/data/orders";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { PaymentReviewCard } from "@/components/admin/PaymentReviewCard";
import { OrderStatusBadge } from "@/components/ui/Badge";

interface Props {
    params: Promise<{ orderRef: string }>;
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
        <div className="flex flex-col gap-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-rw-muted">
                <Link
                    href="/admin/orders"
                    className="hover:text-rw-crimson transition-colors"
                >
                    Orders
                </Link>
                <span>/</span>
                <span className="font-mono font-bold text-rw-ink">{order.orderRef}</span>
            </div>

            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <h1 className="font-mono font-bold text-3xl text-rw-ink">
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
                {/* Status actions (stub) */}
                <div className="flex flex-wrap gap-2">
                    <button className="rounded-xl border border-[var(--rw-border-mid)] px-4 py-2 text-sm font-semibold text-rw-ink hover:bg-rw-bg-alt transition-colors">
                        Confirm Order
                    </button>
                    <button className="rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors">
                        Cancel
                    </button>
                </div>
            </div>

            <div className="grid lg:grid-cols-[1fr_300px] gap-6 items-start">
                <div className="flex flex-col gap-5">
                    {/* Customer */}
                    <Card>
                        <CardContent>
                            <h2 className="text-xs font-semibold text-rw-muted uppercase tracking-wider mb-3">
                                Customer
                            </h2>
                            <p className="font-semibold text-rw-ink">
                                {order.customerName}
                            </p>
                            <p className="text-sm text-rw-text-2">
                                {order.customerEmail} · {order.customerPhone}
                            </p>
                            {order.customerNote && (
                                <p className="mt-2 text-sm italic text-rw-muted">
                                    &ldquo;{order.customerNote}&rdquo;
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Items */}
                    <Card className="overflow-hidden">
                        <CardHeader>
                            <h2 className="text-xs font-semibold text-rw-muted uppercase tracking-wider">
                                Line Items
                            </h2>
                        </CardHeader>
                        <table className="w-full text-sm">
                            <tbody>
                                {order.items.map((i) => (
                                    <tr
                                        key={i.id}
                                        className="border-b border-[var(--rw-border)] last:border-0"
                                    >
                                        <td className="px-5 py-3">
                                            <p className="font-medium text-rw-ink">
                                                {i.productName}
                                            </p>
                                            <p className="text-xs text-rw-muted">
                                                {i.variantLabel}
                                            </p>
                                        </td>
                                        <td className="px-5 py-3 text-center text-rw-text-2">
                                            × {i.quantity}
                                        </td>
                                        <td className="px-5 py-3 text-right font-semibold text-rw-ink">
                                            ₦{(i.unitPrice * i.quantity).toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                                <tr className="bg-rw-bg-alt">
                                    <td
                                        colSpan={2}
                                        className="px-5 py-3 font-semibold text-rw-ink"
                                    >
                                        Total
                                    </td>
                                    <td className="px-5 py-3 text-right font-bold text-rw-crimson">
                                        ₦{order.totalAmount.toLocaleString()}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </Card>

                    {/* Payments */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between px-1">
                            <h2 className="text-xs font-bold text-rw-muted uppercase tracking-widest">
                                Payment History{" "}
                                {order.payments.length > 0 &&
                                    `(${order.payments.length})`}
                            </h2>
                        </div>

                        {order.payments.length === 0 ? (
                            <Card className="p-8 text-center">
                                <p className="text-sm text-rw-muted">
                                    No payments submitted yet.
                                </p>
                            </Card>
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

                {/* Sidebar: payment summary */}
                <div className="rw-card p-5 flex flex-col gap-4">
                    <h2 className="text-xs font-semibold text-rw-muted uppercase tracking-wider">
                        Payment Summary
                    </h2>
                    <div>
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-rw-text-2">Progress</span>
                            <span className="font-bold text-rw-crimson">{pct}%</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-gray-100">
                            <div
                                className="h-full rounded-full bg-rw-crimson transition-all"
                                style={{ width: `${pct}%` }}
                            />
                        </div>
                    </div>
                    <dl className="flex flex-col gap-2 text-sm">
                        <div className="flex justify-between">
                            <dt className="text-rw-muted">Total</dt>
                            <dd className="font-semibold text-rw-ink">
                                ₦{order.totalAmount.toLocaleString()}
                            </dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-rw-muted">Paid</dt>
                            <dd className="font-semibold text-green-700">
                                ₦{order.amountPaid.toLocaleString()}
                            </dd>
                        </div>
                        <div className="flex justify-between border-t border-[var(--rw-border)] pt-2">
                            <dt className="text-rw-muted">Remaining</dt>
                            <dd className="font-bold text-rw-crimson">
                                ₦{(order.totalAmount - order.amountPaid).toLocaleString()}
                            </dd>
                        </div>
                    </dl>
                    <Link
                        href={`/fulfil?ref=${order.orderRef}`}
                        target="_blank"
                        className="text-xs text-center text-rw-crimson hover:underline"
                    >
                        Open payment page ↗
                    </Link>
                </div>
            </div>
        </div>
    );
}
