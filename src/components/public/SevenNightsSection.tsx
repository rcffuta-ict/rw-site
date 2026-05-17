"use client";

import { useState } from "react";
import { ph } from "@/lib/utils/functions";
import { TENURE } from "@/lib/config";

interface Night {
    day: string;
    name: string;
    unit: string;
    desc: string;
}

const NIGHT_COLORS = [
    { accent: "#FF0015", bgLight: "#fff5f5", strip: "from-[#FF0015]/10 to-white" },
    { accent: "#FF6A00", bgLight: "#fff8f0", strip: "from-[#FF6A00]/10 to-white" },
    { accent: "#7722cc", bgLight: "#f8f0ff", strip: "from-[#7722cc]/10 to-white" },
    { accent: "#cc4400", bgLight: "#fff3ee", strip: "from-[#cc4400]/10 to-white" },
    { accent: "#007733", bgLight: "#f0fff5", strip: "from-[#007733]/10 to-white" },
    { accent: "#887700", bgLight: "#fffef0", strip: "from-[#887700]/10 to-white" },
    { accent: "#006655", bgLight: "#f0fffd", strip: "from-[#006655]/10 to-white" },
];

const IMG_BG = [
    { bg: "1C0003", fg: "FF6A00" },
    { bg: "0d1a3d", fg: "88aaff" },
    { bg: "2a0055", fg: "cc88ff" },
    { bg: "3d1000", fg: "ff8855" },
    { bg: "003320", fg: "55ffaa" },
    { bg: "2a2200", fg: "ffcc44" },
    { bg: "002822", fg: "55ffee" },
];

