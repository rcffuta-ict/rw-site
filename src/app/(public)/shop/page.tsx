import { DEMO_PRODUCTS } from "@/lib/data/products";
import { ph } from "@/lib/utils/functions";
import { ShopClient } from "./ShopClient";
import { TENURE } from "@/lib/config";

export const metadata = {
    title: `Shop — ${TENURE.brandLabel} Official Merch`,
    description: `Pre-order official RW${TENURE.shortYear} anniversary merchandise. T-shirts, hoodies, caps, and more. Ready for pickup during the Handing Over ceremony.`,
};

export default function ShopPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Full-width hero banner */}
            <ShopBanner />

            <div className="section-container py-12 lg:py-16">
                <ShopClient products={DEMO_PRODUCTS} />
            </div>
        </div>
    );
}

function ShopBanner() {
    return (
        <div className="relative overflow-hidden bg-[#1C0003]">
            {/* Background image */}
            <img
                src={ph(1600, 360, "Official Merch · RW'26", "1C0003", "FF6A00")}
                alt=""
                aria-hidden
                className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-luminosity"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1C0003]/95 via-[#1C0003]/70 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FF0015]/5 to-[#FF6A00]/10" />

            {/* Bottom feather */}
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" />

            <div className="section-container relative z-10 py-16 lg:py-20">
                <p className="eyebrow mb-3 !text-[#FF6A00]">Official Merchandise</p>
                <h1 className="font-display font-extrabold text-white leading-tight tracking-tight"
                    style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}>
                    RW&apos;{TENURE.year.slice(2)} Merch Shop
                </h1>
                <p className="mt-4 text-white/60 text-base leading-relaxed max-w-[50ch]">
                    Pre-order your {TENURE.anniversaryLabel} anniversary merch. Items will be ready for
                    pickup during the Handing Over ceremony on Sunday, July 12.
                </p>

                {/* Info pills */}
                <div className="mt-6 flex flex-wrap gap-2">
                    {[
                        "Free pickup at venue",
                        "Limited quantities",
                        "Secure payment via bank transfer",
                    ].map((tag) => (
                        <span key={tag} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
                                                   border border-white/15 bg-white/8 text-white/70 text-xs font-medium
                                                   backdrop-blur-sm">
                            <span className="h-1 w-1 rounded-full bg-[#FF6A00]" />
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}
