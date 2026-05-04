import Link from "next/link";
import { env } from "@/lib/env";
import { CountdownTimer } from "@/components/public/CountdownTimer";
import { DEMO_PRODUCTS, COLOR_HEX } from "@/lib/data/products";
import { SevenNightsSection } from "@/components/public/SevenNightsSection";

// ─── Data ─────────────────────────────────────────────────────────────────────

export const NIGHTS = [
    { day: "Mon", name: "Opening Ceremony",      unit: "All Units",                  desc: "A grand opening celebrating Nigerian cultures, 38 years of God's faithfulness, and the start of a glorious week." },
    { day: "Tue", name: "Word Night",             unit: "Bible Study Unit",           desc: "An evening of the undiluted Word. Hearts fed, faith built, doctrine grounded." },
    { day: "Wed", name: "Power Night",            unit: "Prayer Unit",                desc: "Impartations, healings, and activations. A reminder that RCFFUTA is a house of prayer." },
    { day: "Thu", name: "Drama Night — Acts '26", unit: "Drama Unit",                 desc: "A rollercoaster of emotion and revival through powerful on-stage storytelling." },
    { day: "Fri", name: "Choir Concert",          unit: "Choir Unit",                 desc: "Dance like David danced. A night of praise, worship, and glorious melodies." },
    { day: "Sat", name: "RIFE & Alumni Reunion",  unit: "Alumni Relations + Welfare", desc: "Alumni come home. Knowledge passed down, final-years inducted, bonds formed over food and stories." },
    { day: "Sun", name: "Handing Over",           unit: "All Units",                  desc: "The mantle passes. Elijah to Elisha. A joyful finale as new leaders are commissioned." },
];

const STATS = [
    { value: "38",   label: "Years of Impact",   sub: "Est. 1983" },
    { value: "9K+",  label: "Alumni Shaped",      sub: "& Counting" },
    { value: "900+", label: "Weekly Members",     sub: "Active Students" },
    { value: "16",   label: "Active Units",       sub: "Diverse Gifts" },
];

const AIMS = [
    { n: "01", title: "Spiritual Growth",       desc: "Word, Prayer, Drama, and Worship — hearts stirred, lives transformed, faith deepened." },
    { n: "02", title: "Alumni Legacy",          desc: "Reconnecting generations. Preserving 38 years of fellowship heritage." },
    { n: "03", title: "Meaningful Connection",  desc: "Relationships built on shared values — mentorship, partnership, lifelong friendship." },
    { n: "04", title: "Family & Belonging",     desc: "A spiritual family joined by the blood of Christ. No unit, tribe, or worker left out." },
    { n: "05", title: "Cultural Unity",         desc: "Celebrating the richness of diversity — one in language, art, attire, and Christ." },
];

const SPONSORS = [
    { tier: "Diamond", amount: "₦1,000,000", perks: ["All-week logo placement", "Daily exhibition booth", "20s video ad daily", "Vocal mentions nightly"] },
    { tier: "Gold",    amount: "₦750,000",   perks: ["All-week logo placement", "Booth × 4 days", "Video ads × 4 days"] },
    { tier: "Silver",  amount: "₦500,000",   perks: ["All-week logo placement", "Booth × 3 days", "Video × 3 days"] },
    { tier: "Bronze",  amount: "₦250,000",   perks: ["Logo × 2 days", "Booth × 2 days", "Image ads daily"] },
];

// ─── Helper ───────────────────────────────────────────────────────────────────

