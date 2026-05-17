import Link from "next/link";
import { ph } from "@/lib/utils/functions";
import { TENURE } from "@/lib/config";

export function CtaBannerSection() {
    return (
        <section className="relative overflow-hidden">
            {/* Deep maroon-to-dark background */}
            <div className="absolute inset-0 bg-[#1C0003]" />
            {/* Background image at very low opacity — cinematic feel */}
            <img
                src={ph(1920, 640, "Worship Crowd · CTA", "1C0003", "FF6A00")}
                alt=""
                className="absolute inset-0 w-full h-full object-cover opacity-15 mix-blend-luminosity"
            />
            {/* Brand fire gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#FF0015]/20 via-transparent to-[#FF6A00]/10" />
            {/* Top light feather */}
            <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-white to-transparent" />
            {/* Bottom light feather */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
            {/* Decorative glows */}
            <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-[#FF0015]/15 rounded-full blur-[120px]" />
            <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-64 h-64 bg-[#FF6A00]/15 rounded-full blur-[80px]" />

            <div className="section-container relative z-10 section-py text-center">
                {/* Eyebrow */}
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#FF6A00] mb-5">
                    {TENURE.anniversaryLabel} · {TENURE.eventName}
                </p>

                {/* Heading */}
                <h2
                    className="font-display font-extrabold text-white max-w-[18ch] mx-auto leading-[0.92] tracking-tight"
                    style={{ fontSize: "clamp(2.5rem, 7vw, 6rem)" }}
                >
                    Let us make this
                    <br />
                    <span style={{
                        background: "linear-gradient(90deg, #FF6A00, #FF0015)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                    }}>
                        the best yet.
                    </span>
                </h2>

                {/* Sub-text */}
                <p className="mt-6 text-white/55 max-w-[52ch] mx-auto leading-relaxed text-lg">
                    Just like birthdays and anniversaries, Redemption Week comes once
                    every year — the most anticipated event every member looks forward to.
                </p>

                {/* Action buttons */}
                <div className="mt-12 flex flex-wrap gap-3 justify-center">
                    <Link
                        href="/shop"
                        id="cta-banner-shop"
                        className="inline-flex items-center gap-2 h-12 px-8 rounded-xl font-bold text-[15px]
                                   bg-[#FF0015] text-white hover:bg-[#cc0011] transition-all
                                   shadow-[0_4px_20px_rgba(255,0,21,0.45)] hover:shadow-[0_6px_28px_rgba(255,0,21,0.55)]
                                   hover:-translate-y-0.5"
                    >
                        Pre-order Merch
                    </Link>
                    <Link
                        href="/support"
                        id="cta-banner-support"
                        className="inline-flex items-center gap-2 h-12 px-8 rounded-xl font-bold text-[15px]
                                   bg-white text-[#1C0003] hover:bg-white/90 transition-all
                                   shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                    >
                        Support the Event
                    </Link>
                    <Link
                        href="/fulfil"
                        className="inline-flex items-center gap-2 h-12 px-7 rounded-xl font-semibold text-[14px]
                                   border border-white/30 text-white/80 hover:text-white hover:border-white/60
                                   hover:bg-white/8 transition-all backdrop-blur-sm"
                    >
                        Pay an Order
                    </Link>
                </div>

                {/* Bottom sponsor note */}
                <p className="mt-14 text-xs text-white/25 font-medium">
                    Interested in sponsoring? &nbsp;
                    <a href="mailto:tobi4saviour2@gmail.com"
                        className="text-[#FF6A00] hover:text-white transition-colors underline underline-offset-2">
                        Reach out to our committee
                    </a>
                </p>
            </div>
        </section>
    );
}