export function SevenNightsSection({ nights }: { nights: Night[] }) {
    const [active, setActive] = useState(0);

    const night = nights[active];
    const palette = NIGHT_COLORS[active] ?? NIGHT_COLORS[0];
    const imgPal = IMG_BG[active] ?? IMG_BG[0];

    return (
        <section id="programme" className="bg-white overflow-hidden scroll-mt-20">
            <div className="section-container section-py">
                {/* Header */}
                <div className="mb-14">
                    <p className="eyebrow mb-4">The Programme</p>
                    <div className="flex flex-col sm:flex-row sm:items-end gap-6 sm:gap-16">
                        <h2 className="section-heading text-4xl sm:text-5xl lg:text-6xl">
                            Seven Nights
                            <br />
                            <span style={{
                                background: "linear-gradient(135deg, #FF0015, #FF6A00)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                backgroundClip: "text",
                            }}>
                                of Faith
                            </span>
                        </h2>
                        <p className="text-rw-text-2 text-base leading-relaxed max-w-[42ch] pb-2">
                            Each night is hosted by a different unit &mdash; a week-long tapestry of
                            Word, Prayer, Drama, Music, and Legacy.
                        </p>
                    </div>
                </div>

                <div className="grid lg:grid-cols-[1fr_480px] gap-8 xl:gap-14 items-start">
                    {/* LEFT: Interactive night list */}
                    <div>
                        {nights.map((n, i) => {
                            const pal = NIGHT_COLORS[i] ?? NIGHT_COLORS[0];
                            const isActive = active === i;
                            return (
                                <button
                                    key={n.day}
                                    onClick={() => setActive(i)}
                                    className={`w-full text-left group transition-all duration-300 rounded-2xl mb-1.5 ${
                                        isActive
                                            ? "shadow-sm"
                                            : "hover:bg-[#fdf8f8]"
                                    }`}
                                    style={{
                                        background: isActive ? pal.bgLight : undefined,
                                    }}
                                >
                                    <div className="flex items-start gap-5 px-5 py-5">
                                        {/* Night number */}
                                        <div className="shrink-0 flex flex-col items-center w-8 pt-0.5">
                                            <span
                                                className="font-display font-bold text-2xl leading-none transition-all duration-300"
                                                style={{
                                                    color: isActive ? pal.accent : "#d4a8b0",
                                                }}
                                            >
                                                {String(i + 1).padStart(2, "0")}
                                            </span>
                                            <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-rw-muted mt-1">
                                                {n.day}
                                            </span>
                                        </div>

                                        {/* Vertical accent line */}
                                        <div
                                            className="shrink-0 w-0.5 self-stretch rounded-full mt-1 transition-all duration-300"
                                            style={{
                                                background: isActive ? pal.accent : "#e8d0d4",
                                                opacity: isActive ? 1 : 0.4,
                                            }}
                                        />

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 flex-wrap">
                                                <h3
                                                    className="font-display font-bold text-xl leading-tight transition-colors duration-300"
                                                    style={{
                                                        color: isActive ? "#1C0003" : "#5c4048",
                                                    }}
                                                >
                                                    {n.name}
                                                </h3>
                                                <span
                                                    className="shrink-0 text-[10px] font-bold px-2.5 py-0.5 rounded-full border transition-all duration-300"
                                                    style={{
                                                        color: isActive ? pal.accent : "#9a8085",
                                                        borderColor: isActive ? `${pal.accent}33` : "#e8d0d4",
                                                        background: isActive ? `${pal.accent}0d` : "white",
                                                    }}
                                                >
                                                    {n.unit}
                                                </span>
                                            </div>

                                            <div
                                                className="overflow-hidden transition-all duration-500"
                                                style={{
                                                    maxHeight: isActive ? "6rem" : "0",
                                                    opacity: isActive ? 1 : 0,
                                                    marginTop: isActive ? "0.6rem" : "0",
                                                }}
                                            >
                                                <p className="text-sm text-rw-text-2 leading-relaxed max-w-[52ch]">
                                                    {n.desc}
                                                </p>
                                                <div className="mt-3 flex items-center gap-2">
                                                    <span
                                                        className="text-[11px] font-bold uppercase tracking-wider"
                                                        style={{ color: pal.accent }}
                                                    >
                                                        Night {String(i + 1).padStart(2, "0")}
                                                    </span>
                                                    <span className="text-[11px] text-rw-muted">· {n.day}, {TENURE.dateRange.split("–")[i === 0 ? 0 : 1]?.split(",")[0] ?? ""}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Arrow indicator */}
                                        <span
                                            className="shrink-0 mt-2 text-base transition-all duration-300"
                                            style={{
                                                color: isActive ? pal.accent : "#d4a8b0",
                                                transform: isActive ? "translateX(0)" : "translateX(-6px)",
                                                opacity: isActive ? 1 : 0.4,
                                            }}
                                        >
                                            →
                                        </span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* RIGHT: Sticky image card */}
                    <div className="hidden lg:block lg:sticky lg:top-28">
                        {/* Image */}
                        <div
                            className="relative rounded-3xl overflow-hidden shadow-2xl"
                            style={{ aspectRatio: "3/4" }}
                        >
                            <img
                                key={active}
                                src={ph(480, 640, `Night ${String(active + 1).padStart(2, "0")}\n${night.name}`, imgPal.bg, imgPal.fg)}
                                alt={night.name}
                                className="w-full h-full object-cover animate-fade-in"
                            />

                            {/* Gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                            {/* Top: night number pill */}
                            <div className="absolute top-5 left-5 flex items-center gap-2">
                                <span
                                    className="font-display font-bold text-sm px-3 py-1.5 rounded-xl text-white"
                                    style={{ background: palette.accent }}
                                >
                                    Night {String(active + 1).padStart(2, "0")}
                                </span>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-white/70 bg-white/15 backdrop-blur-sm px-2.5 py-1 rounded-xl">
                                    {night.day}
                                </span>
                            </div>

                            {/* Progress dots */}
                            <div className="absolute top-5 right-5 flex flex-col gap-1.5">
                                {nights.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setActive(i)}
                                        className="rounded-full transition-all duration-300"
                                        style={{
                                            width: active === i ? "6px" : "6px",
                                            height: active === i ? "20px" : "6px",
                                            background: active === i ? "white" : "rgba(255,255,255,0.3)",
                                        }}
                                    />
                                ))}
                            </div>

                            {/* Bottom info */}
                            <div className="absolute bottom-0 left-0 right-0 p-7">
                                <p className="font-display font-bold text-white text-3xl leading-tight">
                                    {night.name}
                                </p>
                                <p className="text-white/60 text-sm mt-2 font-medium">
                                    {night.unit}
                                </p>
                                <p className="text-white/40 text-xs mt-3 leading-relaxed">
                                    {night.desc}
                                </p>
                            </div>

                            {/* Accent glow at bottom */}
                            <div
                                className="absolute bottom-0 left-0 right-0 h-1 transition-all duration-500"
                                style={{ background: `linear-gradient(90deg, ${palette.accent}, transparent)` }}
                            />
                        </div>

                        {/* Navigation */}
                        <div className="mt-4 flex gap-2">
                            <button
                                onClick={() => setActive((a) => Math.max(0, a - 1))}
                                disabled={active === 0}
                                className="flex-1 h-10 rounded-xl border border-[var(--rw-border)] text-sm font-semibold
                                           text-rw-text-2 hover:border-[#1C0003] hover:text-[#1C0003] transition-all
                                           disabled:opacity-25 disabled:cursor-not-allowed"
                            >
                                ← Prev
                            </button>
                            <button
                                onClick={() => setActive((a) => Math.min(nights.length - 1, a + 1))}
                                disabled={active === nights.length - 1}
                                className="flex-1 h-10 rounded-xl border border-[var(--rw-border)] text-sm font-semibold
                                           text-rw-text-2 hover:border-[#1C0003] hover:text-[#1C0003] transition-all
                                           disabled:opacity-25 disabled:cursor-not-allowed"
                            >
                                Next →
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile: horizontal scroll cards */}
                <div className="lg:hidden mt-10 scroll-row -mx-5 px-5 gap-4 pb-2">
                    {nights.map((n, i) => {
                        const pal = NIGHT_COLORS[i] ?? NIGHT_COLORS[0];
                        const ip = IMG_BG[i] ?? IMG_BG[0];
                        return (
                            <button
                                key={n.day}
                                onClick={() => setActive(i)}
                                className="shrink-0 w-64 rounded-2xl overflow-hidden border text-left transition-all duration-300"
                                style={{
                                    borderColor: active === i ? pal.accent : "#e8d0d4",
                                    boxShadow: active === i ? `0 0 0 2px ${pal.accent}33` : undefined,
                                }}
                            >
                                <img
                                    src={ph(256, 160, `Night ${String(i + 1).padStart(2, "0")}\n${n.name}`, ip.bg, ip.fg)}
                                    alt={n.name}
                                    className="w-full h-36 object-cover"
                                />
                                <div className="p-4 bg-white">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="font-display font-bold text-lg" style={{ color: pal.accent }}>
                                            {String(i + 1).padStart(2, "0")}
                                        </span>
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-rw-muted">
                                            {n.day}
                                        </span>
                                    </div>
                                    <h3 className="font-display font-bold text-rw-ink text-sm leading-tight">
                                        {n.name}
                                    </h3>
                                    <p className="text-xs text-rw-muted mt-1.5 leading-relaxed line-clamp-2">
                                        {n.desc}
                                    </p>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
