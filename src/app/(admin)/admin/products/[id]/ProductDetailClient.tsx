"use client";

import { useState } from "react";
import Link from "next/link";
import { ph } from "@/lib/utils/functions";
import { getProductById, COLOR_HEX } from "@/lib/data/products";
import { notFound } from "next/navigation";
import type { ProductVariant } from "@/lib/data/types";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import { AdminTable } from "@/components/admin/AdminTable";

// ─── Constants ─────────────────────────────────────────────────────────────────

const SIZE_ORDER = ["XS", "S", "M", "L", "XL", "XXL", "One Size"];

const COLOR_SWATCH_BG: Record<string, { bg: string; fg: string }> = {
    Black: { bg: "1a1a1a", fg: "e0e0e0" },
    White: { bg: "f5f5f0", fg: "333333" },
    Burgundy: { bg: "7a0c31", fg: "f0d0d8" },
    "Wine Red": { bg: "940011", fg: "ffcccc" },
    Navy: { bg: "0a1628", fg: "b0c4de" },
};

// ─── Helpers ───────────────────────────────────────────────────────────────────

function sortVariants(variants: ProductVariant[]) {
    return [...variants].sort((a, b) => {
        const colorCmp = (a.color ?? "").localeCompare(b.color ?? "");
        if (colorCmp !== 0) return colorCmp;
        return SIZE_ORDER.indexOf(a.size ?? "") - SIZE_ORDER.indexOf(b.size ?? "");
    });
}

function productImageUrl(name: string, color: string | null) {
    // @ts-expect-error coming from a literaly object
    const { bg, fg } = (color && COLOR_SWATCH_BG[color]) ?? {
        bg: "f3f4f6",
        fg: "9ca3af",
    };
    const label = `${name}${color ? `\n${color}` : ""}`;
    return ph(480, 640, label, bg, fg);
}

// ─── Component ─────────────────────────────────────────────────────────────────

