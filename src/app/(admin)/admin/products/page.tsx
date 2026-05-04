import { DEMO_PRODUCTS } from "@/lib/data/products";
import Link from "next/link";
import type { Metadata } from "next";
import { AddProductButton, UpdateAvailabilityButton } from "./components";

export const metadata: Metadata = { title: "Products — RW'26 Admin" };

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

export default function ProductsPage() {
    const totalVariants = DEMO_PRODUCTS.reduce((s, p) => s + p.variants.length, 0);

    return (
        <div className="flex flex-col gap-8">
            <div className="flex items-end justify-between flex-wrap gap-4">
                <div>
                    <h1 className="section-heading text-2xl text-rw-ink">Products</h1>
                    <p className="mt-1 text-sm text-rw-muted">
                        {DEMO_PRODUCTS.length} products · {totalVariants} variants total
                    </p>
                </div>
                <AddProductButton />
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-2">
                {DEMO_PRODUCTS.map((p) => {
                    const availableVariants = p.variants.filter((v) => v.isAvailable);
                    const uniqueColors = [
                        ...new Set(p.variants.map((v) => v.color).filter(Boolean)),
                    ] as string[];
                    const uniqueSizes = [
                        ...new Set(p.variants.map((v) => v.size).filter(Boolean)),
                    ] as string[];

                    return (
                        <div key={p.id} className="rw-card p-5 flex flex-col gap-4">
                            {/* Image placeholder */}
                            <div className="img-placeholder h-40 rounded-xl overflow-hidden relative">
                                <svg
                                    className="absolute inset-0 m-auto h-16 w-16 text-rw-crimson/20"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M12 2C9 7 6 9 6 13a6 6 0 0 0 12 0c0-4-3-6-6-11z" />
                                </svg>
                                <span className="absolute top-3 left-3">
                                    <span
                                        className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${CATEGORY_COLORS[p.category] ?? "bg-gray-100 text-gray-600 border-gray-200"}`}
                                    >
                                        {CATEGORY_LABELS[p.category] ?? p.category}
                                    </span>
                                </span>
                                <span className="absolute top-3 right-3">
                                    {p.isAvailable ? (
                                        <span className="inline-flex items-center rounded-full border border-green-200 bg-green-50 px-2 py-0.5 text-xs font-semibold text-green-700">
                                            Active
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-xs font-semibold text-gray-500">
                                            Inactive
                                        </span>
                                    )}
                                </span>
                            </div>

                            {/* Info */}
                            <div className="flex-1">
                                <div className="flex items-start justify-between gap-2">
                                    <h2 className="font-display font-bold text-rw-ink text-base">
                                        {p.name}
                                    </h2>
                                    <span className="font-bold text-rw-crimson text-sm whitespace-nowrap">
                                        ₦{p.basePrice.toLocaleString()}
                                    </span>
                                </div>
                                <p className="mt-1 text-xs text-rw-muted line-clamp-2">
                                    {p.description}
                                </p>
                            </div>

                            {/* Variant summary */}
                            <div className="flex flex-wrap gap-3 text-xs text-rw-text-2">
                                <span className="flex items-center gap-1.5">
                                    <span className="font-semibold">
                                        {p.variants.length}
                                    </span>{" "}
                                    variants
                                    <span className="text-rw-muted">
                                        ({availableVariants.length} available)
                                    </span>
                                </span>
                                {uniqueColors.length > 0 && (
                                    <span className="flex items-center gap-1.5">
                                        <span className="text-rw-muted">Colours:</span>{" "}
                                        {uniqueColors.join(", ")}
                                    </span>
                                )}
                                {uniqueSizes.length > 1 && (
                                    <span className="flex items-center gap-1.5">
                                        <span className="text-rw-muted">Sizes:</span>{" "}
                                        {uniqueSizes.join(" · ")}
                                    </span>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 border-t border-[var(--rw-border)] pt-4">
                                <Link
                                    href={`/admin/products/${p.id}`}
                                    className="flex-1 rounded-xl border border-[var(--rw-border-mid)] px-3 py-2 text-sm font-semibold text-rw-text-2 text-center hover:bg-rw-bg-alt transition-colors"
                                >
                                    Edit / Variants
                                </Link>
                                <UpdateAvailabilityButton isAvailable={p.isAvailable} />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
