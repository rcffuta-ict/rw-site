import { listOrders } from "@/lib/services/orders.service";
import { NewVerdictClient } from "./NewVerdictClient";

export const metadata = { title: "New Verdict — RW'26 Admin" };

export default async function NewVerdictPage() {
    const orders = await listOrders();
    return <NewVerdictClient orders={orders} />;
}
