"use client";

import { useRef, useEffect, useState } from "react";
import { ph } from "@/lib/utils/functions";

// Varied grid layout — mix of wide + tall + square cells
const GALLERY_ITEMS = [
    { w: 900, h: 900,  label: "Worship Night",       bg: "1C0003", fg: "FF6A00", span: "col-span-2 row-span-2" },
    { w: 600, h: 400,  label: "Opening Ceremony",    bg: "2d0008", fg: "ffaaaa", span: "col-span-2 row-span-1" },
    { w: 400, h: 800,  label: "Drama Night",         bg: "3d1500", fg: "ff8844", span: "col-span-1 row-span-2" },
    { w: 400, h: 400,  label: "Choir Concert",       bg: "002a15", fg: "66ffaa", span: "col-span-1 row-span-1" },
    { w: 400, h: 400,  label: "Power Night",         bg: "15004a", fg: "aa66ff", span: "col-span-1 row-span-1" },
    { w: 800, h: 400,  label: "Word Night",          bg: "001540", fg: "66aaff", span: "col-span-2 row-span-1" },
    { w: 400, h: 400,  label: "Alumni Reunion",      bg: "2a1c00", fg: "ffcc44", span: "col-span-1 row-span-1" },
    { w: 400, h: 800,  label: "Handing Over",        bg: "003322", fg: "aaffcc", span: "col-span-1 row-span-2" },
    { w: 800, h: 800,  label: "Fellowship Moments",  bg: "200010", fg: "FF6A00", span: "col-span-2 row-span-2" },
    { w: 400, h: 400,  label: "Campus Life",         bg: "0a1800", fg: "88ff88", span: "col-span-1 row-span-1" },
    { w: 400, h: 400,  label: "Community",           bg: "1C0003", fg: "ffaaaa", span: "col-span-1 row-span-1" },
    { w: 800, h: 400,  label: "Prayer Night",        bg: "0d0028", fg: "ccaaff", span: "col-span-2 row-span-1" },
    { w: 400, h: 400,  label: "Praise & Worship",   bg: "300005", fg: "FF6A00", span: "col-span-1 row-span-1" },
    { w: 400, h: 400,  label: "RIFE Night",          bg: "1a1800", fg: "ffff88", span: "col-span-1 row-span-1" },
    { w: 800, h: 400,  label: "Southgate Auditorium",bg: "001820", fg: "44ddff", span: "col-span-2 row-span-1" },
    { w: 400, h: 400,  label: "Drama Team",          bg: "380000", fg: "ffaaaa", span: "col-span-1 row-span-1" },
    { w: 400, h: 400,  label: "Choir",               bg: "003010", fg: "aaffaa", span: "col-span-1 row-span-1" },
];

function GalleryItem({ item, index }: { item: typeof GALLERY_ITEMS[0]; index: number }) {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setVisible(true); },
            { threshold: 0.1 }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            className={`${item.span} overflow-hidden group relative cursor-pointer transition-all duration-700 ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: `${(index % 5) * 80}ms` }}
        >
            <img
                src={ph(item.w, item.h, item.label, item.bg, item.fg)}
                alt={item.label}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            />

            {/* Gradient hover overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent
                            opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-end p-5">
                <div>
                    <span className="text-white text-[11px] font-bold uppercase tracking-[0.2em] drop-shadow">
                        {item.label}
                    </span>
                    <div className="h-0.5 w-6 bg-[#FF6A00] rounded-full mt-1.5 group-hover:w-12 transition-all duration-500" />
                </div>
            </div>

            {/* Subtle permanent corner indicator */}
            <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="h-5 w-5 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
                    <svg className="h-2.5 w-2.5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 15.803 7.5 7.5 0 0 0 15.803 15.803Z" />
                    </svg>
                </div>
            </div>
        </div>
    );
}

export function GallerySection() {
    const sectionRef = useRef<HTMLElement>(null);
    const [scrollPct, setScrollPct] = useState(0);

    useEffect(() => {
        const handler = () => {
            const el = sectionRef.current;
            if (!el) return;
            const rect = el.getBoundingClientRect();
            const pct = Math.max(0, Math.min(1, -rect.top / (rect.height - window.innerHeight)));
            setScrollPct(pct);
        };
        window.addEventListener("scroll", handler, { passive: true });
        return () => window.removeEventListener("scroll", handler);
    }, []);

    return (
        <section ref={sectionRef} className="relative bg-[#1C0003] overflow-hidden">
            {/* Atmospheric glow that responds to scroll */}
            <div
                className="pointer-events-none absolute inset-0 transition-opacity duration-300"
                style={{
                    background: `radial-gradient(ellipse at ${30 + scrollPct * 40}% ${20 + scrollPct * 60}%, rgba(255,106,0,0.12) 0%, transparent 60%)`,
                }}
            />

            {/* Heading — sticky while scrolling through grid */}
            <div className="section-container pt-20 pb-12 relative z-10">
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
                    <div>
                        <p className="eyebrow mb-4 !text-[#FF6A00]">The Archives</p>
                        <h2 className="section-heading text-4xl sm:text-5xl lg:text-6xl text-white">
                            Moments from
                            <br />
                            <span style={{
                                background: "linear-gradient(135deg, #FF6A00, #FF0015)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                backgroundClip: "text",
                            }}>
                                Previous Editions
                            </span>
                        </h2>
                    </div>
                    <p className="text-sm text-white/40 max-w-[220px] sm:text-right leading-relaxed">
                        A visual journey through past editions — glory, power, and community.
                    </p>
                </div>
            </div>

            {/* Full-bleed masonry photo grid — NO side padding */}
            <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-1 auto-rows-[100px] sm:auto-rows-[130px] lg:auto-rows-[160px]">
                {GALLERY_ITEMS.map((item, i) => (
                    <GalleryItem key={i} item={item} index={i} />
                ))}
            </div>

            {/* Bottom bar */}
            <div className="section-container py-10 relative z-10">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-white/25 font-medium text-center sm:text-left">
                        Images courtesy of the RCF FUTA media team — updated as the event approaches.
                    </p>
                    <div className="flex items-center gap-2 text-xs text-white/30 font-bold uppercase tracking-wider">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#FF6A00] animate-pulse" />
                        {GALLERY_ITEMS.length} moments captured
                    </div>
                </div>
            </div>
        </section>
    );
}
