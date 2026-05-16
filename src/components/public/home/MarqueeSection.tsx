// Each banner image gets a distinct dark/rich placeholder tone
const MARQUEE_ITEMS = [
    { label: "Opening Ceremony",  bg: "1C0003", fg: "FF6A00" },
    { label: "Word Night",        bg: "001840", fg: "88bbff" },
    { label: "Power Night",       bg: "1a0040", fg: "cc88ff" },
    { label: "Drama Night",       bg: "2c0010", fg: "FF0015" },
    { label: "Choir Concert",     bg: "003318", fg: "88ffaa" },
    { label: "RIFE Night",        bg: "282800", fg: "ffee44" },
    { label: "Handing Over",      bg: "003322", fg: "44ffcc" },
    { label: "Fellowship Moment", bg: "3d0008", fg: "FF6A00" },
];

export function MarqueeSection() {
    // Doubled for seamless loop
    const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

    return (
        <div className="overflow-hidden border-y border-[#e8d0d4] bg-white py-4">
            <div className="animate-marquee gap-4">
                {items.map(({ label, bg, fg }, i) => (
                    <div
                        key={i}
                        className="relative h-52 w-80 rounded-2xl overflow-hidden flex-shrink-0 group"
                    >
                        <img
                            src={`https://placehold.co/320x208/${bg}/${fg}?text=${encodeURIComponent(label)}`}
                            alt={label}
                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        {/* Hover name reveal */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent
                                        opacity-0 group-hover:opacity-100 transition-opacity duration-300
                                        flex items-end p-4">
                            <span className="text-white text-xs font-bold uppercase tracking-wider">{label}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
