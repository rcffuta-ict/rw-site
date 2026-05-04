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
            <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={onClose} aria-hidden />
            <aside className="fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-white shadow-2xl animate-slide-in-right overflow-y-auto flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-[var(--rw-border)] px-6 py-4 sticky top-0 bg-white z-10">
                    <h2 className="font-display font-bold text-lg text-rw-ink">{product.name}</h2>
                    <button onClick={onClose} aria-label="Close" className="rounded-full p-2 text-rw-muted hover:text-rw-ink hover:bg-rw-bg-alt transition-colors">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <div className="flex flex-col gap-6 p-6 flex-1">
                    {/* Product image — large */}
                    <div className="rounded-2xl overflow-hidden bg-rw-bg-alt">
                        <img
                            src={`https://placehold.co/500x400?text=${encodeURIComponent(product.name)}`}
                            alt={product.name}
                            className="w-full h-64 sm:h-72 object-cover"
                        />
                    </div>

                    {/* Thumbnail gallery */}
                    <div className="flex gap-2">
                        {[1,2,3].map(n => (
                            <div key={n} className="flex-1 rounded-xl overflow-hidden border border-[var(--rw-border)] cursor-pointer hover:border-rw-crimson transition-colors">
                                <img src={`https://placehold.co/160x120?text=View+${n}`} alt={`View ${n}`} className="w-full h-16 object-cover" />
                            </div>
                        ))}
                    </div>

                    <div>
                        <p className="font-display font-bold text-3xl text-rw-ink">₦{price.toLocaleString()}</p>
                        <p className="mt-3 text-sm text-rw-text-2 leading-relaxed">{product.description}</p>
                    </div>

                    {/* Colour */}
                    {colors.length > 0 && (
                        <div>
                            <p className="text-sm font-semibold text-rw-ink mb-3">
                                Colour: <span className="font-normal text-rw-text-2">{selectedColor}</span>
                            </p>
                            <div className="flex flex-wrap gap-2.5">
                                {colors.map(c => (
                                    <button
                                        key={c}
                                        onClick={() => { setSelectedColor(c); setSelectedSize(sizes[0] ?? null); }}
                                        title={c}
                                        aria-label={`Select ${c}`}
                                        aria-pressed={selectedColor === c}
                                        className={`h-10 w-10 rounded-full border-2 transition-all shadow-sm ${selectedColor === c ? "border-rw-crimson scale-110 ring-2 ring-rw-crimson/20" : "border-gray-200 hover:border-gray-400"}`}
                                        style={{ background: COLOR_HEX[c] ?? "#ccc" }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Size */}
                    {sizes.length > 0 && sizes[0] !== "One Size" && (
                        <div>
                            <p className="text-sm font-semibold text-rw-ink mb-3">
                                Size: <span className="font-normal text-rw-text-2">{selectedSize}</span>
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {sizes.map(s => {
                                    const avail = sizeAvail(s);
                                    return (
                                        <button
                                            key={s}
                                            onClick={() => avail && setSelectedSize(s)}
                                            aria-pressed={selectedSize === s}
                                            className={`h-11 min-w-[48px] rounded-xl border px-4 text-sm font-semibold transition-all ${
                                                !avail ? "border-gray-100 text-gray-300 cursor-not-allowed line-through"
                                                : selectedSize === s ? "border-rw-ink bg-rw-ink text-white"
                                                : "border-[var(--rw-border)] text-rw-ink hover:border-rw-ink"
                                            }`}
                                        >{s}</button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Quantity */}
                    <div>
                        <p className="text-sm font-semibold text-rw-ink mb-3">Quantity</p>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center border border-[var(--rw-border)] rounded-xl overflow-hidden">
                                <button onClick={() => setQuantity(q => Math.max(1,q-1))} aria-label="Decrease" className="h-11 w-11 flex items-center justify-center text-rw-ink hover:bg-rw-bg-alt transition-colors font-bold text-lg">−</button>
                                <span className="w-12 text-center font-bold text-rw-ink tabular-nums border-x border-[var(--rw-border)] h-11 flex items-center justify-center">{quantity}</span>
                                <button onClick={() => setQuantity(q => Math.min(20,q+1))} aria-label="Increase" className="h-11 w-11 flex items-center justify-center text-rw-ink hover:bg-rw-bg-alt transition-colors font-bold text-lg">+</button>
                            </div>
                            <span className="text-sm text-rw-muted">₦{(price * quantity).toLocaleString()} total</span>
                        </div>
                    </div>
                </div>

                {/* Sticky footer */}
                <div className="border-t border-[var(--rw-border)] p-6 bg-white sticky bottom-0">
                    <Button
                        variant={added ? "outlined" : "primary"}
                        size="lg"
                        onClick={handleAdd}
                        disabled={!available || added}
                        className="w-full !h-13 !text-base"
                        id={`add-to-cart-${product.id}`}
                    >
                        {added ? "Added to cart ✓" : !available ? "Out of stock" : `Add to Cart — ₦${(price * quantity).toLocaleString()}`}
                    </Button>
                </div>
            </aside>
        </>
    );
}
