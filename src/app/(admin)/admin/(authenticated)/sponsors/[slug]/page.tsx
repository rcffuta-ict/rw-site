import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSponsor } from "@/lib/config";
import { listSponsorLeads, getSponsorStats } from "@/lib/services/sponsors.service";
import { SponsorDetailClient } from "./SponsorDetailClient";

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const sponsor = getSponsor(slug);
    return { title: `${sponsor?.name ?? "Sponsor"} — RW'26 Admin` };
}

export default async function AdminSponsorDetailPage({ params }: Props) {
    const { slug } = await params;
    const sponsor = getSponsor(slug);
    if (!sponsor) notFound();

    const [leads, stats] = await Promise.all([
        listSponsorLeads(slug),
        getSponsorStats(slug),
    ]);

    return <SponsorDetailClient sponsor={sponsor} leads={leads} stats={stats} />;
}
