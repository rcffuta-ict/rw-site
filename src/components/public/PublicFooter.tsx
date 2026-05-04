import Link from "next/link";

// ─── Data ─────────────────────────────────────────────────────────────────────

const PROGRAMME = [
    { day: "Mon", label: "Opening Ceremony" },
    { day: "Tue", label: "Word Night" },
    { day: "Wed", label: "Power Night" },
    { day: "Thu", label: "Drama Night — Acts '26" },
    { day: "Fri", label: "Choir Concert" },
    { day: "Sat", label: "RIFE & Alumni Reunion" },
    { day: "Sun", label: "Handing Over Ceremony" },
];

const QUICK_LINKS = [
    { href: "/",        label: "Home" },
    { href: "/shop",    label: "Shop Merch" },
    { href: "/fulfil",  label: "Pay an Order" },
    { href: "/checkout",label: "Checkout" },
    { href: "/admin",   label: "Admin Dashboard" },
];

const SOCIAL_LINKS = [
    {
        label: "Instagram",
        href: "#",
        icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
            </svg>
        ),
    },
    {
        label: "X / Twitter",
        href: "#",
        icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
        ),
    },
    {
        label: "WhatsApp",
        href: "#",
        icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
        ),
    },
];

const FELLOWSHIP_FACTS = [
    { label: "Founded", value: "1983" },
    { label: "Alumni", value: "9,000+" },
    { label: "Members", value: "900+" },
    { label: "Units", value: "16" },
];

// ─── Component ─────────────────────────────────────────────────────────────────

