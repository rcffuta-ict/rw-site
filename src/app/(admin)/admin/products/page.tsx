import { DEMO_PRODUCTS, COLOR_HEX } from "@/lib/data/products";
import Link from "next/link";
import type { Metadata } from "next";
import { AddProductButton, UpdateAvailabilityButton } from "./components";

export const metadata: Metadata = { title: "Products — RW'26 Admin" };

const CATEGORY_LABELS: Record<string, string> = { tshirt: "T-Shirt", hoodie: "Hoodie", accessory: "Accessory" };
const CATEGORY_COLORS: Record<string, string> = {
    tshirt: "bg-blue-50 text-blue-700 border-blue-200",
    hoodie: "bg-violet-50 text-violet-700 border-violet-200",
    accessory: "bg-amber-50 text-amber-700 border-amber-200",
};

export default function ProductsPage() {
    const totalVariants = DEMO_PRODUCTS.reduce((s, p) => s + p.variants.length, 0);

    return (
        <div className="flex flex-col gap-8">
            <div className="flex items-end justify-between flex-wrap gap-4">
                <div>
                    <h1 className="section-heading text-2xl lg:text-3xl">Products</h1>
                    <p className="mt-1 text-sm text-rw-muted">{DEMO_PRODUCTS.length} products · {totalVariants} variants total</p>
                </div>
                <AddProductButton />
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
                {DEMO_PRODUCTS.map((p) => {
                    const availableVariants = p.variants.filter(v => v.isAvailable);
                    const uniqueColors = [...new Set(p.variants.map(v => v.color).filter(Boolean))] as string[];
                    const uniqueSizes  = [...new Set(p.variants.map(v => v.size).filter(Boolean))] as string[];

                    return (
                        <div key={p.id} className="rw-card overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                            {/* Image */}
                            <div className="relative h-44 bg-rw-bg-alt overflow-hidden">
                                <img src={`https://placehold.co/500x220?text=${encodeURIComponent(p.name)}`} alt={p.name} className="h-full w-full object-cover" />
                                <div className="absolute top-3 left-3 flex gap-2">
                                    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${CATEGORY_COLORS[p.category] ?? "bg-gray-100 text-gray-600 border-gray-200"}`}>
                                        {CATEGORY_LABELS[p.category] ?? p.category}
                                    </span>
                                </div>
                                <div className="absolute top-3 right-3">
                                    {p.isAvailable ? (
                                        <span className="inline-flex items-center rounded-full border border-green-200 bg-green-50 px-2.5 py-0.5 text-xs font-semibold text-green-700">Active</span>
                                    ) : (
                                        <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-2.5 py-0.5 text-xs font-semibold text-gray-500">Inactive</span>
                                    )}
                                </div>
                            </div>

                            <div className="p-5 flex flex-col gap-4 flex-1">
                                <div className="flex items-start justify-between gap-2">
                                    <h2 className="font-display font-bold text-rw-ink text-lg">{p.name}</h2>
                                    <span className="font-bold text-rw-crimson text-lg shrink-0">₦{p.basePrice.toLocaleString()}</span>
                                </div>
                                <p className="text-sm text-rw-muted line-clamp-2">{p.description}</p>

                                {/* Colour swatches */}
                                {uniqueColors.length > 0 && (
                                    <div className="flex items-center gap-2">
                                        {uniqueColors.map(c => (
                                            <span key={c} className="h-6 w-6 rounded-full border-2 border-white shadow-sm" style={{ background: COLOR_HEX[c] ?? "#888" }} title={c} />
                                        ))}
                                        <span className="text-xs text-rw-muted ml-1">{uniqueColors.length} colours</span>
                                    </div>
                                )}

                                <div className="flex flex-wrap gap-3 text-xs text-rw-text-2">
                                    <span><strong>{p.variants.length}</strong> variants ({availableVariants.length} available)</span>
                                    {uniqueSizes.length > 1 && <span>Sizes: {uniqueSizes.join(" · ")}</span>}
                                </div>

                                <div className="flex gap-2 border-t border-[var(--rw-border)] pt-4 mt-auto">
                                    <Link href={`/admin/products/${p.id}`} className="btn-secondary flex-1 !h-10 text-sm">
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
