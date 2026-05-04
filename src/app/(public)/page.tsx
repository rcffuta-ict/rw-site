import Link from "next/link";
import { env } from "@/lib/env";
import { CountdownTimer } from "@/components/public/CountdownTimer";
import { DEMO_PRODUCTS } from "@/lib/data/products";

const NIGHTS = [
    { day: "Mon", name: "Opening Ceremony",      unit: "All Units",                   desc: "A grand opening celebrating Nigerian cultures, 38 years of God's faithfulness, and the start of a glorious week." },
    { day: "Tue", name: "Word Night",             unit: "Bible Study Unit",            desc: "An evening of the undiluted Word. Hearts fed, faith built, doctrine grounded." },
    { day: "Wed", name: "Power Night",            unit: "Prayer Unit",                 desc: "Impartations, healings, and activations. A reminder that RCFFUTA is a house of prayer." },
    { day: "Thu", name: "Drama Night — Acts '26", unit: "Drama Unit",                  desc: "A rollercoaster of emotion and revival through powerful on-stage storytelling." },
    { day: "Fri", name: "Choir Concert",          unit: "Choir Unit",                  desc: "Dance like David danced. A night of praise, worship, and glorious melodies." },
    { day: "Sat", name: "RIFE & Alumni Reunion",  unit: "Alumni Relations + Welfare",  desc: "Alumni come home. Knowledge passed down, final-years inducted, bonds formed over food and stories." },
    { day: "Sun", name: "Handing Over",           unit: "All Units",                   desc: "The mantle passes. Elijah to Elisha. A joyful finale as new leaders are commissioned." },
];

const STATS = [
    { value: "38", label: "Years of Impact" },
    { value: "9K+", label: "Alumni Shaped" },
    { value: "900+", label: "Weekly Members" },
    { value: "16", label: "Active Units" },
];

const AIMS = [
    { title: "Spiritual Growth",        desc: "Word, Prayer, Drama, and Worship — hearts stirred, lives transformed, faith deepened." },
    { title: "Alumni Legacy",           desc: "Reconnecting generations. Preserving 38 years of fellowship heritage." },
    { title: "Meaningful Connections",  desc: "Relationships built on shared values — mentorship, partnership, lifelong friendship." },
    { title: "Family & Belonging",      desc: "A spiritual family joined by the blood of Christ. No unit, tribe, or worker left out." },
    { title: "Cultural Unity",          desc: "Celebrating the richness of diversity — one in language, art, attire, and Christ." },
];

const SPONSORS = [
    { tier: "Diamond", amount: "₦1,000,000", note: "All-week logo · Daily booth · 20s video daily · Vocal mentions" },
    { tier: "Gold",    amount: "₦750,000",   note: "All-week logo · Booth × 4 days · Video ads × 4 days" },
    { tier: "Silver",  amount: "₦500,000",   note: "All-week logo · Booth × 3 days · Video × 3 days" },
    { tier: "Bronze",  amount: "₦250,000",   note: "Logo × 2 days · Booth × 2 days · Image ads daily" },
];

