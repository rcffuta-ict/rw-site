import { DEMO_PRODUCTS } from "@/lib/data/products";
import { ph } from "@/lib/utils";
import { ShopClient } from "./ShopClient";

export const metadata = {
    title: "Shop Merch — Redemption Week '26",
    description: "Pre-order official RW'26 anniversary merchandise. T-shirts, hoodies, caps, and more.",
};

export default function ShopPage() {
    return (
        <div className="section-container py-12 lg:py-16">
            {/* Page header with banner */}
            <div className="relative rounded-2xl overflow-hidden mb-10">
                <img src={ph(1400, 300, "Shop Banner")} alt="Shop banner" className="w-full h-48 sm:h-56 object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-rw-ink/80 to-rw-ink/40" />
                <div className="absolute inset-0 flex flex-col justify-center px-8 sm:px-12">
                    <p className="eyebrow mb-2 !text-rw-orange">Official Merchandise</p>
                    <h1 className="section-heading text-3xl sm:text-4xl lg:text-5xl !text-white">RW&apos;26 Merch Shop</h1>
                    <p className="mt-2 text-sm text-white/70 max-w-[48ch]">
                        Pre-order before the cutoff. Items will be ready for pickup during the Handing Over ceremony on Sunday.
                    </p>
                </div>
            </div>
            <ShopClient products={DEMO_PRODUCTS} />
        </div>
    );
}
