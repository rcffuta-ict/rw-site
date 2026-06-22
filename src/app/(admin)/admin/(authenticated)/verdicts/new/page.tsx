import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getEligibleOrdersForVerdict } from "@/lib/services/verdicts.service";
import { NewVerdictClient } from "./NewVerdictClient";

export const metadata = { title: "New Verdict — RW'26 Admin" };

export default async function NewVerdictPage() {
    const hdrs = await headers();
    if (hdrs.get("x-admin-role") !== "ADMIN") {
        redirect("/admin/verdicts");
    }
    const eligibleOrders = await getEligibleOrdersForVerdict();
    return <NewVerdictClient eligibleOrders={eligibleOrders} />;
}