export default function LandingPage() {
    return (
        <div className="bg-white">
            {/* ── HERO — Full-width immersive ──────────────────────────────── */}
            <section className="relative min-h-[90vh] flex items-center overflow-hidden">
                {/* Background image placeholder */}
                <img
                    src="https://placehold.co/1920x1080?text=Hero+Background"
                    alt="Redemption Week hero"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="hero-overlay" />

                <div className="section-container relative z-10 py-20 lg:py-28">
                    <div className="max-w-3xl stagger-children">
                        {/* Tenure theme logo */}
                        <div className="animate-fade-in-up mb-8">
                            <img
                                src="https://placehold.co/200x80?text=Tenure+Theme+Logo"
                                alt="The Lord's Witnesses: The Purified Army"
                                className="h-16 sm:h-20 w-auto object-contain"
                            />
                        </div>

                        <div className="animate-fade-in-up">
                            <span className="inline-flex items-center gap-2 rounded-full border border-rw-crimson/20 bg-white/80 backdrop-blur-sm px-4 py-1.5 text-xs font-semibold text-rw-crimson tracking-wide">
                                <span className="h-1.5 w-1.5 rounded-full bg-rw-crimson animate-pulse-soft" />
                                38th Anniversary · RCF FUTA
                            </span>
                        </div>

                        <div className="animate-fade-in-up mt-6">
                            <h1 className="section-heading text-5xl sm:text-6xl lg:text-7xl xl:text-8xl">
                                Redemption<br />
                                Week <span className="text-rw-crimson">&apos;26</span>
                            </h1>
                            <p className="mt-5 text-lg sm:text-xl font-display italic text-rw-text-2 max-w-[38ch]">
                                The Lord&apos;s Witnesses: The Purified Army
                            </p>
                        </div>

                        <div className="animate-fade-in-up mt-6 flex flex-wrap gap-3 text-sm text-rw-text-2">
                            <span className="flex items-center gap-2 rounded-xl border border-[var(--rw-border)] bg-white/80 backdrop-blur-sm px-4 py-2 font-medium">
                                <svg className="h-4 w-4 text-rw-crimson" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" /></svg>
                                July 6–12, 2026
                            </span>
                            <span className="flex items-center gap-2 rounded-xl border border-[var(--rw-border)] bg-white/80 backdrop-blur-sm px-4 py-2 font-medium">
                                <svg className="h-4 w-4 text-rw-crimson" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" /></svg>
                                FUTA, Akure
                            </span>
                        </div>

                        <div className="animate-fade-in-up mt-8 flex flex-wrap gap-4">
                            <Link href="/shop" id="hero-shop-cta" className="btn-primary">
                                Shop Merch
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
                            </Link>
                            <Link href="/fulfil" id="hero-pay-cta" className="btn-secondary">
                                Pay an Order
                            </Link>
                        </div>

                        <div className="animate-fade-in-up mt-12">
                            <p className="eyebrow mb-4">Counting down to RW&apos;26</p>
                            <CountdownTimer targetDate={env.eventStartDate} />
                        </div>
                    </div>
                </div>
            </section>

            {/* ── STATS ───────────────────────────────────────────────────── */}
            <section className="border-y border-[var(--rw-border)] bg-rw-bg-alt">
                <div className="section-container py-12">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {STATS.map((s) => (
                            <div key={s.value} className="text-center">
                                <div className="font-display font-bold text-4xl sm:text-5xl text-rw-crimson">{s.value}</div>
                                <div className="mt-2 text-sm text-rw-muted font-medium">{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── IMAGE STRIP ─────────────────────────────────────────────── */}
            <section className="py-2 bg-white overflow-hidden">
                <div className="flex gap-2">
                    {Array.from({ length: 6 }, (_, i) => (
                        <img key={i} src={`https://placehold.co/400x260?text=Event+${i + 1}`} alt={`Event moment ${i + 1}`} className="h-52 w-auto object-cover flex-shrink-0 first:rounded-r-2xl last:rounded-l-2xl" />
                    ))}
                </div>
            </section>

            {/* ── PROGRAMME ───────────────────────────────────────────────── */}
            <section className="section-container py-20 lg:py-28">
                <div className="mb-12 max-w-xl">
                    <p className="eyebrow mb-3">The Week</p>
                    <h2 className="section-heading text-3xl sm:text-4xl lg:text-5xl">Seven nights of faith</h2>
                    <p className="mt-4 text-rw-text-2 leading-relaxed">Each night is hosted by a different unit, showcasing the beauty and diversity of fellowship life.</p>
                </div>

                {/* Desktop: editorial list */}
                <div className="hidden md:block">
                    {NIGHTS.map((n, i) => (
                        <div key={n.day} className="group flex items-center gap-6 py-6 border-b border-[var(--rw-border)] hover:bg-rw-bg-alt -mx-4 px-4 rounded-xl transition-colors">
                            <div className="flex flex-col items-center gap-0.5 shrink-0 w-14">
                                <span className="font-display font-bold text-2xl text-rw-crimson">{String(i + 1).padStart(2,"0")}</span>
                                <span className="text-xs font-semibold text-rw-muted uppercase">{n.day}</span>
                            </div>
                            <img src={`https://placehold.co/120x80?text=Night+${i + 1}`} alt={n.name} className="h-20 w-28 shrink-0 rounded-xl object-cover" />
                            <div className="flex-1 min-w-0">
                                <div className="flex items-baseline gap-3 flex-wrap">
                                    <h3 className="font-display font-bold text-lg text-rw-ink group-hover:text-rw-crimson transition-colors">{n.name}</h3>
                                    <span className="text-xs text-rw-muted bg-rw-bg-alt px-2 py-0.5 rounded-full">{n.unit}</span>
                                </div>
                                <p className="mt-1 text-sm text-rw-text-2 leading-relaxed max-w-[55ch]">{n.desc}</p>
                            </div>
                            <span className="text-rw-muted/30 group-hover:text-rw-crimson transition-colors text-xl shrink-0">→</span>
                        </div>
                    ))}
                </div>

                {/* Mobile: scroll cards */}
                <div className="md:hidden scroll-row -mx-5 px-5">
                    {NIGHTS.map((n, i) => (
                        <div key={n.day} className="rw-card shrink-0 w-72 overflow-hidden flex flex-col">
                            <img src={`https://placehold.co/288x160?text=Night+${i + 1}`} alt={n.name} className="h-36 w-full object-cover" />
                            <div className="p-4 flex flex-col gap-2">
                                <div className="flex items-center justify-between">
                                    <span className="font-display font-bold text-rw-crimson text-xl">{String(i + 1).padStart(2,"0")}</span>
                                    <span className="text-xs font-semibold text-rw-muted uppercase">{n.day}</span>
                                </div>
                                <h3 className="font-display font-bold text-rw-ink text-sm">{n.name}</h3>
                                <p className="text-xs text-rw-muted leading-relaxed line-clamp-3">{n.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── ABOUT / AIMS ────────────────────────────────────────────── */}
            <section className="bg-rw-bg-alt py-20 lg:py-28">
                <div className="section-container">
                    <div className="grid lg:grid-cols-2 gap-16 items-start">
                        <div>
                            <p className="eyebrow mb-3">Why We Gather</p>
                            <h2 className="section-heading text-3xl lg:text-4xl">The heart of Redemption Week</h2>
                            <p className="mt-4 text-rw-text-2 leading-relaxed">
                                The Redeemed Christian Fellowship, FUTA is one of the leading fellowships in the FUTA environs — shaping hearts and lives since 1983.
                            </p>
                            <div className="mt-8 grid grid-cols-2 gap-3">
                                <img src="https://placehold.co/340x220?text=Fellowship+1" alt="Fellowship moment" className="rounded-2xl object-cover w-full h-44" />
                                <img src="https://placehold.co/340x220?text=Fellowship+2" alt="Fellowship moment" className="rounded-2xl object-cover w-full h-44" />
                                <img src="https://placehold.co/700x300?text=Fellowship+Wide" alt="Fellowship wide" className="col-span-2 rounded-2xl object-cover w-full h-48" />
                            </div>
                        </div>
                        <ul className="flex flex-col gap-0">
                            {AIMS.map((a, i) => (
                                <li key={a.title} className="flex gap-5 py-6 border-b border-[var(--rw-border)] first:pt-0 last:border-0 last:pb-0">
                                    <span className="font-display font-bold text-3xl text-rw-crimson/20 w-10 shrink-0">{i + 1}</span>
                                    <div>
                                        <h3 className="font-semibold text-rw-ink text-lg">{a.title}</h3>
                                        <p className="mt-1.5 text-sm text-rw-muted leading-relaxed">{a.desc}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* ── MERCH PREVIEW ───────────────────────────────────────────── */}
            <section className="py-20 lg:py-28">
                <div className="section-container">
                    <div className="mb-12 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                        <div>
                            <p className="eyebrow mb-3">Official Merchandise</p>
                            <h2 className="section-heading text-3xl sm:text-4xl lg:text-5xl">Pre-order now</h2>
                            <p className="mt-3 text-rw-text-2">Ready for pickup during the Handing Over ceremony.</p>
                        </div>
                        <Link href="/shop" className="btn-secondary text-sm !h-11 !px-6">
                            View all items →
                        </Link>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {DEMO_PRODUCTS.map((p) => {
                            const colors = [...new Set(p.variants.filter(v => v.color).map(v => v.color!))];
                            const sizes  = [...new Set(p.variants.filter(v => v.size && v.size !== "One Size").map(v => v.size!))];
                            return (
                                <Link key={p.id} href="/shop" id={`merch-preview-${p.id}`} className="rw-card group flex flex-col overflow-hidden hover:-translate-y-1 hover:shadow-md transition-all">
                                    <img src={`https://placehold.co/400x320?text=${encodeURIComponent(p.name)}`} alt={p.name} className="h-52 w-full object-cover" />
                                    <div className="p-5 flex flex-col gap-3 flex-1">
                                        <h3 className="font-display font-bold text-rw-ink group-hover:text-rw-crimson transition-colors">{p.name}</h3>
                                        <p className="text-xs text-rw-muted line-clamp-2 flex-1">{p.description}</p>
                                        <div className="flex items-center justify-between pt-2 border-t border-[var(--rw-border)]">
                                            <span className="font-bold text-rw-crimson text-lg">₦{p.basePrice.toLocaleString()}</span>
                                            <span className="text-xs text-rw-muted">
                                                {colors.length > 1 && `${colors.length} colours`}
                                                {sizes.length > 0 && ` · ${sizes.length} sizes`}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ── GALLERY ─────────────────────────────────────────────────── */}
            <section className="bg-rw-bg-alt py-20 lg:py-28">
                <div className="section-container">
                    <div className="mb-10 flex items-end justify-between">
                        <div>
                            <p className="eyebrow mb-3">Gallery</p>
                            <h2 className="section-heading text-3xl sm:text-4xl">Moments from RCF FUTA</h2>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {Array.from({ length: 8 }, (_, i) => (
                            <img key={i} src={`https://placehold.co/${i % 3 === 0 ? '600x400' : '400x400'}?text=Photo+${i + 1}`} alt={`Gallery photo ${i + 1}`}
                                className={`rounded-2xl object-cover w-full ${i % 3 === 0 ? 'row-span-2 h-full' : 'h-52'}`}
                            />
                        ))}
                    </div>
                    <p className="mt-6 text-sm text-rw-muted">Event photos will appear here after each night.</p>
                </div>
            </section>

            {/* ── SPONSORS ────────────────────────────────────────────────── */}
            <section className="section-container py-20 lg:py-28">
                <div className="mb-12">
                    <p className="eyebrow mb-3">Support the Vision</p>
                    <h2 className="section-heading text-3xl sm:text-4xl lg:text-5xl">Sponsors &amp; Partners</h2>
                    <p className="mt-3 text-rw-text-2 max-w-[52ch]">
                        Partner with 38 years of impact. Reach 900+ students and alumni across a full week of events.
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {SPONSORS.map((s) => (
                        <div key={s.tier} className="rw-card p-6 flex flex-col gap-3 hover:border-rw-crimson/30 transition-colors">
                            <p className="font-display font-bold text-rw-ink text-lg">{s.tier}</p>
                            <p className="font-bold text-rw-crimson text-2xl">₦{s.amount.replace('₦','')}</p>
                            <p className="text-sm text-rw-muted leading-relaxed flex-1">{s.note}</p>
                        </div>
                    ))}
                </div>

                {/* Community partners */}
                <div className="mt-16">
                    <p className="eyebrow mb-6">Community Partners &amp; Student Businesses</p>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
                        {Array.from({ length: 6 }, (_, i) => (
                            <div key={i} className="rw-card h-20 rounded-xl flex items-center justify-center">
                                <img src={`https://placehold.co/100x50?text=Partner+${i + 1}`} alt={`Partner ${i + 1}`} className="h-8 w-auto object-contain opacity-60" />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-12 rw-card p-8 flex flex-col sm:flex-row sm:items-center gap-6 justify-between">
                    <div>
                        <p className="font-semibold text-rw-ink text-lg">Interested in sponsoring?</p>
                        <p className="text-sm text-rw-muted mt-1">
                            Aiyejagbara Tobi — 09031676421 ·{" "}
                            <a href="mailto:tobi4saviour2@gmail.com" className="text-rw-crimson hover:underline">tobi4saviour2@gmail.com</a>
                        </p>
                        <p className="text-sm text-rw-muted">
                            Olatona Ayobami — 09069948890 ·{" "}
                            <a href="mailto:ayobamioluwaseyi118@gmail.com" className="text-rw-crimson hover:underline">ayobamioluwaseyi118@gmail.com</a>
                        </p>
                    </div>
                    <a href="mailto:tobi4saviour2@gmail.com" className="btn-secondary shrink-0 !h-11 !px-6 text-sm">
                        Get in touch
                    </a>
                </div>
            </section>

            {/* ── CTA BANNER ──────────────────────────────────────────────── */}
            <section className="relative overflow-hidden">
                <img src="https://placehold.co/1920x600?text=CTA+Background" alt="" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-rw-ink/85" />
                <div className="section-container relative z-10 py-24 text-center">
                    <p className="eyebrow mb-5" style={{ color: "#f59e0b" }}>38th Redemption Week</p>
                    <h2 className="section-heading text-3xl sm:text-5xl lg:text-6xl text-white max-w-[20ch] mx-auto">
                        Let us make this the best yet.
                    </h2>
                    <p className="mt-5 text-white/60 max-w-[52ch] mx-auto leading-relaxed">
                        Just like birthdays and anniversaries, Redemption Week comes once every year — the most anticipated event every member looks forward to.
                    </p>
                    <div className="mt-10 flex flex-wrap gap-4 justify-center">
                        <Link href="/shop" id="cta-banner-shop" className="btn-primary !bg-white !text-rw-crimson hover:!bg-white/90">
                            Pre-order Merch
                        </Link>
                        <Link href="/fulfil" className="btn-secondary !border-white/30 !text-white hover:!bg-white/10">
                            Pay an Order
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
