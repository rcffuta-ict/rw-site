import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getVerdictDetail } from "@/lib/services/verdicts.service";
import { VerdictDetailClient } from "./VerdictDetailClient";

export const metadata: Metadata = { title: "Verdict — RW'26 Admin" };

export default async function VerdictDetailPage({
    params,
}: {
    params: Promise<{ ref: string }>;
}) {
    const { ref } = await params;
    const detail = await getVerdictDetail(decodeURIComponent(ref));
    if (!detail) notFound();

    return (
        <VerdictDetailClient verdict={detail.verdict} orders={detail.orders} />
    );
}
