import { ph } from "@/lib/utils/functions";
import { TENURE, FELLOWSHIP } from "@/lib/config";

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

// Three staggered photo placeholders with different colored tones
const PHOTO_GRID = [
    { w: 340, h: 280, label: "Fellowship Community", bg: "fdf0f0", fg: "FF0015" },
    { w: 340, h: 280, label: "Praise & Worship",     bg: "f0f0fd", fg: "5544cc" },
    { w: 700, h: 220, label: "Campus Gathering",      bg: "f0fdf0", fg: "022400" },
    { w: 340, h: 240, label: "Word & Teaching",       bg: "fdf8f0", fg: "cc6600" },
    { w: 340, h: 240, label: "Prayer Night",          bg: "fdf0fd", fg: "884499" },
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
                            The heart of<br />
                            <span className="text-[#FF0015]">Redemption Week</span>
                        </h2>
                        <p className="mt-5 text-rw-text-2 leading-relaxed text-lg max-w-[44ch]">
                            The Redeemed Christian Fellowship, FUTA — shaping hearts and
                            lives since {FELLOWSHIP.founded}. A spiritual home, a family, a legacy.
                        </p>

                        {/* Photo collage — 5 images in an asymmetric stagger */}
                        <div className="mt-10 grid grid-cols-2 gap-3">
                            <img
                                src={ph(PHOTO_GRID[0].w, PHOTO_GRID[0].h, PHOTO_GRID[0].label, PHOTO_GRID[0].bg, PHOTO_GRID[0].fg)}
                                alt="Fellowship community"
                                className="rounded-2xl object-cover w-full h-44 hover-lift"
                            />
                            <img
                                src={ph(PHOTO_GRID[1].w, PHOTO_GRID[1].h, PHOTO_GRID[1].label, PHOTO_GRID[1].bg, PHOTO_GRID[1].fg)}
                                alt="Praise and worship"
                                className="rounded-2xl object-cover w-full h-44 hover-lift mt-6"
                            />
                            <img
                                src={ph(PHOTO_GRID[2].w, PHOTO_GRID[2].h, PHOTO_GRID[2].label, PHOTO_GRID[2].bg, PHOTO_GRID[2].fg)}
                                alt="Campus gathering"
                                className="col-span-2 rounded-2xl object-cover w-full h-36 hover-lift"
                            />
                            <img
                                src={ph(PHOTO_GRID[3].w, PHOTO_GRID[3].h, PHOTO_GRID[3].label, PHOTO_GRID[3].bg, PHOTO_GRID[3].fg)}
                                alt="Word and teaching"
                                className="rounded-2xl object-cover w-full h-36 hover-lift"
                            />
                            <img
                                src={ph(PHOTO_GRID[4].w, PHOTO_GRID[4].h, PHOTO_GRID[4].label, PHOTO_GRID[4].bg, PHOTO_GRID[4].fg)}
                                alt="Prayer night"
                                className="rounded-2xl object-cover w-full h-36 hover-lift"
                            />
                        </div>

                        {/* Fellowship quick stats */}
                        <div className="mt-8 grid grid-cols-3 gap-3">
                            {[
                                { value: `${TENURE.anniversary} yrs`, label: "Of Impact" },
                                { value: FELLOWSHIP.stats.alumni, label: "Alumni" },
                                { value: FELLOWSHIP.stats.members, label: "Active Members" },
                            ].map((s) => (
                                <div key={s.label}
                                    className="rounded-2xl bg-[#fdf8f8] border border-[#e8d0d4] p-4 text-center">
                                    <p className="font-display font-extrabold text-2xl text-[#FF0015]">{s.value}</p>
                                    <p className="text-xs text-rw-muted font-medium mt-0.5">{s.label}</p>
                                </div>
                            ))}
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
                                        <p className="mt-2 text-sm text-rw-muted leading-relaxed">{a.desc}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}
