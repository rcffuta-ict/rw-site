import { ph } from "@/lib/utils";

const AIMS = [
    { n: "01", title: "Spiritual Growth",       desc: "Word, Prayer, Drama, and Worship — hearts stirred, lives transformed, faith deepened." },
    { n: "02", title: "Alumni Legacy",          desc: "Reconnecting generations. Preserving 38 years of fellowship heritage." },
    { n: "03", title: "Meaningful Connection",  desc: "Relationships built on shared values — mentorship, partnership, lifelong friendship." },
    { n: "04", title: "Family & Belonging",     desc: "A spiritual family joined by the blood of Christ. No unit, tribe, or worker left out." },
    { n: "05", title: "Cultural Unity",         desc: "Celebrating the richness of diversity — one in language, art, attire, and Christ." },
];

export function AboutSection() {
    return (
        <section className="section-py">
            <div className="section-container">
                <div className="grid lg:grid-cols-2 gap-16 xl:gap-24 items-start">
                    {/* Left: images */}
                    <div>
                        <p className="eyebrow mb-4">Why We Gather</p>
                        <h2 className="section-heading text-3xl sm:text-4xl lg:text-5xl">
                            The heart of<br />Redemption Week
                        </h2>
                        <p className="mt-5 text-rw-text-2 leading-relaxed text-lg max-w-[44ch]">
                            The Redeemed Christian Fellowship, FUTA — shaping hearts and lives since 1983.
                            A spiritual home, a family, a legacy.
                        </p>

                        <div className="mt-10 grid grid-cols-2 gap-3">
                            <img src={ph(340, 260, "Fellowship 1")} alt="Fellowship moment" className="rounded-2xl object-cover w-full h-48 hover-lift" />
                            <img src={ph(340, 260, "Fellowship 2")} alt="Fellowship moment" className="rounded-2xl object-cover w-full h-48 hover-lift mt-6" />
                            <img src={ph(700, 280, "Fellowship Wide")} alt="Fellowship wide"   className="col-span-2 rounded-2xl object-cover w-full h-44 hover-lift" />
                        </div>
                    </div>

                    {/* Right: aims */}
                    <div>
                        <p className="eyebrow mb-8">Our Five Aims</p>
                        <ul className="flex flex-col">
                            {AIMS.map((a) => (
                                <li key={a.title} className="group flex gap-6 py-7 border-b border-[var(--rw-border)] last:border-0 hover:bg-rw-bg-alt -mx-4 px-4 rounded-xl transition-colors duration-200">
                                    <span className="font-display font-bold text-3xl text-rw-crimson/15 group-hover:text-rw-crimson/30 transition-colors shrink-0 w-10 pt-1">
                                        {a.n}
                                    </span>
                                    <div>
                                        <h3 className="font-semibold text-rw-ink text-lg group-hover:text-rw-crimson transition-colors">
                                            {a.title}
                                        </h3>
                                        <p className="mt-2 text-sm text-rw-muted leading-relaxed">{a.desc}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}
