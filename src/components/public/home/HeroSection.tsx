"use client";

import Link from "next/link";
import Image from "next/image";
import { env } from "@/lib/env";
import { TENURE, LOGOS } from "@/lib/config";
import { CountdownTimer } from "@/components/public/CountdownTimer";
import { ph } from "@/lib/utils/functions";
import { useEffect, useRef } from "react";

// Night-by-night schedule for the right column strip
const NIGHT_ITEMS = [
    { label: "Opening Ceremony", day: "MON", n: "01", color: "#FF0015" },
    { label: "Word Night",       day: "TUE", n: "02", color: "#FF6A00" },
    { label: "Power Night",      day: "WED", n: "03", color: "#FF0015" },
    { label: "Drama Night",      day: "THU", n: "04", color: "#FF6A00" },
    { label: "Choir Concert",    day: "FRI", n: "05", color: "#FF0015" },
    { label: "RIFE Night",       day: "SAT", n: "06", color: "#FF6A00" },
    { label: "Handing Over",     day: "SUN", n: "07", color: "#FF0015" },
];

export function HeroSection() {
    const videoRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = videoRef.current;
        if (!el) return;
        const handler = (e: MouseEvent) => {
            const rect = el.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            el.style.setProperty("--mouse-x", `${x}%`);
            el.style.setProperty("--mouse-y", `${y}%`);
        };
        window.addEventListener("mousemove", handler);
        return () => window.removeEventListener("mousemove", handler);
    }, []);

    return (
        <section
            ref={videoRef}
            className="relative min-h-screen overflow-hidden flex items-center bg-white"
            style={{ "--mouse-x": "60%", "--mouse-y": "40%" } as React.CSSProperties}
        >
            {/* ── Background image — right-side, dramatic ──────────────────── */}
            <div className="absolute inset-0">
                <img
                    src={ph(1920, 1080, "Redemption Week · Worship Night", "1C0003", "FF6A00")}
                    alt=""
                    aria-hidden
                    className="absolute inset-0 w-full h-full object-cover object-right"
                />
                {/* White sweep — content area */}
                <div className="absolute inset-0 bg-gradient-to-r from-white via-white/98 lg:via-white/95 xl:via-white/88 to-white/5" />
                {/* Bottom fade into white */}
                <div className="absolute bottom-0 left-0 right-0 h-56 bg-gradient-to-t from-white via-white/60 to-transparent" />
            </div>

            {/* ── Atmospheric glows ─────────────────────────────────────────── */}
            <div className="absolute top-0 left-0 w-[700px] h-[700px] bg-[#FF0015]/6 rounded-full blur-[140px] -translate-x-1/2 -translate-y-1/3 pointer-events-none" />
            <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] bg-[#FF6A00]/8 rounded-full blur-[100px] pointer-events-none" />
            <div
                className="absolute w-[300px] h-[300px] bg-[#FF0015]/4 rounded-full blur-[80px] pointer-events-none transition-all duration-1000 ease-out"
                style={{ left: "var(--mouse-x)", top: "var(--mouse-y)", transform: "translate(-50%,-50%)" }}
            />

            {/* ── Main content ──────────────────────────────────────────────── */}
            <div className="relative z-10 section-container py-28 lg:py-36 w-full">
                <div className="max-w-3xl stagger-children">

                    {/* Fellowship badge with logos */}
                    <div className="animate-fade-in-up">
                        <div className="inline-flex items-center gap-3 rounded-full border border-[#e8d0d4]
                                        bg-white/95 backdrop-blur-sm px-4 py-2 shadow-sm">
                            <img
                                src={LOGOS.rcfFuta}
                                alt="RCF FUTA"
                                className="h-6 w-6 rounded-full object-cover border border-[#e8d0d4]"
                            />
                            <span className="text-[10px] font-bold text-[#9a8085] tracking-[0.14em] uppercase">
                                {TENURE.anniversaryLabel}
                            </span>
                            <span className="h-3 w-px bg-[#e8d0d4]" />
                            <span className="flex items-center gap-1.5 text-[10px] font-bold text-[#FF0015] tracking-[0.14em] uppercase">
                                <span className="h-1.5 w-1.5 rounded-full bg-[#FF0015] animate-pulse-soft" />
                                Redeemed Christian Fellowship, FUTA
                            </span>
                        </div>
                    </div>

                    {/* Main heading — large editorial */}
                    <div className="animate-fade-in-up mt-8">
                        <h1
                            className="font-display font-extrabold tracking-tight text-[#1C0003]"
                            style={{ fontSize: "clamp(3.5rem, 10vw, 8.5rem)", lineHeight: "0.88" }}
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

                    {/* Theme — italic quote style */}
                    <div className="animate-fade-in-up mt-7">
                        <div className="flex items-start gap-4">
                            <span className="crimson-line shrink-0 mt-2.5" />
                            <p className="font-display italic text-[#5c4048] text-xl sm:text-2xl leading-snug max-w-[36ch]">
                                &ldquo;{TENURE.theme}&rdquo;
                            </p>
                        </div>
                    </div>

                    {/* Meta pills */}
                    <div className="animate-fade-in-up mt-9 flex flex-wrap gap-2">
                        {[
                            {
                                label: TENURE.dateRange,
                                icon: <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />,
                            },
                            {
                                label: "Southgate Auditorium · FUTA, Akure",
                                icon: <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />,
                            },
                            {
                                label: "7 Nights · Free Admission",
                                icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />,
                            },
                        ].map(({ label, icon }) => (
                            <span
                                key={label}
                                className="inline-flex items-center gap-2 rounded-full border border-[#e8d0d4]
                                           bg-white px-4 py-1.5 text-sm font-medium text-[#5c4048] shadow-sm"
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
                    <div className="animate-fade-in-up mt-10 flex flex-wrap gap-3">
                        <Link href="/shop" id="hero-shop-cta" className="btn-primary shadow-lg">
                            Pre-order Merch
                            <svg className="h-4 w-4" fill="none" stroke="currentColor"
                                strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                            </svg>
                        </Link>
                        <Link href="/support" id="hero-support-cta"
                            className="inline-flex items-center gap-2 h-12 px-7 rounded-xl font-semibold text-[15px]
                                       border-2 border-[#1C0003] text-[#1C0003] bg-white
                                       hover:border-[#FF0015] hover:text-[#FF0015] hover:bg-[#FF0015]/4 transition-all">
                            Support the Event
                        </Link>
                        <Link href="/fulfil" id="hero-pay-cta"
                            className="inline-flex items-center gap-2 h-12 px-6 rounded-xl font-medium text-[14px]
                                       text-[#5c4048] hover:text-[#1C0003] transition-colors underline-offset-2">
                            Pay an Order →
                        </Link>
                    </div>

                    {/* Countdown */}
                    <div className="animate-fade-in-up mt-14">
                        <p className="eyebrow mb-5">Counting down to RW&apos;{TENURE.year.slice(2)}</p>
                        <CountdownTimer targetDate={env.eventStartDate} />
                    </div>
                </div>
            </div>

            {/* ── Right: 7-night programme strip ───────────────────────────── */}
            <div className="absolute right-0 top-0 bottom-0 w-[300px] xl:w-[340px] hidden lg:flex flex-col
                            justify-center gap-2 pr-6 xl:pr-10 z-10">
                <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#9a8085] mb-2 pl-1">
                    Programme
                </p>
                {NIGHT_ITEMS.map((n, i) => (
                    <div
                        key={n.label}
                        className="group flex items-center gap-3 rounded-2xl bg-white/85 backdrop-blur-md
                                   border border-white/70 shadow-sm px-3 py-2.5 hover:bg-white
                                   hover:shadow-md transition-all duration-300 cursor-default"
                        style={{ animationDelay: `${i * 60}ms` }}
                    >
                        <div className="shrink-0 flex flex-col items-center w-8">
                            <span className="font-display font-bold text-sm leading-none" style={{ color: n.color }}>
                                {n.n}
                            </span>
                            <span className="text-[8px] font-bold uppercase tracking-wider text-[#9a8085] mt-0.5">
                                {n.day}
                            </span>
                        </div>
                        <span className="h-5 w-px bg-[#e8d0d4] shrink-0" />
                        <p className="text-[12px] font-semibold text-[#1C0003] truncate leading-tight">
                            {n.label}
                        </p>
                    </div>
                ))}
            </div>

            {/* ── Scroll indicator ──────────────────────────────────────────── */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 animate-bounce-subtle">
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#b09098]">Scroll</span>
                <svg className="h-4 w-4 text-[#b09098]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
            </div>
        </section>
    );
}
