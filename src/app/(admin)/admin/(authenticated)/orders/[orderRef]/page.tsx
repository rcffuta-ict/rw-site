import { Metadata } from "next";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { getOrderByRef } from "@/lib/services/orders.service";
import OrderDetailClient from "./OrderDetailClient";

interface Props {
    params: Promise<{ orderRef: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { orderRef } = await params;
    return { title: `${orderRef} — RW'26 Admin` };
}

export default async function AdminOrderDetailPage({ params }: Props) {
    const { orderRef } = await params;
    const [order, hdrs] = await Promise.all([getOrderByRef(orderRef), headers()]);
    if (!order) notFound();
    
    const isAdmin = hdrs.get("x-admin-role") === "ADMIN";

    return <OrderDetailClient order={order} isAdmin={isAdmin} />;
}
