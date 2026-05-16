import Link from "next/link";
import { ph } from "@/lib/utils/functions";
import { TENURE } from "@/lib/config";
import { DEMO_PRODUCTS, COLOR_HEX } from "@/lib/data/products";

export function MerchPreviewSection() {
    return (
        <section className="section-py bg-[#fdf8f8]">
            <div className="section-container">
                {/* Header row */}
                <div className="mb-14 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
                    <div>
                        <p className="eyebrow mb-4">Official Merchandise</p>
                        <h2 className="section-heading text-3xl sm:text-4xl lg:text-5xl">
                            Pre-order now
                        </h2>
                        <p className="mt-3 text-rw-text-2 text-lg">
                            Ready for pickup during the Handing Over ceremony.
                        </p>
                    </div>
                    <Link href="/shop" className="btn-secondary shrink-0 !h-11 !px-6 text-sm">
                        View all items →
                    </Link>
                </div>

                {/* Product grid */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {DEMO_PRODUCTS.map((p) => {
                        const colors = [
                            ...new Set(p.variants.filter((v) => v.color).map((v) => v.color!)),
                        ];
                        // Pick a vivid bg for each category
                        const imgBg =
                            p.category === "tshirt" ? "1C0003" :
                            p.category === "hoodie" ? "2c0010" : "022400";
                        return (
                            <Link
                                key={p.id}
                                href="/shop"
                                id={`merch-preview-${p.id}`}
                                className="rw-card group flex flex-col overflow-hidden hover:-translate-y-2 transition-all duration-300"
                            >
                                <div className="relative overflow-hidden">
                                    <img
                                        src={ph(400, 480, `${p.name}\n₦${p.basePrice.toLocaleString()}`, imgBg, "FF6A00")}
                                        alt={p.name}
                                        className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        style={{ aspectRatio: "5/6" }}
                                    />
                                    {/* Color swatches overlay */}
                                    <div className="absolute top-3 left-3 flex gap-1.5">
                                        {colors.slice(0, 4).map((c) => (
                                            <span
                                                key={c}
                                                className="h-4 w-4 rounded-full border-2 border-white shadow-sm"
                                                style={{ background: COLOR_HEX[c] ?? "#888" }}
                                                title={c}
                                            />
                                        ))}
                                    </div>
                                    {/* Category pill */}
                                    <span className="absolute bottom-3 right-3 text-[10px] font-bold uppercase
                                                     tracking-widest bg-white/90 backdrop-blur-sm text-[#1C0003]
                                                     px-2.5 py-1 rounded-full">
                                        {p.category}
                                    </span>
                                </div>
                                <div className="p-5 flex flex-col gap-2 flex-1">
                                    <h3 className="font-display font-bold text-[#1C0003] group-hover:text-[#FF0015] transition-colors">
                                        {p.name}
                                    </h3>
                                    <p className="text-xs text-rw-muted line-clamp-2 flex-1">{p.description}</p>
                                    <div className="flex items-center justify-between pt-3 border-t border-[#e8d0d4] mt-1">
                                        <span className="font-bold text-[#FF0015] text-lg">
                                            ₦{p.basePrice.toLocaleString()}
                                        </span>
                                        <span className="text-xs text-rw-muted font-medium">
                                            {colors.length > 1 ? `${colors.length} colours` : ""}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* Bottom CTA strip */}
                <div className="mt-12 rounded-3xl bg-[#1C0003] px-8 py-7 flex flex-col sm:flex-row
                                items-center justify-between gap-6 text-center sm:text-left">
                    <div>
                        <p className="font-display font-bold text-white text-xl">
                            {TENURE.eventName} {TENURE.shortYear} Official Merch
                        </p>
                        <p className="text-white/50 text-sm mt-1">
                            Limited quantities — secure yours before it runs out.
                        </p>
                    </div>
                    <Link href="/shop"
                        className="shrink-0 inline-flex items-center gap-2 h-11 px-7 rounded-xl font-bold
                                   text-sm bg-[#FF0015] text-white hover:bg-[#cc0011] transition-all
                                   shadow-[0_4px_16px_rgba(255,0,21,0.4)]">
                        Shop Now →
                    </Link>
                </div>
            </div>
        </section>
    );
}
