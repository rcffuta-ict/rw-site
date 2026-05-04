"use client";

import { useState } from "react";
import type { Product } from "@/lib/data/types";
import { COLOR_HEX } from "@/lib/data/products";
import { ProductDrawer } from "@/components/public/ProductDrawer";
import { useCart } from "@/components/public/CartContext";
import { CartSidebar } from "@/components/public/CartSidebar";

type Category = "all" | "tshirt" | "hoodie" | "accessory";

const CATEGORY_LABELS: Record<Category, string> = {
    all: "All Items",
    tshirt: "T-Shirts",
    hoodie: "Hoodies",
    accessory: "Accessories",
};

function ProductCard({ product, onClick }: { product: Product; onClick: () => void }) {
    const colors = [...new Set(product.variants.filter((v) => v.color).map((v) => v.color!))];
    const sizes = [...new Set(product.variants.filter((v) => v.size && v.size !== "One Size").map((v) => v.size!))];

    return (
        <div className="rw-card group flex flex-col overflow-hidden hover:-translate-y-1 hover:shadow-md transition-all duration-200">
            {/* Image */}
            <div className="relative h-64 overflow-hidden bg-rw-bg-alt">
                <img
                    src={`https://placehold.co/400x320?text=${encodeURIComponent(product.name)}`}
                    alt={product.name}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <button
                    onClick={onClick}
                    id={`product-view-${product.id}`}
                    aria-label={`View ${product.name}`}
                    className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-all"
                >
                    <span className="translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-200 rounded-xl bg-white px-6 py-2.5 text-sm font-bold text-rw-ink shadow-lg">
                        Quick View
                    </span>
                </button>
            </div>

            {/* Info */}
            <div className="flex flex-col gap-3 p-5 flex-1">
                <div className="flex-1">
                    <h3 className="font-display font-bold text-rw-ink group-hover:text-rw-crimson transition-colors text-lg">
                        {product.name}
                    </h3>
                    <p className="mt-1.5 text-sm text-rw-muted line-clamp-2">
                        {product.description}
                    </p>
                </div>

                {/* Colour swatches */}
                {colors.length > 0 && (
                    <div className="flex items-center gap-2">
                        {colors.slice(0, 5).map((c) => (
                            <span key={c} title={c} className="h-5 w-5 rounded-full border-2 border-white shadow-sm" style={{ background: COLOR_HEX[c] ?? "#888" }} />
                        ))}
                        {colors.length > 5 && <span className="text-xs text-rw-muted">+{colors.length - 5}</span>}
                        {sizes.length > 0 && <span className="ml-auto text-xs text-rw-muted">{sizes.join(" · ")}</span>}
                    </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-[var(--rw-border)]">
                    <span className="font-bold text-rw-crimson text-xl">
                        ₦{product.basePrice.toLocaleString()}
                    </span>
                    <button
                        onClick={onClick}
                        className="rounded-xl bg-rw-ink text-white px-4 py-2 text-xs font-bold hover:bg-rw-crimson transition-colors"
                    >
                        Select Options
                    </button>
                </div>
            </div>
        </div>
    );
}

export function ShopClient({ products }: { products: Product[] }) {
    const [category, setCategory] = useState<Category>("all");
    const [selected, setSelected] = useState<Product | null>(null);
    const { isOpen, closeCart } = useCart();

    const filtered = category === "all" ? products : products.filter((p) => p.category === category);

    return (
        <>
            {/* Category tabs */}
            <div className="flex flex-wrap gap-2 mb-10" role="tablist" aria-label="Product categories">
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

            {/* Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filtered.map((p) => (
                    <ProductCard key={p.id} product={p} onClick={() => setSelected(p)} />
                ))}
            </div>

            {filtered.length === 0 && (
                <div className="py-24 text-center text-rw-muted">
                    <p className="text-lg">No items in this category yet.</p>
                </div>
            )}

            {/* Product drawer */}
            {selected && <ProductDrawer product={selected} onClose={() => setSelected(null)} />}

            {/* Cart sidebar */}
            {isOpen && <CartSidebar onClose={closeCart} />}
        </>
    );
}
