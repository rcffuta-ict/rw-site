"use client";

import { useState } from "react";
import type { Product, ProductVariant } from "@/lib/data/types";
import { COLOR_HEX, buildVariantLabel, getEffectivePrice } from "@/lib/data/products";
import { useCart } from "@/components/public/CartContext";
import { Button } from "@/components/ui/Button";

export function ProductDrawer({ product, onClose }: { product: Product; onClose: () => void }) {
    const { addItem } = useCart();
    const colors = [...new Set(product.variants.filter(v => v.color).map(v => v.color!))];
    const sizes  = [...new Set(product.variants.filter(v => v.size).map(v => v.size!))];

    const [selectedColor, setSelectedColor] = useState<string | null>(colors[0] ?? null);
    const [selectedSize,  setSelectedSize]  = useState<string | null>(sizes[0] ?? null);
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false);

    const variant: ProductVariant | undefined = product.variants.find(
        v => (selectedColor === null || v.color === selectedColor) && (selectedSize === null || v.size === selectedSize)
    );
    const available = variant?.isAvailable ?? false;
    const price = variant ? getEffectivePrice(product, variant.id) : product.basePrice;

    function sizeAvail(size: string) {
        return product.variants.some(v => v.color === selectedColor && v.size === size && v.isAvailable);
    }

    function handleAdd() {
        if (!variant || !available) return;
        addItem({ variantId: variant.id, productId: product.id, productName: product.name, variantLabel: buildVariantLabel(variant), unitPrice: price, quantity });
        setAdded(true);
        setTimeout(() => { setAdded(false); onClose(); }, 1000);
    }

    return (
        <>
            <div className="fixed inset-0 z-40 bg-black/30" onClick={onClose} aria-hidden />
            <aside className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-rw-surface border-l border-[var(--rw-border)] shadow-xl animate-slide-in-right overflow-y-auto flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-[var(--rw-border)] px-5 py-4 sticky top-0 bg-rw-surface z-10">
                    <h2 className="font-display font-bold text-rw-ink">{product.name}</h2>
                    <button onClick={onClose} aria-label="Close" className="rounded-lg p-1.5 text-rw-muted hover:text-rw-ink hover:bg-rw-bg-alt transition-colors">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" aria-hidden><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <div className="flex flex-col gap-6 p-5">
                    {/* Product image */}
                    <div className="img-placeholder h-56 w-full rounded-2xl relative">
                        <span className="relative z-10 text-[10px] font-bold tracking-widest text-rw-muted/50 uppercase">{product.name}</span>
                    </div>

                    <div>
                        <p className="font-display font-bold text-3xl text-rw-crimson">₦{price.toLocaleString()}</p>
                        <p className="mt-2 text-sm text-rw-text-2 leading-relaxed">{product.description}</p>
                    </div>

                    {/* Colour */}
                    {colors.length > 0 && (
                        <div>
                            <p className="text-sm font-semibold text-rw-ink mb-2">
                                Colour — <span className="font-normal text-rw-text-2">{selectedColor}</span>
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {colors.map(c => (
                                    <button
                                        key={c}
                                        onClick={() => { setSelectedColor(c); setSelectedSize(sizes[0] ?? null); }}
                                        title={c}
                                        aria-label={`Select ${c}`}
                                        aria-pressed={selectedColor === c}
                                        className={`h-8 w-8 rounded-full border-2 transition-all ${selectedColor === c ? "border-rw-crimson scale-110" : "border-transparent hover:border-rw-muted"}`}
                                        style={{ background: COLOR_HEX[c] ?? "#ccc" }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Size */}
                    {sizes.length > 0 && sizes[0] !== "One Size" && (
                        <div>
                            <p className="text-sm font-semibold text-rw-ink mb-2">
                                Size — <span className="font-normal text-rw-text-2">{selectedSize}</span>
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {sizes.map(s => {
                                    const avail = sizeAvail(s);
                                    return (
                                        <button
                                            key={s}
                                            onClick={() => avail && setSelectedSize(s)}
                                            aria-pressed={selectedSize === s}
                                            className={`h-10 min-w-[44px] rounded-xl border px-3 text-sm font-semibold transition-all ${
                                                !avail ? "border-gray-200 text-gray-300 cursor-not-allowed line-through"
                                                : selectedSize === s ? "border-rw-crimson bg-rw-crimson text-white"
                                                : "border-[var(--rw-border-mid)] text-rw-ink hover:border-rw-crimson/50"
                                            }`}
                                        >{s}</button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Quantity */}
                    <div>
                        <p className="text-sm font-semibold text-rw-ink mb-2">Quantity</p>
                        <div className="flex items-center gap-3">
                            <button onClick={() => setQuantity(q => Math.max(1,q-1))} aria-label="Decrease" className="h-9 w-9 rounded-xl border border-[var(--rw-border-mid)] text-rw-ink hover:border-rw-crimson/50 flex items-center justify-center font-bold">−</button>
                            <span className="w-6 text-center font-bold text-rw-ink tabular-nums">{quantity}</span>
                            <button onClick={() => setQuantity(q => Math.min(20,q+1))} aria-label="Increase" className="h-9 w-9 rounded-xl border border-[var(--rw-border-mid)] text-rw-ink hover:border-rw-crimson/50 flex items-center justify-center font-bold">+</button>
                            <span className="text-sm text-rw-muted ml-1">₦{(price * quantity).toLocaleString()}</span>
                        </div>
                    </div>

                    <Button
                        variant={added ? "outlined" : "primary"}
                        size="lg"
                        onClick={handleAdd}
                        disabled={!available || added}
                        className="w-full"
                        id={`add-to-cart-${product.id}`}
                    >
                        {added ? "Added to cart ✓" : !available ? "Out of stock" : `Add to Cart — ₦${(price * quantity).toLocaleString()}`}
                    </Button>
                </div>
            </aside>
        </>
    );
}
