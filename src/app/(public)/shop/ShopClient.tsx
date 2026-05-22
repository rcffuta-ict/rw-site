"use client";

import { useState } from "react";
import type { Product } from "@/lib/data/types";
import { COLOR_HEX } from "@/lib/data/products";
import { ProductDrawer } from "@/components/public/ProductDrawer";
import { useCart } from "@/context/CartContext";
import { productImageUrl } from "@/lib/utils/functions";

// ─── Types ─────────────────────────────────────────────────────────────────────

type Category = "all" | "tshirt" | "hoodie" | "accessory";

const CATEGORY_LABELS: Record<Category, string> = {
    all: "All Items",
    tshirt: "T-Shirts",
    hoodie: "Hoodies",
    accessory: "Accessories",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

// ─── ProductCard ──────────────────────────────────────────────────────────────

function ProductCard({ product, onOpen }: { product: Product; onOpen: () => void }) {
    const colors = [
        ...new Set(product.variants.filter((v) => v.color).map((v) => v.color!)),
    ];
    const sizes = [
        ...new Set(
            product.variants
                .filter((v) => v.size && v.size !== "One Size")
                .map((v) => v.size!)
        ),
    ];

    const [hoveredColor, setHoveredColor] = useState<string | null>(null);
    const displayColor = hoveredColor ?? colors[0] ?? null;

    // Find the image for the current display colour
    const activeVariant = product.variants.find((v) => v.color === displayColor) || product.variants[0];
    const primaryImage = activeVariant?.images?.find((img) => img.isPrimary)?.cloudinaryUrl || activeVariant?.images?.[0]?.cloudinaryUrl;
    const finalImageUrl = primaryImage || productImageUrl(product.name, displayColor, 360, 480);

    return (
        <article className="rw-card group flex flex-col overflow-hidden hover:-translate-y-1.5">
            {/* Image */}
            <div
                className="relative overflow-hidden bg-rw-bg-alt"
                style={{ aspectRatio: "3/4" }}
            >
                <img
                    src={finalImageUrl}
                    alt={`${product.name}${displayColor ? ` — ${displayColor}` : ""}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Quick view overlay */}
                <button
                    onClick={onOpen}
                    id={`product-view-${product.id}`}
                    aria-label={`Quick view ${product.name}`}
                    className="absolute inset-0 flex items-end justify-center pb-5 bg-black/0 group-hover:bg-black/25 transition-all"
                >
                    <span className="translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-200 bg-white rounded-xl px-6 py-2.5 text-sm font-bold text-rw-ink shadow-lg">
                        Quick View
                    </span>
                </button>

                {/* Colour swatches (hover to preview) */}
                {colors.length > 0 && (
                    <div className="absolute top-3 left-3 flex gap-1.5">
                        {colors.slice(0, 5).map((c) => (
                            <button
                                key={c}
                                title={c}
                                onMouseEnter={() => setHoveredColor(c)}
                                onMouseLeave={() => setHoveredColor(null)}
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setHoveredColor(c);
                                }}
                                className={`h-5 w-5 rounded-full border-2 shadow-sm transition-all ${hoveredColor === c ? "border-white scale-125" : "border-white/60"}`}
                                style={{ background: COLOR_HEX[c] ?? "#888" }}
                            />
                        ))}
                        {colors.length > 5 && (
                            <span className="text-[10px] text-white font-bold bg-black/30 rounded-full px-1.5 flex items-center">
                                +{colors.length - 5}
                            </span>
                        )}
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="flex flex-col gap-3 p-5 flex-1">
                <div className="flex-1">
                    <h3 className="font-display font-bold text-rw-ink group-hover:text-rw-crimson transition-colors text-[15px] leading-snug">
                        {product.name}
                    </h3>
                    <p className="mt-1.5 text-xs text-rw-muted line-clamp-2 leading-relaxed">
                        {product.description}
                    </p>
                </div>

                {sizes.length > 0 && (
                    <p className="text-[11px] text-rw-muted font-medium">
                        Sizes: {sizes.join(" · ")}
                    </p>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-[var(--rw-border)]">
                    <span className="font-bold text-rw-crimson text-lg">
                        ₦{product.basePrice.toLocaleString()}
                    </span>
                    <button
                        onClick={onOpen}
                        className="rounded-xl bg-rw-ink text-white px-4 py-2 text-xs font-bold hover:bg-rw-crimson transition-colors"
                    >
                        Select Options
                    </button>
                </div>
            </div>
        </article>
    );
}

// ─── ShopClient ───────────────────────────────────────────────────────────────

export function ShopClient({ products }: { products: Product[] }) {
    const [category, setCategory] = useState<Category>("all");
    const [selected, setSelected] = useState<Product | null>(null);
    const { isOpen, closeCart } = useCart();

    const filtered =
        category === "all"
            ? products
            : products.filter((p) => p.categorySlug === category);

    if (products.length === 0) {
        return (
            <div className="py-24 max-w-2xl mx-auto text-center flex flex-col items-center">
                <div className="mb-6 flex items-center justify-center w-24 h-24 rounded-full bg-rw-bg-alt border-8 border-white shadow-sm text-rw-muted">
                    <svg
                        className="w-10 h-10"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                        />
                    </svg>
                </div>
                <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-rw-ink mb-4">
                    Collection Dropping Soon
                </h2>
                <p className="text-rw-muted text-lg leading-relaxed">
                    The official merchandise collection is currently being finalized.
                    We&#39;re putting the finishing touches on our exclusive items for the
                    upcoming celebration. Check back shortly to secure your limited
                    edition pieces!
                </p>
            </div>
        );
    }

    return (
        <div className="mb-20">
            {/* Category tabs */}
            <div
                className="flex flex-wrap gap-2 mb-10"
                role="tablist"
                aria-label="Product categories"
            >
                {(Object.keys(CATEGORY_LABELS) as Category[]).map((c) => (
                    <button
                        key={c}
                        role="tab"
                        aria-selected={category === c}
                        onClick={() => setCategory(c)}
                        id={`category-tab-${c}`}
                        className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${
                            category === c
                                ? "bg-rw-ink text-white shadow-sm"
                                : "border border-[var(--rw-border)] text-rw-text-2 hover:border-rw-ink/30 hover:text-rw-ink"
                        }`}
                    >
                        {CATEGORY_LABELS[c]}
                    </button>
                ))}
            </div>

            {/* Product grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filtered.map((p) => (
                    <ProductCard key={p.id} product={p} onOpen={() => setSelected(p)} />
                ))}
            </div>

            {filtered.length === 0 && (
                <div className="py-24 text-center text-rw-muted">
                    <p className="text-lg">No items in this category yet.</p>
                </div>
            )}

            {selected && (
                <ProductDrawer product={selected} onClose={() => setSelected(null)} />
            )}
        </div>
    );
}
