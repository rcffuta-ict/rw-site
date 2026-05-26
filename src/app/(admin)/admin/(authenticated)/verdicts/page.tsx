import type { Metadata } from "next";
import { headers } from "next/headers";
import VerdictsClient from "./VerdictsClient";
import { listVerdicts } from "@/lib/services/verdicts.service";

export const metadata: Metadata = {
    title: "Verdicts — RW'26 Admin",
    description:
        "Manage and download production manifests and fulfillment permits for Redemption Week '26.",
};

export default async function VerdictsPage() {
    const [verdicts, hdrs] = await Promise.all([listVerdicts(), headers()]);
    const isAdmin = hdrs.get("x-admin-role") === "ADMIN";
    return <VerdictsClient verdicts={verdicts} isAdmin={isAdmin} />;
}
