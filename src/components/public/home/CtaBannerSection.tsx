import Link from "next/link";
import { TENURE } from "@/lib/config";
import { SiteImage } from "@/components/ui/SiteImage";

export function CtaBannerSection() {
    return (
        <section className="relative overflow-hidden bg-[#1C0003] py-24 md:py-32">
            {/* Deep maroon-to-dark background */}
            {/* <div className="absolute inset-0 bg-[#1C0003]" /> */}

            {/* Background image — cinematic feel */}
            <SiteImage
                src="1920X640_cta_desktop_pvnusp"
                alt=""
                fill
                sizes="100vw"
                placeholderLabel="Worship Crowd · CTA"
                colors={{ bg: "1C0003", fg: "FF6A00" }}
                className="absolute inset-0 w-full h-full object-cover object-center opacity-80"
            />

            {/* Brand fire gradient overlay to give it depth */}
            {/* <div className="absolute inset-0 bg-gradient-to-r from-[#FF0015]/20 via-transparent to-[#FF0015]/20 mix-blend-color-dodge" /> */}

            {/* Top feather mask (Seamless blend into the page layout background) */}
            <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-[#1C0003] via-[#1C0003]/80 to-transparent" />

            {/* Bottom feather mask (Seamless blend into the page layout background) */}
            <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#1C0003] via-[#1C0003]/80 to-transparent" />

            {/* Decorative glows */}
            {/* <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-[#FF0015]/15 rounded-full blur-[120px]" />
            <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-64 h-64 bg-[#FF6A00]/15 rounded-full blur-[80px]" /> */}

            <div className="section-container relative z-10 max-w-5xl mx-auto px-6 text-center">
                {/* Eyebrow */}
                <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#FF6A00]/90 mb-6 drop-shadow-sm">
                    {TENURE.anniversaryLabel} · {TENURE.eventName}
                </p>

                {/* Heading with distinct phrase coloring to match design */}
                <h2
                    className="font-display font-extrabold text-white max-w-[16ch] mx-auto leading-[0.95] tracking-tight drop-shadow-md"
                    style={{ fontSize: "clamp(2.5rem, 6.5vw, 5.5rem)" }}
                >
                    Let us make this{" "}
                    <span className="block mt-1">
                        <span className="text-[#FF6A00]">the best </span>
                        <span className="text-[#FF0015]">yet.</span>
                    </span>
                </h2>

                {/* Sub-text */}
                <p className="mt-6 text-white/70 max-w-[50ch] mx-auto text-base md:text-lg font-normal leading-relaxed antialiased">
                    Just like birthdays and anniversaries, Redemption Week comes once
                    every year — the most anticipated event every member looks forward to.
                </p>

                {/* Action buttons */}
                <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link
                        href="/shop"
                        id="cta-banner-shop"
                        className="w-full sm:w-auto inline-flex items-center justify-center h-13 px-8 rounded-xl font-bold text-[15px]
                                   bg-[#FF0015] text-white hover:bg-[#E00013] transition-all duration-300
                                   shadow-[0_4px_24px_rgba(255,0,21,0.4)] hover:shadow-[0_8px_32px_rgba(255,0,21,0.6)]
                                   hover:-translate-y-0.5 active:translate-y-0"
                    >
                        Pre-order Merch
                    </Link>
                    <Link
                        href="/fulfil"
                        id="cta-banner-support"
                        className="w-full sm:w-auto inline-flex items-center justify-center h-13 px-8 rounded-xl font-bold text-[15px]
                                   bg-white text-[#1C0003] hover:bg-white/95 transition-all duration-300
                                   shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                    >
                        Pay an Order
                    </Link>
                </div>

                {/* Bottom sponsor note */}
                <p className="mt-14 text-xs text-white/40 font-medium tracking-wide">
                    Interested in sponsoring? &nbsp;
                    <a
                        href="mailto:tobi4saviour2@gmail.com"
                        className="text-[#FF6A00] hover:text-[#FF8433] transition-colors underline underline-offset-4 decoration-[#FF6A00]/40"
                    >
                        Reach out to our committee
                    </a>
                </p>
            </div>
        </section>
    );
}
