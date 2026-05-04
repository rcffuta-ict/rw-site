const SPONSORS = [
    { tier: "Diamond", amount: "₦1,000,000", perks: ["All-week logo placement", "Daily exhibition booth", "20s video ad daily", "Vocal mentions nightly"] },
    { tier: "Gold",    amount: "₦750,000",   perks: ["All-week logo placement", "Booth × 4 days", "Video ads × 4 days"] },
    { tier: "Silver",  amount: "₦500,000",   perks: ["All-week logo placement", "Booth × 3 days", "Video × 3 days"] },
    { tier: "Bronze",  amount: "₦250,000",   perks: ["Logo × 2 days", "Booth × 2 days", "Image ads daily"] },
];

export function SponsorsSection() {
    return (
        <section className="bg-rw-bg-alt section-py">
            <div className="section-container">
                <div className="mb-14">
                    <p className="eyebrow mb-4">Support the Vision</p>
                    <h2 className="section-heading text-3xl sm:text-4xl lg:text-5xl">Sponsors & Partners</h2>
                    <p className="mt-4 text-rw-text-2 text-lg max-w-[52ch] leading-relaxed">
                        Partner with 38 years of impact. Reach 900+ students and alumni across a full week of events.
                    </p>
                </div>

                {/* Tier cards */}
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {SPONSORS.map((s, i) => (
                        <div key={s.tier} className={`rw-card p-7 flex flex-col gap-5 hover:border-rw-crimson/30 ${i === 0 ? "border-rw-crimson/20 bg-rw-crimson/[0.02]" : ""}`}>
                            <div>
                                <p className="eyebrow text-rw-muted mb-2">{s.tier}</p>
                                <p className="font-display font-bold text-rw-crimson text-3xl">{s.amount}</p>
                            </div>
                            <ul className="flex flex-col gap-2 flex-1">
                                {s.perks.map(perk => (
                                    <li key={perk} className="flex items-start gap-2 text-sm text-rw-text-2">
                                        <svg className="h-4 w-4 text-rw-crimson shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                        </svg>
                                        {perk}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Community partners logos */}
                <div className="mt-16">
                    <p className="eyebrow mb-6">Community Partners & Student Businesses</p>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
                        {Array.from({ length: 6 }, (_, i) => (
                            <div key={i} className="rw-card h-20 rounded-xl flex items-center justify-center">
                                <img
                                    src={`https://placehold.co/120x50/f9fafb/cccccc?text=Partner+${i + 1}%0A120×50`}
                                    alt={`Partner ${i + 1}`}
                                    className="h-8 w-auto object-contain opacity-60 hover:opacity-100 transition-opacity"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Contact CTA */}
                <div className="mt-12 rw-card p-8 flex flex-col sm:flex-row sm:items-center gap-6 justify-between">
                    <div>
                        <p className="font-semibold text-rw-ink text-lg">Interested in sponsoring?</p>
                        <p className="text-sm text-rw-muted mt-1.5">
                            Aiyejagbara Tobi — 09031676421 ·{" "}
                            <a href="mailto:tobi4saviour2@gmail.com" className="text-rw-crimson hover:underline">tobi4saviour2@gmail.com</a>
                        </p>
                        <p className="text-sm text-rw-muted mt-1">
                            Olatona Ayobami — 09069948890 ·{" "}
                            <a href="mailto:ayobamioluwaseyi118@gmail.com" className="text-rw-crimson hover:underline">ayobamioluwaseyi118@gmail.com</a>
                        </p>
                    </div>
                    <a href="mailto:tobi4saviour2@gmail.com" className="btn-secondary shrink-0 !h-11 !px-7 text-sm">
                        Get in touch
                    </a>
                </div>
            </div>
        </section>
    );
}
