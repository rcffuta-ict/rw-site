import type { Metadata } from "next";
import { headers } from "next/headers";
import OrdersClient from "./OrdersClient";
import { listOrders } from "@/lib/services/orders.service";

export const metadata: Metadata = {
    title: "Orders — RW'26 Admin",
    description: "Manage fulfillment and track payments across the platform.",
};

export default async function AdminOrdersPage() {
    const [orders, hdrs] = await Promise.all([listOrders(), headers()]);
    const isAdmin = hdrs.get("x-admin-role") === "ADMIN";

    return <OrdersClient initialOrders={orders} isAdmin={isAdmin} />;
}
