import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { listOrders } from "@/lib/services/orders.service";
import { NewVerdictClient } from "./NewVerdictClient";

export const metadata = { title: "New Verdict — RW'26 Admin" };

export default async function NewVerdictPage() {
    const hdrs = await headers();
    if (hdrs.get("x-admin-role") !== "ADMIN") {
        redirect("/admin/verdicts");
    }
    const orders = await listOrders();
    return <NewVerdictClient orders={orders} />;
}

