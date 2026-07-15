import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSponsorBySlug, listSponsorLeads, getSponsorStats } from "@/lib/services/sponsors.service";
import { SponsorDetailClient } from "./SponsorDetailClient";

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const sponsor = await getSponsorBySlug(slug);
    return { title: `${sponsor?.name ?? "Sponsor"} — RW'26 Admin` };
}

export default async function AdminSponsorDetailPage({ params }: Props) {
    const { slug } = await params;
    const sponsor = await getSponsorBySlug(slug);
    if (!sponsor) notFound();

    // Leads only exist for data-collecting sponsors.
    const [leads, stats] = sponsor.collectsData
        ? await Promise.all([listSponsorLeads(slug), getSponsorStats(slug)])
        : [[], { effective: 0, signedUp: 0, autoIncluded: 0, optedOut: 0 }];

    return <SponsorDetailClient sponsor={sponsor} leads={leads} stats={stats} />;
}
