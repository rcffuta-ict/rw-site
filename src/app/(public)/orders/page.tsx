import type { Metadata } from "next";
import { OrdersClient } from "./OrdersClient";

export const metadata: Metadata = {
    title: "My Orders — Redemption Week '26",
    description:
        "Look up your Redemption Week merchandise orders by phone number or email address.",
};

export default function OrdersPage() {
    return <OrdersClient />;
}
