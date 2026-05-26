import { ph } from "@/lib/utils/functions";
import type { Order } from "@/lib/data/types";
import { ProductImage } from "@/components/common/ProductImage";

function ProgressBar({
    approved,
    pending,
    total,
}: {
    approved: number;
    pending: number;
    total: number;
}) {
    const approvedPct =
        total > 0 ? Math.min(100, Math.round((approved / total) * 100)) : 0;
    const pendingPct =
        total > 0 ? Math.min(100 - approvedPct, Math.round((pending / total) * 100)) : 0;

    return (
        <div className="flex flex-col gap-3">
            <div className="flex justify-between items-end">
                <div>
                    <span className="font-display font-black text-sm text-rw-ink uppercase tracking-wider block">
                        Payment Progress
                    </span>
                    <span className="text-[10px] text-rw-muted font-bold uppercase tracking-wider block mt-0.5">
                        ₦{approved.toLocaleString()} approved{" "}
                        {pending > 0 && `· ₦${pending.toLocaleString()} pending`}
                    </span>
                </div>
                <div className="text-right">
                    <span className="font-display font-black text-xl text-rw-crimson">
                        {approvedPct}%
                    </span>
                    {pendingPct > 0 && (
                        <span className="text-xs font-bold text-amber-500 block">
                            +{pendingPct}% pending
                        </span>
                    )}
                </div>
            </div>

            {/* Premium Dual Segment Bar */}
            <div className="h-3 w-full bg-rw-bg-alt rounded-full overflow-hidden flex border border-[var(--rw-border)] relative">
                {/* Approved segment */}
                <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-green-400 transition-all duration-500 rounded-l-full"
                    style={{ width: `${approvedPct}%` }}
                />
                {/* Pending segment (amber striped / pulse) */}
                <div
                    className="h-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-500 animate-pulse relative overflow-hidden"
                    style={{
                        width: `${pendingPct}%`,
                        backgroundImage: `linear-gradient(45deg, rgba(255,255,255,0.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.15) 75%, transparent 75%, transparent)`,
                        backgroundSize: "1rem 1rem",
                    }}
                />
            </div>

            <div className="flex justify-between text-xs font-medium text-rw-muted">
                <span>₦{approved.toLocaleString()} confirmed</span>
                <span>
                    ₦{Math.max(0, total - approved - pending).toLocaleString()} remaining
                </span>
            </div>
        </div>
    );
}

export function OrderSummary({ order }: { order: Order }) {
    const payments = order.payments || [];

    const approvedSum = payments
        .filter((p) => p.status === "approved")
        .reduce((sum, p) => sum + (p.amountConfirmed ?? p.extractedAmount), 0);

    const pendingSum = payments
        .filter((p) => p.status === "pending")
        .reduce((sum, p) => sum + p.extractedAmount, 0);

    return (
        <div className="rw-card overflow-hidden border-t-[3px] border-t-rw-crimson shadow-rw-shadow-md">
            <div className="bg-gradient-to-r from-rw-crimson/5 to-transparent px-6 py-5 border-b border-rw-crimson/10 flex items-center justify-between">
                <h2 className="font-display font-bold text-lg text-rw-ink">
                    Order Summary
                </h2>
                <span
                    className={`badge-${order.status} inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide`}
                >
                    {order.status.replace("_", " ")}
                </span>
            </div>

            <div className="p-6">
                <div className="mb-6">
                    <p className="text-xs text-rw-muted font-medium uppercase tracking-wider mb-1">
                        Customer
                    </p>
                    <p className="font-semibold text-rw-ink text-lg">
                        {order.customerName}
                    </p>
                </div>

                {/* Item previews */}
                <div className="flex flex-col gap-3 mb-8">
                    <p className="text-xs text-rw-muted font-medium uppercase tracking-wider mb-1">
                        Items ({order.items.length})
                    </p>
                    {order.items.map((i) => (
                        <div
                            key={i.id}
                            className="flex items-center gap-4 p-3 rounded-2xl border border-[var(--rw-border)] hover:border-[var(--rw-border-mid)] transition-colors"
                        >
                            <ProductImage
                                imageUrl={
                                    i.imageUrl || ph(64, 64, i.productName.slice(0, 6))
                                }
                                alt={i.productName}
                                minimal={true}
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
                                <p className="text-xs text-rw-muted mt-0.5">
                                    Qty: {i.quantity}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <ProgressBar
                    approved={approvedSum}
                    pending={pendingSum}
                    total={order.totalAmount}
                />
            </div>
        </div>
    );
}
