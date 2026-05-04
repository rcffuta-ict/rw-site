"use client";

import { useState } from "react";
import Link from "next/link";
import { getProductById, COLOR_HEX } from "@/lib/data/products";
import { notFound } from "next/navigation";
import type { ProductVariant } from "@/lib/data/types";

const SIZE_ORDER = ["S", "M", "L", "XL", "XXL", "One Size"];

function sortVariants(variants: ProductVariant[]) {
    return [...variants].sort((a, b) => {
        const colorCmp = (a.color ?? "").localeCompare(b.color ?? "");
        if (colorCmp !== 0) return colorCmp;
        const ai = SIZE_ORDER.indexOf(a.size ?? "");
        const bi = SIZE_ORDER.indexOf(b.size ?? "");
        return ai - bi;
    });
}

export function ProductDetailClient({ productId }: { productId: string }) {
    const product = getProductById(productId);
    if (!product) notFound();

    const [variants, setVariants] = useState(() => sortVariants(product.variants));
    const [saved, setSaved] = useState(false);

    function toggleVariant(id: string) {
        setVariants(prev => prev.map(v => v.id === id ? { ...v, isAvailable: !v.isAvailable } : v));
        setSaved(false);
    }

    function handleSave() {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    }

    const uniqueColors = [...new Set(variants.map(v => v.color).filter(Boolean))] as string[];
    const availableCount = variants.filter(v => v.isAvailable).length;

    return (
        <div className="flex flex-col gap-8">
            {/* Header */}
            <div className="flex items-start gap-3">
                <Link href="/admin/products" className="mt-1 text-rw-muted hover:text-rw-ink transition-colors">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                </Link>
                <div className="flex-1">
                    <h1 className="section-heading text-2xl text-rw-ink">{product.name}</h1>
                    <p className="mt-1 text-sm text-rw-muted">{product.description}</p>
                </div>
                <div className="text-right shrink-0">
                    <p className="font-bold text-xl text-rw-crimson">₦{product.basePrice.toLocaleString()}</p>
                    <p className="text-xs text-rw-muted">base price</p>
                </div>
            </div>

            {/* Overview */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                    { label: "Total Variants",   value: variants.length },
                    { label: "Available",        value: availableCount },
                    { label: "Colours",          value: uniqueColors.length },
                    { label: "Category",         value: product.category },
                ].map(stat => (
                    <div key={stat.label} className="rw-card p-4 text-center">
                        <p className="font-display font-bold text-2xl text-rw-ink">{stat.value}</p>
                        <p className="text-xs text-rw-muted mt-0.5">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Colour swatches overview */}
            {uniqueColors.length > 0 && (
                <div>
                    <h2 className="text-xs font-bold uppercase tracking-wider text-rw-text-2 mb-3">Colour Options</h2>
                    <div className="flex flex-wrap gap-3">
                        {uniqueColors.map(color => (
                            <div key={color} className="flex items-center gap-2 rounded-xl border border-[var(--rw-border)] px-3 py-2 bg-white">
                                <span
                                    className="h-4 w-4 rounded-full border border-black/10"
                                    style={{ backgroundColor: COLOR_HEX[color] ?? "#999" }}
                                />
                                <span className="text-sm text-rw-ink font-medium">{color}</span>
                                <span className="text-xs text-rw-muted">
                                    ({variants.filter(v => v.color === color && v.isAvailable).length}/{variants.filter(v => v.color === color).length})
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Variant editor */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-rw-text-2">Variants</h2>
                    <button
                        onClick={() => alert("Add variant — stub in demo build")}
                        className="flex items-center gap-1.5 rounded-lg border border-[var(--rw-border-mid)] px-3 py-1.5 text-xs font-semibold text-rw-text-2 hover:bg-rw-bg-alt transition-colors"
                    >
                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                        Add Variant
                    </button>
                </div>

                <div className="rw-card overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-[var(--rw-border)] bg-rw-bg-alt text-rw-muted">
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Colour</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Size</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider hidden sm:table-cell">Design</th>
                                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider">Price</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider">Available</th>
                                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider hidden md:table-cell">ID</th>
                            </tr>
                        </thead>
                        <tbody>
                            {variants.map(v => (
                                <tr key={v.id} className={`border-b border-[var(--rw-border)] last:border-0 transition-colors ${v.isAvailable ? "hover:bg-rw-bg-alt" : "bg-gray-50 opacity-60"}`}>
                                    <td className="px-4 py-3">
                                        {v.color ? (
                                            <div className="flex items-center gap-2">
                                                <span
                                                    className="h-4 w-4 rounded-full border border-black/10 shrink-0"
                                                    style={{ backgroundColor: COLOR_HEX[v.color] ?? "#999" }}
                                                />
                                                <span className="text-rw-ink">{v.color}</span>
                                            </div>
                                        ) : <span className="text-rw-muted">—</span>}
                                    </td>
                                    <td className="px-4 py-3 text-rw-ink font-medium">{v.size ?? "—"}</td>
                                    <td className="px-4 py-3 hidden sm:table-cell text-rw-text-2">{v.design ?? "—"}</td>
                                    <td className="px-4 py-3 text-right font-semibold text-rw-ink">
                                        {v.priceOverride ? (
                                            <span className="text-rw-crimson">₦{v.priceOverride.toLocaleString()}</span>
                                        ) : (
                                            <span className="text-rw-muted text-xs">base</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <button
                                            onClick={() => toggleVariant(v.id)}
                                            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${v.isAvailable ? "bg-green-500" : "bg-gray-200"}`}
                                        >
                                            <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform ${v.isAvailable ? "translate-x-4.5" : "translate-x-0.5"}`} />
                                        </button>
                                    </td>
                                    <td className="px-4 py-3 text-right text-xs font-mono text-rw-muted hidden md:table-cell">{v.id}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Save */}
                <div className="mt-4 flex items-center gap-3">
                    <button
                        onClick={handleSave}
                        className="rounded-xl bg-fire-gradient px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:opacity-90 transition-opacity"
                    >
                        Save Changes
                    </button>
                    {saved && (
                        <span className="text-sm text-green-700 flex items-center gap-1.5">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                            Saved (demo only — resets on refresh)
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
