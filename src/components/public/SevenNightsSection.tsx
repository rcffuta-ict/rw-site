"use client";

import { useState } from "react";
import { ph } from "@/lib/utils";

interface Night {
    day: string;
    name: string;
    unit: string;
    desc: string;
}

const COLOR_BY_NIGHT: Record<number, { bg: string; fg: string }> = {
    0: { bg: "f9f5f0", fg: "8c6a3a" },
    1: { bg: "f0f4f9", fg: "2e5080" },
    2: { bg: "f5f0f9", fg: "6a2e80" },
    3: { bg: "f9f0f0", fg: "802e2e" },
    4: { bg: "f0f9f0", fg: "2e6a2e" },
    5: { bg: "f9f7e8", fg: "8c7a20" },
    6: { bg: "f0f9f9", fg: "2e6a6a" },
};

export function SevenNightsSection({ nights }: { nights: Night[] }) {
    const [active, setActive] = useState(0);

    const night = nights[active];
    const palette = COLOR_BY_NIGHT[active] ?? { bg: "f3f4f6", fg: "9ca3af" };

    return (
        <section className="section-container section-py">
            {/* Header */}
            <div className="mb-16 max-w-2xl">
                <p className="eyebrow mb-4">The Programme</p>
                <h2 className="section-heading text-4xl sm:text-5xl lg:text-6xl">
                    Seven Nights
                    <br />
                    of Faith
                </h2>
                <p className="mt-5 text-rw-text-2 text-lg leading-relaxed max-w-[48ch]">
                    Each night is hosted by a different unit — a week-long tapestry of
                    Word, Prayer, Drama, Music, and Legacy.
                </p>
            </div>

            <div className="grid lg:grid-cols-[1fr_440px] gap-12 xl:gap-20 items-start">
                {/* LEFT: List */}
                <div className="flex flex-col divide-y divide-[var(--rw-border)]">
                    {nights.map((n, i) => (
                        <button
                            key={n.day}
                            onClick={() => setActive(i)}
                            className={`group flex items-start gap-6 py-7 text-left w-full transition-all duration-300 ${
                                active === i
                                    ? "opacity-100"
                                    : "opacity-40 hover:opacity-75"
                            }`}
                        >
                            {/* Number + day */}
                            <div className="shrink-0 flex flex-col items-center gap-1 w-10 pt-0.5">
                                <span
                                    className={`font-display font-bold text-2xl leading-none transition-colors duration-300 ${
                                        active === i
                                            ? "text-rw-crimson"
                                            : "text-rw-muted/50"
                                    }`}
                                >
                                    {String(i + 1).padStart(2, "0")}
                                </span>
                                <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-rw-muted">
                                    {n.day}
                                </span>
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 flex-wrap">
                                    <h3
                                        className={`font-display font-bold text-xl leading-tight transition-colors duration-300 ${
                                            active === i
                                                ? "text-rw-ink"
                                                : "text-rw-text-2"
                                        }`}
                                    >
                                        {n.name}
                                    </h3>
                                    <span className="shrink-0 text-[11px] font-semibold text-rw-muted bg-rw-bg-alt border border-[var(--rw-border)] px-2.5 py-0.5 rounded-full">
                                        {n.unit}
                                    </span>
                                </div>

                                <div
                                    className={`overflow-hidden transition-all duration-500 ${
                                        active === i
                                            ? "max-h-24 mt-2.5 opacity-100"
                                            : "max-h-0 opacity-0"
                                    }`}
                                >
                                    <p className="text-sm text-rw-text-2 leading-relaxed max-w-[52ch]">
                                        {n.desc}
                                    </p>
                                </div>
                            </div>

                            {/* Arrow */}
                            <span
                                className={`shrink-0 mt-1 text-lg transition-all duration-300 ${
                                    active === i
                                        ? "text-rw-crimson translate-x-0 opacity-100"
                                        : "text-rw-muted/20 -translate-x-2 opacity-0 group-hover:opacity-50 group-hover:translate-x-0"
                                }`}
                            >
                                →
                            </span>
                        </button>
                    ))}
                </div>

                {/* RIGHT: Sticky image */}
                <div className="hidden lg:block lg:sticky lg:top-28">
                    <div
                        className="relative rounded-3xl overflow-hidden"
                        style={{ aspectRatio: "3/4" }}
                    >
                        <img
                            key={active}
                            src={ph(
                                440,
                                587,
                                `Night ${String(active + 1).padStart(2, "0")}\n${night.name}\n440×587`,
                                palette.bg,
                                palette.fg
                            )}
                            alt={night.name}
                            className="w-full h-full object-cover animate-fade-in"
                        />
                        {/* Bottom info overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-7 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50 mb-2 block">
                                Night {String(active + 1).padStart(2, "0")} · {night.day}
                            </span>
                            <p className="font-display font-bold text-white text-2xl leading-tight">
                                {night.name}
                            </p>
                            <p className="text-white/60 text-sm mt-1 font-medium">
                                {night.unit}
                            </p>
                        </div>

                        {/* Progress dots */}
                        <div className="absolute top-5 right-5 flex flex-col gap-1.5">
                            {nights.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActive(i)}
                                    className={`rounded-full transition-all duration-300 ${
                                        active === i
                                            ? "h-5 w-1.5 bg-white"
                                            : "h-1.5 w-1.5 bg-white/30 hover:bg-white/60"
                                    }`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Navigation buttons */}
                    <div className="mt-4 flex gap-2">
                        <button
                            onClick={() => setActive((a) => Math.max(0, a - 1))}
                            disabled={active === 0}
                            className="flex-1 h-10 rounded-xl border border-[var(--rw-border)] text-sm font-semibold text-rw-text-2 hover:border-rw-ink hover:text-rw-ink transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            ← Prev
                        </button>
                        <button
                            onClick={() =>
                                setActive((a) => Math.min(nights.length - 1, a + 1))
                            }
                            disabled={active === nights.length - 1}
                            className="flex-1 h-10 rounded-xl border border-[var(--rw-border)] text-sm font-semibold text-rw-text-2 hover:border-rw-ink hover:text-rw-ink transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            Next →
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile: scroll cards */}
            <div className="lg:hidden mt-10 scroll-row -mx-5 px-5 gap-4 pb-2">
                {nights.map((n, i) => {
                    const pal = COLOR_BY_NIGHT[i] ?? { bg: "f3f4f6", fg: "9ca3af" };
                    return (
                        <div
                            key={n.day}
                            className="shrink-0 w-64 rounded-2xl overflow-hidden border border-[var(--rw-border)] bg-white shadow-sm"
                        >
                            <img
                                src={ph(
                                    256,
                                    192,
                                    `Night ${String(i + 1).padStart(2, "0")}\n${n.name}\n256×192`,
                                    pal.bg,
                                    pal.fg
                                )}
                                alt={n.name}
                                className="w-full h-40 object-cover"
                            />
                            <div className="p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="font-display font-bold text-rw-crimson text-lg">
                                        {String(i + 1).padStart(2, "0")}
                                    </span>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-rw-muted">
                                        {n.day}
                                    </span>
                                </div>
                                <h3 className="font-display font-bold text-rw-ink text-sm">
                                    {n.name}
                                </h3>
                                <p className="text-xs text-rw-muted mt-1.5 leading-relaxed line-clamp-2">
                                    {n.desc}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
