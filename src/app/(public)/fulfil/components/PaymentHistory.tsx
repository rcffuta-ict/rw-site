import type { Order } from "@/lib/data/types";

export function PaymentHistory({ payments }: { payments: Order["payments"] }) {
    if (payments.length === 0) return null;

    return (
        <div className="rw-card p-6 border-t-[3px] border-t-rw-border-strong shadow-sm">
            <h3 className="font-display font-bold text-lg text-rw-ink mb-5">
                Payment History
            </h3>
            <ul className="flex flex-col gap-4">
                {payments.map((p) => (
                    <li
                        key={p.id}
                        className="flex items-center justify-between p-4 rounded-2xl bg-rw-bg-alt border border-transparent hover:border-[var(--rw-border)] transition-colors"
                    >
                        <div>
                            <p className="font-bold text-rw-ink">
                                ₦{p.amountClaimed.toLocaleString()}
                            </p>
                            <p className="text-xs text-rw-muted mt-1 font-medium">
                                {new Date(p.createdAt).toLocaleDateString("en-NG", { dateStyle: "medium" })}
                            </p>
                        </div>
                        <span
                            className={`badge-${p.status} inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase`}
                        >
                            {p.status}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
