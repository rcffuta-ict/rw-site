import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getOrderByRef } from "@/lib/services/orders.service";
import OrderInfoClient from "./OrderInfoClient";

interface Props {
    params: Promise<{ orderRef: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { orderRef } = await params;
    return { title: `Details: ${orderRef} — RW'26 Admin` };
}

export default async function OrderDetailsInfoPage({ params }: Props) {
    const { orderRef } = await params;
    const order = await getOrderByRef(orderRef);
    if (!order) notFound();

    return <OrderInfoClient order={order} />;
}
