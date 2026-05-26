"use client";

import { COLOR_HEX } from "@/lib/data/products";
import type { Product } from "@/lib/data/types";
import cloudinaryLoader from "@/lib/utils/cloudinaryLoader";
import { formatNaira, productImageUrl } from "@/lib/utils/functions";
import Image from "next/image";
import { useMemo, useState } from "react";
import { ProductImage } from "../common/CloudinaryImage";

interface Props {
    product: Product;
    onOpen: () => void;
}

export function ShopProductCard({ product, onOpen }: Props) {
    const colors = useMemo(() => {
        return [...new Set(product.variants.filter((v) => v.color).map((v) => v.color!))];
    }, [product.variants]);

    const sizes = [
        ...new Set(
            product.variants
                .filter((v) => v.size && v.size !== "One Size")
                .map((v) => v.size!)
        ),
    ];

    const [hoveredColor, setHoveredColor] = useState<string | null>(null);
    const displayColor = hoveredColor ?? colors[0] ?? null;

    const activeVariant =
        product.variants.find((v) => v.color === displayColor) || product.variants[0];
    const primaryImage =
        activeVariant?.images?.find((img) => img.isPrimary)?.cloudinaryUrl ||
        activeVariant?.images?.[0]?.cloudinaryUrl;
    const finalImageUrl =
        primaryImage || productImageUrl(product.name, displayColor, 360, 480);

    return (
        <article className="rw-card group flex flex-col overflow-hidden hover:-translate-y-1.5">
            {/* Image Wrapper */}
            <div
                className="relative overflow-hidden bg-rw-bg-alt"
                style={{ aspectRatio: "3/4" }}
            >
                <ProductImage
                    imageUrl={finalImageUrl}
                    alt={`${product.name}${displayColor ? ` — ${displayColor}` : ""}`}
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

                {/* Colour swatches */}
                {colors.length > 0 && (
                    <div className="absolute top-3 left-3 flex gap-1.5 z-10">
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

                {/* Category pill */}
                <span className="absolute bottom-3 right-3 text-[10px] font-bold uppercase tracking-widest bg-white/90 backdrop-blur-sm text-[#1C0003] px-2.5 py-1 rounded-full z-10">
                    {product.categoryLabel}
                </span>
            </div>

            {/* Info Section */}
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
                        {formatNaira(product.basePrice)}
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

export function ShimmerCard() {
    return (
        <div
            className="rw-card overflow-hidden flex flex-col"
            style={{ aspectRatio: "auto" }}
        >
            {/* Image placeholder */}
            <div
                className="relative bg-gradient-to-br from-[#f5f0ef] to-[#ede5e3] overflow-hidden"
                style={{ aspectRatio: "3/4" }}
            >
                {/* Shimmer sweep */}
                <div className="absolute inset-0 -translate-x-full animate-[shimmer-slide_1.8s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/50 to-transparent" />
                {/* Ghost icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <svg
                        className="w-10 h-10 text-[#1C0003]/10"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007Z"
                        />
                    </svg>
                </div>
            </div>
            {/* Info placeholder */}
            <div className="p-5 flex flex-col gap-3">
                <div className="h-4 w-3/4 rounded-full bg-[#1C0003]/8 overflow-hidden relative">
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer-slide_1.8s_ease-in-out_infinite_0.2s] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
                </div>
                <div className="h-3 w-1/2 rounded-full bg-[#1C0003]/5 overflow-hidden relative">
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer-slide_1.8s_ease-in-out_infinite_0.4s] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
                </div>
                <div className="pt-3 border-t border-[var(--rw-border)] flex items-center justify-between">
                    <div className="h-5 w-16 rounded-full bg-rw-crimson/15 overflow-hidden relative">
                        <div className="absolute inset-0 -translate-x-full animate-[shimmer-slide_1.8s_ease-in-out_infinite_0.6s] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
                    </div>
                    <div className="h-8 w-24 rounded-xl bg-[#1C0003]/8 overflow-hidden relative">
                        <div className="absolute inset-0 -translate-x-full animate-[shimmer-slide_1.8s_ease-in-out_infinite_0.3s] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
                    </div>
                </div>
            </div>
        </div>
    );
}
