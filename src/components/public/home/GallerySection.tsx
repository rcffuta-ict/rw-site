"use client";

import { useRef, useEffect, useState } from "react";
import clsx from "clsx";
import { SiteImage } from "@/components/ui/SiteImage";

type GalleryItemType = {
    w: number;
    h: number;
    label: string;
    bg: string;
    fg: string;
    span: string;
    /** [desktop, tablet, mobile] Cloudinary public IDs. Omit for placeholder. */
    imgs?: [string, string, string];
    imagePosition: "top" | "center" | "bottom";
};

// Completely optimized grid spans for a seamless mosaic on ALL screens
const GALLERY_ITEMS: GalleryItemType[] = [
    {
        w: 900,
        h: 900,
        label: "Worship Night",
        bg: "1C0003",
        fg: "FF6A00",
        imgs: [
            "900X900_worship_night_i8ozec",
            "750X750_worship_night_qdd0r3",
            "600x600_worship_night_prqvu9",
        ],
        // Large square: Takes full width on mobile, massive block on desktop
        span: "col-span-2 row-span-2 sm:col-span-4 sm:row-span-4 lg:col-span-4 lg:row-span-4",
        imagePosition: "top",
    },
    {
        w: 600,
        h: 400,
        label: "Opening Ceremony",
        bg: "2d0008",
        fg: "ffaaaa",
        imgs: [
            "600X400_opening_ceremony_t3et5b",
            "500x333_opening_ceremony_makkgt",
            "400x267_opening_ceremony_iaki5f",
        ],
        // Wide rectangle: Full width on mobile, wide banner on desktop
        span: "col-span-2 row-span-1 sm:col-span-2 sm:row-span-2 lg:col-span-4 lg:row-span-2",
        imagePosition: "center",
    },
    {
        w: 400,
        h: 800,
        label: "Drama Night",
        bg: "3d1500",
        fg: "ff8844",
        imgs: [
            "400X800_drama_night_gu4nfm",
            "333x667_drama_night_gec2od",
            "257x533_drama_night_xgexnj",
        ],
        // Portrait tall: 1 column on mobile (so things can flow next to it!), tall on desktop
        span: "col-span-1 row-span-2 sm:col-span-2 sm:row-span-4 lg:col-span-2 lg:row-span-4",
        imagePosition: "top",
    },
    {
        w: 400,
        h: 400,
        label: "Choir Concert",
        bg: "002a15",
        fg: "66ffaa",
        imgs: [
            "400X400_choir_concert_b9l4vp",
            "333x333_choir_concert_m8vikt",
            "267x267_choir_concert_skyasp",
        ],
        // Small Square: Fits perfectly next to tall portrait items on mobile
        span: "col-span-1 row-span-1 sm:col-span-2 sm:row-span-2 lg:col-span-2 lg:row-span-2",
        imagePosition: "top",
    },
    {
        w: 400,
        h: 400,
        label: "Power Night",
        bg: "15004a",
        fg: "aa66ff",
        imgs: [
            "400X400_power_night_byarph",
            "333x333_power_night_cagpof",
            "267x267_power_night_k2aujr",
        ],
        span: "col-span-1 row-span-1 sm:col-span-2 sm:row-span-2 lg:col-span-2 lg:row-span-2",
        imagePosition: "center",
    },
    {
        w: 800,
        h: 400,
        label: "Word Night",
        bg: "001540",
        fg: "66aaff",
        imgs: [
            "800X400_word_night_ksp7qn",
            "667X333_word_night_knm6rw",
            "533x267_word_night_v42yp7",
        ],
        span: "col-span-2 row-span-1 sm:col-span-4 sm:row-span-2 lg:col-span-4 lg:row-span-2",
        imagePosition: "center",
    },
    {
        w: 400,
        h: 400,
        label: "Alumni Reunion",
        bg: "2a1c00",
        fg: "ffcc44",
        imgs: ["400X400_alumni_i4o9kp", "333x333_alumni_oldlna", "267x267_alumni_pjl0qq"],
        span: "col-span-1 row-span-1 sm:col-span-2 sm:row-span-2 lg:col-span-2 lg:row-span-2",
        imagePosition: "top",
    },
    {
        w: 400,
        h: 800,
        label: "Handing Over",
        bg: "003322",
        fg: "aaffcc",
        imgs: [
            "400X800_handing_over_lri25b",
            "333x667_handing_over_bufpjj",
            "267x533_handing_over_v0lvb6",
        ],
        span: "col-span-1 row-span-2 sm:col-span-2 sm:row-span-4 lg:col-span-2 lg:row-span-4",
        imagePosition: "top",
    },
    {
        w: 800,
        h: 800,
        label: "Fellowship Moments",
        bg: "200010",
        fg: "FF6A00",
        imgs: [
            "800X800_fellowship_moment_lqw51w",
            "667X667_fellowship_moment_lxh6un",
            "533x533_fellowship_moment_vtmqnv",
        ],
        span: "col-span-2 row-span-2 sm:col-span-4 sm:row-span-4 lg:col-span-4 lg:row-span-4",
        imagePosition: "top",
    },
    {
        w: 400,
        h: 400,
        label: "Campus Life",
        bg: "0a1800",
        fg: "88ff88",
        imgs: [
            "400X400_campus_life_ovbpbj",
            "333x333_campus_life_dh1eeh",
            "267x267_campus_life_frsuy9",
        ],
        span: "col-span-1 row-span-1 sm:col-span-2 sm:row-span-2 lg:col-span-2 lg:row-span-2",
        imagePosition: "top",
    },
    {
        w: 400,
        h: 400,
        label: "Community",
        bg: "1C0003",
        fg: "ffaaaa",
        imgs: [
            "400X400_COMMUNITY_111749_rptmpb",
            "333x333_community_012909_pvpvcp",
            "267x267_community_114840_hecgxh",
        ],
        span: "col-span-1 row-span-1 sm:col-span-2 sm:row-span-2 lg:col-span-2 lg:row-span-2",
        imagePosition: "center",
    },
    {
        w: 800,
        h: 400,
        label: "Prayer Night",
        bg: "0d0028",
        fg: "ccaaff",
        imgs: [
            "800X400_prayer_night_uqoyq4",
            "667X333_prayer_night_qlxvpu",
            "533x267_prayer_night_f772e0",
        ],
        span: "col-span-2 row-span-1 sm:col-span-4 sm:row-span-2 lg:col-span-4 lg:row-span-2",
        imagePosition: "top",
    },
    {
        w: 400,
        h: 400,
        label: "Praise & Worship",
        bg: "300005",
        fg: "FF6A00",
        imgs: [
            "400X400_praise_worship_y4mltv",
            "333x333_praise_worship_z2orvd",
            "267x267_praise_worship_lafi40",
        ],
        span: "col-span-1 row-span-1 sm:col-span-2 sm:row-span-2 lg:col-span-2 lg:row-span-2",
        imagePosition: "center",
    },
    {
        w: 400,
        h: 400,
        label: "RIFE Night",
        bg: "1a1800",
        fg: "ffff88",
        imgs: [
            "400X400_rife_night_wiol6m",
            "333x333_rife_night_e91a1f",
            "267x267_rife_night_pcn2zd",
        ],
        span: "col-span-1 row-span-1 sm:col-span-2 sm:row-span-2 lg:col-span-2 lg:row-span-2",
        imagePosition: "top",
    },
    {
        w: 800,
        h: 400,
        label: "Southgate Auditorium",
        bg: "001820",
        fg: "44ddff",
        // No real asset yet — stays a placeholder.
        span: "col-span-2 row-span-1 sm:col-span-4 sm:row-span-2 lg:col-span-4 lg:row-span-2",
        imagePosition: "center",
    },
    {
        w: 400,
        h: 400,
        label: "Drama Team",
        bg: "380000",
        fg: "ffaaaa",
        imgs: [
            "400X400_drama_team_iihsxo",
            "333x333_drama_team_pdy1xt",
            "267x267_drama_team_hru9vn",
        ],
        span: "col-span-1 row-span-1 sm:col-span-2 sm:row-span-2 lg:col-span-2 lg:row-span-2",
        imagePosition: "center",
    },
    {
        w: 400,
        h: 400,
        label: "Choir",
        bg: "003010",
        fg: "aaffaa",
        imgs: ["400X400_choir_kpsggn", "333x333_choir_nydooq", "267x267_choir_l4nbdf"],
        span: "col-span-1 row-span-1 sm:col-span-2 sm:row-span-2 lg:col-span-2 lg:row-span-2",
        imagePosition: "top",
    },
    {
        w: 400,
        h: 400,
        label: "Bible Study",
        bg: "0d0028",
        fg: "aaffaa",
        imgs: [
            "400X400_bible_study_p2u9gj",
            "333x333_bible_study_tleteh",
            "267x267_bible_study_dtpifw",
        ],
        span: "col-span-1 row-span-1 sm:col-span-2 sm:row-span-2 lg:col-span-2 lg:row-span-2",
        imagePosition: "center",
    },
];

