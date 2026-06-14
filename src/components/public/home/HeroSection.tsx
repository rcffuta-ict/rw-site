"use client";

import Link from "next/link";
import { env } from "@/lib/env";
import { TENURE, LOGOS } from "@/lib/config";
import { CountdownTimer } from "@/components/public/CountdownTimer";
import { SiteImage } from "@/components/ui/SiteImage";
import { useEffect, useRef, useState } from "react";

const NIGHT_ITEMS = [
    { label: "Opening Ceremony", day: "MON", n: "01", color: "#FF0015" },
    { label: "Word Night", day: "TUE", n: "02", color: "#FF6A00" },
    { label: "Power Night", day: "WED", n: "03", color: "#FF0015" },
    { label: "Drama Night", day: "THU", n: "04", color: "#FF6A00" },
    { label: "Choir Concert", day: "FRI", n: "05", color: "#FF0015" },
    { label: "RIFE Night", day: "SAT", n: "06", color: "#FF6A00" },
    { label: "Handing Over", day: "SUN", n: "07", color: "#FF0015" },
];

export function HeroSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const [mounted, setMounted] = useState(false);

    // setMounted deferred to avoid synchronous setState inside effect
    useEffect(() => {
        const t = setTimeout(() => setMounted(true), 0);
        return () => clearTimeout(t);
    }, []);

    useEffect(() => {
        const el = sectionRef.current;
        if (!el) return;
        const handler = (e: MouseEvent) => {
            const rect = el.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            el.style.setProperty("--mx", `${x}%`);
            el.style.setProperty("--my", `${y}%`);
        };
        window.addEventListener("mousemove", handler);
        return () => window.removeEventListener("mousemove", handler);
    }, []);

    return (
        <>
            <style>{`
                .hero-root {
                    --mx: 55%;
                    --my: 45%;
                }

                /* ── grain overlay ─────────────────────────────────── */
                .hero-grain::after {
                    content: "";
                    position: absolute;
                    inset: 0;
                    pointer-events: none;
                    z-index: 4;
                    opacity: 0.035;
                    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
                    background-size: 180px 180px;
                }

                /* ── gradient masks ────────────────────────────────── */
                .hero-gradient-left {
                    background: linear-gradient(
                        105deg,
                        rgba(10,0,2,0.97) 0%,
                        rgba(10,0,2,0.92) 30%,
                        rgba(10,0,2,0.72) 55%,
                        rgba(10,0,2,0.18) 78%,
                        transparent 100%
                    );
                }
                @media (max-width: 639px) {
                    .hero-gradient-left {
                        background: linear-gradient(
                            to bottom,
                            rgba(10,0,2,0.82) 0%,
                            rgba(10,0,2,0.65) 40%,
                            rgba(10,0,2,0.88) 100%
                        );
                    }
                }
                .hero-gradient-bottom {
                    background: linear-gradient(
                        to top,
                        rgba(10,0,2,1) 0%,
                        rgba(10,0,2,0.6) 25%,
                        transparent 55%
                    );
                }
                .hero-gradient-top {
                    background: linear-gradient(
                        to bottom,
                        rgba(10,0,2,0.55) 0%,
                        transparent 40%
                    );
                }

                /* ── mouse glow ────────────────────────────────────── */
                .hero-glow {
                    position: absolute;
                    width: 420px;
                    height: 420px;
                    background: radial-gradient(circle, rgba(255,0,21,0.18) 0%, transparent 70%);
                    border-radius: 50%;
                    left: var(--mx);
                    top: var(--my);
                    transform: translate(-50%, -50%);
                    transition: left 1.2s cubic-bezier(0.16,1,0.3,1), top 1.2s cubic-bezier(0.16,1,0.3,1);
                    pointer-events: none;
                    z-index: 3;
                    mix-blend-mode: screen;
                }

                /* ── headline ──────────────────────────────────────── */
                .hero-display {
                    font-family: var(--font-bebas), 'Impact', sans-serif;
                    font-size: clamp(3.6rem, 13vw, 14rem);
                    line-height: 0.86;
                    letter-spacing: -0.01em;
                    color: #fff;
                    text-transform: uppercase;
                }
                .hero-display .fire-word {
                    background: linear-gradient(135deg, #FF0015 0%, #FF6A00 55%, #FFB347 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    display: inline-block;
                }
                .hero-display .outline-word {
                    -webkit-text-stroke: 1.5px rgba(255,255,255,0.28);
                    color: transparent;
                    display: block;
                }

                /* ── theme quote ───────────────────────────────────── */
                .theme-quote {
                    font-family: var(--font-dm-sans), ui-sans-serif, sans-serif;
                    font-style: italic;
                    font-weight: 300;
                    font-size: clamp(0.9rem, 2.2vw, 1.25rem);
                    line-height: 1.55;
                    color: rgba(255,255,255,0.72);
                    max-width: 38ch;
                }

                /* ── meta pills ────────────────────────────────────── */
                .meta-pill {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.4rem;
                    padding: 0.35rem 0.75rem;
                    border-radius: 999px;
                    border: 1px solid rgba(255,255,255,0.14);
                    background: rgba(255,255,255,0.06);
                    backdrop-filter: blur(8px);
                    font-family: var(--font-dm-sans), ui-sans-serif, sans-serif;
                    font-size: 0.75rem;
                    font-weight: 500;
                    color: rgba(255,255,255,0.72);
                    white-space: normal;
                    word-break: break-word;
                }
                @media (min-width: 480px) {
                    .meta-pill { white-space: nowrap; }
                }

                /* ── CTA buttons ───────────────────────────────────── */
                .cta-fire {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    height: 48px;
                    padding: 0 1.5rem;
                    background: linear-gradient(135deg, #FF0015 0%, #FF6A00 100%);
                    color: #fff;
                    font-family: var(--font-dm-sans), ui-sans-serif, sans-serif;
                    font-weight: 600;
                    font-size: 0.9rem;
                    border-radius: 14px;
                    border: none;
                    cursor: pointer;
                    text-decoration: none;
                    box-shadow: 0 4px 24px rgba(255,0,21,0.45), 0 1px 4px rgba(0,0,0,0.3);
                    transition: transform 0.22s ease, box-shadow 0.22s ease, filter 0.22s ease;
                    letter-spacing: 0.01em;
                    flex-shrink: 0;
                }
                @media (min-width: 640px) {
                    .cta-fire { height: 52px; padding: 0 2rem; font-size: 0.9375rem; }
                }
                .cta-fire:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 10px 40px rgba(255,0,21,0.55), 0 2px 8px rgba(0,0,0,0.4);
                    filter: brightness(1.08);
                }
                .cta-ghost {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    height: 48px;
                    padding: 0 1.5rem;
                    background: rgba(255,255,255,0.07);
                    color: rgba(255,255,255,0.88);
                    font-family: var(--font-dm-sans), ui-sans-serif, sans-serif;
                    font-weight: 500;
                    font-size: 0.9rem;
                    border-radius: 14px;
                    border: 1px solid rgba(255,255,255,0.22);
                    cursor: pointer;
                    text-decoration: none;
                    backdrop-filter: blur(8px);
                    transition: all 0.22s ease;
                    letter-spacing: 0.01em;
                    flex-shrink: 0;
                }
                @media (min-width: 640px) {
                    .cta-ghost { height: 52px; padding: 0 2rem; font-size: 0.9375rem; }
                }
                .cta-ghost:hover {
                    background: rgba(255,255,255,0.13);
                    border-color: rgba(255,255,255,0.38);
                    transform: translateY(-2px);
                }
                .cta-link {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.3rem;
                    font-family: var(--font-dm-sans), ui-sans-serif, sans-serif;
                    font-size: 0.875rem;
                    font-weight: 500;
                    color: rgba(255,255,255,0.5);
                    text-decoration: none;
                    transition: color 0.2s ease;
                    letter-spacing: 0.01em;
                    padding: 0.25rem 0;
                }
                .cta-link:hover { color: rgba(255,255,255,0.85); }

                /* ── eyebrow ───────────────────────────────────────── */
                .eyebrow-dark {
                    font-family: var(--font-dm-sans), ui-sans-serif, sans-serif;
                    font-size: 0.65rem;
                    font-weight: 600;
                    letter-spacing: 0.18em;
                    text-transform: uppercase;
                    color: rgba(255,255,255,0.4);
                }

                /* ── composite brand wrapper ────────────────────────── */
                .brand-composer-panel {
                    display: inline-flex;
                    flex-direction: column;
                    gap: 12px;
                    max-width: 100%;
                    width: fit-content;
                }
                @media (min-width: 768px) {
                    .brand-composer-panel {
                        flex-direction: row;
                        align-items: center;
                        background: rgba(15, 5, 5, 0.4);
                        border: 1px solid rgba(255,255,255,0.08);
                        border-radius: 999px;
                        padding: 6px 18px 6px 6px;
                        backdrop-filter: blur(16px);
                        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
                    }
                }

                .hero-badge-base {
                    display: inline-flex;
                    align-items: center;
                    gap: 10px;
                    background: rgba(15, 5, 5, 0.55);
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 999px;
                    padding: 5px 14px 5px 6px;
                    backdrop-filter: blur(12px);
                    width: fit-content;
                }
                @media (min-width: 768px) {
                    .hero-badge-base {
                        background: transparent;
                        border: none;
                        padding: 0;
                        backdrop-filter: none;
                    }
                }

                /* ── fire accent line ──────────────────────────────── */
                .fire-line {
                    height: 2px;
                    width: 36px;
                    background: linear-gradient(90deg, #FF0015, #FF6A00);
                    border-radius: 999px;
                    flex-shrink: 0;
                }
                @media (min-width: 640px) {
                    .fire-line { width: 48px; }
                }

                /* ── desktop programme strip ───────────────────────── */
                .prog-strip {
                    position: absolute;
                    right: 0; top: 0; bottom: 0;
                    width: 260px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    gap: 6px;
                    padding: 0 1.5rem 0 0;
                    z-index: 10;
                }
                @media (min-width: 1280px) {
                    .prog-strip { width: 290px; padding-right: 2rem; }
                }
                @media (max-width: 1023px) {
                    .prog-strip { display: none !important; }
                }
                .prog-item {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    background: rgba(255,255,255,0.055);
                    border: 1px solid rgba(255,255,255,0.09);
                    border-radius: 12px;
                    padding: 9px 12px;
                    backdrop-filter: blur(14px);
                    transition: background 0.25s, border-color 0.25s, transform 0.25s;
                    cursor: default;
                }
                .prog-item:hover {
                    background: rgba(255,255,255,0.10);
                    border-color: rgba(255,255,255,0.18);
                    transform: translateX(-3px);
                }
                .prog-num {
                    font-family: var(--font-bebas), 'Impact', sans-serif;
                    font-size: 1.25rem;
                    line-height: 1;
                    flex-shrink: 0;
                    width: 26px;
                    text-align: center;
                }
                .prog-day {
                    font-family: var(--font-dm-sans), ui-sans-serif, sans-serif;
                    font-size: 0.6rem;
                    font-weight: 600;
                    letter-spacing: 0.12em;
                    text-transform: uppercase;
                    color: rgba(255,255,255,0.38);
                    text-align: center;
                    margin-top: 1px;
                }
                .prog-label {
                    font-family: var(--font-dm-sans), ui-sans-serif, sans-serif;
                    font-size: 0.78rem;
                    font-weight: 500;
                    color: rgba(255,255,255,0.82);
                    letter-spacing: 0.01em;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                /* ── mobile programme scroll ───────────────────────── */
                .prog-mobile {
                    display: none;
                }
                @media (max-width: 1023px) {
                    .prog-mobile {
                        display: flex;
                        overflow-x: auto;
                        gap: 7px;
                        scrollbar-width: none;
                        padding-bottom: 2px;
                        margin-left: -0.25rem;
                        padding-left: 0.25rem;
                    }
                    .prog-mobile::-webkit-scrollbar { display: none; }
                    .prog-mobile-item {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        gap: 2px;
                        background: rgba(255,255,255,0.07);
                        border: 1px solid rgba(255,255,255,0.10);
                        border-radius: 10px;
                        padding: 7px 10px;
                        flex-shrink: 0;
                        backdrop-filter: blur(10px);
                        min-width: 68px;
                    }
                    .prog-mobile-num {
                        font-family: var(--font-bebas), 'Impact', sans-serif;
                        font-size: 1.05rem;
                        line-height: 1;
                    }
                    .prog-mobile-label {
                        font-family: var(--font-dm-sans), ui-sans-serif, sans-serif;
                        font-size: 0.6rem;
                        font-weight: 500;
                        color: rgba(255,255,255,0.65);
                        white-space: nowrap;
                        text-align: center;
                    }
                    .prog-mobile-day {
                        font-family: var(--font-dm-sans), ui-sans-serif, sans-serif;
                        font-size: 0.52rem;
                        font-weight: 600;
                        letter-spacing: 0.1em;
                        text-transform: uppercase;
                        color: rgba(255,255,255,0.32);
                    }
                }

                /* ── content grid ──────────────────────────────────── */
                .hero-content-grid {
                    position: relative;
                    z-index: 10;
                    width: 100%;
                    max-width: 1600px;
                    margin: 0 auto;
                    padding: 5rem 1.25rem 3rem;
                    display: flex;
                    flex-direction: column;
                    justify-content: flex-start;
                    min-height: 100svh;
                }
                @media (min-width: 480px) {
                    .hero-content-grid { padding: 5.5rem 1.5rem 3.5rem; }
                }
                @media (min-width: 640px) {
                    .hero-content-grid { padding: 6rem 2rem 4rem; }
                }
                @media (min-width: 1024px) {
                    .hero-content-grid {
                        justify-content: center;
                        padding: 8rem 300px 4rem 2rem;
                        min-height: 100svh;
                    }
                }
                @media (min-width: 1280px) {
                    .hero-content-grid { padding-right: 330px; }
                }
            `}</style>

            {/* ── Root section ───────────────────────────────────────────── */}
            <section
                ref={sectionRef}
                className="hero-root hero-grain relative -mt-16 min-h-[100svh] overflow-hidden bg-[#0a0002]"
            >
                {/* background image */}
                <div className="absolute inset-0 z-0">
                    <SiteImage
                        src="hero_1920_1080_mzm89e"
                        alt="Redemption Week Live Worship Congregation"
                        fill
                        priority
                        sizes="100vw"
                        placeholderLabel="Redemption Week · Worship Night"
                        className="absolute inset-0 w-full h-full object-cover object-center"
                        colors={{ bg: "0a0002", fg: "FF0015" }}
                    />
                </div>

                {/* ── BRAND LOGO ASSETS: EDITORIAL BACKGROUND LAYERS ── */}
                {/* 38th Anniversary Logo Watermark background accent */}
                <div className="absolute right-0 bottom-0 lg:right-[10%] lg:top-1/2 lg:-translate-y-1/2 pointer-events-none z-[1] select-none opacity-[0.04] md:opacity-[0.06] transition-opacity duration-700">
                    <img
                        src={LOGOS.redemptionWeek}
                        alt="38th Anniversary Stamp"
                        className="w-[300px] h-[300px] sm:w-[450px] sm:h-[450px] lg:w-[650px] lg:h-[650px] object-contain"
                    />
                </div>

                {/* gradient masks */}
                <div className="absolute inset-0 z-[1] hero-gradient-left" />
                <div className="absolute inset-0 z-[2] hero-gradient-bottom" />
                <div className="absolute inset-0 z-[2] hero-gradient-top" />

                {/* atmospheric orbs */}
                <div
                    className="absolute z-[3] pointer-events-none"
                    style={{
                        top: "-10%",
                        left: "-8%",
                        width: "520px",
                        height: "520px",
                        background:
                            "radial-gradient(circle, rgba(255,0,21,0.14) 0%, transparent 70%)",
                        borderRadius: "50%",
                        filter: "blur(20px)",
                    }}
                />
                <div
                    className="absolute z-[3] pointer-events-none"
                    style={{
                        bottom: "10%",
                        left: "20%",
                        width: "350px",
                        height: "350px",
                        background:
                            "radial-gradient(circle, rgba(255,106,0,0.10) 0%, transparent 70%)",
                        borderRadius: "50%",
                        filter: "blur(16px)",
                    }}
                />

                {/* mouse glow */}
                <div className="hero-glow" />

                {/* ── Main content ──────────────────────────────────────── */}
                <div className="hero-content-grid">
                    <div style={{ maxWidth: "780px", width: "100%" }}>
                        {/* ── COMPOSITE BRAND HEADER ARCHITECTURE ── */}
                        <div
                            className={`brand-composer-panel h-reveal d0 ${mounted ? "" : "opacity-0"}`}
                        >
                            {/* Primary Badge Structure: Host Branding */}
                            <div className="hero-badge-base">
                                <div className="flex items-center justify-center shadow-md">
                                    <img
                                        src={LOGOS.rcfFutaMix}
                                        alt="RCF FUTA Primary Logo"
                                        className="h-[18px] w-auto max-w-[40px] object-contain"
                                    />
                                </div>
                                <span className="eyebrow-dark tracking-[0.22em] text-white/90 text-[10px] sm:text-xs font-bold">
                                    {TENURE.anniversaryLabel}
                                </span>
                            </div>

                            {/* Divider Line (Only displays on Desktop cluster block) */}
                            <span className="hidden md:block w-[1px] h-4 bg-white/20" />

                            {/* Desktop/Mobile integrated secondary logo rows */}
                            <div className="flex items-center gap-4 bg-neutral-900/50 border border-white/5 md:border-none md:bg-transparent px-3 py-2 md:p-0 rounded-full w-fit">
                                {/* Campaign Logo: RW'26 */}
                                <div className="flex items-center gap-2">
                                    <div className="bg-white">
                                        <img
                                            src={LOGOS.anniversary}
                                            alt="RW26 Logo Card"
                                            className="h-[22px] w-auto object-contain filter drop-shadow-[0_2px_8px_rgba(255,106,0,0.2)]"
                                        />
                                    </div>
                                    <span className="text-[10px] uppercase font-semibold tracking-wider text-neutral-400 font-dm-sans hidden sm:inline">
                                        {TENURE.dateRange}
                                    </span>
                                </div>

                                <span className="w-[1px] h-3 bg-white/10" />

                                {/* Active Tenure Identity Icon */}
                                <div className="flex items-center gap-2">
                                    <img
                                        src={LOGOS.tenureIcon}
                                        alt="Current Tenure Icon"
                                        className="h-[20px] w-auto object-contain filter brightness-110"
                                    />
                                    <span className="text-[10px] uppercase font-bold tracking-widest text-orange-500 font-dm-sans">
                                        RW &apos;{TENURE.year.slice(2)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Headline */}
                        <div
                            className={`h-reveal d1 ${mounted ? "" : "opacity-0"}`}
                            style={{ marginTop: "clamp(1.25rem, 3vw, 2.25rem)" }}
                        >
                            <h1 className="hero-display">
                                <span className="outline-word">Redemption</span>
                                <span className="fire-word">
                                    Week &apos;{TENURE.year.slice(2)}
                                </span>
                            </h1>
                        </div>

                        {/* Theme */}
                        <div
                            className={`h-reveal d2 ${mounted ? "" : "opacity-0"}`}
                            style={{
                                marginTop: "clamp(0.75rem, 2vw, 1.5rem)",
                                display: "flex",
                                alignItems: "flex-start",
                                gap: "12px",
                            }}
                        >
                            <div className="fire-line" style={{ marginTop: "0.55em" }} />
                            <p className="theme-quote">&ldquo;{TENURE.theme}&rdquo;</p>
                        </div>

                        {/* Meta pills */}
                        <div
                            className={`h-reveal d3 ${mounted ? "" : "opacity-0"}`}
                            style={{
                                marginTop: "clamp(0.75rem, 2vw, 1.5rem)",
                                display: "flex",
                                flexWrap: "wrap",
                                gap: "6px",
                            }}
                        >
                            {[
                                {
                                    label: TENURE.dateRange,
                                    icon: (
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
                                        />
                                    ),
                                },
                                {
                                    label: "Southgate Aud. · FUTA, Akure",
                                    icon: (
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                                        />
                                    ),
                                },
                                {
                                    label: "7 Nights · Free Entry",
                                    icon: (
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                        />
                                    ),
                                },
                            ].map(({ label, icon }) => (
                                <span key={label} className="meta-pill">
                                    <svg
                                        className="shrink-0"
                                        style={{
                                            width: "12px",
                                            height: "12px",
                                            color: "#FF6A00",
                                        }}
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                        viewBox="0 0 24 24"
                                        aria-hidden
                                    >
                                        {icon}
                                    </svg>
                                    {label}
                                </span>
                            ))}
                        </div>

                        {/* CTAs */}
                        <div
                            className={`h-reveal d4 ${mounted ? "" : "opacity-0"}`}
                            style={{
                                marginTop: "clamp(1rem, 2.5vw, 2rem)",
                                display: "flex",
                                flexWrap: "wrap",
                                alignItems: "center",
                                gap: "10px",
                            }}
                        >
                            <Link href="/shop" id="hero-shop-cta" className="cta-fire">
                                Pre-order Merch
                                <svg
                                    style={{ width: "15px", height: "15px" }}
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={2.5}
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                                    />
                                </svg>
                            </Link>
                            <Link href="/fulfil" id="hero-pay-cta" className="cta-link">
                                Pay an Order →
                            </Link>
                        </div>

                        {/* Countdown */}
                        <div
                            className={`hero-countdown-wrap h-reveal d5 ${mounted ? "" : "opacity-0"}`}
                            style={{ marginTop: "clamp(1.25rem, 3vw, 2.5rem)" }}
                        >
                            <p
                                className="eyebrow-dark"
                                style={{ marginBottom: "0.875rem" }}
                            >
                                Counting down to RW&apos;{TENURE.year.slice(2)}
                            </p>
                            <CountdownTimer targetDate={env.eventStartDate} />
                        </div>

                        {/* Mobile programme scroll */}
                        <div
                            className={`prog-mobile h-reveal d6 ${mounted ? "" : "opacity-0"}`}
                            style={{ marginTop: "clamp(1.25rem, 3vw, 2rem)" }}
                        >
                            {NIGHT_ITEMS.map((n) => (
                                <div key={n.label} className="prog-mobile-item">
                                    <span
                                        className="prog-mobile-num"
                                        style={{ color: n.color }}
                                    >
                                        {n.n}
                                    </span>
                                    <span className="prog-mobile-day">{n.day}</span>
                                    <span className="prog-mobile-label">{n.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Desktop programme strip ────────────────────────────── */}
                <div className="prog-strip">
                    <p
                        className="eyebrow-dark"
                        style={{ paddingLeft: "4px", marginBottom: "6px" }}
                    >
                        Programme
                    </p>
                    {NIGHT_ITEMS.map((n, i) => (
                        <div
                            key={n.label}
                            className="prog-item"
                            style={{ animationDelay: `${600 + i * 70}ms` }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    flexShrink: 0,
                                    width: "28px",
                                }}
                            >
                                <span className="prog-num" style={{ color: n.color }}>
                                    {n.n}
                                </span>
                                <span className="prog-day">{n.day}</span>
                            </div>
                            <span
                                style={{
                                    width: "1px",
                                    height: "20px",
                                    background: "rgba(255,255,255,0.1)",
                                    flexShrink: 0,
                                }}
                            />
                            <span className="prog-label">{n.label}</span>
                        </div>
                    ))}
                </div>

                {/* ── Scroll indicator ──────────────────────────────────── */}
                <div
                    className="absolute bottom-8 left-1/2 z-10 hidden md:flex"
                    style={{ transform: "translateX(-50%)" }}
                >
                    <div className="scroll-hint">
                        <span className="eyebrow-dark">Scroll</span>
                        <div className="scroll-hint-line" />
                    </div>
                </div>
            </section>
        </>
    );
}
