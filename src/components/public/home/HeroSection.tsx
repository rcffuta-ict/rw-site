import Link from "next/link";
import { env } from "@/lib/env";
import { TENURE } from "@/lib/config";
import { CountdownTimer } from "@/components/public/CountdownTimer";
import { ph } from "@/lib/utils/functions";

// Night-by-night thumbnail images for the image strip
const NIGHT_THUMBS = [
    { label: "Opening Ceremony", bg: "fff0f0", fg: "FF0015" },
    { label: "Word Night",        bg: "f0f4ff", fg: "2255cc" },
    { label: "Power Night",       bg: "f5f0ff", fg: "7722cc" },
    { label: "Drama Night",       bg: "fff4f0", fg: "cc4400" },
    { label: "Choir Concert",     bg: "f0fff4", fg: "007733" },
    { label: "RIFE Night",        bg: "fffff0", fg: "887700" },
    { label: "Handing Over",      bg: "f0faf9", fg: "006655" },
];

export function HeroSection() {
    return (
        <section className="relative min-h-screen overflow-hidden flex items-center bg-white">
            {/* ── Full-bleed background image ───────────────────────────────── */}
            <img
                src={ph(1920, 1080, "Hero · Worship Night", "1C0003", "FF6A00")}
                alt="Redemption Week worship gathering"
                className="absolute inset-0 w-full h-full object-cover"
            />

            {/* ── Layered overlays — light mode: white washes the left, not the right ── */}
            {/* 1. Base soft dark over entire image so text is always legible */}
            <div className="absolute inset-0 bg-black/20" />
            {/* 2. Strong white sweep from left — clean light-mode hero content area */}
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/96 lg:via-white/90 xl:via-white/80 to-white/10" />
            {/* 3. Bottom feather into white page */}
            <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-white via-white/80 to-transparent" />
            {/* 4. Top-right brand accent glow */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#FF0015]/8 rounded-full blur-[100px] -translate-y-1/4 translate-x-1/4" />
            <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-[#FF6A00]/10 rounded-full blur-[80px]" />

            {/* ── Main content ──────────────────────────────────────────────── */}
            <div className="relative z-10 section-container py-24 lg:py-32 w-full">
                <div className="max-w-3xl stagger-children">

                    {/* Eyebrow badge */}
                    <div className="animate-fade-in-up">
                        <span className="inline-flex items-center gap-2.5 rounded-full border border-[#FF0015]/25
                                         bg-white/90 backdrop-blur-sm px-5 py-2 text-[11px] font-bold
                                         text-[#FF0015] tracking-[0.16em] uppercase shadow-sm">
                            <span className="h-2 w-2 rounded-full bg-[#FF0015] animate-pulse-soft" />
                            {TENURE.anniversaryLabel} · Redeemed Christian Fellowship, FUTA
                        </span>
                    </div>

                    {/* Main heading */}
                    <div className="animate-fade-in-up mt-7">
                        <h1
                            className="font-display font-extrabold leading-[0.88] tracking-tight text-[#1C0003]"
                            style={{ fontSize: "clamp(3.2rem, 9vw, 7.5rem)" }}
                        >
                            Redemption
                            <br />
                            <span
                                className="text-gradient-fire"
                                style={{ WebkitTextFillColor: "transparent" }}
                            >
                                Week &apos;{TENURE.year.slice(2)}
                            </span>
                        </h1>
                    </div>

                    {/* Theme subtitle */}
                    <div className="animate-fade-in-up mt-6 flex items-center gap-4">
                        <span className="crimson-line shrink-0" />
                        <p className="font-display italic text-lg sm:text-xl text-[#5c4048] leading-snug max-w-[40ch]">
                            &ldquo;{TENURE.theme}&rdquo;
                        </p>
                    </div>

                    {/* Meta pills */}
                    <div className="animate-fade-in-up mt-8 flex flex-wrap gap-2.5">
                        {[
                            {
                                label: TENURE.dateRange,
                                icon: <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />,
                            },
                            {
                                label: TENURE.venue,
                                icon: <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />,
                            },
                            {
                                label: "7 Nights of Faith",
                                icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />,
                            },
                        ].map(({ label, icon }) => (
                            <span
                                key={label}
                                className="inline-flex items-center gap-2 rounded-full border border-[#e8d0d4]
                                           bg-white/90 backdrop-blur-sm px-4 py-1.5 text-sm font-medium
                                           text-[#5c4048] shadow-sm"
                            >
                                <svg className="h-3.5 w-3.5 text-[#FF0015] shrink-0" fill="none"
                                    stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden>
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
                            <svg className="h-4 w-4" fill="none" stroke="currentColor"
                                strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                            </svg>
                        </Link>
                        <Link href="/fulfil" id="hero-pay-cta"
                            className="btn-secondary bg-white/90 backdrop-blur-sm">
                            Pay an Order
                        </Link>
                    </div>

                    {/* Countdown */}
                    <div className="animate-fade-in-up mt-14">
                        <p className="eyebrow mb-5">Counting down to RW&apos;{TENURE.year.slice(2)}</p>
                        <CountdownTimer targetDate={env.eventStartDate} />
                    </div>
                </div>
            </div>

            {/* ── Night thumbnails strip — right side, desktop only ────────── */}
            <div className="absolute right-0 top-0 bottom-0 w-[340px] xl:w-[400px] hidden lg:flex flex-col
                            justify-center gap-3 pr-8 xl:pr-14 z-10">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#9a8085] mb-2 pl-1">
                    7 Nights of Faith
                </p>
                {NIGHT_THUMBS.map((n, i) => (
                    <div
                        key={n.label}
                        className="group flex items-center gap-3 rounded-2xl bg-white/80 backdrop-blur-md
                                   border border-white/60 shadow-sm px-3 py-2.5 hover:bg-white hover:shadow-md
                                   transition-all duration-300 cursor-default"
                        style={{ animationDelay: `${i * 60}ms` }}
                    >
                        <div className="shrink-0 h-10 w-10 rounded-xl overflow-hidden">
                            <img
                                src={ph(80, 80, `${i + 1}`, n.bg, n.fg)}
                                alt={n.label}
                                className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[10px] font-bold text-[#FF0015] uppercase tracking-wider">
                                Night {String(i + 1).padStart(2, "0")}
                            </p>
                            <p className="text-[13px] font-semibold text-[#1C0003] truncate leading-tight mt-0.5">
                                {n.label}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Scroll indicator ──────────────────────────────────────────── */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 animate-bounce-subtle">
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#9a8085]">Scroll</span>
                <svg className="h-4 w-4 text-[#9a8085]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
            </div>
        </section>
    );
}
