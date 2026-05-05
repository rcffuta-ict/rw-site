"use client";

import { useState, useMemo } from "react";
import { DEMO_PRODUCTS, COLOR_HEX } from "@/lib/data/products";
import Link from "next/link";
import { ph } from "@/lib/utils/functions";
import { AddProductButton, UpdateAvailabilityButton } from "./components";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import { SearchInput } from "@/components/ui/SearchInput";

const CATEGORY_LABELS: Record<string, string> = {
    tshirt: "T-Shirt",
    hoodie: "Hoodie",
    accessory: "Accessory",
};

const CATEGORY_COLORS: Record<string, string> = {
    tshirt: "bg-blue-50 text-blue-700 border-blue-200",
    hoodie: "bg-violet-50 text-violet-700 border-violet-200",
    accessory: "bg-amber-50 text-amber-700 border-amber-200",
};

const COLOR_SWATCH_BG: Record<string, string> = {
    Black: "1a1a1a",
    White: "f5f5f0",
    Burgundy: "7a0c31",
    "Wine Red": "940011",
    Navy: "0a1628",
};

function productImageUrl(name: string, color: string | null) {
    const bg = color && COLOR_SWATCH_BG[color] ? COLOR_SWATCH_BG[color] : "f3f4f6";
    const fg = color ? "e0e0e0" : "9ca3af";
    const label = `${name}${color ? `\n${color}` : ""}`;
    return ph(480, 640, label, bg, fg);
}

const CATEGORIES = ["all", "tshirt", "hoodie", "accessory"] as const;

