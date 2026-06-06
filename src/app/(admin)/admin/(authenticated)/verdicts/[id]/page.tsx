import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { getVerdictById } from "@/lib/services/verdicts.service";
import { VerdictDetailClient } from "./VerdictDetailClient";

interface Props {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    return { title: `Verdict ${id} — RW'26 Admin` };
}

export default async function VerdictDetailPage({ params }: Props) {
    const { id } = await params;
    const [verdict, hdrs] = await Promise.all([getVerdictById(id), headers()]);

    if (!verdict) notFound();

    const isAdmin = hdrs.get("x-admin-role") === "ADMIN";

    return <VerdictDetailClient verdict={verdict} isAdmin={isAdmin} />;
}
