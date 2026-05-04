const STATS = [
    { value: "38",   label: "Years of Impact",   sub: "Est. 1983" },
    { value: "9K+",  label: "Alumni Shaped",      sub: "& Counting" },
    { value: "900+", label: "Weekly Members",     sub: "Active Students" },
    { value: "16",   label: "Active Units",       sub: "Diverse Gifts" },
];

export function StatsSection() {
    return (
        <section className="bg-rw-ink text-white section-py">
            <div className="section-container">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 lg:divide-x lg:divide-white/10">
                    {STATS.map((s, i) => (
                        <div key={s.label} className="flex flex-col items-center text-center lg:px-8 animate-number-up" style={{ animationDelay: `${i * 100}ms` }}>
                            <span className="font-display font-bold text-5xl sm:text-6xl text-rw-crimson leading-none">
                                {s.value}
                            </span>
                            <span className="mt-2 text-sm font-semibold text-white">{s.label}</span>
                            <span className="mt-0.5 text-xs text-white/40">{s.sub}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
