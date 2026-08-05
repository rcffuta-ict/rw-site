import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getVerdictDetail } from "@/lib/services/verdicts.service";
import { getSettings } from "@/lib/services/settings.service";
import { VerdictDetailClient } from "./VerdictDetailClient";

export const metadata: Metadata = { title: "Verdict — RW'26 Admin" };

export default async function VerdictDetailPage({
    params,
}: {
    params: Promise<{ ref: string }>;
}) {
    const { ref } = await params;
    const [detail, settings] = await Promise.all([
        getVerdictDetail(decodeURIComponent(ref)),
        getSettings(),
    ]);
    if (!detail) notFound();

    return (
        <VerdictDetailClient
            verdict={detail.verdict}
            orders={detail.orders}
            pickupTokenRequired={settings.pickup_token_required}
        />
    );
}
