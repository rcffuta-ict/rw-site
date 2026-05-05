"use client";

import { useState } from "react";
import type { Product, ProductVariant } from "@/lib/data/types";
import { COLOR_HEX, buildVariantLabel, getEffectivePrice } from "@/lib/data/products";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/forms/Button";
import { ph } from "@/lib/utils/functions";

// Map each colour to a distinctive placeholder palette
const COLOR_SWATCH_BG: Record<string, { bg: string; fg: string }> = {
    Black: { bg: "1a1a1a", fg: "e0e0e0" },
    White: { bg: "f5f5f0", fg: "333333" },
    Burgundy: { bg: "7a0c31", fg: "f0d0d8" },
    "Wine Red": { bg: "940011", fg: "ffcccc" },
    Navy: { bg: "0a1628", fg: "b0c4de" },
};

function productImageUrl(name: string, color: string | null) {
    // @ts-expect-error coming from a literaly object
    const { bg, fg } = (color && COLOR_SWATCH_BG[color]) ?? {
        bg: "f3f4f6",
        fg: "9ca3af",
    };
    const label = `${name}${color ? `\n${color}` : ""}`;
    return ph(512, 384, label, bg, fg);
}

const SIZE_ORDER = ["XS", "S", "M", "L", "XL", "XXL", "One Size"];

