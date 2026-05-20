import type { Metadata } from "next";
import { OrdersClient } from "./OrdersClient";

import { TENURE } from "@/lib/config";

export const metadata: Metadata = {
    title: `My Orders — ${TENURE.brandLabel}`,
    description: `Look up your ${TENURE.eventName} merchandise orders by phone number or email address.`,
};

export default function OrdersPage() {
    return <OrdersClient />;
}
