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

    useEffect(() => {
        setMounted(true);
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
            {/* ── Injected styles ─────────────────────────────────────────── */}
            <style>{`

                .hero-root {
                    --mx: 55%;
                    --my: 45%;
                }

                /* ---------- noise grain overlay ---------- */
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

                /* ---------- gradient layers ---------- */
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

                /* ---------- mouse-tracked glow ---------- */
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

                /* ---------- headline ---------- */
                .hero-display {
                    fontFamily: var(--font-bebas);
                    font-size: clamp(5.5rem, 8vw, 14rem);
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

                /* ---------- theme quote ---------- */
                .theme-quote {
                    font-family: var(--font-dm-sans);
                    font-style: italic;
                    font-weight: 300;
                    font-size: clamp(1rem, 2.2vw, 1.25rem);
                    line-height: 1.5;
                    color: rgba(255,255,255,0.72);
                    max-width: 38ch;
                }

                /* ---------- meta pill ---------- */
                .meta-pill {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.4rem;
                    padding: 0.35rem 0.85rem;
                    border-radius: 999px;
                    border: 1px solid rgba(255,255,255,0.14);
                    background: rgba(255,255,255,0.06);
                    backdrop-filter: blur(8px);
                    font-family: var(--font-dm-sans);
                    font-size: 0.78rem;
                    font-weight: 500;
                    color: rgba(255,255,255,0.72);
                    white-space: nowrap;
                }

                /* ---------- CTA buttons ---------- */
                .cta-fire {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    height: 52px;
                    padding: 0 2rem;
                    background: linear-gradient(135deg, #FF0015 0%, #FF6A00 100%);
                    color: #fff;
                    font-family: var(--font-dm-sans);
                    font-weight: 600;
                    font-size: 0.9375rem;
                    border-radius: 14px;
                    border: none;
                    cursor: pointer;
                    text-decoration: none;
                    box-shadow: 0 4px 24px rgba(255,0,21,0.45), 0 1px 4px rgba(0,0,0,0.3);
                    transition: transform 0.22s ease, box-shadow 0.22s ease, filter 0.22s ease;
                    letter-spacing: 0.01em;
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
                    height: 52px;
                    padding: 0 2rem;
                    background: rgba(255,255,255,0.07);
                    color: rgba(255,255,255,0.88);
                    font-family: var(--font-dm-sans);
                    font-weight: 500;
                    font-size: 0.9375rem;
                    border-radius: 14px;
                    border: 1px solid rgba(255,255,255,0.22);
                    cursor: pointer;
                    text-decoration: none;
                    backdrop-filter: blur(8px);
                    transition: all 0.22s ease;
                    letter-spacing: 0.01em;
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
                    font-family: var(--font-dm-sans);
                    font-size: 0.875rem;
                    font-weight: 500;
                    color: rgba(255,255,255,0.5);
                    text-decoration: none;
                    transition: color 0.2s ease;
                    letter-spacing: 0.01em;
                }
                .cta-link:hover { color: rgba(255,255,255,0.85); }

                /* ---------- eyebrow label ---------- */
                .eyebrow-dark {
                    font-family: var(--font-dm-sans);
                    font-size: 0.68rem;
                    font-weight: 600;
                    letter-spacing: 0.18em;
                    text-transform: uppercase;
                    color: rgba(255,255,255,0.4);
                }

                /* ---------- programme strip (desktop) ---------- */
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
                @media (min-width: 1280px) { .prog-strip { width: 290px; padding-right: 2rem; } }
                @media (max-width: 1023px) { .prog-strip { display: none !important; } }

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
                    font-family: var(--font-bebas);
                    font-size: 1.25rem;
                    line-height: 1;
                    flex-shrink: 0;
                    width: 26px;
                    text-align: center;
                }
                .prog-day {
                    font-family: var(--font-dm-sans);
                    font-size: 0.6rem;
                    font-weight: 600;
                    letter-spacing: 0.12em;
                    text-transform: uppercase;
                    color: rgba(255,255,255,0.38);
                    text-align: center;
                    margin-top: 1px;
                }
                .prog-label {
                    font-family: var(--font-dm-sans);
                    font-size: 0.78rem;
                    font-weight: 500;
                    color: rgba(255,255,255,0.82);
                    letter-spacing: 0.01em;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                /* ---------- programme strip (mobile) ---------- */
                .prog-mobile {
                    display: none;
                }
                @media (max-width: 1023px) {
                    .prog-mobile {
                        display: flex;
                        overflow-x: auto;
                        gap: 8px;
                        scrollbar-width: none;
                        padding-bottom: 4px;
                    }
                    .prog-mobile::-webkit-scrollbar { display: none; }
                    .prog-mobile-item {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        gap: 3px;
                        background: rgba(255,255,255,0.07);
                        border: 1px solid rgba(255,255,255,0.1);
                        border-radius: 10px;
                        padding: 8px 12px;
                        flex-shrink: 0;
                        backdrop-filter: blur(10px);
                    }
                    .prog-mobile-num {
                        font-family: var(--font-bebas);
                        font-size: 1.1rem;
                        line-height: 1;
                    }
                    .prog-mobile-label {
                        font-family: var(--font-dm-sans);
                        font-size: 0.65rem;
                        font-weight: 500;
                        color: rgba(255,255,255,0.65);
                        white-space: nowrap;
                        text-align: center;
                    }
                    .prog-mobile-day {
                        font-family: var(--font-dm-sans);
                        font-size: 0.55rem;
                        font-weight: 600;
                        letter-spacing: 0.1em;
                        text-transform: uppercase;
                        color: rgba(255,255,255,0.32);
                    }
                }

                /* ---------- divider line ---------- */
                .fire-line {
                    height: 2px;
                    width: 48px;
                    background: linear-gradient(90deg, #FF0015, #FF6A00);
                    border-radius: 999px;
                    flex-shrink: 0;
                }

                /* ---------- badge ---------- */
                .hero-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 10px;
                    background: rgba(255,255,255,0.06);
                    border: 1px solid rgba(255,255,255,0.12);
                    border-radius: 999px;
                    padding: 7px 14px 7px 8px;
                    backdrop-filter: blur(10px);
                }

                /* ---------- scroll indicator ---------- */
                .scroll-hint {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 6px;
                }
                .scroll-hint-line {
                    width: 1px;
                    height: 32px;
                    background: linear-gradient(to bottom, rgba(255,0,21,0.7), transparent);
                    animation: scrollPulse 1.8s ease-in-out infinite;
                }
                @keyframes scrollPulse {
                    0%, 100% { opacity: 0.4; transform: scaleY(1); }
                    50% { opacity: 1; transform: scaleY(1.15); }
                }

                /* ---------- stagger fade-ins ---------- */
                @keyframes heroFadeUp {
                    from { opacity: 0; transform: translateY(28px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .h-reveal { opacity: 0; animation: heroFadeUp 0.75s cubic-bezier(0.16,1,0.3,1) forwards; }
                .h-reveal.d0  { animation-delay: 100ms; }
                .h-reveal.d1  { animation-delay: 220ms; }
                .h-reveal.d2  { animation-delay: 360ms; }
                .h-reveal.d3  { animation-delay: 480ms; }
                .h-reveal.d4  { animation-delay: 600ms; }
                .h-reveal.d5  { animation-delay: 720ms; }
                .h-reveal.d6  { animation-delay: 840ms; }

                /* ---------- countdown override for dark bg ---------- */
                .hero-countdown-wrap {
                    --rw-ink: #fff;
                    --rw-text: rgba(255,255,255,0.9);
                    --rw-text-2: rgba(255,255,255,0.55);
                    --rw-border: rgba(255,255,255,0.12);
                    --rw-surface: rgba(255,255,255,0.06);
                    --rw-crimson: #FF0015;
                }

                /* ---------- responsive content layout ---------- */
                .hero-content-grid {
                    position: relative;
                    z-index: 10;
                    max-width: 1600px;
                    margin: 0 auto;
                    padding: 0 1.5rem;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    justify-content: flex-end;
                    padding-bottom: clamp(3rem, 7vw, 6rem);
                }
                @media (min-width: 640px) {
                    .hero-content-grid { padding-left: 2rem; padding-right: 2rem; }
                }
                @media (min-width: 1024px) {
                    .hero-content-grid {
                        justify-content: center;
                        padding-top: 8rem;
                        padding-bottom: 0;
                        /* leave right column free for prog strip */
                        padding-right: 300px;
                    }
                }
                @media (min-width: 1280px) {
                    .hero-content-grid { padding-right: 330px; }
                }
            `}</style>

            {/* ── Root section ───────────────────────────────────────────── */}
            <section
                ref={sectionRef}
                className="hero-root hero-grain relative min-h-[100svh] overflow-hidden bg-[#0a0002]"
            >
                {/* ── Background image ────────────────────────────────── */}
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

                {/* ── Gradient masks ──────────────────────────────────── */}
                <div className="absolute inset-0 z-1 hero-gradient-left" />
                <div className="absolute inset-0 z-2 hero-gradient-bottom" />
                <div className="absolute inset-0 z-2 hero-gradient-top" />

                {/* ── Static crimson atmospheric orbs ────────────────── */}
                <div
                    className="absolute z-3 pointer-events-none"
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
                    className="absolute z-3 pointer-events-none"
                    style={{
                        bottom: "10%",
                        left: "20%",
                        width: "350px",
                        height: "350px",
                        background:
                            "radial-gradient(circle, rgba(255,106,0,0.1) 0%, transparent 70%)",
                        borderRadius: "50%",
                        filter: "blur(16px)",
                    }}
                />

                {/* ── Mouse glow ──────────────────────────────────────── */}
                <div className="hero-glow" />

                {/* ── Main content ────────────────────────────────────── */}
                <div className="hero-content-grid">
                    <div style={{ maxWidth: "780px" }}>
                        {/* Badge */}
                        <div
                            className={`hero-badge h-reveal d0 ${mounted ? "" : "opacity-0"}`}
                        >
                            <img
                                src={LOGOS.redemptionWeek}
                                alt="RCF FUTA"
                                style={{
                                    height: "22px",
                                    width: "22px",
                                    objectFit: "contain",
                                }}
                            />
                            <span className="eyebrow-dark">
                                {TENURE.anniversaryLabel}
                            </span>
                            <span
                                style={{
                                    width: "1px",
                                    height: "12px",
                                    background: "rgba(255,255,255,0.15)",
                                    display: "inline-block",
                                }}
                            />
                            <span
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "5px",
                                    fontFamily: "var(--font-dm-sans)",
                                    fontSize: "0.68rem",
                                    fontWeight: 600,
                                    letterSpacing: "0.14em",
                                    textTransform: "uppercase",
                                    color: "#FF6A00",
                                }}
                            >
                                <span
                                    style={{
                                        width: "5px",
                                        height: "5px",
                                        borderRadius: "50%",
                                        background: "#FF0015",
                                        animation: "pulse-soft 2s infinite",
                                        display: "inline-block",
                                    }}
                                />
                                RCF FUTA
                            </span>
                        </div>

                        {/* Headline */}
                        <div
                            className={`h-reveal d1 ${mounted ? "" : "opacity-0"}`}
                            style={{ marginTop: "clamp(1.25rem, 2.5vw, 2rem)" }}
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
                                marginTop: "clamp(1rem, 2vw, 1.5rem)",
                                display: "flex",
                                alignItems: "flex-start",
                                gap: "14px",
                            }}
                        >
                            <div className="fire-line" style={{ marginTop: "0.6em" }} />
                            <p className="theme-quote">&ldquo;{TENURE.theme}&rdquo;</p>
                        </div>

                        {/* Meta pills */}
                        <div
                            className={`h-reveal d3 ${mounted ? "" : "opacity-0"}`}
                            style={{
                                marginTop: "clamp(1rem, 2vw, 1.5rem)",
                                display: "flex",
                                flexWrap: "wrap",
                                gap: "8px",
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
                                    label: "Southgate Auditorium · FUTA, Akure",
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
                                            width: "13px",
                                            height: "13px",
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

                        {/* CTA buttons */}
                        <div
                            className={`h-reveal d4 ${mounted ? "" : "opacity-0"}`}
                            style={{
                                marginTop: "clamp(1.25rem, 2.5vw, 2rem)",
                                display: "flex",
                                flexWrap: "wrap",
                                alignItems: "center",
                                gap: "12px",
                            }}
                        >
                            <Link href="/shop" id="hero-shop-cta" className="cta-fire">
                                Pre-order Merch
                                <svg
                                    style={{ width: "16px", height: "16px" }}
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
                            <Link
                                href="/#support"
                                id="hero-support-cta"
                                className="cta-ghost"
                            >
                                Support the Event
                            </Link>
                            <Link href="/fulfil" id="hero-pay-cta" className="cta-link">
                                Pay an Order →
                            </Link>
                        </div>

                        {/* Countdown */}
                        <div
                            className={`hero-countdown-wrap h-reveal d5 ${mounted ? "" : "opacity-0"}`}
                            style={{ marginTop: "clamp(1.5rem, 3vw, 2.5rem)" }}
                        >
                            <p className="eyebrow-dark" style={{ marginBottom: "1rem" }}>
                                Counting down to RW&apos;{TENURE.year.slice(2)}
                            </p>
                            <CountdownTimer targetDate={env.eventStartDate} />
                        </div>

                        {/* Mobile programme scroll */}
                        <div
                            className={`prog-mobile h-reveal d6 ${mounted ? "" : "opacity-0"}`}
                            style={{ marginTop: "clamp(1.5rem, 3vw, 2rem)" }}
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

                {/* ── Desktop programme strip ─────────────────────────── */}
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

                {/* ── Scroll indicator ─────────────────────────────────── */}
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
