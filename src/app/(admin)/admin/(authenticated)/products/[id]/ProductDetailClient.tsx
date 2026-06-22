"use client";

import { useState, useTransition, useRef } from "react";
import { toast } from "sonner";
import { useCloudinaryUpload } from "@/hooks/useCloudinaryUpload";
import { productImageUrl, COLOR_HEX } from "@/lib/utils/functions";
import type { Product, ProductVariant } from "@/lib/data/types";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import { AdminTable } from "@/components/admin/AdminTable";
import {
    updateVariant,
    deleteVariant,
    deleteProduct,
    upsertVariantImage,
} from "@/lib/services/products.service";
import { useRouter } from "next/navigation";
import { ProductImage } from "@/components/common/ProductImage";

const SIZE_ORDER = ["XS", "S", "M", "L", "XL", "XXL", "One Size"];

function sortVariants(variants: ProductVariant[]) {
    return [...variants].sort((a, b) => {
        const colorCmp = (a.color ?? "").localeCompare(b.color ?? "");
        if (colorCmp !== 0) return colorCmp;
        return SIZE_ORDER.indexOf(a.size ?? "") - SIZE_ORDER.indexOf(b.size ?? "");
    });
}

function ImageSlot({
    variant,
    productName,
    isActive,
    onUpload,
    isAdmin,
}: {
    variant: ProductVariant;
    productName: string;
    isActive: boolean;
    onUpload: (variantId: string, file: File) => void;
    isAdmin: boolean;
}) {
    const primaryImage =
        variant.images.find((img) => img.isPrimary) ?? variant.images[0] ?? null;
    const fileInputRef = useRef<HTMLInputElement>(null);

    const finalImageUrl =
        primaryImage?.cloudinaryUrl || productImageUrl(productName, variant.color);

    return (
        <div
            className={`relative rounded-xl overflow-hidden border-2 transition-all ${
                isActive ? "border-rw-crimson shadow-lg" : "border-[var(--rw-border)]"
            }`}
            style={{ aspectRatio: "3/4" }}
        >
            <ProductImage
                imageUrl={finalImageUrl}
                alt={`${productName} — ${variant.color ?? "default"}`}
            />

            {primaryImage?.cloudinaryUrl ? (
                <div className="absolute bottom-2 left-2 right-2">
                    <span className="block w-full text-center text-[9px] font-bold uppercase tracking-widest bg-black/40 text-white backdrop-blur-sm rounded-full px-2 py-0.5">
                        Cloudinary ✓
                    </span>
                </div>
            ) : isAdmin ? (
                <div className="absolute inset-0 flex items-end justify-center p-2">
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={(e) => {
                            if (e.target.files?.[0])
                                onUpload(variant.id, e.target.files[0]);
                        }}
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full text-[9px] font-bold uppercase tracking-widest bg-white/80 text-rw-ink backdrop-blur-sm rounded-full px-2 py-1 hover:bg-white transition-colors"
                    >
                        + Upload Image
                    </button>
                </div>
            ) : null}
            {isActive && (
                <div className="absolute inset-0 ring-2 ring-inset ring-rw-crimson rounded-xl pointer-events-none" />
            )}
        </div>
    );
}

