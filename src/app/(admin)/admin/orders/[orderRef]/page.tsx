import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDemoOrder } from "@/lib/data/orders";
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
    const order = getDemoOrder(orderRef);
    if (!order) notFound();

    return <OrderDetailClient order={order} />;
}
