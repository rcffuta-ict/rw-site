import { TENURE, FELLOWSHIP } from "@/lib/config";
import { ResponsiveSiteImage } from "@/components/ui/SiteImage";

const AIMS = [
    {
        n: "01",
        title: "Spiritual Growth",
        desc: "Word, Prayer, Drama, and Worship — hearts stirred, lives transformed, faith deepened.",
        color: "#FF0015",
    },
    {
        n: "02",
        title: "Alumni Legacy",
        desc: `Reconnecting generations. Preserving ${TENURE.anniversary} years of fellowship heritage.`,
        color: "#FF6A00",
    },
    {
        n: "03",
        title: "Meaningful Connection",
        desc: "Relationships built on shared values — mentorship, partnership, lifelong friendship.",
        color: "#FF0015",
    },
    {
        n: "04",
        title: "Family & Belonging",
        desc: "A spiritual family joined by the blood of Christ. No unit, tribe, or worker left out.",
        color: "#FF6A00",
    },
    {
        n: "05",
        title: "Cultural Unity",
        desc: "Celebrating the richness of diversity — one in language, art, attire, and Christ.",
        color: "#FF0015",
    },
];

// Real Cloudinary photos (desktop + mobile variants).
type PhotoSlot = {
    desktopSrc: string;
    mobileSrc: string;
    alt: string;
};

const PHOTO_GRID: PhotoSlot[] = [
    {
        desktopSrc: "340X280_fellowship_community_znuzhc",
        mobileSrc: "170x140_fellowship_community_la0lrf",
        alt: "Fellowship community",
    },
    {
        desktopSrc: "340X280_worship_n7oe10",
        mobileSrc: "170x140_worship_ir1r9q",
        alt: "Praise and worship",
    },
    {
        desktopSrc: "700X220_campus_gathering_vy3p1t",
        mobileSrc: "350x110_campus_gathering_wjngjl",
        alt: "Campus gathering",
    },
    {
        desktopSrc: "340X240_bible_study_ozqi7d",
        mobileSrc: "170x120_bible_study_gghmog",
        alt: "Word and teaching",
    },
    {
        desktopSrc: "340X240_prayer_night_i7e7kl",
        mobileSrc: "170x120_prayer_night_cefyct",
        alt: "Prayer night",
    },
];

export function AboutSection() {
    return (
        <section className="section-py bg-white">
            <div className="section-container">
                <div className="grid lg:grid-cols-2 gap-16 xl:gap-24 items-start">
                    {/* Left: images + intro */}
                    <div>
                        <p className="eyebrow mb-4">Why We Gather</p>
                        <h2 className="section-heading text-3xl sm:text-4xl lg:text-5xl">
                            The heart of
                            <br />
                            <span className="text-[#FF0015]">Redemption Week</span>
                        </h2>
                        <p className="mt-5 text-rw-text-2 leading-relaxed text-lg max-w-[44ch]">
                            The Redeemed Christian Fellowship, FUTA — shaping hearts and
                            lives since {FELLOWSHIP.founded}. A spiritual home, a family,
                            a legacy.
                        </p>

                        {/* Photo collage — 5 images in an asymmetric stagger */}
                        <div className="mt-10 grid grid-cols-2 gap-3">
                            <div className="relative w-full h-44 rounded-2xl overflow-hidden hover-lift">
                                <ResponsiveSiteImage
                                    desktopSrc={PHOTO_GRID[0].desktopSrc!}
                                    mobileSrc={PHOTO_GRID[0].mobileSrc!}
                                    alt={PHOTO_GRID[0].alt}
                                />
                            </div>

                            <div className="relative w-full h-44 rounded-2xl overflow-hidden hover-lift mt-6">
                                <ResponsiveSiteImage
                                    desktopSrc={PHOTO_GRID[1].desktopSrc!}
                                    mobileSrc={PHOTO_GRID[1].mobileSrc!}
                                    alt={PHOTO_GRID[1].alt}
                                />
                            </div>

                            {/* Campus Gathering — full-width banner */}
                            <div className="col-span-2 relative w-full h-36 rounded-2xl overflow-hidden hover-lift">
                                <ResponsiveSiteImage
                                    desktopSrc={PHOTO_GRID[2].desktopSrc!}
                                    mobileSrc={PHOTO_GRID[2].mobileSrc!}
                                    alt={PHOTO_GRID[2].alt}
                                    imageTop
                                />
                            </div>

                            <div className="relative w-full h-36 rounded-2xl overflow-hidden hover-lift">
                                <ResponsiveSiteImage
                                    desktopSrc={PHOTO_GRID[3].desktopSrc!}
                                    mobileSrc={PHOTO_GRID[3].mobileSrc!}
                                    alt={PHOTO_GRID[3].alt}
                                    imageTop
                                />
                            </div>

                            <div className="relative w-full h-36 rounded-2xl overflow-hidden hover-lift">
                                <ResponsiveSiteImage
                                    desktopSrc={PHOTO_GRID[4].desktopSrc!}
                                    mobileSrc={PHOTO_GRID[4].mobileSrc!}
                                    alt={PHOTO_GRID[4].alt}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right: aims list */}
                    <div>
                        <p className="eyebrow mb-8">Our Five Aims</p>
                        <ul className="flex flex-col">
                            {AIMS.map((a) => (
                                <li
                                    key={a.title}
                                    className="group flex gap-6 py-7 border-b border-[#e8d0d4] last:border-0
                                               hover:bg-[#fdf8f8] -mx-4 px-4 rounded-xl transition-colors duration-200"
                                >
                                    <span
                                        className="font-display font-bold text-3xl shrink-0 w-10 pt-1 transition-colors"
                                        style={{ color: `${a.color}22` }}
                                    >
                                        {a.n}
                                    </span>
                                    <div>
                                        <h3 className="font-semibold text-[#1C0003] text-lg group-hover:text-[#FF0015] transition-colors">
                                            {a.title}
                                        </h3>
                                        <p className="mt-2 text-sm text-rw-muted leading-relaxed">
                                            {a.desc}
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        {/* Fellowship quick stats */}
                        <div className="mt-8 grid grid-cols-3 gap-3">
                            {[
                                {
                                    value: `${TENURE.anniversary} yrs`,
                                    label: "Of Impact",
                                },
                                { value: FELLOWSHIP.stats.alumni, label: "Alumni" },
                                {
                                    value: FELLOWSHIP.stats.members,
                                    label: "Active Members",
                                },
                            ].map((s) => (
                                <div
                                    key={s.label}
                                    className="rounded-2xl bg-[#fdf8f8] border border-[#e8d0d4] p-4 text-center"
                                >
                                    <p className="font-display font-extrabold text-xl lg:text-2xl! text-[#FF0015]">
                                        {s.value}
                                    </p>
                                    <p className="text-xs text-rw-muted font-medium mt-0.5">
                                        {s.label}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
