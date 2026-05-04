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
    { value: "38", label: "Years" },
    { value: "9K+", label: "Alumni shaped" },
    { value: "900+", label: "Weekly members" },
    { value: "16", label: "Active units" },
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

function Placeholder({ className = "", label = "" }: { className?: string; label?: string }) {
    return (
        <div className={`img-placeholder relative ${className}`}>
            {label && <span className="relative z-10 text-[10px] font-bold tracking-widest text-rw-muted/50 uppercase">{label}</span>}
        </div>
    );
}

export default function LandingPage() {
    return (
        <div className="bg-rw-bg">
            {/* ── HERO ─────────────────────────────────────────────────────── */}
            <section className="section-container py-16 lg:py-24">
                <div className="grid lg:grid-cols-[1fr_420px] gap-12 items-center">
                    {/* Copy */}
                    <div className="flex flex-col gap-6 stagger-children">
                        <div className="animate-fade-in-up">
                            <span className="inline-block rounded-full border border-rw-crimson/30 bg-rw-crimson/6 px-3.5 py-1 text-xs font-semibold text-rw-crimson tracking-wide">
                                38th Anniversary · RCF FUTA
                            </span>
                        </div>

                        <div className="animate-fade-in-up">
                            <h1 className="section-heading text-5xl sm:text-6xl lg:text-[5.5rem] text-rw-ink">
                                Redemption<br />
                                Week <span className="text-rw-crimson">&apos;26</span>
                            </h1>
                            <p className="mt-4 text-lg sm:text-xl font-display italic text-rw-text-2 max-w-[36ch]">
                                The Lord&apos;s Witnesses: The Purified Army
                            </p>
                        </div>

                        <div className="animate-fade-in-up flex flex-wrap gap-2 text-sm text-rw-text-2">
                            <span className="flex items-center gap-1.5 rounded-lg border border-[var(--rw-border)] bg-rw-surface px-3 py-1.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-rw-crimson" />
                                July 6–12, 2026
                            </span>
                            <span className="flex items-center gap-1.5 rounded-lg border border-[var(--rw-border)] bg-rw-surface px-3 py-1.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-rw-orange" />
                                FUTA, Akure
                            </span>
                        </div>

                        <div className="animate-fade-in-up flex flex-wrap gap-3">
                            <Link
                                href="/shop"
                                id="hero-shop-cta"
                                className="inline-flex h-11 items-center rounded-xl bg-rw-crimson px-6 text-sm font-semibold text-white hover:bg-rw-crimson-dk transition-colors shadow-sm"
                            >
                                Shop Merch
                            </Link>
                            <Link
                                href="/fulfil"
                                id="hero-pay-cta"
                                className="inline-flex h-11 items-center rounded-xl border border-[var(--rw-border-mid)] px-6 text-sm font-semibold text-rw-ink hover:border-rw-crimson/40 transition-colors"
                            >
                                Pay an Order
                            </Link>
                        </div>

                        <div className="animate-fade-in-up">
                            <p className="eyebrow mb-3">Counting down to RW&apos;26</p>
                            <CountdownTimer targetDate={env.eventStartDate} />
                        </div>
                    </div>

                    {/* Hero image */}
                    <div className="animate-fade-in hidden lg:block">
                        <Placeholder className="h-[500px] w-full rounded-3xl shadow-md" label="Hero Image" />
                        <div className="mt-3 grid grid-cols-2 gap-3">
                            <Placeholder className="h-32 rounded-2xl" label="Event photo" />
                            <Placeholder className="h-32 rounded-2xl" label="Event photo" />
                        </div>
                    </div>
                </div>
            </section>

            {/* ── STATS ────────────────────────────────────────────────────── */}
            <section className="border-y border-[var(--rw-border)] bg-rw-bg-alt">
                <div className="section-container py-10">
                    <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-[var(--rw-border)]">
                        {STATS.map((s) => (
                            <div key={s.value} className="px-6 py-4 text-center first:pl-0 last:pr-0">
                                <div className="font-display font-bold text-4xl text-rw-crimson">{s.value}</div>
                                <div className="mt-1 text-xs text-rw-muted uppercase tracking-wider">{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── PROGRAMME ────────────────────────────────────────────────── */}
            <section className="section-container py-20">
                <div className="mb-10">
                    <p className="eyebrow mb-2">The Week</p>
                    <h2 className="section-heading text-3xl sm:text-4xl text-rw-ink">Seven nights of faith</h2>
                </div>

                {/* Desktop: editorial list */}
                <div className="hidden md:block">
                    {NIGHTS.map((n, i) => (
                        <div
                            key={n.day}
                            className="group flex items-start gap-8 py-6 border-b border-[var(--rw-border)] hover:bg-rw-bg-alt -mx-4 px-4 rounded-xl transition-colors"
                        >
                            <div className="flex flex-col items-center gap-0.5 shrink-0 w-14">
                                <span className="font-display font-bold text-2xl text-rw-crimson">{String(i + 1).padStart(2,"0")}</span>
                                <span className="text-xs font-semibold text-rw-muted uppercase">{n.day}</span>
                            </div>
                            <Placeholder className="h-20 w-28 shrink-0 rounded-xl" label="" />
                            <div className="flex-1 min-w-0">
                                <div className="flex items-baseline gap-3 flex-wrap">
                                    <h3 className="font-display font-bold text-lg text-rw-ink group-hover:text-rw-crimson transition-colors">{n.name}</h3>
                                    <span className="text-xs text-rw-muted">{n.unit}</span>
                                </div>
                                <p className="mt-1 text-sm text-rw-text-2 leading-relaxed max-w-[55ch]">{n.desc}</p>
                            </div>
                            <span className="text-rw-muted/40 group-hover:text-rw-crimson transition-colors text-xl shrink-0">→</span>
                        </div>
                    ))}
                </div>

                {/* Mobile: scroll cards */}
                <div className="md:hidden scroll-row -mx-6 px-6">
                    {NIGHTS.map((n, i) => (
                        <div key={n.day} className="rw-card shrink-0 w-64 p-4 flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                                <span className="font-display font-bold text-rw-crimson text-2xl">{String(i + 1).padStart(2,"0")}</span>
                                <span className="text-xs font-semibold text-rw-muted uppercase">{n.day}</span>
                            </div>
                            <Placeholder className="h-28 w-full rounded-xl" label="" />
                            <div>
                                <h3 className="font-display font-bold text-rw-ink text-sm">{n.name}</h3>
                                <p className="mt-1 text-xs text-rw-muted leading-relaxed line-clamp-3">{n.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── MERCH PREVIEW ────────────────────────────────────────────── */}
            <section className="bg-rw-bg-alt py-20">
                <div className="section-container">
                    <div className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
                        <div>
                            <p className="eyebrow mb-2">Official Merchandise</p>
                            <h2 className="section-heading text-3xl sm:text-4xl text-rw-ink">Pre-order now</h2>
                            <p className="mt-2 text-sm text-rw-muted">Ready for pickup during the Handing Over ceremony.</p>
                        </div>
                        <Link href="/shop" className="text-sm font-semibold text-rw-crimson hover:text-rw-crimson-dk shrink-0 transition-colors">
                            View all items →
                        </Link>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {DEMO_PRODUCTS.map((p) => {
                            const colors = [...new Set(p.variants.filter(v => v.color).map(v => v.color!))];
                            const sizes  = [...new Set(p.variants.filter(v => v.size && v.size !== "One Size").map(v => v.size!))];
                            return (
                                <Link
                                    key={p.id}
                                    href="/shop"
                                    id={`merch-preview-${p.id}`}
                                    className="rw-card group flex flex-col overflow-hidden hover:-translate-y-0.5 hover:shadow-md transition-all"
                                >
                                    <Placeholder className="h-44 w-full" label={p.name} />
                                    <div className="p-4 flex flex-col gap-2">
                                        <h3 className="font-display font-bold text-sm text-rw-ink group-hover:text-rw-crimson transition-colors">{p.name}</h3>
                                        <div className="flex items-center justify-between">
                                            <span className="font-bold text-rw-crimson">₦{p.basePrice.toLocaleString()}</span>
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

            {/* ── ABOUT / AIMS ─────────────────────────────────────────────── */}
            <section className="section-container py-20">
                <div className="grid lg:grid-cols-[360px_1fr] gap-16 items-start">
                    <div>
                        <p className="eyebrow mb-3">Why We Gather</p>
                        <h2 className="section-heading text-3xl text-rw-ink">The heart of Redemption Week</h2>
                        <p className="mt-4 text-sm text-rw-text-2 leading-relaxed">
                            The Redeemed Christian Fellowship, FUTA is one of the leading fellowships in the FUTA environs — shaping hearts and lives since 1983.
                        </p>
                        <div className="mt-6">
                            <Placeholder className="h-48 w-full rounded-2xl" label="About image" />
                        </div>
                    </div>
                    <ul className="flex flex-col divide-y divide-[var(--rw-border)]">
                        {AIMS.map((a, i) => (
                            <li key={a.title} className="flex gap-4 py-5 first:pt-0 last:pb-0">
                                <span className="font-display font-bold text-2xl text-rw-crimson/30 w-8 shrink-0 mt-0.5">{i + 1}</span>
                                <div>
                                    <h3 className="font-semibold text-rw-ink">{a.title}</h3>
                                    <p className="mt-1 text-sm text-rw-muted leading-relaxed">{a.desc}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* ── GALLERY ──────────────────────────────────────────────────── */}
            <section className="bg-rw-bg-alt py-16">
                <div className="section-container">
                    <p className="eyebrow mb-6">Gallery</p>
                    <div className="scroll-row -mx-6 px-6">
                        {Array.from({ length: 8 }, (_, i) => (
                            <Placeholder key={i} className="h-56 w-80 shrink-0 rounded-2xl" label={`Photo ${i + 1}`} />
                        ))}
                    </div>
                    <p className="mt-4 text-xs text-rw-muted">Event photos will appear here after each night.</p>
                </div>
            </section>

            {/* ── SPONSORS ─────────────────────────────────────────────────── */}
            <section className="section-container py-20">
                <div className="mb-10">
                    <p className="eyebrow mb-2">Support the Vision</p>
                    <h2 className="section-heading text-3xl sm:text-4xl text-rw-ink">Sponsors &amp; Partners</h2>
                    <p className="mt-2 text-sm text-rw-muted max-w-[50ch]">
                        Partner with 38 years of impact. Reach 900+ students and alumni across a full week of events.
                    </p>
                </div>

                <div className="grid gap-px bg-[var(--rw-border)] border border-[var(--rw-border)] rounded-2xl overflow-hidden sm:grid-cols-2 lg:grid-cols-4">
                    {SPONSORS.map((s) => (
                        <div key={s.tier} className="bg-rw-surface p-6 flex flex-col gap-2">
                            <p className="font-display font-bold text-rw-ink">{s.tier}</p>
                            <p className="font-bold text-rw-crimson text-xl">{s.amount}</p>
                            <p className="text-xs text-rw-muted leading-relaxed mt-1">{s.note}</p>
                        </div>
                    ))}
                </div>

                {/* Community partners */}
                <div className="mt-10">
                    <p className="eyebrow mb-4">Community Partners &amp; Student Businesses</p>
                    <div className="scroll-row">
                        {Array.from({ length: 6 }, (_, i) => (
                            <div
                                key={i}
                                className="rw-card shrink-0 h-16 w-32 rounded-xl flex items-center justify-center text-xs text-rw-muted font-medium"
                            >
                                Partner {i + 1}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-10 rw-card p-6 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                    <div>
                        <p className="font-semibold text-rw-ink">Interested in sponsoring?</p>
                        <p className="text-sm text-rw-muted mt-0.5">
                            Aiyejagbara Tobi — 09031676421 ·{" "}
                            <a href="mailto:tobi4saviour2@gmail.com" className="text-rw-crimson hover:underline">tobi4saviour2@gmail.com</a>
                        </p>
                        <p className="text-sm text-rw-muted">
                            Olatona Ayobami — 09069948890 ·{" "}
                            <a href="mailto:ayobamioluwaseyi118@gmail.com" className="text-rw-crimson hover:underline">ayobamioluwaseyi118@gmail.com</a>
                        </p>
                    </div>
                    <a
                        href="mailto:tobi4saviour2@gmail.com"
                        className="shrink-0 inline-flex h-10 items-center rounded-xl border border-rw-crimson/40 px-5 text-sm font-semibold text-rw-crimson hover:bg-rw-crimson/6 transition-colors"
                    >
                        Get in touch
                    </a>
                </div>
            </section>

            {/* ── CTA BANNER ───────────────────────────────────────────────── */}
            <section className="bg-rw-ink py-20">
                <div className="section-container text-center">
                    <p className="eyebrow mb-4" style={{ color: "#ff9100" }}>38th Redemption Week</p>
                    <h2 className="section-heading text-3xl sm:text-5xl text-white max-w-[18ch] mx-auto">
                        Let us make this the best yet.
                    </h2>
                    <p className="mt-4 text-sm text-white/60 max-w-[52ch] mx-auto leading-relaxed">
                        Just like birthdays and anniversaries, Redemption Week comes once every year — the most anticipated event every member looks forward to.
                    </p>
                    <div className="mt-8 flex flex-wrap gap-3 justify-center">
                        <Link
                            href="/shop"
                            id="cta-banner-shop"
                            className="inline-flex h-11 items-center rounded-xl bg-rw-crimson px-7 text-sm font-semibold text-white hover:bg-rw-red transition-colors shadow-sm"
                        >
                            Pre-order Merch
                        </Link>
                        <Link
                            href="/fulfil"
                            className="inline-flex h-11 items-center rounded-xl border border-white/20 px-7 text-sm font-semibold text-white hover:bg-white/8 transition-colors"
                        >
                            Pay an Order
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
