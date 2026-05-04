import { DEMO_PRODUCTS } from "@/lib/data/products";
import { ShopClient } from "./ShopClient";

export const metadata = {
    title: "Shop Merch — Redemption Week '26",
    description: "Pre-order official RW'26 anniversary merchandise. T-shirts, hoodies, caps, and more.",
};

export default function ShopPage() {
    return (
        <div className="section-container py-12">
            <div className="mb-8">
                <p className="eyebrow mb-2">Official Merchandise</p>
                <h1 className="section-heading text-3xl sm:text-4xl text-rw-ink">RW&apos;26 Merch Shop</h1>
                <p className="mt-2 text-sm text-rw-muted max-w-[52ch]">
                    Pre-order before the cutoff. Items will be ready for pickup during the Handing Over ceremony on Sunday.
                </p>
            </div>
            <ShopClient products={DEMO_PRODUCTS} />
        </div>
    );
}