export default function ProductsClient() {
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState<typeof CATEGORIES[number]>("all");

    const filteredProducts = useMemo(() => {
        return DEMO_PRODUCTS.filter(p => {
            const matchesSearch = !searchQuery || 
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.description.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = categoryFilter === "all" || p.category === categoryFilter;
            return matchesSearch && matchesCategory;
        });
    }, [searchQuery, categoryFilter]);

    const totalVariants = filteredProducts.reduce((s, p) => s + p.variants.length, 0);

    return (
        <div className="flex flex-col gap-10 animate-fade-in">
            <AdminBreadcrumb items={[{ label: "Products" }]} />

            {/* Page header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-[var(--rw-border)] pb-10">
                <div className="flex flex-col gap-2">
                    <h1 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-rw-ink tracking-tight">Products</h1>
                    <div className="flex items-center gap-3 text-sm text-rw-muted font-medium">
                        <span className="flex items-center gap-1.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-rw-crimson" />
                            {filteredProducts.length} Products
                        </span>
                        <span className="h-1 w-1 rounded-full bg-rw-muted/30" />
                        <span>{totalVariants} Variants</span>
                    </div>
                </div>
                <AddProductButton />
            </div>

            {/* Filter & Search */}
            <div className="flex flex-col xl:flex-row gap-6 items-start xl:items-end justify-between">
                <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setCategoryFilter(cat)}
                            className={`rounded-full px-5 py-2 text-[10px] font-bold uppercase tracking-widest transition-all ${
                                categoryFilter === cat
                                    ? "bg-rw-ink text-white shadow-md scale-105"
                                    : "bg-white text-rw-muted border border-[var(--rw-border)] hover:border-rw-ink hover:text-rw-ink"
                            }`}
                        >
                            {cat === "all" ? "All Categories" : CATEGORY_LABELS[cat]}
                        </button>
                    ))}
                </div>
                <div className="w-full xl:max-w-md">
                    <SearchInput 
                        query={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onClear={() => setSearchQuery("")}
                        placeholder="Search products by name or description..."
                    />
                </div>
            </div>

            {/* Product grid - 4 per row on desktop */}
            {filteredProducts.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 stagger-children">
                    {filteredProducts.map((p) => {
                        const uniqueColors = [
                            ...new Set(p.variants.map((v) => v.color).filter(Boolean)),
                        ] as string[];
                        const primaryColor = uniqueColors[0] ?? null;

                        return (
                            <div
                                key={p.id}
                                className="rw-card group flex flex-col bg-white border-none shadow-lg ring-1 ring-[var(--rw-border)] hover:ring-rw-crimson/30 transition-all duration-300"
                            >
                                {/* Product image */}
                                <div className="relative aspect-[3/4] overflow-hidden bg-rw-bg-alt rounded-t-[var(--rw-radius)]">
                                    <img
                                        src={productImageUrl(p.name, primaryColor)}
                                        alt={p.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    
                                    {/* Status Overlay */}
                                    <div className="absolute top-4 right-4 z-10">
                                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border ${
                                            p.isAvailable 
                                                ? "bg-green-500/10 text-green-600 border-green-500/20" 
                                                : "bg-gray-500/10 text-gray-500 border-gray-500/20"
                                        }`}>
                                            <span className={`h-1.5 w-1.5 rounded-full ${p.isAvailable ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" : "bg-gray-400"}`} />
                                            {p.isAvailable ? "Active" : "Hidden"}
                                        </span>
                                    </div>

                                    {/* Category Badge */}
                                    <div className="absolute bottom-4 left-4">
                                        <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest bg-white/90 backdrop-blur-sm border border-white/20 shadow-sm ${CATEGORY_COLORS[p.category]}`}>
                                            {CATEGORY_LABELS[p.category]}
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-5 flex flex-col flex-1">
                                    <div className="flex flex-col gap-1 mb-4">
                                        <h2 className="font-display font-bold text-rw-ink text-base line-clamp-1 group-hover:text-rw-crimson transition-colors">
                                            {p.name}
                                        </h2>
                                        <div className="flex items-baseline justify-between">
                                            <span className="font-display font-black text-rw-crimson text-lg">
                                                ₦{p.basePrice.toLocaleString()}
                                            </span>
                                            <span className="text-[10px] font-bold text-rw-muted uppercase tracking-wider">Base Price</span>
                                        </div>
                                    </div>

                                    <div className="space-y-3 mb-6">
                                        {/* Stats */}
                                        <div className="flex items-center justify-between py-2 border-y border-[var(--rw-border)]">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-bold text-rw-muted uppercase tracking-wider">Variants</span>
                                                <span className="text-sm font-bold text-rw-ink">{p.variants.length}</span>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <span className="text-[10px] font-bold text-rw-muted uppercase tracking-wider">Colors</span>
                                                <div className="flex gap-1 mt-0.5">
                                                    {uniqueColors.slice(0, 3).map(c => (
                                                        <span key={c} className="h-2 w-2 rounded-full border border-black/10" style={{ background: COLOR_HEX[c] }} />
                                                    ))}
                                                    {uniqueColors.length > 3 && <span className="text-[8px] font-bold text-rw-muted">+{uniqueColors.length - 3}</span>}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <p className="text-[11px] text-rw-muted line-clamp-2 leading-relaxed font-medium">
                                            {p.description}
                                        </p>
                                    </div>

                                    <div className="flex gap-2 mt-auto">
                                        <Link
                                            href={`/admin/products/${p.id}`}
                                            className="btn-secondary flex-1 !h-10 !px-0 text-[11px] font-bold uppercase tracking-widest border-[var(--rw-border-mid)] shadow-sm"
                                        >
                                            Manage
                                        </Link>
                                        <UpdateAvailabilityButton isAvailable={p.isAvailable} />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="rw-card p-20 flex flex-col items-center justify-center text-center gap-4 bg-rw-bg-alt/30 border-dashed">
                    <div className="h-16 w-16 rounded-full bg-rw-bg-alt border border-[var(--rw-border)] flex items-center justify-center text-rw-muted">
                        <svg className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
                    </div>
                    <div>
                        <p className="font-display font-bold text-xl text-rw-ink">No products found</p>
                        <p className="text-sm text-rw-muted mt-1">Try adjusting your filters or search query</p>
                    </div>
                    <button 
                        onClick={() => { setSearchQuery(""); setCategoryFilter("all"); }}
                        className="btn-secondary !h-10 px-6 text-[11px] font-bold uppercase tracking-widest mt-2"
                    >
                        Clear Filters
                    </button>
                </div>
            )}
        </div>
    );
}
