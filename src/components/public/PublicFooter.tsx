import Link from "next/link";
import { Identity } from "../ui/Identity";

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
    { href: "/", label: "Home" },
    { href: "/shop", label: "Shop Merch" },
    { href: "/fulfil", label: "Pay an Order" },
    { href: "/checkout", label: "Checkout" },
    { href: "/admin", label: "Admin Dashboard" },
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
        label: "Facebook",
        href: "#",
        icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z" />
            </svg>
        ),
    },
    {
        label: "Threads",
        href: "#",
        icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.964-.065-1.19.408-2.285 1.33-3.082.88-.76 2.119-1.207 3.583-1.291a13.853 13.853 0 0 1 3.02.142c-.126-.742-.375-1.332-.75-1.757-.513-.586-1.308-.883-2.359-.89h-.029c-.844 0-1.992.232-2.721 1.32L7.734 7.847c.98-1.454 2.568-2.256 4.478-2.256h.044c3.194.02 5.097 1.975 5.287 5.388.108.046.216.094.321.142 1.49.7 2.58 1.761 3.154 3.07.797 1.82.871 4.79-1.548 7.158-1.85 1.81-4.094 2.628-7.277 2.65Zm1.003-11.69c-.242 0-.487.007-.739.021-1.836.103-2.98.946-2.916 2.143.067 1.256 1.452 1.839 2.784 1.767 1.224-.065 2.818-.543 3.086-3.71a10.5 10.5 0 0 0-2.215-.221z" />
            </svg>
        ),
    },
    {
        label: "Telegram",
        href: "#",
        icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
            </svg>
        ),
    },
    {
        label: "YouTube",
        href: "#",
        icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
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
            <div className="border-b border-white/8 py-6 lg:py-3">
                <div className="section-container py-10 lg:py-14 flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-8 text-center lg:text-left">
                    {/* Identity */}
                    <Identity dark className="justify-center lg:justify-start" />

                    {/* Organisation logos */}
                    <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 lg:gap-12 opacity-40">
                        {[
                            {
                                src: "/images/logos/rcf-futa.jpeg",
                                alt: "RCF FUTA",
                            },
                            {
                                src: "/images/logos/crm.png",
                                alt: "Christ the Redeemers' Ministries",
                            },
                            {
                                src: "/images/logos/rccg.png",
                                alt: "Redeemed Christian Church of God",
                            },
                        ].map((logo) => (
                            <img
                                key={logo.alt}
                                src={logo.src}
                                alt={logo.alt}
                                className="h-10 sm:h-12 w-auto object-contain hover:opacity-100 transition-opacity duration-300 filter grayscale brightness-200 lg:grayscale-0 lg:brightness-100"
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Main footer columns ────────────────────────────────────────── */}
            <div className="section-container py-6 lg:py-28">
                <div className="grid gap-12 lg:gap-16 xl:gap-20 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] py-6 lg:py-3">
                    {/* Col 1 — About */}
                    <div className="text-center sm:text-left">
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/30 mb-6">
                            About
                        </p>
                        <p className="text-sm text-white/60 leading-relaxed max-w-[38ch] mx-auto sm:mx-0">
                            The Redeemed Christian Fellowship, Federal University of
                            Technology, Akure (RCFFUTA) is one of the leading fellowships
                            in the FUTA environs. Standing strong in faith, values, and
                            purpose since 1983.
                        </p>
                        <p className="mt-5 text-sm text-white/30 italic">
                            &ldquo;A place where good things never cease.&rdquo;
                        </p>

                        {/* Fellowship facts */}
                        <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-5">
                            {FELLOWSHIP_FACTS.map((f) => (
                                <div
                                    key={f.label}
                                    className="border border-white/8 rounded-xl p-4 transition-colors hover:bg-white/5"
                                >
                                    <p className="font-display font-bold text-2xl text-rw-crimson">
                                        {f.value}
                                    </p>
                                    <p className="text-[11px] text-white/40 font-medium mt-1">
                                        {f.label}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Social links */}
                        <div className="mt-10 flex items-center justify-center sm:justify-start gap-4">
                            {SOCIAL_LINKS.map((s) => (
                                <a
                                    key={s.label}
                                    href={s.href}
                                    aria-label={s.label}
                                    className="h-11 w-11 rounded-xl border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 hover:bg-white/5 transition-all duration-200"
                                >
                                    {s.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Col 2 — Programme */}
                    <div className="text-center sm:text-left">
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/30 mb-6">
                            Programme
                        </p>
                        <ul className="flex flex-col gap-1 max-w-[280px] mx-auto sm:mx-0">
                            {PROGRAMME.map((n, i) => (
                                <li
                                    key={n.day}
                                    className="flex items-start gap-4 py-3 border-b border-white/5 last:border-0"
                                >
                                    <div className="flex flex-col items-center gap-1 shrink-0 w-8 mt-0.5">
                                        <span className="font-display font-bold text-[11px] text-rw-crimson">
                                            {String(i + 1).padStart(2, "0")}
                                        </span>
                                        <span className="text-[9px] text-white/30 font-bold uppercase tracking-wider">
                                            {n.day}
                                        </span>
                                    </div>
                                    <span className="text-sm text-white/60 leading-tight">
                                        {n.label}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Col 3 — Navigate */}
                    <div className="text-center sm:text-left">
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/30 mb-6">
                            Navigate
                        </p>
                        <ul className="flex flex-col gap-4">
                            {QUICK_LINKS.map((l) => (
                                <li key={l.href}>
                                    <Link
                                        href={l.href}
                                        className="group flex items-center justify-center sm:justify-start gap-3 text-sm text-white/50 hover:text-white transition-colors duration-200"
                                    >
                                        <span className="h-px w-3 bg-rw-crimson/40 group-hover:w-5 group-hover:bg-rw-crimson transition-all duration-300" />
                                        {l.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Col 4 — Sponsorship */}
                    <div className="text-center sm:text-left">
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/30 mb-6">
                            Sponsorship
                        </p>
                        <p className="text-sm text-white/50 leading-relaxed mb-8 mx-auto sm:mx-0">
                            Partner with 38 years of impact. Reach 900+ students and
                            alumni across a full week of events.
                        </p>

                        {/* Tier pills */}
                        <div className="flex flex-col gap-3 mb-9">
                            {[
                                { tier: "Diamond", amount: "₦1,000,000" },
                                { tier: "Gold", amount: "₦750,000" },
                                { tier: "Silver", amount: "₦500,000" },
                                { tier: "Bronze", amount: "₦250,000" },
                            ].map((s) => (
                                <div
                                    key={s.tier}
                                    className="flex items-center justify-between py-2 border-b border-white/5 text-xs"
                                >
                                    <span className="text-white/40 font-medium">
                                        {s.tier}
                                    </span>
                                    <span className="text-white/70 font-semibold tabular-nums">
                                        {s.amount}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col gap-4">
                            <p className="text-[11px] text-white/30 font-bold uppercase tracking-wider">
                                Contact
                            </p>
                            <a
                                href="mailto:tobi4saviour2@gmail.com"
                                className="text-sm text-rw-crimson hover:text-white transition-colors block"
                            >
                                tobi4saviour2@gmail.com
                            </a>
                            <a
                                href="mailto:ayobamioluwaseyi118@gmail.com"
                                className="text-sm text-rw-crimson hover:text-white transition-colors block"
                            >
                                ayobamioluwaseyi118@gmail.com
                            </a>
                            <div className="flex flex-col gap-2 mt-2">
                                <span className="text-xs text-white/30">
                                    09031676421 · Aiyejagbara Oluwatobi
                                </span>
                                <span className="text-xs text-white/30">
                                    09069948890 · Olatona Ayobami
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Bottom bar ─────────────────────────────────────────────────── */}
            <div className="border-t border-white/5 py-6 lg:py-3">
                <div className="section-container py-8 flex flex-col lg:flex-row items-center justify-between gap-6 text-center lg:text-left">
                    <span className="text-xs text-white/20">
                        &copy; 2026 Redeemed Christian Fellowship, FUTA Chapter · All
                        rights reserved
                    </span>
                    <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                        <span className="text-xs text-white/20">
                            Powered by the RCF FUTA ICT Unit
                        </span>
                        <span className="hidden sm:block h-3 w-px bg-white/10" />
                        <a
                            href="https://rcffuta.com"
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-white/20 hover:text-white/50 transition-colors"
                        >
                            rcffuta.com
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
