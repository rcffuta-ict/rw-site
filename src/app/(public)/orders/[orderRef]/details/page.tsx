import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getOrderByRef } from "@/lib/services/orders.service";
import OrderDetailSheetClient from "./OrderDetailSheetClient";
import { TENURE } from "@/lib/config";

interface Props {
    params: Promise<{ orderRef: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { orderRef } = await params;
    return {
        title: `Order Account: ${orderRef} — ${TENURE.eventName} ${TENURE.year} Merch Sales`,
    };
}

export default async function OrderDetailSheetPage({ params }: Props) {
    const { orderRef } = await params;
    const order = await getOrderByRef(orderRef);
    if (!order) notFound();

    return <OrderDetailSheetClient order={order} />;
}