export function ProductDrawer({
    product,
    onClose,
}: {
    product: Product;
    onClose: () => void;
}) {
    const { addItem } = useCart();

    const colors = [
        ...new Set(product.variants.filter((v) => v.color).map((v) => v.color!)),
    ];
    const allSizes = [
        ...new Set(product.variants.filter((v) => v.size).map((v) => v.size!)),
    ].sort((a, b) => SIZE_ORDER.indexOf(a) - SIZE_ORDER.indexOf(b));

    const [selectedColor, setSelectedColor] = useState<string | null>(colors[0] ?? null);
    const [selectedSize, setSelectedSize] = useState<string | null>(allSizes[0] ?? null);
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false);

    const variant: ProductVariant | undefined = product.variants.find(
        (v) =>
            (selectedColor === null || v.color === selectedColor) &&
            (selectedSize === null || v.size === selectedSize)
    );

    const available = variant?.isAvailable ?? false;
    const price = variant ? getEffectivePrice(product, variant.id) : product.basePrice;

    function sizesForColor(color: string | null) {
        return product.variants
            .filter((v) => color === null || v.color === color)
            .map((v) => v.size)
            .filter(Boolean) as string[];
    }

    function isSizeAvailable(size: string) {
        return product.variants.some(
            (v) => v.color === selectedColor && v.size === size && v.isAvailable
        );
    }

    function handleColorSelect(color: string) {
        setSelectedColor(color);
        // Reset size if not available for new color
        const available = sizesForColor(color);
        if (selectedSize && !available.includes(selectedSize)) {
            setSelectedSize(available[0] ?? null);
        }
    }

    function handleAdd() {
        if (!variant || !available) return;
        addItem({
            variantId: variant.id,
            productId: product.id,
            productName: product.name,
            variantLabel: buildVariantLabel(variant),
            unitPrice: price,
            quantity,
        });
        setAdded(true);
        setTimeout(() => {
            setAdded(false);
            onClose();
        }, 1000);
    }

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
                onClick={onClose}
                aria-hidden
            />

            {/* Drawer */}
            <aside className="fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-white shadow-2xl animate-slide-in-right flex flex-col overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-[var(--rw-border)] px-6 py-4 shrink-0">
                    <div>
                        <h2 className="font-display font-bold text-lg text-rw-ink">
                            {product.name}
                        </h2>
                        <p className="text-xs text-rw-muted mt-0.5">
                            Select your options below
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        aria-label="Close"
                        className="rounded-full p-2 text-rw-muted hover:text-rw-ink hover:bg-rw-bg-alt transition-colors"
                    >
                        <svg
                            className="h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={1.8}
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18 18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                {/* Scrollable body */}
                <div className="flex-1 overflow-y-auto">
                    {/* Product image — changes with colour */}
                    <div className="relative bg-rw-bg-alt" style={{ aspectRatio: "4/3" }}>
                        <img
                            key={selectedColor ?? "default"}
                            src={productImageUrl(product.name, selectedColor)}
                            alt={`${product.name}${selectedColor ? ` — ${selectedColor}` : ""}`}
                            className="w-full h-full object-cover animate-fade-in"
                        />
                        {/* Colour badge */}
                        {selectedColor && (
                            <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-sm">
                                <span
                                    className="h-3.5 w-3.5 rounded-full border border-black/10"
                                    style={{
                                        background: COLOR_HEX[selectedColor] ?? "#888",
                                    }}
                                />
                                <span className="text-xs font-semibold text-rw-ink">
                                    {selectedColor}
                                </span>
                            </div>
                        )}
                        {/* Dimensions badge */}
                        <div className="absolute top-3 right-3 bg-black/30 backdrop-blur-sm rounded-lg px-2 py-1">
                            <span className="text-[10px] font-mono text-white/80">
                                512×384
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-7 p-6">
                        {/* Price + description */}
                        <div>
                            <p className="font-display font-bold text-3xl text-rw-ink">
                                ₦{price.toLocaleString()}
                            </p>
                            <p className="mt-2.5 text-sm text-rw-text-2 leading-relaxed">
                                {product.description}
                            </p>
                        </div>

                        {/* Colour selection */}
                        {colors.length > 0 && (
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <p className="text-sm font-semibold text-rw-ink">
                                        Colour
                                    </p>
                                    {selectedColor && (
                                        <span className="text-sm text-rw-text-2">
                                            {selectedColor}
                                        </span>
                                    )}
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    {colors.map((c) => (
                                        <button
                                            key={c}
                                            onClick={() => handleColorSelect(c)}
                                            title={c}
                                            aria-label={`Select ${c}`}
                                            aria-pressed={selectedColor === c}
                                            className={`relative h-10 w-10 rounded-full border-2 transition-all shadow-sm ${
                                                selectedColor === c
                                                    ? "border-rw-crimson scale-110 ring-2 ring-rw-crimson/20"
                                                    : "border-gray-200 hover:border-gray-400 hover:scale-105"
                                            }`}
                                            style={{ background: COLOR_HEX[c] ?? "#ccc" }}
                                        >
                                            {selectedColor === c && (
                                                <span className="absolute inset-0 flex items-center justify-center">
                                                    <svg
                                                        className="h-4 w-4 text-white drop-shadow"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth={2.5}
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="m4.5 12.75 6 6 9-13.5"
                                                        />
                                                    </svg>
                                                </span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Size selection */}
                        {allSizes.length > 0 && allSizes[0] !== "One Size" && (
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <p className="text-sm font-semibold text-rw-ink">
                                        Size
                                    </p>
                                    {selectedSize && (
                                        <span className="text-sm text-rw-text-2">
                                            {selectedSize}
                                        </span>
                                    )}
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {allSizes.map((s) => {
                                        const avail = isSizeAvailable(s);
                                        return (
                                            <button
                                                key={s}
                                                onClick={() =>
                                                    avail && setSelectedSize(s)
                                                }
                                                aria-pressed={selectedSize === s}
                                                disabled={!avail}
                                                className={`h-11 min-w-[52px] rounded-xl border px-4 text-sm font-semibold transition-all ${
                                                    !avail
                                                        ? "border-gray-100 text-gray-300 cursor-not-allowed line-through bg-gray-50"
                                                        : selectedSize === s
                                                          ? "border-rw-ink bg-rw-ink text-white"
                                                          : "border-[var(--rw-border)] text-rw-ink hover:border-rw-ink"
                                                }`}
                                            >
                                                {s}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Quantity */}
                        <div>
                            <p className="text-sm font-semibold text-rw-ink mb-3">
                                Quantity
                            </p>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center border border-[var(--rw-border)] rounded-xl overflow-hidden">
                                    <button
                                        onClick={() =>
                                            setQuantity((q) => Math.max(1, q - 1))
                                        }
                                        aria-label="Decrease quantity"
                                        className="h-11 w-11 flex items-center justify-center text-rw-ink hover:bg-rw-bg-alt transition-colors font-bold text-lg"
                                    >
                                        −
                                    </button>
                                    <span className="w-12 text-center font-bold text-rw-ink tabular-nums border-x border-[var(--rw-border)] h-11 flex items-center justify-center">
                                        {quantity}
                                    </span>
                                    <button
                                        onClick={() =>
                                            setQuantity((q) => Math.min(20, q + 1))
                                        }
                                        aria-label="Increase quantity"
                                        className="h-11 w-11 flex items-center justify-center text-rw-ink hover:bg-rw-bg-alt transition-colors font-bold text-lg"
                                    >
                                        +
                                    </button>
                                </div>
                                <span className="text-sm text-rw-muted">
                                    ₦{(price * quantity).toLocaleString()} total
                                </span>
                            </div>
                        </div>

                        {/* Availability warning */}
                        {!available && variant && (
                            <div className="flex items-center gap-2 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3">
                                <svg
                                    className="h-4 w-4 text-amber-600 shrink-0"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                                    />
                                </svg>
                                <p className="text-sm text-amber-700 font-medium">
                                    This variant is currently out of stock.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sticky footer */}
                <div className="border-t border-[var(--rw-border)] p-6 bg-white shrink-0">
                    <Button
                        variant={added ? "outlined" : "primary"}
                        size="lg"
                        onClick={handleAdd}
                        disabled={!available || added}
                        className="w-full !h-14 !text-base"
                        id={`add-to-cart-${product.id}`}
                    >
                        {added
                            ? "Added to cart ✓"
                            : !available
                              ? "Out of stock"
                              : `Add to Cart — ₦${(price * quantity).toLocaleString()}`}
                    </Button>
                </div>
            </aside>
        </>
    );
}
