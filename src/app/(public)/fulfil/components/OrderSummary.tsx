import { ph } from "@/lib/utils";
import type { Order } from "@/lib/data/types";

function ProgressBar({ paid, total }: { paid: number; total: number }) {
    const pct = total > 0 ? Math.min(100, Math.round((paid / total) * 100)) : 0;
    return (
        <div>
            <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-rw-ink">Payment Progress</span>
                <span className="font-bold text-rw-crimson">{pct}%</span>
            </div>
            <div className="progress-bar-track">
                <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
            </div>
            <div className="flex justify-between text-xs text-rw-muted mt-2">
                <span>₦{paid.toLocaleString()} paid</span>
                <span>₦{(total - paid).toLocaleString()} remaining</span>
            </div>
        </div>
    );
}

export function OrderSummary({ order }: { order: Order }) {
    return (
        <div className="rw-card overflow-hidden border-t-[3px] border-t-rw-crimson shadow-rw-shadow-md">
            <div className="bg-gradient-to-r from-rw-crimson/5 to-transparent px-6 py-5 border-b border-rw-crimson/10 flex items-center justify-between">
                <h2 className="font-display font-bold text-lg text-rw-ink">Order Summary</h2>
                <span
                    className={`badge-${order.status} inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide`}
                >
                    {order.status.replace("_", " ")}
                </span>
            </div>
            
            <div className="p-6">
                <div className="mb-6">
                    <p className="text-xs text-rw-muted font-medium uppercase tracking-wider mb-1">Customer</p>
                    <p className="font-semibold text-rw-ink text-lg">{order.customerName}</p>
                </div>

                {/* Item previews */}
                <div className="flex flex-col gap-3 mb-8">
                    <p className="text-xs text-rw-muted font-medium uppercase tracking-wider mb-1">Items ({order.items.length})</p>
                    {order.items.map((i) => (
                        <div
                            key={i.id}
                            className="flex items-center gap-4 p-3 rounded-2xl border border-[var(--rw-border)] hover:border-[var(--rw-border-mid)] transition-colors"
                        >
                            <img
                                src={ph(64, 64, i.productName.slice(0, 6))}
                                alt={i.productName}
                                className="h-16 w-16 rounded-xl object-cover shrink-0 bg-rw-bg-alt"
                            />
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm text-rw-ink truncate">
                                    {i.productName}
                                </p>
                                <p className="text-xs text-rw-text-2 mt-0.5">
                                    {i.variantLabel}
                                </p>
                            </div>
                            <div className="text-right shrink-0">
                                <p className="font-bold text-sm text-rw-ink">
                                    ₦{(i.unitPrice * i.quantity).toLocaleString()}
                                </p>
                                <p className="text-xs text-rw-muted mt-0.5">Qty: {i.quantity}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <ProgressBar
                    paid={order.amountPaid}
                    total={order.totalAmount}
                />
            </div>
        </div>
    );
}
