"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { formatNaira } from "@/lib/utils/functions";
import { buildVariantLabel } from "@/lib/data/products";
import {
    bulkSetPostOrderPrices,
    type BulkPostOrderPriceEntry,
} from "@/lib/services/products.service";
import type { Product } from "@/lib/data/types";

interface Props {
    products: Product[];
}

// Local editable state keyed by product/variant id. "" = clear (inherit).
type PriceMap = Record<string, string>;

function toInput(value: number | null): string {
    return value === null || value === undefined ? "" : String(value);
}

export default function PostOrderPricingClient({ products }: Props) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const [productPrices, setProductPrices] = useState<PriceMap>(() =>
        Object.fromEntries(products.map((p) => [p.id, toInput(p.postOrderPrice)]))
    );
    const [variantPrices, setVariantPrices] = useState<PriceMap>(() =>
        Object.fromEntries(
            products.flatMap((p) =>
                p.variants.map((v) => [v.id, toInput(v.postOrderPriceOverride)])
            )
        )
    );
    const [expanded, setExpanded] = useState<Record<string, boolean>>({});

    // Only submit rows that actually changed from their saved values.
    const changedEntries = useMemo<BulkPostOrderPriceEntry[]>(() => {
        const entries: BulkPostOrderPriceEntry[] = [];
        for (const p of products) {
            const nextProduct = productPrices[p.id]?.trim()
                ? Number(productPrices[p.id])
                : null;
            const productChanged = nextProduct !== p.postOrderPrice;

            const changedVariants = p.variants
                .map((v) => {
                    const next = variantPrices[v.id]?.trim()
                        ? Number(variantPrices[v.id])
                        : null;
                    return { v, next };
                })
                .filter(({ v, next }) => next !== v.postOrderPriceOverride)
                .map(({ v, next }) => ({
                    variantId: v.id,
                    postOrderPriceOverride: next,
                }));

            if (productChanged || changedVariants.length > 0) {
                entries.push({
                    productId: p.id,
                    postOrderPrice: nextProduct,
                    variants: changedVariants,
                });
            }
        }
        return entries;
    }, [products, productPrices, variantPrices]);

    const changedCount = changedEntries.length;

    function handleSave() {
        if (changedCount === 0) {
            toast.info("No changes to save.");
            return;
        }
        const toastId = toast.loading("Saving post-order prices...");
        startTransition(async () => {
            const res = await bulkSetPostOrderPrices(changedEntries);
            if (res.success) {
                toast.success(
                    `Updated ${res.data?.productsUpdated ?? 0} products, ${
                        res.data?.variantsUpdated ?? 0
                    } variants.`,
                    { id: toastId }
                );
                router.refresh();
            } else {
                toast.error(res.error || "Failed to save.", { id: toastId });
            }
        });
    }

    return (
        <div className="flex flex-col gap-8 animate-fade-in max-w-5xl">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div className="flex flex-col gap-2">
                    <Link
                        href="/admin/products"
                        className="text-[11px] font-bold text-rw-muted uppercase tracking-widest hover:text-rw-ink"
                    >
                        ← Products
                    </Link>
                    <h1 className="font-display font-black text-3xl sm:text-4xl text-rw-ink tracking-tight uppercase">
                        Post-order Pricing
                    </h1>
                    <p className="text-sm text-rw-muted font-medium italic max-w-2xl">
                        Set the prices shown when the store is in the post-order phase.
                        Leave a field blank to inherit the pre-order (base) price. Flip the
                        active phase from{" "}
                        <Link
                            href="/admin/settings"
                            className="underline hover:text-rw-ink"
                        >
                            Settings
                        </Link>
                        .
                    </p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isPending || changedCount === 0}
                    className="btn-primary !h-12 !px-8 text-xs font-black uppercase tracking-widest shadow-lg shadow-rw-crimson/20 disabled:opacity-50 shrink-0"
                >
                    {isPending
                        ? "Saving..."
                        : changedCount > 0
                          ? `Save ${changedCount} change${changedCount > 1 ? "s" : ""}`
                          : "No changes"}
                </button>
            </div>

            {/* Product list */}
            <div className="rw-card overflow-hidden border-none shadow-xl ring-1 ring-rw-ink/5 bg-white divide-y divide-[var(--rw-border)]">
                {products.length === 0 ? (
                    <p className="p-10 text-center text-sm text-rw-muted">
                        No products yet.
                    </p>
                ) : (
                    products.map((p) => {
                        const isOpen = expanded[p.id] ?? false;
                        return (
                            <div key={p.id} className="p-5 sm:p-6">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                                    <div className="min-w-0">
                                        <p className="font-display font-black text-rw-ink text-sm uppercase tracking-tight truncate">
                                            {p.name}
                                        </p>
                                        <p className="text-[11px] text-rw-muted font-bold uppercase tracking-widest mt-0.5">
                                            Base {formatNaira(p.basePrice)} ·{" "}
                                            {p.variants.length} variant
                                            {p.variants.length === 1 ? "" : "s"}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3 shrink-0">
                                        <label className="text-[10px] font-black text-rw-muted uppercase tracking-widest">
                                            Post-order ₦
                                        </label>
                                        <input
                                            type="number"
                                            inputMode="numeric"
                                            value={productPrices[p.id] ?? ""}
                                            onChange={(e) =>
                                                setProductPrices((s) => ({
                                                    ...s,
                                                    [p.id]: e.target.value,
                                                }))
                                            }
                                            placeholder={String(p.basePrice)}
                                            className="w-32 rounded-xl border border-[var(--rw-border)] px-3 py-2 text-sm font-mono text-rw-ink focus:outline-none focus:ring-1 focus:ring-rw-crimson"
                                        />
                                        {p.variants.length > 0 && (
                                            <button
                                                onClick={() =>
                                                    setExpanded((s) => ({
                                                        ...s,
                                                        [p.id]: !isOpen,
                                                    }))
                                                }
                                                className="text-[10px] font-black text-rw-crimson uppercase tracking-widest hover:underline"
                                            >
                                                {isOpen ? "Hide" : "Variants"}
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {isOpen && p.variants.length > 0 && (
                                    <div className="mt-4 pl-1 sm:pl-4 border-l-2 border-rw-crimson/20 space-y-2">
                                        {p.variants.map((v) => (
                                            <div
                                                key={v.id}
                                                className="flex items-center justify-between gap-3"
                                            >
                                                <span className="text-xs text-rw-muted truncate">
                                                    {buildVariantLabel(v) || "Variant"}
                                                </span>
                                                <input
                                                    type="number"
                                                    inputMode="numeric"
                                                    value={variantPrices[v.id] ?? ""}
                                                    onChange={(e) =>
                                                        setVariantPrices((s) => ({
                                                            ...s,
                                                            [v.id]: e.target.value,
                                                        }))
                                                    }
                                                    placeholder="Inherit"
                                                    className="w-28 rounded-lg border border-[var(--rw-border)] px-2 py-1.5 text-xs font-mono text-rw-ink focus:outline-none focus:ring-1 focus:ring-rw-crimson shrink-0"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