export function PublicFooter() {
    return (
        <footer className="bg-rw-ink text-white">

            {/* ── Top brand band ─────────────────────────────────────────────── */}
            <div className="border-b border-white/8">
                <div className="section-container py-10 flex flex-wrap items-center justify-between gap-6">
                    {/* Identity */}
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-rw-crimson/20 border border-rw-crimson/30 flex items-center justify-center shrink-0">
                            <img
                                src="https://placehold.co/48x48/1a1a1a/c41230?text=R"
                                alt="RCF FUTA"
                                className="h-8 w-8 object-contain"
                            />
                        </div>
                        <div>
                            <p className="font-display font-bold text-lg text-white leading-tight">
                                Redemption Week <span className="text-rw-crimson">&apos;26</span>
                            </p>
                            <p className="text-xs text-white/40 font-medium tracking-wide mt-0.5">
                                38th Anniversary · RCF FUTA · rw.rcffuta.com
                            </p>
                        </div>
                    </div>

                    {/* Organisation logos */}
                    <div className="flex items-center gap-6 sm:gap-10">
                        {[
                            { src: "https://placehold.co/120x48/1a1a1a/555555?text=RCFFUTA", alt: "RCF FUTA" },
                            { src: "https://placehold.co/120x48/1a1a1a/555555?text=CRM", alt: "Christ the Redeemers' Ministries" },
                        ].map(logo => (
                            <img
                                key={logo.alt}
                                src={logo.src}
                                alt={logo.alt}
                                className="h-10 w-auto object-contain opacity-40 hover:opacity-80 transition-opacity duration-300"
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Main footer columns ────────────────────────────────────────── */}
            <div className="section-container py-20">
                <div className="grid gap-14 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr]">

                    {/* Col 1 — About */}
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/30 mb-5">About</p>
                        <p className="text-sm text-white/60 leading-relaxed max-w-[38ch]">
                            The Redeemed Christian Fellowship, Federal University of Technology,
                            Akure (RCFFUTA) is one of the leading fellowships in the FUTA environs.
                            Standing strong in faith, values, and purpose since 1983.
                        </p>
                        <p className="mt-4 text-sm text-white/30 italic">
                            &ldquo;A place where good things never cease.&rdquo;
                        </p>

                        {/* Fellowship facts */}
                        <div className="mt-8 grid grid-cols-2 gap-4">
                            {FELLOWSHIP_FACTS.map(f => (
                                <div key={f.label} className="border border-white/8 rounded-xl p-3">
                                    <p className="font-display font-bold text-xl text-rw-crimson">{f.value}</p>
                                    <p className="text-[11px] text-white/40 font-medium mt-0.5">{f.label}</p>
                                </div>
                            ))}
                        </div>

                        {/* Social links */}
                        <div className="mt-8 flex items-center gap-3">
                            {SOCIAL_LINKS.map(s => (
                                <a
                                    key={s.label}
                                    href={s.href}
                                    aria-label={s.label}
                                    className="h-10 w-10 rounded-xl border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 hover:bg-white/5 transition-all duration-200"
                                >
                                    {s.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Col 2 — Programme */}
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/30 mb-5">Programme</p>
                        <ul className="flex flex-col gap-0">
                            {PROGRAMME.map((n, i) => (
                                <li key={n.day} className="flex items-start gap-3 py-3 border-b border-white/5 last:border-0">
                                    <div className="flex flex-col items-center gap-0.5 shrink-0 w-8 mt-0.5">
                                        <span className="font-display font-bold text-[11px] text-rw-crimson">
                                            {String(i + 1).padStart(2, "0")}
                                        </span>
                                        <span className="text-[9px] text-white/30 font-bold uppercase tracking-wider">
                                            {n.day}
                                        </span>
                                    </div>
                                    <span className="text-sm text-white/60 leading-tight">{n.label}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Col 3 — Navigate */}
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/30 mb-5">Navigate</p>
                        <ul className="flex flex-col gap-3">
                            {QUICK_LINKS.map(l => (
                                <li key={l.href}>
                                    <Link
                                        href={l.href}
                                        className="group flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors duration-200"
                                    >
                                        <span className="h-px w-3 bg-rw-crimson/40 group-hover:w-5 group-hover:bg-rw-crimson transition-all duration-300" />
                                        {l.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Col 4 — Sponsorship */}
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/30 mb-5">Sponsorship</p>
                        <p className="text-sm text-white/50 leading-relaxed mb-6">
                            Partner with 38 years of impact. Reach 900+ students and alumni across a full week of events.
                        </p>

                        {/* Tier pills */}
                        <div className="flex flex-col gap-2 mb-7">
                            {[
                                { tier: "Diamond", amount: "₦1,000,000" },
                                { tier: "Gold",    amount: "₦750,000" },
                                { tier: "Silver",  amount: "₦500,000" },
                                { tier: "Bronze",  amount: "₦250,000" },
                            ].map(s => (
                                <div key={s.tier} className="flex items-center justify-between py-2 border-b border-white/5 text-xs">
                                    <span className="text-white/40 font-medium">{s.tier}</span>
                                    <span className="text-white/70 font-semibold tabular-nums">{s.amount}</span>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col gap-3">
                            <p className="text-[11px] text-white/30 font-bold uppercase tracking-wider">Contact</p>
                            <a href="mailto:tobi4saviour2@gmail.com" className="text-sm text-rw-crimson hover:text-white transition-colors block">
                                tobi4saviour2@gmail.com
                            </a>
                            <a href="mailto:ayobamioluwaseyi118@gmail.com" className="text-sm text-rw-crimson hover:text-white transition-colors block">
                                ayobamioluwaseyi118@gmail.com
                            </a>
                            <div className="flex flex-col gap-1 mt-1">
                                <span className="text-xs text-white/30">09031676421 · Aiyejagbara Tobi</span>
                                <span className="text-xs text-white/30">09069948890 · Olatona Ayobami</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Conclusion quote band ──────────────────────────────────────── */}
            <div className="border-t border-white/5 bg-white/[0.02]">
                <div className="section-container py-10">
                    <p className="text-sm text-white/35 text-center leading-relaxed max-w-[64ch] mx-auto">
                        &ldquo;Just like birthdays and anniversaries, Redemption Week comes once every year and is
                        the most anticipated event every member looks forward to. Join us in weaving together the
                        story of 38 years of God&apos;s faithfulness.&rdquo;
                    </p>
                </div>
            </div>

            {/* ── Bottom bar ─────────────────────────────────────────────────── */}
            <div className="border-t border-white/5">
                <div className="section-container py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <span className="text-xs text-white/20">
                        &copy; 2026 Redeemed Christian Fellowship, FUTA · All rights reserved
                    </span>
                    <div className="flex items-center gap-4">
                        <span className="text-xs text-white/20">
                            Built by the RCF FUTA ICT Unit
                        </span>
                        <span className="h-3 w-px bg-white/10" />
                        <a href="https://rcffuta.com" target="_blank" rel="noreferrer" className="text-xs text-white/20 hover:text-white/50 transition-colors">
                            rcffuta.com
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
