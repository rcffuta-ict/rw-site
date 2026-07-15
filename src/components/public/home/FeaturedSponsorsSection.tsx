import Link from "next/link";
import { SponsorLogo } from "@/components/common/SponsorLogo";
import { listSponsors, type Sponsor } from "@/lib/services/sponsors.service";
import { TENURE } from "@/lib/config";

/**
 * Landing-page band that showcases our CONFIRMED partners (e.g. Skybil) and the
 * perk they bring to members — distinct from the sponsorship-tiers pitch in
 * SponsorsSection. DB-driven, so new active sponsors appear automatically.
 */
export async function FeaturedSponsorsSection() {
    let sponsors: Sponsor[] = [];
    try {
        sponsors = await listSponsors(true);
    } catch {
        sponsors = [];
    }
    if (sponsors.length === 0) return null;

    return (
        <section className="bg-white section-py">
            <div className="section-container">
                <div className="max-w-3xl mx-auto text-center mb-12">
                    <p className="eyebrow mb-4 text-[#FF0015]!">Our Sponsors</p>
                    <h2 className="section-heading text-4xl sm:text-5xl text-[#1C0003] mb-6">
                        Perks for our members
                    </h2>
                    <p className="text-rw-text-2 text-lg leading-relaxed">
                        {TENURE.brandLabel} is powered by partners who invest in you. Tap in
                        to what they&rsquo;re offering the {TENURE.brandLabelShort} family.
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
                    {sponsors.map((sponsor) => (
                        <Link
                            key={sponsor.slug}
                            href={`/sponsors/${sponsor.slug}`}
                            className="group relative overflow-hidden rounded-3xl p-8 text-white shadow-lg transition-transform hover:-translate-y-1"
                            style={{ backgroundColor: sponsor.brandColor }}
                        >
                            <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-3xl" />

                            <div className="relative z-10 flex flex-col h-full">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="rounded-2xl bg-white p-2.5 shadow-md">
                                        <SponsorLogo
                                            src={sponsor.logoUrl}
                                            alt={`${sponsor.name} logo`}
                                            size={40}
                                            className="h-10 w-10 rounded-xl object-contain"
                                        />
                                    </div>
                                    <div>
                                        <p className="font-display font-black text-2xl leading-none">
                                            {sponsor.name}
                                        </p>
                                        <p className="text-xs font-semibold uppercase tracking-widest text-white/70 mt-1.5">
                                            Official Sponsor
                                        </p>
                                    </div>
                                </div>

                                {sponsor.description && (
                                    <p className="text-white/90 leading-relaxed mb-6 flex-1">
                                        {sponsor.description}
                                    </p>
                                )}

                                <span
                                    className="inline-flex items-center gap-2 self-start rounded-xl bg-white px-5 py-2.5 text-sm font-bold transition-transform group-hover:translate-x-0.5"
                                    style={{ color: sponsor.brandColor }}
                                >
                                    {sponsor.collectsData ? "Get free access" : "Learn more"}
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                    </svg>
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
