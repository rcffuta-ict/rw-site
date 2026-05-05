"use client";

import { StatsCard } from "@/components/ui/cards/StatsCard";
import { Order } from "@/lib/data/types";

export function OrderStats({ orders }: { orders: Order[] }) {
    const total = orders.length;
    const pending = orders.filter(o => o.status === "pending").length;
    const paid = orders.filter(o => o.status === "paid" || o.status === "confirmed" || o.status === "partially_paid").length;
    const flagged = orders.filter(o => o.status === "flagged").length;

    return (
        <div className="relative">
            <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 overflow-x-auto pb-4 sm:pb-0 scrollbar-hide -mx-5 px-5 sm:mx-0 sm:px-0">
                <div className="min-w-[240px] sm:min-w-0 flex-1">
                    <StatsCard
                        label="Total Orders"
                        value={total}
                        icon={<svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007Z" /></svg>}
                    />
                </div>
                <div className="min-w-[240px] sm:min-w-0 flex-1">
                    <StatsCard
                        label="Pending Action"
                        value={pending}
                        sub="Requires initial review"
                        icon={<svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>}
                    />
                </div>
                <div className="min-w-[240px] sm:min-w-0 flex-1">
                    <StatsCard
                        label="Paid / Confirmed"
                        value={paid}
                        sub={`${Math.round((paid / total) * 100)}% of total`}
                        icon={<svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>}
                    />
                </div>
                <div className="min-w-[240px] sm:min-w-0 flex-1">
                    <StatsCard
                        label="Flagged"
                        value={flagged}
                        sub="Critical issues"
                        icon={<svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" /></svg>}
                    />
                </div>
            </div>
        </div>
    );
}
