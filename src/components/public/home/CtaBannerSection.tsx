import Link from "next/link";
import { ph } from "@/lib/utils/functions";

export function CtaBannerSection() {
    return (
        <section className="relative overflow-hidden bg-rw-ink">
            <img
                src={ph(1920, 640, "CTA Background")}
                alt=""
                className="absolute inset-0 w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-rw-crimson/30 via-transparent to-rw-ink/50" />
            <div className="section-container relative z-10 section-py text-center">
                <p className="eyebrow mb-5" style={{ color: "#f59e0b" }}>
                    38th Redemption Week
                </p>
                <h2 className="section-heading text-4xl sm:text-5xl lg:text-6xl text-white max-w-[22ch] mx-auto leading-tight">
                    Let us make this the best yet.
                </h2>
                <p className="mt-6 text-white/60 max-w-[50ch] mx-auto leading-relaxed text-lg">
                    Just like birthdays and anniversaries, Redemption Week comes once
                    every year — the most anticipated event every member looks forward to.
                </p>
                <div className="mt-12 flex flex-wrap gap-4 justify-center">
                    <Link
                        href="/shop"
                        id="cta-banner-shop"
                        className="btn-primary !bg-white !text-rw-crimson hover:!bg-white/90"
                    >
                        Pre-order Merch
                    </Link>
                    <Link
                        href="/fulfil"
                        className="btn-secondary !border-white/30 !text-white hover:!bg-white/10"
                    >
                        Pay an Order
                    </Link>
                </div>
            </div>
        </section>
    );
}
