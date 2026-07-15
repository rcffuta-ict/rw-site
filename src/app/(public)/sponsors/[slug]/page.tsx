import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSponsor, TENURE } from "@/lib/config";
import { SponsorClient } from "./SponsorClient";

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const sponsor = getSponsor(slug);
    if (!sponsor) return { title: "Sponsor Not Found" };
    return {
        title: `${sponsor.name} × ${TENURE.brandLabel} — Free Courses for RCF FUTA`,
        description: `${sponsor.name} is sponsoring free ${sponsor.tagline.toLowerCase()} for the RCF FUTA family. Sign up to get access.`,
    };
}

export default async function SponsorPage({ params }: Props) {
    const { slug } = await params;
    const sponsor = getSponsor(slug);
    if (!sponsor) notFound();

    return <SponsorClient sponsor={sponsor} />;
}
