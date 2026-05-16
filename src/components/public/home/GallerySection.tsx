import { ph } from "@/lib/utils/functions";

const GALLERY_ITEMS = [
    { w: 800, h: 800, label: "Worship Night",    bg: "1C0003", fg: "FF6A00", span: "col-span-2 row-span-2" },
    { w: 600, h: 400, label: "Opening Ceremony", bg: "3d0008", fg: "ffffff", span: "col-span-2 row-span-1" },
    { w: 400, h: 800, label: "Drama Night",      bg: "cc4400", fg: "ffffff", span: "col-span-1 row-span-2" },
    { w: 400, h: 400, label: "Choir Concert",    bg: "022400", fg: "aaffaa", span: "col-span-1 row-span-1" },
    { w: 400, h: 400, label: "Power Night",      bg: "1a0040", fg: "cc88ff", span: "col-span-1 row-span-1" },
    { w: 400, h: 400, label: "Word Night",       bg: "002244", fg: "88ccff", span: "col-span-1 row-span-1" },
    { w: 400, h: 400, label: "Alumni Reunion",   bg: "3a2800", fg: "ffcc44", span: "col-span-1 row-span-1" },
    { w: 400, h: 800, label: "Handing Over",     bg: "004422", fg: "ffffff", span: "col-span-1 row-span-2" },
    { w: 800, h: 800, label: "Fellowship Moment",bg: "2c0010", fg: "FF6A00", span: "col-span-2 row-span-2" },
    { w: 800, h: 400, label: "Campus Life",      bg: "0a1800", fg: "88ff88", span: "col-span-2 row-span-1" },
    { w: 400, h: 400, label: "Community",        bg: "1C0003", fg: "ffaaaa", span: "col-span-1 row-span-1" },
    { w: 400, h: 400, label: "Prayer Night",     bg: "0d0020", fg: "ccaaff", span: "col-span-1 row-span-1" },
    { w: 400, h: 400, label: "Praise & Worship", bg: "300000", fg: "FF6A00", span: "col-span-1 row-span-1" },
    { w: 400, h: 400, label: "RIFE Night",       bg: "1a1a00", fg: "ffff88", span: "col-span-1 row-span-1" },
];

export function GallerySection() {
    return (
        <section className="section-py overflow-hidden bg-[#1C0003]">
            {/* Heading — contained */}
            <div className="section-container mb-10">
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
                    <div>
                        <p className="eyebrow mb-4 !text-[#FF6A00]">The Archives</p>
                        <h2 className="section-heading text-3xl sm:text-4xl lg:text-5xl text-white">
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
                    <p className="text-sm text-white/40 hidden sm:block max-w-[240px] text-right leading-relaxed">
                        A visual journey through past editions — glory, power, and community.
                    </p>
                </div>
            </div>

            {/* Full-bleed masonry grid — NO container, edge to edge */}
            <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-1.5 auto-rows-[140px] sm:auto-rows-[180px] lg:auto-rows-[200px] px-1.5">
                {GALLERY_ITEMS.map(({ w, h, label, bg, fg, span }, i) => (
                    <div
                        key={i}
                        className={`${span} overflow-hidden group relative cursor-pointer`}
                    >
                        <img
                            src={ph(w, h, label, bg, fg)}
                            alt={label}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent
                                        opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                            <span className="text-white text-xs font-bold uppercase tracking-wider drop-shadow">
                                {label}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer note */}
            <div className="section-container mt-8">
                <p className="text-center text-xs text-white/25 font-medium">
                    Images courtesy of the RCF FUTA media team — more moments to be added as the event approaches.
                </p>
            </div>
        </section>
    );
}
