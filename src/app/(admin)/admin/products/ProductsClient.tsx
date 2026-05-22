"use client";

import { useState, useMemo, useTransition } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { ph } from "@/lib/utils/functions";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import { SearchInput } from "@/components/ui/SearchInput";
import { AdminStats, AdminStatItem } from "@/components/admin/AdminStats";
import CategoryDrawer from "@/components/admin/CategoryDrawer";
import { updateProduct } from "@/lib/services/products.service";
import type { Category, Product } from "@/lib/data/types";

// ─── Color map ────────────────────────────────────────────────────────────────

const COLOR_HEX: Record<string, string> = {
    Black:      "#1a1a1a",
    White:      "#f5f5f0",
    Burgundy:   "#7a0c31",
    "Wine Red": "#940011",
    Navy:       "#0a1628",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function productImageUrl(name: string, color: string | null, cloudinaryUrl?: string | null) {
    if (cloudinaryUrl) return cloudinaryUrl;
    const bg = color ? (COLOR_HEX[color]?.slice(1) ?? "f3f4f6") : "f3f4f6";
    const fg = color ? "e0e0e0" : "9ca3af";
    return ph(360, 480, `${name}${color ? `\n${color}` : ""}`, bg, fg);
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyProducts({ onClear, hasFilters }: { onClear: () => void; hasFilters: boolean }) {
    if (hasFilters) {
        return (
            <div className="rw-card p-20 flex flex-col items-center justify-center text-center gap-4 bg-rw-bg-alt/30 border-dashed">
                <div className="h-16 w-16 rounded-full bg-rw-bg-alt border border-[var(--rw-border)] flex items-center justify-center text-rw-muted">
                    <svg className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>
                </div>
                <div>
                    <p className="font-display font-bold text-xl text-rw-ink">No products found</p>
                    <p className="text-sm text-rw-muted mt-1">Try adjusting your filters or search query</p>
                </div>
                <button onClick={onClear} className="btn-secondary !h-10 px-6 text-[11px] font-bold uppercase tracking-widest mt-2">
                    Clear Filters
                </button>
            </div>
        );
    }

    return (
        <div className="rw-card p-20 flex flex-col items-center justify-center text-center gap-6 bg-rw-bg-alt/30 border-dashed">
            <div className="h-20 w-20 rounded-2xl bg-white border border-[var(--rw-border)] shadow-sm flex items-center justify-center text-rw-muted">
                <svg className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth={1.2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                </svg>
            </div>
            <div>
                <p className="font-display font-bold text-2xl text-rw-ink">No products yet</p>
                <p className="text-sm text-rw-muted mt-2 max-w-xs mx-auto leading-relaxed">
                    Add your first product to start building the Redemption Week &apos;26 catalog.
                </p>
            </div>
            <Link href="/admin/products/new" className="btn-primary !h-11 !px-8 text-sm font-bold flex items-center gap-2">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Add First Product
            </Link>
        </div>
    );
}

// ─── Product card ─────────────────────────────────────────────────────────────

function ProductCard({ product, categoryLabel, onToggle }: {
    product: Product;
    categoryLabel: string;
    onToggle: (id: string, current: boolean) => void;
}) {
    const uniqueColors   = [...new Set(product.variants.map((v) => v.color).filter(Boolean))] as string[];
    const primaryVariant = product.variants.find((v) => v.color === uniqueColors[0]) ?? product.variants[0];
    const primaryImage   = primaryVariant?.images.find((img) => img.isPrimary) ?? primaryVariant?.images[0];
    const availableCount = product.variants.filter((v) => v.isAvailable).length;

    return (
        <div className="rw-card group flex flex-col bg-white border-none shadow-md ring-1 ring-[var(--rw-border)] hover:ring-rw-crimson/30 hover:shadow-xl transition-all duration-300 overflow-hidden">
            {/* Image */}
            <div className="relative aspect-[3/4] overflow-hidden bg-rw-bg-alt">
                <img
                    src={productImageUrl(product.name, uniqueColors[0] ?? null, primaryImage?.cloudinaryUrl)}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Badges */}
                <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest bg-rw-crimson/90 text-white backdrop-blur-sm shadow-sm">
                        Pre-order
                    </span>
                </div>

                <div className="absolute top-3 right-3">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider backdrop-blur-md border ${
                        product.isAvailable
                            ? "bg-green-500/10 text-green-600 border-green-500/20"
                            : "bg-gray-500/10 text-gray-500 border-gray-500/20"
                    }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${product.isAvailable ? "bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.6)]" : "bg-gray-400"}`} />
                        {product.isAvailable ? "Active" : "Hidden"}
                    </span>
                </div>

                <div className="absolute bottom-3 left-3">
                    <span className="px-2 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest bg-white/90 backdrop-blur-sm border border-white/20 shadow-sm text-rw-ink">
                        {categoryLabel}
                    </span>
                </div>

                {product.tags.length > 0 && (
                    <div className="absolute bottom-3 right-3 flex gap-1">
                        {product.tags.slice(0, 2).map((tag) => (
                            <span key={tag} className="px-2 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest bg-rw-crimson/90 text-white backdrop-blur-sm shadow-sm">
                                {tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col flex-1 gap-3">
                <div className="flex flex-col gap-0.5">
                    <h3 className="font-display font-bold text-rw-ink text-sm line-clamp-1 group-hover:text-rw-crimson transition-colors">
                        {product.name}
                    </h3>
                    <div className="flex items-baseline justify-between">
                        <span className="font-display font-black text-rw-crimson text-base">
                            ₦{product.basePrice.toLocaleString()}
                        </span>
                        <span className="text-[9px] font-bold text-rw-muted uppercase tracking-wider">Base Price</span>
                    </div>
                </div>

                <div className="flex items-center justify-between py-2 border-y border-[var(--rw-border)]">
                    <div className="flex flex-col gap-0.5">
                        <span className="text-[9px] font-bold text-rw-muted uppercase tracking-wider">Variants</span>
                        <span className="text-xs font-bold text-rw-ink">{availableCount}/{product.variants.length}</span>
                    </div>
                    <div className="flex flex-col items-end gap-0.5">
                        <span className="text-[9px] font-bold text-rw-muted uppercase tracking-wider">Colors</span>
                        <div className="flex gap-1 mt-0.5">
                            {uniqueColors.slice(0, 4).map((c) => (
                                <span key={c} className="h-2.5 w-2.5 rounded-full border border-black/10" style={{ background: COLOR_HEX[c] }} />
                            ))}
                            {uniqueColors.length > 4 && <span className="text-[9px] font-bold text-rw-muted">+{uniqueColors.length - 4}</span>}
                        </div>
                    </div>
                </div>

                {product.variants.length === 0 && (
                    <p className="text-[10px] text-amber-600 font-semibold flex items-center gap-1.5">
                        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                        </svg>
                        No variants — add them to make orderable
                    </p>
                )}

                <div className="flex items-center gap-2 mt-auto">
                    <Link href={`/admin/products/${product.id}`} className="btn-secondary flex-1 !h-9 !px-0 text-[10px] font-bold uppercase tracking-widest border-[var(--rw-border-mid)] shadow-sm text-center">
                        Manage
                    </Link>
                    <button
                        onClick={() => onToggle(product.id, product.isAvailable)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 ${
                            product.isAvailable ? "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.25)]" : "bg-gray-200"
                        }`}
                        title={product.isAvailable ? "Hide from storefront" : "Make available"}
                    >
                        <span className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-300 ${product.isAvailable ? "translate-x-6" : "translate-x-1"}`} />
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface ProductsClientProps {
    products:   Product[];
    categories: Category[];
}

export default function ProductsClient({ products: initialProducts, categories: initialCategories }: ProductsClientProps) {
    const [products,          setProducts]          = useState(initialProducts);
    const [categories,        setCategories]        = useState(initialCategories);
    const [searchQuery,       setSearchQuery]       = useState("");
    const [activeCategoryId,  setActiveCategoryId]  = useState<string | "all">("all");
    const [drawerOpen,        setDrawerOpen]        = useState(false);
    const [,                  startTransition]      = useTransition();

    // Product counts per category (for CategoryDrawer delete guard)
    const productCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        products.forEach((p) => { counts[p.categoryId] = (counts[p.categoryId] ?? 0) + 1; });
        return counts;
    }, [products]);

    const filteredProducts = useMemo(() => {
        return products.filter((p) => {
            const matchesSearch = !searchQuery ||
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.description.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = activeCategoryId === "all" || p.categoryId === activeCategoryId;
            return matchesSearch && matchesCategory;
        });
    }, [products, searchQuery, activeCategoryId]);

    const getCategoryLabel = (categoryId: string) =>
        categories.find((c) => c.id === categoryId)?.label ?? "Unknown";

    // Toggle product availability with optimistic update + toast
    function handleToggle(productId: string, currentlyAvailable: boolean) {
        const next = !currentlyAvailable;
        // Optimistic
        setProducts((prev) => prev.map((p) => p.id === productId ? { ...p, isAvailable: next } : p));

        startTransition(async () => {
            const res = await updateProduct(productId, { isAvailable: next });
            if (!res.success) {
                // Revert
                setProducts((prev) => prev.map((p) => p.id === productId ? { ...p, isAvailable: currentlyAvailable } : p));
                toast.error("Failed to update visibility", { description: res.error });
            } else {
                toast.success(next ? "Product is now live" : "Product hidden from storefront");
            }
        });
    }

    const stats: AdminStatItem[] = [
        {
            label: "Products",
            value: products.length,
            icon: <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>,
        },
        {
            label: "Variants",
            value: products.reduce((s, p) => s + p.variants.length, 0),
            sub: "Across all sizes/colors",
            icon: <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 6.878V6a2.25 2.25 0 012.25-2.25h7.5A2.25 2.25 0 0118 6v.878m-12 0c.235.083.487.122.75.122h10.5c.263 0 .515-.039.75-.122m-12 0a3.75 3.75 0 00-3.75 3.75v1.5a3.75 3.75 0 003.75 3.75m12-9a3.75 3.75 0 013.75 3.75v1.5a3.75 3.75 0 01-3.75 3.75m-12 0c.235.083.487.122.75.122h10.5c.263 0 .515-.039.75-.122m-12 0V19.5a2.25 2.25 0 002.25 2.25h7.5a2.25 2.25 0 002.25-2.25v-4.122" /></svg>,
        },
        {
            label: "Active",
            value: products.filter((p) => p.isAvailable).length,
            sub: "Visible to customers",
            icon: <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.644C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
        },
        {
            label: "Categories",
            value: categories.filter((c) => c.isActive).length,
            sub: "Active groups",
            icon: <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" /><path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" /></svg>,
        },
    ];

    return (
        <>
            <div className="flex flex-col gap-10 animate-fade-in">
                <AdminBreadcrumb items={[{ label: "Products" }]} />

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-[var(--rw-border)] pb-10">
                    <div className="flex flex-col gap-2">
                        <h1 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-rw-ink tracking-tight">Products</h1>
                        <p className="text-sm text-rw-muted font-medium italic">Pre-order inventory — Redemption Week &apos;26</p>
                    </div>
                    <Link href="/admin/products/new" id="btn-add-product" className="btn-primary !h-11 !px-6 text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 shrink-0">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                        Add Product
                    </Link>
                </div>

                {/* Stats */}
                <AdminStats stats={stats} />

                {/* Toolbar */}
                <div className="flex flex-col xl:flex-row gap-4 items-start xl:items-center justify-between">
                    {/* Category pills */}
                    <div className="flex flex-wrap gap-2 items-center">
                        <button
                            id="filter-all"
                            onClick={() => setActiveCategoryId("all")}
                            className={`rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-all ${
                                activeCategoryId === "all"
                                    ? "bg-rw-ink text-white shadow-md scale-105"
                                    : "bg-white text-rw-muted border border-[var(--rw-border)] hover:border-rw-ink hover:text-rw-ink"
                            }`}
                        >
                            All ({products.length})
                        </button>

                        {categories.filter((c) => c.isActive).map((cat) => (
                            <button
                                key={cat.id}
                                id={`filter-${cat.slug}`}
                                onClick={() => setActiveCategoryId(cat.id)}
                                className={`rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-all ${
                                    activeCategoryId === cat.id
                                        ? "bg-rw-ink text-white shadow-md scale-105"
                                        : "bg-white text-rw-muted border border-[var(--rw-border)] hover:border-rw-ink hover:text-rw-ink"
                                }`}
                            >
                                {cat.label} ({productCounts[cat.id] ?? 0})
                            </button>
                        ))}

                        <button
                            id="btn-manage-categories"
                            onClick={() => setDrawerOpen(true)}
                            className="rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-widest bg-white border border-dashed border-rw-muted text-rw-muted hover:border-rw-ink hover:text-rw-ink transition-all flex items-center gap-1.5"
                        >
                            <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg>
                            Manage
                        </button>
                    </div>

                    {/* Search */}
                    <div className="w-full xl:max-w-sm">
                        <SearchInput
                            query={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onClear={() => setSearchQuery("")}
                            placeholder="Search products..."
                        />
                    </div>
                </div>

                {/* Grid */}
                {filteredProducts.length > 0 ? (
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 stagger-children">
                        {filteredProducts.map((p) => (
                            <ProductCard
                                key={p.id}
                                product={p}
                                categoryLabel={getCategoryLabel(p.categoryId)}
                                onToggle={handleToggle}
                            />
                        ))}
                    </div>
                ) : (
                    <EmptyProducts
                        hasFilters={!!searchQuery || activeCategoryId !== "all"}
                        onClear={() => { setSearchQuery(""); setActiveCategoryId("all"); }}
                    />
                )}
            </div>

            <CategoryDrawer
                isOpen={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                categories={categories}
                productCounts={productCounts}
                onChanged={setCategories}
            />
        </>
    );
}
