import type { Metadata } from "next";
import { headers } from "next/headers";
import VerdictsClient from "./VerdictsClient";
import { listVerdicts, getVerdictsOverview } from "@/lib/services/verdicts.service";
import { getSettings } from "@/lib/services/settings.service";

export const metadata: Metadata = {
    title: "Verdicts — RW'26 Admin",
    description:
        "Official production verdicts: what to produce and how much to debit, served as the single source of truth.",
};

export default async function VerdictsPage() {
    const [verdicts, overview, hdrs, settings] = await Promise.all([
        listVerdicts(),
        getVerdictsOverview(),
        headers(),
        getSettings(),
    ]);
    const isAdmin = hdrs.get("x-admin-role") === "ADMIN";
    return (
        <VerdictsClient
            verdicts={verdicts}
            overview={overview}
            isAdmin={isAdmin}
            pickupTokenRequired={settings.pickup_token_required}
        />
    );
}