export default function ProductDetailClient({ productId }: { productId: string }) {
    const product = getProductById(productId);
    if (!product) notFound();

    const [variants, setVariants] = useState(() => sortVariants(product.variants));
    const [saved, setSaved] = useState(false);

    const uniqueColors = [
        ...new Set(variants.map((v) => v.color).filter(Boolean)),
    ] as string[];
    const availableCount = variants.filter((v) => v.isAvailable).length;

    // Active colour drives the main image
    const [activeColor, setActiveColor] = useState<string | null>(
        uniqueColors[0] ?? null
    );

    function toggleVariant(id: string) {
        setVariants((prev) =>
            prev.map((v) => (v.id === id ? { ...v, isAvailable: !v.isAvailable } : v))
        );
        setSaved(false);
    }

    function handleSave() {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    }

    return (
        <div className="flex flex-col gap-10">
            <AdminBreadcrumb
                items={[
                    { label: "Products", href: "/admin/products" },
                    { label: product.name }
                ]}
            />

            {/* Product header: image left, details right */}
            <div className="grid lg:grid-cols-[360px_1fr] gap-8 items-start">
                {/* Image panel — single view, switches per colour */}
                <div className="flex flex-col gap-3">
                    <div
                        className="relative rounded-2xl overflow-hidden bg-rw-bg-alt"
                        style={{ aspectRatio: "3/4" }}
                    >
                        <img
                            key={activeColor ?? "default"}
                            src={productImageUrl(product.name, activeColor)}
                            alt={`${product.name}${activeColor ? ` — ${activeColor}` : ""}`}
                            className="w-full h-full object-cover animate-fade-in"
                        />
                        {/* Colour label */}
                        {activeColor && (
                            <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-sm">
                                <span
                                    className="h-3.5 w-3.5 rounded-full border border-black/10"
                                    style={{
                                        background: COLOR_HEX[activeColor] ?? "#888",
                                    }}
                                />
                                <span className="text-xs font-semibold text-rw-ink">
                                    {activeColor}
                                </span>
                            </div>
                        )}
                        {/* Dimension badge */}
                        <div className="absolute top-3 right-3 bg-black/30 backdrop-blur-sm rounded-lg px-2 py-1">
                            <span className="text-[10px] font-mono text-white/80">
                                480×640
                            </span>
                        </div>
                    </div>

                    {/* Colour switcher thumbnails */}
                    {uniqueColors.length > 1 && (
                        <div className="flex gap-2">
                            {uniqueColors.map((color) => (
                                <button
                                    key={color}
                                    title={color}
                                    onClick={() => setActiveColor(color)}
                                    className={`relative flex-1 rounded-xl overflow-hidden border-2 transition-all ${
                                        activeColor === color
                                            ? "border-rw-crimson"
                                            : "border-[var(--rw-border)] hover:border-rw-muted"
                                    }`}
                                    style={{ aspectRatio: "3/4" }}
                                >
                                    <img
                                        src={productImageUrl(product.name, color)}
                                        alt={color}
                                        className="w-full h-full object-cover"
                                    />
                                    {activeColor === color && (
                                        <div className="absolute inset-0 ring-2 ring-inset ring-rw-crimson rounded-xl" />
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Product details */}
                <div className="flex flex-col gap-6">
                    <div>
                        <h1 className="section-heading text-2xl lg:text-3xl">
                            {product.name}
                        </h1>
                        <p className="mt-2.5 text-rw-text-2 leading-relaxed">
                            {product.description}
                        </p>
                    </div>

                    <div className="flex items-baseline gap-2">
                        <p className="font-display font-bold text-4xl text-rw-crimson">
                            ₦{product.basePrice.toLocaleString()}
                        </p>
                        <span className="text-sm text-rw-muted">base price</span>
                    </div>

                    {/* Quick stats */}
                    <div className="grid grid-cols-3 gap-3">
                        {[
                            { label: "Variants", value: variants.length },
                            { label: "Available", value: availableCount },
                            { label: "Colours", value: uniqueColors.length },
                        ].map((stat) => (
                            <div key={stat.label} className="rw-card p-4 text-center">
                                <p className="font-display font-bold text-2xl text-rw-ink">
                                    {stat.value}
                                </p>
                                <p className="text-[11px] text-rw-muted font-medium uppercase tracking-wider mt-0.5">
                                    {stat.label}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Colour breakdown */}
                    {uniqueColors.length > 0 && (
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-rw-muted mb-3">
                                Colour Options
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {uniqueColors.map((color) => (
                                    <button
                                        key={color}
                                        onClick={() => setActiveColor(color)}
                                        className={`flex items-center gap-2 rounded-xl border px-3 py-2 bg-white transition-colors ${
                                            activeColor === color
                                                ? "border-rw-crimson"
                                                : "border-[var(--rw-border)] hover:border-rw-muted"
                                        }`}
                                    >
                                        <span
                                            className="h-4 w-4 rounded-full border border-black/10"
                                            style={{
                                                backgroundColor:
                                                    COLOR_HEX[color] ?? "#999",
                                            }}
                                        />
                                        <span className="text-sm text-rw-ink font-medium">
                                            {color}
                                        </span>
                                        <span className="text-xs text-rw-muted">
                                            {
                                                variants.filter(
                                                    (v) =>
                                                        v.color === color && v.isAvailable
                                                ).length
                                            }
                                            /
                                            {
                                                variants.filter((v) => v.color === color)
                                                    .length
                                            }
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Variant table */}
            <div className="flex flex-col gap-5">
                <div className="flex items-center justify-between">
                    <h2 className="font-display font-bold text-lg text-rw-ink uppercase tracking-tight">Product Variants</h2>
                    <button
                        onClick={() => alert("Add variant — stub in demo build")}
                        className="btn-secondary !h-10 !px-5 text-[11px] font-bold uppercase tracking-widest flex items-center gap-2"
                    >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                        Add Variant
                    </button>
                </div>

                <AdminTable<ProductVariant>
                    data={variants}
                    keyExtractor={(v) => v.id}
                    columns={[
                        {
                            label: "Colour",
                            key: "color",
                            render: (v: ProductVariant) => (
                                <div className="flex items-center gap-3">
                                    <span className="h-5 w-5 rounded-full border border-black/10 shrink-0" style={{ backgroundColor: COLOR_HEX[v.color ?? ""] ?? "#999" }} />
                                    <span className="font-bold text-rw-ink">{v.color ?? "—"}</span>
                                </div>
                            )
                        },
                        {
                            label: "Size",
                            key: "size",
                            render: (v: ProductVariant) => <span className="font-mono font-bold text-rw-muted">{v.size ?? "—"}</span>
                        },
                        {
                            label: "Design",
                            key: "design",
                            className: "hidden sm:table-cell",
                            render: (v: ProductVariant) => <span className="text-rw-text-2 font-medium">{v.design ?? "—"}</span>
                        },
                        {
                            label: "Price",
                            key: "priceOverride",
                            align: "right",
                            render: (v: ProductVariant) => (
                                <span className={v.priceOverride ? "text-rw-crimson font-bold" : "text-rw-muted text-[10px] font-bold uppercase tracking-widest"}>
                                    {v.priceOverride ? `₦${v.priceOverride.toLocaleString()}` : "Inherit Base"}
                                </span>
                            )
                        },
                        {
                            label: "Available",
                            key: "isAvailable",
                            align: "center",
                            render: (v: ProductVariant) => (
                                <button
                                    onClick={() => toggleVariant(v.id)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 ${v.isAvailable ? "bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.3)]" : "bg-gray-200"}`}
                                >
                                    <span className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-300 ${v.isAvailable ? "translate-x-6" : "translate-x-1"}`} />
                                </button>
                            )
                        },
                        {
                            label: "ID",
                            key: "id",
                            align: "right",
                            className: "hidden md:table-cell",
                            render: (v: ProductVariant) => <span className="text-[10px] font-mono text-rw-muted font-medium">{v.id}</span>
                        }
                    ]}
                />
            </div>

            <div className="mt-5 flex items-center gap-3">
                <button
                    onClick={handleSave}
                    className="btn-primary !h-10 !px-5 text-sm"
                >
                    Save Changes
                </button>
                {saved && (
                    <span className="text-sm text-green-700 flex items-center gap-1.5 animate-fade-in">
                        <svg
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m4.5 12.75 6 6 9-13.5"
                            />
                        </svg>
                        Saved — resets on refresh (demo)
                    </span>
                )}
            </div>
        </div>
    );
}
