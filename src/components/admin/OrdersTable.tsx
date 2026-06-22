import React from "react";
import Link from "next/link";
import { Order } from "@/lib/data/types";
import { OrderStatusBadge } from "@/components/ui/Badge";
import { CopyButton } from "../common/CopyButton";
import { AdminTable } from "./AdminTable";
import { formatNaira, getEffectiveStatus, getRelativeTime } from "@/lib/utils/functions";

interface OrdersTableProps {
    orders: Order[];
    /** Rows per page — keeps the table a fixed height so pagination kicks in. */
    pageSize?: number;
}

export function OrdersTable({ orders, pageSize = 10 }: OrdersTableProps) {
    return (
        <AdminTable<Order>
            data={orders}
            pageSize={pageSize}
            keyExtractor={(o: Order) => o.id}
            emptyMessage="No orders found"
            columns={[
                {
                    label: "Ref",
                    key: "orderRef",
                    render: (o: Order) => (
                        <div className="flex items-center gap-2">
                            <Link
                                href={`/admin/orders/${o.orderRef}`}
                                className="font-mono font-bold text-rw-crimson hover:text-rw-crimson-dk transition-colors border-b border-rw-crimson/20 pb-0.5"
                            >
                                {o.orderRef}
                            </Link>
                            <CopyButton textToCopy={o.orderRef} />
                        </div>
                    ),
                },
                {
                    label: "Customer",
                    key: "customerName",
                    render: (o: Order) => (
                        <div className="flex flex-col">
                            <span className="font-bold text-rw-ink group-hover:text-rw-crimson transition-colors">
                                {o.customerName}
                            </span>
                            <span className="text-xs text-rw-muted">
                                {o.customerEmail}
                            </span>
                        </div>
                    ),
                },
                {
                    label: "Items",
                    key: "items",
                    align: "right",
                    className: "hidden sm:table-cell",
                    render: (o: Order) => (
                        <span className="px-2 py-1 rounded-md bg-rw-bg-alt text-[11px] font-bold">
                            {o.items.length} items
                        </span>
                    ),
                },
                {
                    label: "Total",
                    key: "totalAmount",
                    align: "right",
                    render: (o: Order) => (
                        <span className="font-display font-bold text-rw-ink">
                            {formatNaira(o.totalAmount)}
                        </span>
                    ),
                },
                {
                    label: "Paid",
                    key: "amountPaid",
                    align: "right",
                    className: "hidden md:table-cell",
                    render: (o: Order) => (
                        <span
                            className={
                                o.amountPaid >= o.totalAmount
                                    ? "text-green-600 font-semibold"
                                    : ""
                            }
                        >
                            {formatNaira(o.amountPaid)}
                        </span>
                    ),
                },
                {
                    label: "Status",
                    key: "status",
                    render: (o: Order) => {
                        const effectiveStatus = getEffectiveStatus(o);
                        if (effectiveStatus === "queued") {
                            return (
                                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-purple-100 text-purple-700">
                                    Queued
                                </span>
                            );
                        }
                        return <OrderStatusBadge status={o.status} />;
                    },
                },
                {
                    label: "Date",
                    key: "createdAt",
                    align: "right",
                    className: "hidden lg:table-cell",
                    render: (o: Order) => {
                        const date = new Date(o.createdAt);
                        const absoluteDate = date.toLocaleDateString("en-NG", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                        });
                        const absoluteTime = date.toLocaleTimeString("en-NG", {
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                        });
                        const relative = getRelativeTime(o.createdAt);

                        return (
                            <div className="flex flex-col items-end">
                                <span className="text-xs font-bold text-rw-ink">
                                    {absoluteDate}{" "}
                                    <span className="font-normal text-rw-muted">
                                        • {absoluteTime}
                                    </span>
                                </span>
                                <span className="text-[10px] font-semibold text-rw-crimson mt-0.5 tracking-wide">
                                    {relative}
                                </span>
                            </div>
                        );
                    },
                },
            ]}
            footer={
                <div className="flex items-center justify-between">
                    <p className="text-xs text-rw-muted font-medium italic">
                        Showing {orders.length} orders
                    </p>
                </div>
            }
        />
    );

    // return (
    //     <Card className="overflow-hidden">
    //         <div className="overflow-x-auto custom-scrollbar">
    //             <table className="w-full text-sm text-left">
    //                 <thead>
    //                     <tr className="border-b border-[var(--rw-border)] bg-rw-bg-alt/50 text-rw-muted">
    //                         <th className="px-5 py-3 text-xs font-bold uppercase tracking-widest">
    //                             Ref
    //                         </th>
    //                         <th className="px-5 py-3 text-xs font-bold uppercase tracking-widest">
    //                             Customer
    //                         </th>
    //                         <th className="px-5 py-3 text-xs font-bold uppercase tracking-widest hidden sm:table-cell">
    //                             Items
    //                         </th>
    //                         <th className="px-5 py-3 text-xs font-bold uppercase tracking-widest text-right">
    //                             Total
    //                         </th>
    //                         <th className="px-5 py-3 text-xs font-bold uppercase tracking-widest text-right hidden md:table-cell">
    //                             Paid
    //                         </th>
    //                         <th className="px-5 py-3 text-xs font-bold uppercase tracking-widest">
    //                             Status
    //                         </th>
    //                         <th className="px-5 py-3 text-xs font-bold uppercase tracking-widest text-right hidden lg:table-cell">
    //                             Date
    //                         </th>
    //                     </tr>
    //                 </thead>
    //                 <tbody>
    //                     {orders.map((o) => (
    //                         <tr
    //                             key={o.id}
    //                             className="border-b border-[var(--rw-border)] last:border-0 hover:bg-rw-bg-alt/30 transition-colors group"
    //                         >
    //                             <td className="px-5 py-4">
    //                                 <div className="flex items-center gap-2">
    //                                     <Link
    //                                         href={`/admin/orders/${o.orderRef}`}
    //                                         className="font-mono font-bold text-rw-crimson hover:underline text-sm tracking-tight"
    //                                     >
    //                                         {o.orderRef}
    //                                     </Link>
    //                                     <CopyButton textToCopy={o.orderRef} />
    //                                 </div>
    //                             </td>
    //                             <td className="px-5 py-4">
    //                                 <p className="font-bold text-rw-ink truncate max-w-[140px] sm:max-w-none">
    //                                     {o.customerName}
    //                                 </p>
    //                                 <p className="text-[10px] text-rw-muted truncate max-w-[140px] sm:max-w-none hidden sm:block font-medium">
    //                                     {o.customerEmail}
    //                                 </p>
    //                             </td>
    //                             <td className="px-5 py-4 hidden sm:table-cell">
    //                                 <span className="text-[10px] font-bold text-rw-muted bg-rw-bg-alt px-1.5 py-0.5 rounded border border-[var(--rw-border)]">
    //                                     {o.items.length} ITEM
    //                                     {o.items.length !== 1 ? "S" : ""}
    //                                 </span>
    //                             </td>
    //                             <td className="px-5 py-4 text-right font-bold text-rw-ink whitespace-nowrap">
    //                                 ₦{o.totalAmount.toLocaleString()}
    //                             </td>
    //                             <td className="px-5 py-4 text-right text-rw-text-2 hidden md:table-cell whitespace-nowrap">
    //                                 ₦{o.amountPaid.toLocaleString()}
    //                             </td>
    //                             <td className="px-5 py-4">
    //                                 <OrderStatusBadge status={o.status} />
    //                             </td>
    //                             <td className="px-5 py-4 text-right text-[10px] font-bold text-rw-muted hidden lg:table-cell uppercase tracking-tighter">
    //                                 {new Date(o.createdAt).toLocaleDateString("en-NG", {
    //                                     day: "numeric",
    //                                     month: "short",
    //                                     year: "2-digit",
    //                                 })}
    //                             </td>
    //                         </tr>
    //                     ))}
    //                 </tbody>
    //             </table>
    //         </div>
    //     </Card>
    // );
}