export default function ProductDetailClient({
    product: initialProduct,
    isAdmin,
}: {
    product: Product;
    isAdmin: boolean;
}) {
    const router = useRouter();
    const [product] = useState(initialProduct);
    const [variants, setVariants] = useState(() => sortVariants(product.variants));
    const [isPending, startTransition] = useTransition();
    const { uploadImage } = useCloudinaryUpload();

    const [editSkuId] = useState<string | null>(null);
    const [editSkuVal, setEditSkuVal] = useState("");
    const [editPriceId, setEditPriceId] = useState<string | null>(null);
    const [editPriceVal, setEditPriceVal] = useState("");

    const uniqueColors = [
        ...new Set(variants.map((v) => v.color).filter(Boolean)),
    ] as string[];
    const [activeColor, setActiveColor] = useState<string | null>(
        uniqueColors[0] ?? null
    );
    const activeVariant = variants.find((v) => v.color === activeColor) ?? variants[0];

    const finalImageUrl =
        activeVariant?.images?.length > 0
            ? activeVariant.images[0].cloudinaryUrl
            : productImageUrl(product.name, activeColor);

    // Upload Image
    async function handleUploadImage(variantId: string, file: File) {
        const toastId = `upload-${variantId}`;
        toast.loading("Uploading image...", { id: toastId });

        const uploadData = await uploadImage(file, variantId);

        if (uploadData.success && uploadData.publicId && uploadData.url) {
            startTransition(async () => {
                const dbRes = await upsertVariantImage(
                    variantId,
                    uploadData.publicId!,
                    uploadData.url!,
                    `${product.name}`,
                    true
                );
                if (dbRes.success && dbRes.data) {
                    toast.success("Image uploaded", { id: toastId });
                    // Update local state
                    setVariants((prev) =>
                        prev.map((v) =>
                            v.id === variantId ? { ...v, images: [dbRes.data!] } : v
                        )
                    );
                } else {
                    toast.error(`Database error: ${dbRes.error}`, { id: toastId });
                }
            });
        } else {
            toast.error(`Upload error: ${uploadData.error}`, { id: toastId });
        }
    }

    // Toggle Variant
    function toggleVariant(variant: ProductVariant) {
        const toastId = `toggle-${variant.id}`;
        const next = !variant.isAvailable;

        // Optimistic
        setVariants((prev) =>
            prev.map((v) => (v.id === variant.id ? { ...v, isAvailable: next } : v))
        );

        startTransition(async () => {
            toast.loading("Updating visibility...", { id: toastId });
            const res = await updateVariant(variant.id, { isAvailable: next });
            if (!res.success) {
                // Revert
                setVariants((prev) =>
                    prev.map((v) =>
                        v.id === variant.id
                            ? { ...v, isAvailable: variant.isAvailable }
                            : v
                    )
                );
                toast.error("Failed to update visibility", { id: toastId });
            }
        });
    }

    // Edit SKU
    function startSkuEdit(v: ProductVariant) {
        // setEditSkuId(v.id);
        // setEditSkuVal(v.sku ?? "");
    }

    function saveSkuEdit(id: string) {
        // const val = editSkuVal.trim() || null;
        // setEditSkuId(null);
        // const original = variants.find((v) => v.id === id)?.sku;
        // if (original === val) return;
        // const toastId = `sku-${id}`;
        // toast.loading("Saving SKU...", { id: toastId });
        // setVariants((prev) => prev.map((v) => (v.id === id ? { ...v, sku: val } : v)));
        // startTransition(async () => {
        //     const res = await updateVariant(id, { sku: val });
        //     if (res.success) toast.success("SKU updated", { id: toastId });
        //     else {
        //         setVariants((prev) =>
        //             prev.map((v) => (v.id === id ? { ...v, sku: original || null } : v))
        //         );
        //         toast.error("Failed to save SKU", { id: toastId });
        //     }
        // });
    }

    // Edit Price
    function startPriceEdit(v: ProductVariant) {
        setEditPriceId(v.id);
        setEditPriceVal(v.priceOverride ? String(v.priceOverride) : "");
    }

    function savePriceEdit(id: string) {
        const val = editPriceVal.trim() ? Number(editPriceVal) : null;
        setEditPriceId(null);

        const original = variants.find((v) => v.id === id)?.priceOverride;
        if (original === val) return;

        const toastId = `price-${id}`;
        toast.loading("Saving price override...", { id: toastId });

        setVariants((prev) =>
            prev.map((v) => (v.id === id ? { ...v, priceOverride: val } : v))
        );

        startTransition(async () => {
            const res = await updateVariant(id, { priceOverride: val });
            if (res.success) toast.success("Price updated", { id: toastId });
            else {
                setVariants((prev) =>
                    prev.map((v) =>
                        v.id === id ? { ...v, priceOverride: original || null } : v
                    )
                );
                toast.error("Failed to save price", { id: toastId });
            }
        });
    }

    // Delete Variant
    function handleDeleteVariant(id: string) {
        toast("Delete variant?", {
            description: "Are you sure?",
            action: {
                label: "Delete",
                onClick: () => {
                    const toastId = `del-${id}`;
                    toast.loading("Deleting variant...", { id: toastId });
                    startTransition(async () => {
                        const res = await deleteVariant(id);
                        if (res.success) {
                            setVariants((prev) => prev.filter((v) => v.id !== id));
                            toast.success("Variant deleted", { id: toastId });
                        } else {
                            toast.error(`Failed: ${res.error}`, { id: toastId });
                        }
                    });
                },
            },
            cancel: { label: "Cancel", onClick: () => {} },
        });
    }

    // Delete Product
    function handleDeleteProduct() {
        toast("Delete Product?", {
            description: "This will remove the product and all variants.",
            action: {
                label: "Delete",
                onClick: () => {
                    const toastId = "del-prod";
                    toast.loading("Deleting product...", { id: toastId });
                    startTransition(async () => {
                        const res = await deleteProduct(product.id);
                        if (res.success) {
                            toast.success("Product deleted", { id: toastId });
                            router.push("/admin/products");
                        } else {
                            toast.error(`Failed: ${res.error}`, { id: toastId });
                        }
                    });
                },
            },
            cancel: { label: "Cancel", onClick: () => {} },
        });
    }

    return (
        <div className="flex flex-col gap-8 animate-fade-in-up">
            <AdminBreadcrumb
                items={[
                    { label: "Products", href: "/admin/products" },
                    { label: product.name },
                ]}
            />

            {!isAdmin && (
                <div className="rw-card p-5 border-l-4 border-amber-500 bg-amber-50/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex gap-3">
                        <div className="h-9 w-9 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                            <svg
                                className="h-5 w-5"
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
                        </div>
                        <div>
                            <p className="font-display font-bold text-sm text-rw-ink">
                                Moderator Access — Read Only Mode
                            </p>
                            <p className="text-xs text-rw-muted mt-0.5">
                                Only Administrators can modify product details, change
                                price overrides, toggle variant availabilities, or delete
                                products.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid lg:grid-cols-[380px_1fr] gap-8 items-start">
                <div className="flex flex-col gap-3">
                    {/* Main image */}
                    <div
                        className="relative rounded-2xl overflow-hidden bg-rw-bg-alt"
                        style={{ aspectRatio: "3/4" }}
                    >
                        <ProductImage
                            imageUrl={finalImageUrl}
                            alt={`${product.name} — ${activeColor ?? "default"}`}
                        />
                        <div className="absolute top-4 left-4">
                            <span className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest bg-rw-crimson text-white shadow-md">
                                Pre-order
                            </span>
                        </div>
                        {activeColor && (
                            <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-sm">
                                <span
                                    className="h-3.5 w-3.5 rounded-full border border-black/10"
                                    style={{
                                        background: COLOR_HEX[activeColor]
                                            ? `#${COLOR_HEX[activeColor]}`
                                            : "#888",
                                    }}
                                />
                                <span className="text-xs font-semibold text-rw-ink">
                                    {activeColor}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Color switcher */}
                    {uniqueColors.length > 1 && (
                        <div
                            className="grid gap-2"
                            style={{
                                gridTemplateColumns: `repeat(${Math.min(uniqueColors.length, 4)}, 1fr)`,
                            }}
                        >
                            {uniqueColors.map((color) => {
                                const variant = variants.find((v) => v.color === color);
                                if (!variant) return null;
                                return (
                                    <button
                                        key={color}
                                        title={color}
                                        onClick={() => setActiveColor(color)}
                                    >
                                        <ImageSlot
                                            variant={variant}
                                            productName={product.name}
                                            isActive={activeColor === color}
                                            onUpload={handleUploadImage}
                                            isAdmin={isAdmin}
                                        />
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-rw-crimson mb-1 block">
                                {product.categoryLabel}
                            </span>
                            <h1 className="section-heading text-2xl lg:text-3xl">
                                {product.name}
                            </h1>
                            <p className="mt-2.5 text-rw-text-2 leading-relaxed text-sm">
                                {product.description}
                            </p>
                        </div>
                        {isAdmin && (
                            <button
                                onClick={handleDeleteProduct}
                                disabled={isPending}
                                className="btn-secondary !h-9 !px-4 text-[10px] font-bold uppercase tracking-widest text-red-600 hover:bg-red-50 hover:border-red-200"
                            >
                                Delete
                            </button>
                        )}
                    </div>

                    <div className="flex items-baseline gap-2">
                        <p className="font-display font-bold text-4xl text-rw-crimson">
                            ₦{product.basePrice.toLocaleString()}
                        </p>
                        <span className="text-sm text-rw-muted">base price</span>
                    </div>

                    <div className="rounded-xl bg-white border border-[var(--rw-border)] shadow-sm overflow-hidden mt-4">
                        <div className="border-b border-[var(--rw-border)] px-5 py-4 flex items-center justify-between bg-rw-bg-alt/30">
                            <div>
                                <h2 className="font-display font-bold text-lg text-rw-ink">
                                    Variants
                                </h2>
                                <p className="text-xs text-rw-muted">
                                    Manage inventory and SKU references
                                </p>
                            </div>
                            <div className="text-xs font-bold px-3 py-1 bg-white rounded-full border border-[var(--rw-border)] shadow-sm">
                                {variants.length} total
                            </div>
                        </div>

                        <AdminTable
                            columns={[
                                {
                                    key: "color",
                                    label: "Color",
                                    render: (v: ProductVariant) => (
                                        <div className="flex items-center gap-2">
                                            <span
                                                className="h-3 w-3 rounded-full border border-black/10"
                                                style={{
                                                    background: v.color
                                                        ? COLOR_HEX[v.color]
                                                            ? `#${COLOR_HEX[v.color]}`
                                                            : "#ccc"
                                                        : "#ccc",
                                                }}
                                            />
                                            <span className="font-bold text-rw-ink">
                                                {v.color || "-"}
                                            </span>
                                        </div>
                                    ),
                                },
                                {
                                    key: "size",
                                    label: "Size",
                                    render: (v: ProductVariant) => (
                                        <span className="font-semibold text-rw-muted">
                                            {v.size || "-"}
                                        </span>
                                    ),
                                },
                                {
                                    key: "design",
                                    label: "Design",
                                    render: (v: ProductVariant) => (
                                        <span className="text-xs">{v.design || "-"}</span>
                                    ),
                                },
                                {
                                    key: "sku",
                                    label: "SKU",
                                    render: (v: ProductVariant) => (
                                        <div className="group flex items-center gap-2">
                                            {editSkuId === v.id ? (
                                                <input
                                                    autoFocus
                                                    value={editSkuVal}
                                                    onChange={(e) =>
                                                        setEditSkuVal(e.target.value)
                                                    }
                                                    onBlur={() => saveSkuEdit(v.id)}
                                                    onKeyDown={(e) =>
                                                        e.key === "Enter" &&
                                                        saveSkuEdit(v.id)
                                                    }
                                                    className="w-32 rounded border border-[var(--rw-border)] px-2 py-1 text-xs font-mono text-rw-ink focus:outline-none focus:ring-1 focus:ring-rw-crimson"
                                                />
                                            ) : (
                                                <>
                                                    <span className="font-mono text-[10px] bg-rw-bg-alt px-2 py-1 rounded text-rw-muted">
                                                        {v.sku || "—"}
                                                    </span>
                                                    {/* <button
                                                        onClick={() => startSkuEdit(v)}
                                                        className="opacity-0 group-hover:opacity-100 p-1 text-rw-muted hover:text-rw-ink transition-opacity"
                                                    >
                                                        <svg
                                                            className="h-3 w-3"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth={2}
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487z"
                                                            />
                                                        </svg>
                                                    </button> */}
                                                </>
                                            )}
                                        </div>
                                    ),
                                },
                                {
                                    key: "price",
                                    label: "Price",
                                    render: (v: ProductVariant) => {
                                        const effPrice =
                                            v.priceOverride ?? product.basePrice;
                                        return (
                                            <div className="group flex items-center gap-2">
                                                {editPriceId === v.id ? (
                                                    <input
                                                        autoFocus
                                                        type="number"
                                                        value={editPriceVal}
                                                        onChange={(e) =>
                                                            setEditPriceVal(
                                                                e.target.value
                                                            )
                                                        }
                                                        onBlur={() => savePriceEdit(v.id)}
                                                        onKeyDown={(e) =>
                                                            e.key === "Enter" &&
                                                            savePriceEdit(v.id)
                                                        }
                                                        placeholder={`₦${effPrice.toLocaleString()}`}
                                                        className="w-24 rounded border border-[var(--rw-border)] px-2 py-1 text-xs font-mono text-rw-ink focus:outline-none focus:ring-1 focus:ring-rw-crimson"
                                                    />
                                                ) : (
                                                    <>
                                                        <span
                                                            className={`text-xs font-bold ${v.priceOverride ? "text-rw-crimson" : "text-rw-muted"}`}
                                                        >
                                                            ₦{effPrice.toLocaleString()}
                                                        </span>
                                                        {isAdmin && (
                                                            <button
                                                                onClick={() =>
                                                                    startPriceEdit(v)
                                                                }
                                                                className="opacity-0 group-hover:opacity-100 p-1 text-rw-muted hover:text-rw-ink transition-opacity"
                                                            >
                                                                <svg
                                                                    className="h-3 w-3"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    strokeWidth={2}
                                                                    viewBox="0 0 24 24"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487z"
                                                                    />
                                                                </svg>
                                                            </button>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        );
                                    },
                                },
                                {
                                    key: "status",
                                    label: "Status",
                                    render: (v: ProductVariant) => (
                                        <button
                                            onClick={() => toggleVariant(v)}
                                            disabled={!isAdmin || isPending}
                                            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-all duration-300 ${
                                                v.isAvailable
                                                    ? "bg-green-500"
                                                    : "bg-gray-200"
                                            } ${!isAdmin ? "opacity-60 cursor-not-allowed" : ""}`}
                                        >
                                            <span
                                                className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform duration-300 ${v.isAvailable ? "translate-x-4" : "translate-x-0.5"}`}
                                            />
                                        </button>
                                    ),
                                },
                                {
                                    key: "actions",
                                    label: "Actions",
                                    render: (v: ProductVariant) => (
                                        <button
                                            onClick={() => handleDeleteVariant(v.id)}
                                            disabled={isPending}
                                            className="h-7 w-7 rounded-lg flex items-center justify-center text-rw-muted hover:text-red-600 hover:bg-red-50 transition-colors"
                                        >
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
                                                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                                />
                                            </svg>
                                        </button>
                                    ),
                                },
                            ].filter((col) => isAdmin || col.key !== "actions")}
                            data={variants}
                            pageSize={8}
                            keyExtractor={(v) => v.id}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
