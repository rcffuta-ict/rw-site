import type { Metadata } from "next";
import { headers } from "next/headers";
import VerdictsClient from "./VerdictsClient";
import { listOrders } from "@/lib/services/orders.service";

export const metadata: Metadata = { 
    title: "Verdicts — RW'26 Admin",
    description: "Manage and download production manifests and fulfillment permits for Redemption Week '26."
};

export default async function VerdictsPage() {
    const [orders, hdrs] = await Promise.all([listOrders(), headers()]);
    const isAdmin = hdrs.get("x-admin-role") === "ADMIN";
    return <VerdictsClient orders={orders} isAdmin={isAdmin} />;
}

