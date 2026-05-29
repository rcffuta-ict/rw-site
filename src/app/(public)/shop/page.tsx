import { getProducts } from "@/lib/services/products.service";
import { ShopClient } from "./ShopClient";
import { TENURE } from "@/lib/config";
import { SiteImage } from "@/components/ui/SiteImage";
import Link from "next/link";
import { Button } from "@/components/ui/forms/Button";

export const metadata = {
    title: `Shop — ${TENURE.brandLabel} Official Merch`,
    description: `Pre-order official RW${TENURE.shortYear} anniversary merchandise. T-shirts, hoodies, caps, and more. Ready for pickup during the Handing Over ceremony.`,
};

export default async function ShopPage() {
    const products = await getProducts();

    return (
        <div className="min-h-screen bg-white">
            {/* Full-width hero banner */}
            <ShopBanner />

            {/* By adding bg-slate-50/50 and a subtle top border,
              the feather transition looks intentional and incredibly premium.
            */}
            <div className="bg-gradient-to-b from-slate-50/60 to-white my-16">
                <div className="section-container py-12 lg:py-16">
                    <ShopClient products={products} />
                </div>
            </div>

            {/* CTA Banner - Payment Guide */}
            <div className="section-container mb-24">
                <div className="rw-card p-8 md:p-12 bg-gradient-to-r from-rw-crimson/10 to-rw-crimson/5 border-l-4 border-l-rw-crimson">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div>
                            <p className="text-sm font-bold text-rw-crimson uppercase tracking-widest mb-2">
                                Next Step
                            </p>
                            <h3 className="font-display font-bold text-3xl text-rw-ink mb-2">
                                Ready to Checkout?
                            </h3>
                            <p className="text-rw-text-2 max-w-lg">
                                Learn how to complete your order, make payment, and get
                                your items confirmed.
                            </p>
                        </div>
                        <div className="flex gap-3 flex-wrap md:flex-nowrap">
                            <Link href="/docs">
                                <Button variant="outlined" size="lg">
                                    View Guide
                                </Button>
                            </Link>
                            <Link href="/checkout">
                                <Button variant="primary" size="lg">
                                    Checkout Now
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
function ShopBanner() {
    return (
        <div className="relative overflow-hidden bg-[#1C0003] min-h-[340px] md:min-h-[420px] flex items-center border-b border-black/10">
            {/* The Real Dynamic Asset Loader */}
            <SiteImage
                src="shop_banner_usufiq"
                alt="Official Merch Banner Background"
                fill
                priority
                sizes="100vw"
                placeholderLabel="Official Merch · RW'26"
                className="absolute inset-0 w-full h-full object-cover object-right md:object-center"
                colors={{
                    bg: "1C0003",
                    fg: "FF6A00",
                }}
            />

            {/* Text Protection Gradients */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#1C0003] via-[#1C0003]/50 to-transparent md:block hidden" />
            <div className="absolute inset-0 bg-[#1C0003]/70 md:hidden block" />

            {/* THE ULTRA-SMOOTH BOTTOM FEATHER:
              Instead of a harsh white block, we use a deep rich tone fading out,
              paired with a subtle overlay that catches the white background below it.
            */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#1C0003] via-[#1C0003]/40 to-transparent pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white/10 to-transparent pointer-events-none" />

            <div className="section-container relative z-10 w-full py-16 md:py-24">
                <p className="eyebrow mb-3 !text-[#FF6A00] tracking-widest text-xs uppercase font-semibold">
                    Official Merchandise
                </p>

                <h1
                    className="font-display font-extrabold text-white leading-none tracking-tight"
                    style={{ fontSize: "clamp(2.5rem, 5.5vw, 4.5rem)" }}
                >
                    RW&apos;{TENURE.year.slice(2)} Merch Sales
                </h1>

                <p className="mt-4 text-white/80 text-sm md:text-base leading-relaxed max-w-[48ch]">
                    Pre-order your {TENURE.anniversaryLabel} anniversary merch. Order
                    information will be communicated to you as you engage with sales.
                </p>

                {/* Info Pills */}
                {/* <div className="mt-8 flex flex-wrap gap-2 max-w-[50ch]">
                    {[
                        "Quick",
                        "Limited quantities",
                        "Let other",
                    ].map((tag) => (
                        <span
                            key={tag}
                            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full
                                       border border-white/15 bg-white/5 text-white/95 text-xs font-medium
                                       backdrop-blur-md shadow-sm"
                        >
                            <span className="h-1.5 w-1.5 rounded-full bg-[#FF6A00]" />
                            {tag}
                        </span>
                    ))}
                </div> */}
            </div>
        </div>
    );
}
