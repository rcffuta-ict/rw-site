import { DEMO_PRODUCTS, COLOR_HEX } from "@/lib/data/products";
import Link from "next/link";
import type { Metadata } from "next";
import { AddProductButton, UpdateAvailabilityButton } from "./components";

export const metadata: Metadata = { title: "Products — RW'26 Admin" };

const CATEGORY_LABELS: Record<string, string> = {
    tshirt:    "T-Shirt",
    hoodie:    "Hoodie",
    accessory: "Accessory",
};

const CATEGORY_COLORS: Record<string, string> = {
    tshirt:    "bg-blue-50 text-blue-700 border-blue-200",
    hoodie:    "bg-violet-50 text-violet-700 border-violet-200",
    accessory: "bg-amber-50 text-amber-700 border-amber-200",
};

const COLOR_SWATCH_BG: Record<string, string> = {
    Black:      "1a1a1a",
    White:      "f5f5f0",
    Burgundy:   "7a0c31",
    "Wine Red": "940011",
    Navy:       "0a1628",
};

function productImageUrl(name: string, color: string | null) {
    const bg    = color && COLOR_SWATCH_BG[color] ? COLOR_SWATCH_BG[color] : "f3f4f6";
    const fg    = color ? "e0e0e0" : "9ca3af";
    const label = encodeURIComponent(`${name}${color ? `\n${color}` : ""}\n480×640`);
    return `https://placehold.co/480x640/${bg}/${fg}?text=${label}`;
}

export default function ProductsPage() {
    const totalVariants = DEMO_PRODUCTS.reduce((s, p) => s + p.variants.length, 0);

    return (
        <div className="flex flex-col gap-8">
            {/* Page header */}
            <div className="flex items-end justify-between flex-wrap gap-4">
                <div>
                    <h1 className="section-heading text-2xl lg:text-3xl">Products</h1>
                    <p className="mt-1.5 text-sm text-rw-muted">
                        {DEMO_PRODUCTS.length} products · {totalVariants} variants total
                    </p>
                </div>
                <AddProductButton />
            </div>

            {/* Product grid */}
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {DEMO_PRODUCTS.map(p => {
                    const availableVariants = p.variants.filter(v => v.isAvailable);
                    const uniqueColors = [...new Set(p.variants.map(v => v.color).filter(Boolean))] as string[];
                    const uniqueSizes  = [...new Set(p.variants.map(v => v.size).filter(Boolean))] as string[];
                    const primaryColor = uniqueColors[0] ?? null;

                    return (
                        <div key={p.id} className="rw-card overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                            {/* Product image — realistic portrait ratio */}
                            <div className="relative overflow-hidden bg-rw-bg-alt" style={{ aspectRatio: "3/4" }}>
                                <img
                                    src={productImageUrl(p.name, primaryColor)}
                                    alt={p.name}
                                    className="w-full h-full object-cover"
                                />

                                {/* Colour dots overlay (top left) */}
                                {uniqueColors.length > 0 && (
                                    <div className="absolute top-3 left-3 flex gap-1.5">
                                        {uniqueColors.slice(0, 5).map(c => (
                                            <span
                                                key={c}
                                                title={c}
                                                className="h-5 w-5 rounded-full border-2 border-white shadow-sm"
                                                style={{ background: COLOR_HEX[c] ?? "#888" }}
                                            />
                                        ))}
                                        {uniqueColors.length > 5 && (
                                            <span className="text-[10px] text-white font-bold bg-black/40 rounded-full px-1.5 flex items-center">
                                                +{uniqueColors.length - 5}
                                            </span>
                                        )}
                                    </div>
                                )}

                                {/* Category badge */}
                                <div className="absolute top-3 right-3">
                                    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${CATEGORY_COLORS[p.category] ?? "bg-gray-100 text-gray-600 border-gray-200"}`}>
                                        {CATEGORY_LABELS[p.category] ?? p.category}
                                    </span>
                                </div>

                                {/* Availability ribbon */}
                                <div className="absolute bottom-0 left-0 right-0 px-4 py-3 bg-gradient-to-t from-black/60 via-black/20 to-transparent">
                                    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${p.isAvailable ? "text-green-300" : "text-gray-400"}`}>
                                        <span className={`h-1.5 w-1.5 rounded-full ${p.isAvailable ? "bg-green-400 animate-pulse-soft" : "bg-gray-400"}`} />
                                        {p.isAvailable ? "Active" : "Inactive"}
                                    </span>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="p-5 flex flex-col gap-4 flex-1">
                                <div className="flex items-start justify-between gap-2">
                                    <h2 className="font-display font-bold text-rw-ink text-lg leading-snug">{p.name}</h2>
                                    <span className="font-bold text-rw-crimson text-lg shrink-0">₦{p.basePrice.toLocaleString()}</span>
                                </div>

                                <p className="text-sm text-rw-muted line-clamp-2 leading-relaxed">{p.description}</p>

                                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-rw-text-2">
                                    <span><strong className="text-rw-ink">{p.variants.length}</strong> variants</span>
                                    <span><strong className="text-rw-ink">{availableVariants.length}</strong> available</span>
                                    {uniqueColors.length > 0 && <span><strong className="text-rw-ink">{uniqueColors.length}</strong> colours</span>}
                                    {uniqueSizes.length > 1  && <span>Sizes: {uniqueSizes.join(" · ")}</span>}
                                </div>

                                <div className="flex gap-2 border-t border-[var(--rw-border)] pt-4 mt-auto">
                                    <Link
                                        href={`/admin/products/${p.id}`}
                                        className="btn-secondary flex-1 !h-10 text-sm"
                                    >
                                        Edit / Variants
                                    </Link>
                                    <UpdateAvailabilityButton isAvailable={p.isAvailable} />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