function ph(w: number, h: number, label = "") {
    const text = encodeURIComponent(label ? `${label}\n${w}×${h}` : `${w}×${h}`);
    return `https://placehold.co/${w}x${h}/f3f4f6/9ca3af?text=${text}`;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
    return (
        <div className="bg-white overflow-x-hidden">

            {/* ── HERO ─────────────────────────────────────────────────────── */}
            <section className="relative min-h-screen overflow-hidden flex items-center">
                {/* Full-bleed background image */}
                <img
                    src={ph(1920, 1080, "Hero · 1920×1080")}
                    alt="Redemption Week background"
                    className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Layered overlays — keeps it immersive but legible */}
                {/* 1. Dark vignette across the whole image */}
                <div className="absolute inset-0 bg-black/30" />
                {/* 2. Strong white fade on the left for text readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 lg:via-white/80 to-transparent" />
                {/* 3. Soft bottom fade to match the rest of the page */}
                <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white to-transparent" />
                {/* 4. Crimson fire accent — top-right glow */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-rw-crimson/10 rounded-full blur-3xl" />

                {/* Content */}
                <div className="relative z-10 section-container py-28 lg:py-32 w-full">
                    <div className="max-w-2xl stagger-children">

                        {/* Eyebrow badge */}
                        <div className="animate-fade-in-up">
                            <span className="inline-flex items-center gap-2.5 rounded-full border border-rw-crimson/30 bg-white/80 backdrop-blur-sm px-5 py-2 text-[11px] font-bold text-rw-crimson tracking-[0.14em] uppercase shadow-sm">
                                <span className="h-2 w-2 rounded-full bg-rw-crimson animate-pulse-soft" />
                                38th Anniversary · Redeemed Christian Fellowship, FUTA
                            </span>
                        </div>

                        {/* Main heading — very large, editorial */}
                        <div className="animate-fade-in-up mt-8">
                            <h1 className="section-heading leading-[0.9]" style={{ fontSize: "clamp(3.5rem, 9vw, 7.5rem)" }}>
                                Redemption<br />
                                <span className="text-rw-crimson">Week &apos;26</span>
                            </h1>
                        </div>

                        {/* Theme subtitle */}
                        <div className="animate-fade-in-up mt-6 flex items-center gap-4">
                            <span className="crimson-line shrink-0" />
                            <p className="font-display italic text-xl sm:text-2xl text-rw-text-2 leading-snug">
                                The Lord&apos;s Witnesses: The Purified Army
                            </p>
                        </div>

                        {/* Meta pills */}
                        <div className="animate-fade-in-up mt-8 flex flex-wrap gap-3">
                            {[
                                {
                                    label: "July 6–12, 2026",
                                    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />,
                                },
                                {
                                    label: "FUTA Main Campus, Akure",
                                    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />,
                                },
                                {
                                    label: "7 Nights of Faith",
                                    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />,
                                },
                            ].map(({ label, icon }) => (
                                <span key={label} className="inline-flex items-center gap-2 rounded-full border border-[var(--rw-border)] bg-white/80 backdrop-blur-sm px-4 py-2 text-sm font-medium text-rw-text-2 shadow-sm">
                                    <svg className="h-3.5 w-3.5 text-rw-crimson shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                        {icon}
                                    </svg>
                                    {label}
                                </span>
                            ))}
                        </div>

                        {/* CTA buttons */}
                        <div className="animate-fade-in-up mt-10 flex flex-wrap gap-4">
                            <Link href="/shop" id="hero-shop-cta" className="btn-primary shadow-lg">
                                Pre-order Merch
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                                </svg>
                            </Link>
                            <Link href="/fulfil" id="hero-pay-cta" className="btn-secondary bg-white/80 backdrop-blur-sm shadow-sm">
                                Pay an Order
                            </Link>
                        </div>

                        {/* Countdown */}
                        <div className="animate-fade-in-up mt-14">
                            <p className="eyebrow mb-5">Counting down to RW&apos;26</p>
                            <CountdownTimer targetDate={env.eventStartDate} />
                        </div>
                    </div>
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 animate-bounce-subtle">
                    <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-rw-muted">Scroll</span>
                    <svg className="h-4 w-4 text-rw-muted" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                </div>
            </section>


            {/* ── STATS BAND ───────────────────────────────────────────────── */}
            <section className="bg-rw-ink text-white section-py">
                <div className="section-container">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 lg:divide-x lg:divide-white/10">
                        {STATS.map((s, i) => (
                            <div key={s.label} className="flex flex-col items-center text-center lg:px-8 animate-number-up" style={{ animationDelay: `${i * 100}ms` }}>
                                <span className="font-display font-bold text-5xl sm:text-6xl text-rw-crimson leading-none">
                                    {s.value}
                                </span>
                                <span className="mt-2 text-sm font-semibold text-white">{s.label}</span>
                                <span className="mt-0.5 text-xs text-white/40">{s.sub}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── IMAGE MARQUEE ─────────────────────────────────────────────── */}
            <div className="overflow-hidden border-b border-[var(--rw-border)] bg-rw-bg-alt">
                <div className="animate-marquee gap-3 py-3">
                    {Array.from({ length: 16 }, (_, i) => (
                        <img
                            key={i}
                            src={`https://placehold.co/360x220/f0f0f0/c0c0c0?text=Event+${(i % 8) + 1}%0A360×220`}
                            alt={`Event moment ${(i % 8) + 1}`}
                            className="h-48 w-auto object-cover rounded-xl flex-shrink-0"
                        />
                    ))}
                </div>
            </div>

            {/* ── SEVEN NIGHTS ──────────────────────────────────────────────── */}
            <SevenNightsSection nights={NIGHTS} />

            {/* ── DIVIDER ───────────────────────────────────────────────────── */}
            <div className="section-container"><div className="section-divider" /></div>

            {/* ── ABOUT ─────────────────────────────────────────────────────── */}
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

            {/* ── MERCH PREVIEW ─────────────────────────────────────────────── */}
            <section className="bg-rw-bg-alt section-py">
                <div className="section-container">
                    <div className="mb-14 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
                        <div>
                            <p className="eyebrow mb-4">Official Merchandise</p>
                            <h2 className="section-heading text-3xl sm:text-4xl lg:text-5xl">Pre-order now</h2>
                            <p className="mt-3 text-rw-text-2 text-lg">Ready for pickup during the Handing Over ceremony.</p>
                        </div>
                        <Link href="/shop" className="btn-secondary shrink-0 !h-11 !px-6 text-sm">
                            View all items →
                        </Link>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {DEMO_PRODUCTS.map((p) => {
                            const colors = [...new Set(p.variants.filter(v => v.color).map(v => v.color!))];
                            return (
                                <Link
                                    key={p.id}
                                    href="/shop"
                                    id={`merch-preview-${p.id}`}
                                    className="rw-card group flex flex-col overflow-hidden hover:-translate-y-1.5"
                                >
                                    <div className="relative overflow-hidden bg-rw-bg-alt">
                                        <img
                                            src={`https://placehold.co/400x480/f3f4f6/9ca3af?text=${encodeURIComponent(p.name)}%0A400×480`}
                                            alt={p.name}
                                            className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            style={{ aspectRatio: "5/6" }}
                                        />
                                        <div className="absolute top-3 left-3 flex gap-1.5">
                                            {colors.slice(0, 4).map(c => (
                                                <span key={c} className="h-4 w-4 rounded-full border-2 border-white shadow-sm" style={{ background: COLOR_HEX[c] ?? "#888" }} title={c} />
                                            ))}
                                        </div>
                                    </div>
                                    <div className="p-5 flex flex-col gap-2 flex-1">
                                        <h3 className="font-display font-bold text-rw-ink group-hover:text-rw-crimson transition-colors">
                                            {p.name}
                                        </h3>
                                        <p className="text-xs text-rw-muted line-clamp-2 flex-1">{p.description}</p>
                                        <div className="flex items-center justify-between pt-3 border-t border-[var(--rw-border)] mt-1">
                                            <span className="font-bold text-rw-crimson text-lg">₦{p.basePrice.toLocaleString()}</span>
                                            <span className="text-xs text-rw-muted font-medium">
                                                {colors.length > 1 ? `${colors.length} colours` : ""}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ── GALLERY ───────────────────────────────────────────────────── */}
            <section className="section-py">
                <div className="section-container">
                    <div className="mb-12 flex items-end justify-between">
                        <div>
                            <p className="eyebrow mb-4">Gallery</p>
                            <h2 className="section-heading text-3xl sm:text-4xl">Moments from RCF FUTA</h2>
                        </div>
                        <p className="text-sm text-rw-muted hidden sm:block">Photos will appear after each night</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 auto-rows-[180px]">
                        {[
                            { w: 600, h: 380, span: "col-span-2 row-span-2" },
                            { w: 400, h: 180, span: "" },
                            { w: 400, h: 180, span: "" },
                            { w: 400, h: 180, span: "" },
                            { w: 400, h: 180, span: "" },
                            { w: 400, h: 380, span: "row-span-2" },
                            { w: 400, h: 180, span: "" },
                            { w: 800, h: 180, span: "col-span-2" },
                        ].map(({ w, h, span }, i) => (
                            <div key={i} className={`${span} overflow-hidden rounded-2xl bg-rw-bg-alt hover-lift`}>
                                <img
                                    src={`https://placehold.co/${w}x${h}/ebebeb/aaaaaa?text=Photo+${i + 1}%0A${w}×${h}`}
                                    alt={`Gallery photo ${i + 1}`}
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── SPONSORS ──────────────────────────────────────────────────── */}
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

            {/* ── CTA BANNER ────────────────────────────────────────────────── */}
            <section className="relative overflow-hidden bg-rw-ink">
                <img
                    src={ph(1920, 640, "CTA Background")}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover opacity-20"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-rw-crimson/30 via-transparent to-rw-ink/50" />
                <div className="section-container relative z-10 section-py text-center">
                    <p className="eyebrow mb-5" style={{ color: "#f59e0b" }}>38th Redemption Week</p>
                    <h2 className="section-heading text-4xl sm:text-5xl lg:text-6xl text-white max-w-[22ch] mx-auto leading-tight">
                        Let us make this the best yet.
                    </h2>
                    <p className="mt-6 text-white/60 max-w-[50ch] mx-auto leading-relaxed text-lg">
                        Just like birthdays and anniversaries, Redemption Week comes once every year —
                        the most anticipated event every member looks forward to.
                    </p>
                    <div className="mt-12 flex flex-wrap gap-4 justify-center">
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
