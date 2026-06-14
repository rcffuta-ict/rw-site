"use client";

import { useState } from "react";
import Image from "next/image";
import { TENURE, LOGOS, BRAND } from "@/lib/config";

type LogoAsset = {
    name: string;
    desc: string;
    src: string;
    /** Preview backdrop — some marks are meant for dark, others for light. */
    surface: "light" | "dark";
};

const LOGO_ASSETS: LogoAsset[] = [
    {
        name: "Redemption Week 2026",
        desc: "Primary event logo. Use for all RW '26 communications.",
        src: LOGOS.redemptionWeek,
        surface: "dark",
    },
    {
        name: "38th Anniversary Mark",
        desc: "Commemorative anniversary stamp for the 2026 tenure.",
        src: LOGOS.anniversary,
        surface: "dark",
    },
    {
        name: "RCF FUTA — Dark",
        desc: "Fellowship logo for use on light/white backgrounds.",
        src: LOGOS.rcfFutaDark,
        surface: "light",
    },
    {
        name: "RCF FUTA — Light",
        desc: "Fellowship logo for use on dark/photo backgrounds.",
        src: LOGOS.rcfFutaLight,
        surface: "dark",
    },
    {
        name: "RCF Badge",
        desc: "Standalone fellowship badge mark.",
        src: LOGOS.rcf,
        surface: "light",
    },
    {
        name: "Tenure Icon",
        desc: "Torch / flame icon for compact placements & favicons.",
        src: LOGOS.tenureIcon,
        surface: "light",
    },
];

const COLORS: { name: string; hex: string; onDark?: boolean }[] = [
    { name: "Deep Maroon", hex: BRAND.deepMaroon, onDark: true },
    { name: "Brand Red", hex: BRAND.red, onDark: true },
    { name: "Brand Orange", hex: BRAND.orange, onDark: true },
    { name: "Forest", hex: BRAND.forest, onDark: true },
    { name: "White", hex: BRAND.white },
];

const GUIDELINES = {
    do: [
        "Use the official files supplied here without re-drawing or recolouring.",
        "Keep clear space around the logo — at least the height of the “R” mark.",
        "Place the light logo on dark/photo backgrounds and the dark logo on light ones.",
        `Refer to the event as “${TENURE.eventName} ${TENURE.year}” or “RW${TENURE.shortYear}”.`,
    ],
    dont: [
        "Stretch, rotate, add shadows, or change the logo colours.",
        "Recreate the logo with different fonts or place it on busy backgrounds.",
        "Use the fellowship logo to imply endorsement without written permission.",
        "Crop the anniversary mark or combine it with other emblems.",
    ],
};

function CopyButton({ value, label }: { value: string; label?: string }) {
    const [copied, setCopied] = useState(false);
    return (
        <button
            onClick={async () => {
                await navigator.clipboard.writeText(value);
                setCopied(true);
                setTimeout(() => setCopied(false), 1800);
            }}
            className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border border-[#e8d0d4] text-[#5c4048] hover:border-[#1C0003] hover:text-[#1C0003] transition-all"
        >
            {copied ? "✓ Copied" : (label ?? "Copy")}
        </button>
    );
}

export function BrandAssetsClient() {
    return (
        <main className="bg-white text-[#1C0003]">
            {/* ── Logos ── */}
            <section className="section-container section-py">
                <div className="mb-10">
                    <h2 className="section-heading text-3xl sm:text-4xl">Logos</h2>
                    <p className="mt-3 text-[#5c4048] max-w-[60ch]">
                        Click download to grab the full-resolution PNG. Each mark is shown
                        on its recommended background.
                    </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {LOGO_ASSETS.map((logo) => (
                        <div
                            key={logo.name}
                            className="rounded-2xl border border-[#e8d0d4] overflow-hidden flex flex-col"
                        >
                            <div
                                className={`flex items-center justify-center p-10 h-48 ${
                                    logo.surface === "dark"
                                        ? "bg-[#1C0003]"
                                        : "bg-[#fdf8f8]"
                                }`}
                            >
                                <Image
                                    src={logo.src}
                                    alt={logo.name}
                                    width={200}
                                    height={120}
                                    className="max-h-28 w-auto object-contain"
                                />
                            </div>
                            <div className="p-5 flex flex-col gap-3 flex-1">
                                <div className="flex-1">
                                    <p className="font-bold text-[#1C0003]">
                                        {logo.name}
                                    </p>
                                    <p className="text-sm text-[#5c4048] mt-1 leading-relaxed">
                                        {logo.desc}
                                    </p>
                                </div>
                                <a
                                    href={logo.src}
                                    download
                                    className="inline-flex items-center justify-center gap-2 h-10 rounded-xl text-sm font-bold border border-[#e8d0d4] text-[#1C0003] hover:bg-[#1C0003] hover:text-white transition-all"
                                >
                                    <svg
                                        className="h-4 w-4"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                                        />
                                    </svg>
                                    Download PNG
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Colours ── */}
            <section className="bg-[#fdf8f8] border-y border-[#e8d0d4]">
                <div className="section-container section-py">
                    <div className="mb-10">
                        <h2 className="section-heading text-3xl sm:text-4xl">
                            Brand Colours
                        </h2>
                        <p className="mt-3 text-[#5c4048] max-w-[60ch]">
                            The official palette. Tap a swatch to copy its HEX value.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                        {COLORS.map((c) => (
                            <div
                                key={c.hex}
                                className="rounded-2xl border border-[#e8d0d4] overflow-hidden bg-white"
                            >
                                <div
                                    className="h-28 flex items-end p-3"
                                    style={{ background: c.hex }}
                                >
                                    <span
                                        className={`text-[11px] font-bold uppercase tracking-wider ${
                                            c.onDark ? "text-white/80" : "text-[#1C0003]/60"
                                        }`}
                                    >
                                        {c.name}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between gap-2 p-3">
                                    <span className="font-mono text-sm font-bold uppercase">
                                        {c.hex}
                                    </span>
                                    <CopyButton value={c.hex} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Guidelines ── */}
            <section className="section-container section-py">
                <div className="mb-10">
                    <h2 className="section-heading text-3xl sm:text-4xl">
                        Usage Guidelines
                    </h2>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="rounded-2xl border border-[#cdeccd] bg-[#f4fbf4] p-7">
                        <p className="font-bold text-[#0a7a2f] uppercase text-xs tracking-widest mb-4">
                            ✓ Do
                        </p>
                        <ul className="flex flex-col gap-3">
                            {GUIDELINES.do.map((g) => (
                                <li
                                    key={g}
                                    className="text-sm text-[#1C0003] leading-relaxed"
                                >
                                    {g}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="rounded-2xl border border-[#f1cdd2] bg-[#fdf3f4] p-7">
                        <p className="font-bold text-[#c50018] uppercase text-xs tracking-widest mb-4">
                            ✕ Don&rsquo;t
                        </p>
                        <ul className="flex flex-col gap-3">
                            {GUIDELINES.dont.map((g) => (
                                <li
                                    key={g}
                                    className="text-sm text-[#1C0003] leading-relaxed"
                                >
                                    {g}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* ── Need something else? note ── */}
            <section className="section-container pb-4 -mt-4">
                <div className="rounded-2xl border border-[#e8d0d4] bg-[#fdf8f8] p-6 text-center">
                    <p className="text-sm text-[#5c4048] leading-relaxed max-w-[60ch] mx-auto">
                        Need vector (SVG/AI) files, high-resolution photos, or a custom
                        format? Reach out to our committee using the contacts below and
                        we&rsquo;ll send them over.
                    </p>
                </div>
            </section>
        </main>
    );
}
