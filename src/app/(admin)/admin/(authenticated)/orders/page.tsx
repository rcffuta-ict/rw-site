import type { Metadata } from "next";
import OrdersClient from "./OrdersClient";
import { listOrders } from "@/lib/services/orders.service";

export const metadata: Metadata = {
    title: "Orders — RW'26 Admin",
    description: "Manage fulfillment and track payments across the platform.",
};

export default async function AdminOrdersPage() {
    const orders = await listOrders();

    return <OrdersClient initialOrders={orders} />;
}