function GalleryItem({ item, index }: { item: GalleryItemType; index: number }) {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setVisible(true);
            },
            { threshold: 0.05 }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            className={`${item.span} overflow-hidden group relative cursor-pointer w-full h-full min-h-full transition-all duration-700 ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: `${(index % 5) * 80}ms` }}
        >
            <SiteImage
                src={item.imgs?.[0]}
                alt={item.label}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                placeholderLabel={item.label}
                colors={{ bg: item.bg, fg: item.fg }}
                className={clsx(
                    "w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out",
                    {
                        "object-top": item.imagePosition === "top",
                        "object-center": item.imagePosition === "center",
                        "object-bottom": item.imagePosition === "bottom",
                    }
                )}
            />

            {/* Gradient hover overlay */}
            <div
                className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent
                            opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-end p-5"
            >
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
                    <svg
                        className="h-2.5 w-2.5 text-white"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 15.803 7.5 7.5 0 0 0 15.803 15.803Z"
                        />
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
            const pct = Math.max(
                0,
                Math.min(1, -rect.top / (rect.height - window.innerHeight))
            );
            setScrollPct(pct);
        };
        window.addEventListener("scroll", handler, { passive: true });
        return () => window.removeEventListener("scroll", handler);
    }, []);

    return (
        <section
            ref={sectionRef}
            className="relative bg-rw-bg-warm overflow-hidden w-full section-py-sm"
        >
            {/* Atmospheric glow that responds to scroll */}
            <div
                className="pointer-events-none absolute inset-0 transition-opacity duration-300"
                style={{
                    background: `radial-gradient(ellipse at ${30 + scrollPct * 40}% ${20 + scrollPct * 60}%, rgba(255,106,0,0.12) 0%, transparent 60%)`,
                }}
            />

            {/* Heading */}
            <div className="section-container pb-12! relative z-10">
                <div
                    data-reveal="up"
                    className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6"
                >
                    <div>
                        <p className="eyebrow mb-4 !text-[#FF6A00]">The Archives</p>
                        <h2 className="section-heading text-4xl sm:text-5xl lg:text-6xl text-white">
                            Moments from
                            <br />
                            <span
                                style={{
                                    background:
                                        "linear-gradient(135deg, #FF6A00, #FF0015)",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                    backgroundClip: "text",
                                }}
                            >
                                Previous Editions
                            </span>
                        </h2>
                    </div>
                    <p className="text-sm text-rw-muted max-w-[220px] sm:text-right leading-relaxed">
                        A visual journey through past editions — glory, power, and
                        community.
                    </p>
                </div>
            </div>

            {/* Full-bleed responsive masonry photo grid with your exact layout wrapper */}
            <div className="w-full grid grid-cols-2 sm:grid-cols-6 lg:grid-cols-12 grid-flow-dense gap-1 auto-rows-[140px] sm:auto-rows-[65px] lg:auto-rows-[65px]">
                {GALLERY_ITEMS.map((item, i) => (
                    <GalleryItem key={i} item={item} index={i} />
                ))}
            </div>

            {/* Bottom bar */}
            <div className="section-container pt-10! relative z-10">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-rw-muted font-medium text-center sm:text-left">
                        Images courtesy of the RCF FUTA media team — updated as the event
                        approaches.
                    </p>
                    <div className="flex items-center gap-2 text-xs text-rw-muted font-bold uppercase tracking-wider">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#FF6A00] animate-pulse" />
                        {GALLERY_ITEMS.length} moments captured
                    </div>
                </div>
            </div>
        </section>
    );
}
