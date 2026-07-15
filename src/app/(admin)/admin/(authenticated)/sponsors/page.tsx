import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { SPONSOR_LIST, TENURE } from "@/lib/config";
import { getSponsorStats } from "@/lib/services/sponsors.service";

export const metadata: Metadata = {
    title: "Sponsors — RW'26 Admin",
    description: "Sponsor lead collection: sign-ups, auto-included customers, and exports.",
};

export default async function AdminSponsorsPage() {
    const stats = await Promise.all(
        SPONSOR_LIST.map(async (s) => ({ sponsor: s, stats: await getSponsorStats(s.slug) }))
    );

    return (
        <div className="max-w-5xl">
            <header className="mb-8">
                <h1 className="font-display font-black text-2xl text-rw-ink">Sponsors</h1>
                <p className="text-sm text-rw-muted mt-1">
                    Partners collecting {TENURE.brandLabel} member details. Select a sponsor to
                    manage sign-ups, auto-include confirmed customers, and export data.
                </p>
            </header>

            <div className="grid gap-5 sm:grid-cols-2">
                {stats.map(({ sponsor, stats }) => (
                    <Link
                        key={sponsor.slug}
                        href={`/admin/sponsors/${sponsor.slug}`}
                        className="rw-card p-6 flex items-center gap-5 transition-all hover:shadow-md hover:-translate-y-0.5"
                    >
                        <div
                            className="shrink-0 rounded-2xl p-2.5"
                            style={{ backgroundColor: sponsor.blue }}
                        >
                            <Image
                                src={sponsor.logo}
                                alt={`${sponsor.name} logo`}
                                width={56}
                                height={56}
                                className="h-12 w-12 rounded-xl object-contain"
                            />
                        </div>
                        <div className="min-w-0 flex-1">
                            <h2 className="font-display font-bold text-rw-ink">{sponsor.name}</h2>
                            <p className="text-xs text-rw-muted truncate">{sponsor.tagline}</p>
                            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs">
                                <span className="text-rw-text-2">
                                    <strong className="text-rw-ink">{stats.effective}</strong> enrolled
                                </span>
                                <span className="text-rw-text-2">
                                    <strong className="text-rw-ink">{stats.signedUp}</strong> signed up
                                </span>
                                <span className="text-rw-text-2">
                                    <strong className="text-rw-ink">{stats.autoIncluded}</strong> auto-included
                                </span>
                                {stats.optedOut > 0 && (
                                    <span className="text-rw-muted">{stats.optedOut} opted out</span>
                                )}
                            </div>
                        </div>
                        <svg className="h-5 w-5 shrink-0 text-rw-muted" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                ))}
            </div>
        </div>
    );
}
