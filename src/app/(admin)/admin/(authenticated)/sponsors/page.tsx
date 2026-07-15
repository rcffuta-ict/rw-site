import type { Metadata } from "next";
import Link from "next/link";
import { SponsorLogo } from "@/components/common/SponsorLogo";
import { TENURE } from "@/lib/config";
import { listSponsors, getSponsorStats } from "@/lib/services/sponsors.service";

export const metadata: Metadata = {
    title: "Sponsors — RW'26 Admin",
    description: "Manage sponsor profiles, sign-ups, auto-included customers, and exports.",
};

export default async function AdminSponsorsPage() {
    const sponsors = await listSponsors();
    const withStats = await Promise.all(
        sponsors.map(async (s) => ({
            sponsor: s,
            stats: s.collectsData ? await getSponsorStats(s.slug) : null,
        }))
    );

    return (
        <div className="max-w-5xl">
            <header className="mb-8 flex items-start justify-between gap-4">
                <div>
                    <h1 className="font-display font-black text-2xl text-rw-ink">Sponsors</h1>
                    <p className="text-sm text-rw-muted mt-1">
                        Partners featured on the {TENURE.brandLabel} site. Each has a public page;
                        data-collecting sponsors gather sign-ups you can export.
                    </p>
                </div>
                <Link href="/admin/sponsors/new" className="shrink-0">
                    <span className="inline-flex items-center gap-2 h-10 px-4 rounded-xl text-sm font-semibold bg-rw-crimson text-white hover:bg-rw-crimson-dk transition-colors">
                        + New Sponsor
                    </span>
                </Link>
            </header>

            {withStats.length === 0 ? (
                <div className="rw-card p-10 text-center text-sm text-rw-muted">
                    No sponsors yet. Click <strong>New Sponsor</strong> to add one.
                </div>
            ) : (
                <div className="grid gap-5 sm:grid-cols-2">
                    {withStats.map(({ sponsor, stats }) => (
                        <Link
                            key={sponsor.slug}
                            href={`/admin/sponsors/${sponsor.slug}`}
                            className="rw-card p-6 flex items-center gap-5 transition-all hover:shadow-md hover:-translate-y-0.5"
                        >
                            <div className="shrink-0 rounded-2xl p-2.5" style={{ backgroundColor: sponsor.brandColor }}>
                                <SponsorLogo
                                    src={sponsor.logoUrl}
                                    alt={`${sponsor.name} logo`}
                                    size={48}
                                    className="h-12 w-12 rounded-xl object-contain"
                                />
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                    <h2 className="font-display font-bold text-rw-ink truncate">{sponsor.name}</h2>
                                    {!sponsor.active && (
                                        <span className="text-[10px] font-bold uppercase tracking-wide rounded-full bg-rw-bg-alt text-rw-muted px-2 py-0.5">
                                            Inactive
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-rw-muted truncate">{sponsor.tagline || sponsor.slug}</p>
                                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs">
                                    {sponsor.collectsData && stats ? (
                                        <>
                                            <span className="text-rw-text-2"><strong className="text-rw-ink">{stats.effective}</strong> enrolled</span>
                                            <span className="text-rw-text-2"><strong className="text-rw-ink">{stats.signedUp}</strong> signed up</span>
                                            {stats.optedOut > 0 && <span className="text-rw-muted">{stats.optedOut} opted out</span>}
                                        </>
                                    ) : (
                                        <span className="text-rw-muted">Showcase only — no data collected</span>
                                    )}
                                </div>
                            </div>
                            <svg className="h-5 w-5 shrink-0 text-rw-muted" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
