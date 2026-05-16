import { TENURE, FELLOWSHIP } from "@/lib/config";

const STATS = [
    { value: `${TENURE.anniversary}`,     label: "Years of Impact",   sub: `Est. ${FELLOWSHIP.founded}` },
    { value: FELLOWSHIP.stats.alumni,      label: "Alumni Shaped",      sub: "& Counting" },
    { value: FELLOWSHIP.stats.members,     label: "Weekly Members",     sub: "Active Students" },
    { value: `${FELLOWSHIP.stats.units}`,  label: "Active Units",       sub: "Diverse Gifts" },
];

export function StatsSection() {
    return (
        <section className="relative overflow-hidden">
            {/* Deep maroon background — our signature dark band */}
            <div className="absolute inset-0 bg-[#1C0003]" />
            {/* Subtle diagonal light sweep */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#FF0015]/10 via-transparent to-[#FF6A00]/8" />
            {/* Decorative glow dots */}
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-[#FF0015]/10 rounded-full blur-[80px]" />
            <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-[#FF6A00]/10 rounded-full blur-[60px]" />

            <div className="section-container relative z-10 section-py">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 lg:divide-x lg:divide-white/8">
                    {STATS.map((s, i) => (
                        <div
                            key={s.label}
                            className="flex flex-col items-center text-center lg:px-8 animate-number-up"
                            style={{ animationDelay: `${i * 100}ms` }}
                        >
                            <span className="font-display font-extrabold leading-none"
                                style={{
                                    fontSize: "clamp(3rem, 6vw, 4.5rem)",
                                    background: "linear-gradient(135deg, #FF6A00, #FF0015)",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                    backgroundClip: "text",
                                }}>
                                {s.value}
                            </span>
                            <span className="mt-2 text-sm font-semibold text-white/90">{s.label}</span>
                            <span className="mt-0.5 text-xs text-white/35 font-medium">{s.sub}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
