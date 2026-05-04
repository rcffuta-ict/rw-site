"use client";
import Link from "next/link";
import { DEMO_PRODUCTS, COLOR_HEX } from "@/lib/data/products";
import { ph } from "@/lib/utils";

export function MerchPreviewSection() {
    return (
        <section className="bg-rw-bg-alt section-py">
            <div className="section-container">
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
                    <Link
                        href="/shop"
                        className="btn-secondary shrink-0 !h-11 !px-6 text-sm"
                    >
                        View all items →
                    </Link>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {DEMO_PRODUCTS.map((p) => {
                        const colors = [
                            ...new Set(
                                p.variants.filter((v) => v.color).map((v) => v.color!)
                            ),
                        ];
                        return (
                            <Link
                                key={p.id}
                                href="/shop"
                                id={`merch-preview-${p.id}`}
                                className="rw-card group flex flex-col overflow-hidden hover:-translate-y-1.5"
                            >
                                <div className="relative overflow-hidden bg-rw-bg-alt">
                                    <img
                                        src={ph(400, 480, p.name)}
                                        alt={p.name}
                                        className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        style={{ aspectRatio: "5/6" }}
                                    />
                                    <div className="absolute top-3 left-3 flex gap-1.5">
                                        {colors.slice(0, 4).map((c) => (
                                            <span
                                                key={c}
                                                className="h-4 w-4 rounded-full border-2 border-white shadow-sm"
                                                style={{
                                                    background: COLOR_HEX[c] ?? "#888",
                                                }}
                                                title={c}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <div className="p-5 flex flex-col gap-2 flex-1">
                                    <h3 className="font-display font-bold text-rw-ink group-hover:text-rw-crimson transition-colors">
                                        {p.name}
                                    </h3>
                                    <p className="text-xs text-rw-muted line-clamp-2 flex-1">
                                        {p.description}
                                    </p>
                                    <div className="flex items-center justify-between pt-3 border-t border-[var(--rw-border)] mt-1">
                                        <span className="font-bold text-rw-crimson text-lg">
                                            ₦{p.basePrice.toLocaleString()}
                                        </span>
                                        <span className="text-xs text-rw-muted font-medium">
                                            {colors.length > 1
                                                ? `${colors.length} colours`
                                                : ""}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
