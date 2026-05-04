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

function PlaceholderImage({ label }: { label: string }) {
    return (
        <div className="img-placeholder relative h-full w-full">
            <span className="relative z-10 text-xs font-bold text-rw-muted/60 uppercase tracking-widest">
                [{label}]
            </span>
        </div>
    );
}

function ProductCard({ product, onClick }: { product: Product; onClick: () => void }) {
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

    return (
        <div className="glass-card group flex flex-col overflow-hidden hover:border-rw-crimson/50 hover:-translate-y-1 transition-all duration-200">
            {/* Image */}
            <div className="relative h-52 overflow-hidden">
                <PlaceholderImage label={product.name} />
                <button
                    onClick={onClick}
                    id={`product-view-${product.id}`}
                    aria-label={`View ${product.name}`}
                    className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/40 transition-all"
                >
                    <span className="translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-200 rounded-xl bg-rw-crimson px-5 py-2 text-sm font-bold text-white">
                        View Options
                    </span>
                </button>
            </div>

            {/* Info */}
            <div className="flex flex-col gap-3 p-4">
                <div>
                    <h3 className="font-display font-bold text-rw-white group-hover:text-rw-crimson transition-colors">
                        {product.name}
                    </h3>
                    <p className="mt-1 text-xs text-rw-muted line-clamp-2">
                        {product.description}
                    </p>
                </div>

                {/* Colour swatches */}
                {colors.length > 0 && (
                    <div className="flex items-center gap-1.5">
                        {colors.slice(0, 5).map((c) => (
                            <span
                                key={c}
                                title={c}
                                className="h-4 w-4 rounded-full border border-white/10"
                                style={{ background: COLOR_HEX[c] ?? "#888" }}
                            />
                        ))}
                        {colors.length > 5 && (
                            <span className="text-xs text-rw-muted">
                                +{colors.length - 5}
                            </span>
                        )}
                        {sizes.length > 0 && (
                            <span className="ml-2 text-xs text-rw-muted">
                                {sizes.join(" · ")}
                            </span>
                        )}
                    </div>
                )}

                <div className="flex items-center justify-between mt-auto">
                    <span className="font-bold text-rw-orange">
                        ₦{product.basePrice.toLocaleString()}
                    </span>
                    <button
                        onClick={onClick}
                        className="rounded-xl bg-rw-surface-2 border border-[var(--rw-border)] px-3 py-1.5 text-xs font-bold text-rw-text-2 hover:border-rw-crimson/50 hover:text-rw-white transition-colors"
                    >
                        Select →
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

    const filtered =
        category === "all" ? products : products.filter((p) => p.category === category);

    return (
        <>
            {/* Category tabs */}
            <div
                className="flex flex-wrap gap-2 mb-8"
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
                        className={`rounded-full px-4 py-2 text-sm font-bold transition-all ${
                            category === c
                                ? "bg-rw-crimson text-white"
                                : "border border-[var(--rw-border)] text-rw-text-2 hover:border-rw-crimson/50 hover:text-rw-white"
                        }`}
                    >
                        {CATEGORY_LABELS[c]}
                    </button>
                ))}
            </div>

            {/* Grid */}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((p) => (
                    <ProductCard key={p.id} product={p} onClick={() => setSelected(p)} />
                ))}
            </div>

            {filtered.length === 0 && (
                <div className="py-20 text-center text-rw-muted">
                    No items in this category yet.
                </div>
            )}

            {/* Product drawer */}
            {selected && (
                <ProductDrawer product={selected} onClose={() => setSelected(null)} />
            )}

            {/* Cart sidebar */}
            {isOpen && <CartSidebar onClose={closeCart} />}
        </>
    );
}
