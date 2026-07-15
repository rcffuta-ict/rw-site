import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSponsorBySlug } from "@/lib/services/sponsors.service";
import { SponsorForm } from "../../SponsorForm";

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const sponsor = await getSponsorBySlug(slug);
    return { title: `Edit ${sponsor?.name ?? "Sponsor"} — RW'26 Admin` };
}

export default async function EditSponsorPage({ params }: Props) {
    const { slug } = await params;
    const sponsor = await getSponsorBySlug(slug);
    if (!sponsor) notFound();

    return (
        <div className="max-w-2xl">
            <Link
                href={`/admin/sponsors/${slug}`}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-rw-muted hover:text-rw-ink mb-5"
            >
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                Back to {sponsor.name}
            </Link>
            <h1 className="font-display font-black text-2xl text-rw-ink mb-6">Edit {sponsor.name}</h1>
            <SponsorForm sponsor={sponsor} />
        </div>
    );
}
