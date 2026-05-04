import { OrdersTable } from "@/components/admin/OrdersTable";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { DEMO_ORDERS } from "@/lib/data/orders";
import type { OrderStatus } from "@/lib/data/types";

export const metadata = { title: "Orders — RW'26 Admin" };

const STATUS_TABS: { key: OrderStatus | "all"; label: string }[] = [
    { key: "all",            label: "All Orders" },
    { key: "pending",        label: "Pending" },
    { key: "partially_paid", label: "Partial" },
    { key: "paid",           label: "Paid" },
    { key: "confirmed",      label: "Confirmed" },
    { key: "flagged",        label: "Flagged" },
];

export default function AdminOrdersPage() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <h1 className="section-heading text-2xl text-rw-ink uppercase tracking-tight">Order Management</h1>
                    <p className="mt-1 text-sm text-rw-muted font-medium">{DEMO_ORDERS.length} total orders across all statuses</p>
                </div>
                <div className="flex gap-2">
                    <button className="rounded-xl border border-[var(--rw-border-mid)] px-4 py-2.5 text-xs font-bold text-rw-ink hover:bg-rw-bg-alt transition-colors uppercase tracking-widest">
                        Export All
                    </button>
                </div>
            </div>

            {/* Filters and Search Row */}
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="flex flex-wrap gap-1.5 p-1 rounded-2xl bg-rw-bg-alt/50 border border-[var(--rw-border)]">
                    {STATUS_TABS.map(t => (
                        <button 
                            key={t.key} 
                            className={`rounded-xl px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-all ${
                                t.key === "all"
                                    ? "bg-rw-crimson text-white shadow-sm"
                                    : "text-rw-muted hover:text-rw-ink hover:bg-white"
                            }`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>
                <div className="w-full md:w-64">
                    <Input 
                        placeholder="Search Ref or Name..." 
                        className="h-10 !rounded-2xl"
                        containerClassName="!gap-0"
                    />
                </div>
            </div>

            <OrdersTable orders={DEMO_ORDERS} />
        </div>
    );
}
