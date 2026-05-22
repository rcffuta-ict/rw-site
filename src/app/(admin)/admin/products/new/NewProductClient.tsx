"use client";

import { useState, useTransition, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import { createProduct, addVariant, upsertVariantImage } from "@/lib/services/products.service";
import type { Category } from "@/lib/data/types";
import { ph } from "@/lib/utils/functions";

// ─── Constants ────────────────────────────────────────────────────────────────

const COLOR_HEX: Record<string, string> = {
    Black: "#1a1a1a",
    White: "#f5f5f0",
    Burgundy: "#7a0c31",
    "Wine Red": "#940011",
    Navy: "#0a1628",
    Grey: "#6b7280",
};

// ─── Types ────────────────────────────────────────────────────────────────────

type LocalVariant = {
    tempId: string;
    size: string;
    color: string;
    colorHex: string;
    design: string;
    sku: string;
    priceOverride: number | null;
    isAvailable: boolean;
    imageFile?: File;
    imagePreviewUrl?: string;
};

interface NewProductClientProps {
    categories: Category[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function productImageUrl(name: string, color: string | null, cloudinaryUrl?: string | null) {
    if (cloudinaryUrl) return cloudinaryUrl;
    const bg = color ? (COLOR_HEX[color]?.slice(1) ?? "f3f4f6") : "f3f4f6";
    const fg = color ? "e0e0e0" : "9ca3af";
    return ph(360, 480, `${name || "Product"}${color ? `\n${color}` : ""}`, bg, fg);
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function NewProductClient({ categories }: NewProductClientProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    // Form State
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [basePrice, setBasePrice] = useState<number>(0);
    const [categoryId, setCategoryId] = useState<string>(categories[0]?.id || "");
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState("");
    const [isAvailable, setIsAvailable] = useState(true);

    // Variants State
    const [variants, setVariants] = useState<LocalVariant[]>([]);

    // New Variant Form State
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [nvSize, setNvSize] = useState("");
    const [nvColor, setNvColor] = useState("");
    const [nvColorHex, setNvColorHex] = useState("");
    const [nvDesign, setNvDesign] = useState("");
    const [nvSku, setNvSku] = useState("");
    const [nvPriceOverride, setNvPriceOverride] = useState<string>("");
    const [nvImageFile, setNvImageFile] = useState<File | undefined>(undefined);
    const [nvImagePreview, setNvImagePreview] = useState<string | undefined>(undefined);

    // Tags
    function handleTagKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            const val = tagInput.trim().replace(/,/g, "");
            if (val && !tags.includes(val)) {
                setTags([...tags, val]);
            }
            setTagInput("");
        }
    }

    function removeTag(tagToRemove: string) {
        setTags(tags.filter((t) => t !== tagToRemove));
    }

    // Add Variant
    function handleAddVariant() {
        const finalSize = nvSize.trim();
        const finalColor = nvColor.trim();

        if (!finalSize && !finalColor && !nvDesign) {
            toast.error("Provide at least a size, color, or design.");
            return;
        }

        const newVar: LocalVariant = {
            tempId: `tmp-${Date.now()}`,
            size: finalSize,
            color: finalColor,
            colorHex: nvColorHex.trim(),
            design: nvDesign.trim(),
            sku: nvSku.trim(),
            priceOverride: nvPriceOverride ? Number(nvPriceOverride) : null,
            isAvailable: true,
            imageFile: nvImageFile,
            imagePreviewUrl: nvImagePreview,
        };

        setVariants([...variants, newVar]);

        // Reset variant form
        setNvSku("");
        setNvPriceOverride("");
        setNvImageFile(undefined);
        setNvImagePreview(undefined);
        if (fileInputRef.current) fileInputRef.current.value = "";
    }

    function handleRemoveVariant(id: string) {
        setVariants(variants.filter((v) => v.tempId !== id));
    }

    // Handle Image Selection for Variant Form
    function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) {
            setNvImageFile(file);
            setNvImagePreview(URL.createObjectURL(file));
        }
    }

    // Submit Action
    async function handleSave(publish: boolean) {
        if (!name.trim()) {
            toast.error("Product name is required.");
            return;
        }
        if (!categoryId) {
            toast.error("Please select a category.");
            return;
        }

        const toastId = "save-product";
        toast.loading(publish ? "Publishing product..." : "Saving as draft...", { id: toastId });

        startTransition(async () => {
            // 1. Create Product
            const productRes = await createProduct({
                categoryId,
                name: name.trim(),
                description: description.trim(),
                basePrice: Number(basePrice) || 0,
                tags,
                isAvailable: publish,
            });

            if (!productRes.success || !productRes.data) {
                toast.error(`Failed to create product: ${productRes.error}`, { id: toastId });
                return;
            }

            const productId = productRes.data.id;

            // 2. Add Variants & Upload Images
            let addedCount = 0;
            for (const v of variants) {
                toast.loading(`Adding variant ${addedCount + 1} of ${variants.length}...`, { id: toastId });

                const varRes = await addVariant(productId, {
                    size: v.size || null,
                    color: v.color || null,
                    colorHex: v.colorHex || null,
                    design: v.design || null,
                    sku: v.sku || null,
                    priceOverride: v.priceOverride,
                    isAvailable: v.isAvailable,
                });

                if (varRes.success && varRes.data && v.imageFile) {
                    toast.loading(`Uploading image for variant ${addedCount + 1}...`, { id: toastId });

                    // Upload to Cloudinary
                    const formData = new FormData();
                    formData.append("file", v.imageFile);
                    formData.append("variantId", varRes.data.id);

                    try {
                        const uploadRes = await fetch("/api/cloudinary/upload", {
                            method: "POST",
                            body: formData,
                        });
                        const uploadData = await uploadRes.json();

                        if (uploadData.publicId && uploadData.url) {
                            // Link image in DB
                            await upsertVariantImage(
                                varRes.data.id,
                                uploadData.publicId,
                                uploadData.url,
                                `${name} - ${v.color || ""} ${v.size || ""}`,
                                true // Make it primary
                            );
                        }
                    } catch (e) {
                        console.error("Failed to upload image for variant", varRes.data.id, e);
                    }
                }
                addedCount++;
            }

            toast.success(publish ? "Product published!" : "Draft saved!", { id: toastId });
            router.push(`/admin/products/${productId}`);
        });
    }

    // Previews
    const catLabel = categories.find((c) => c.id === categoryId)?.label || "Category";
    const primaryImage = variants[0]?.imagePreviewUrl || null;
    const uniqueColors = [...new Set(variants.map((v) => v.color).filter(Boolean))];

    return (
        <div className="flex flex-col gap-10 animate-fade-in pb-20">
            <AdminBreadcrumb items={[{ label: "Products", href: "/admin/products" }, { label: "New Product" }]} />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-[var(--rw-border)] pb-10">
                <div className="flex flex-col gap-2">
                    <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-rw-ink tracking-tight">
                        Add New Product
                    </h1>
                    <p className="text-sm text-rw-muted font-medium">Create a new product, configure variants, and upload images.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                {/* Left & Middle: Form (8 cols) */}
                <div className="lg:col-span-8 flex flex-col gap-8">
                    
                    {/* General Info */}
                    <div className="rw-card p-6 sm:p-8 space-y-6 bg-white">
                        <div className="flex items-center gap-3 border-b border-[var(--rw-border)] pb-4 mb-2">
                            <div className="h-8 w-8 rounded-full bg-rw-ink text-white flex items-center justify-center font-bold text-sm">1</div>
                            <h2 className="font-display font-bold text-xl text-rw-ink">General Info</h2>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-rw-muted uppercase tracking-wider">Product Name</label>
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. RW'26 Premium Hoodie"
                                className="w-full rounded-xl border border-[var(--rw-border)] px-4 py-3 text-sm font-semibold text-rw-ink focus:ring-2 focus:ring-rw-crimson/30 focus:border-rw-crimson transition-all"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-rw-muted uppercase tracking-wider">Base Price (₦)</label>
                                <input
                                    type="number"
                                    value={basePrice || ""}
                                    onChange={(e) => setBasePrice(Number(e.target.value))}
                                    placeholder="0"
                                    className="w-full rounded-xl border border-[var(--rw-border)] px-4 py-3 text-sm font-semibold text-rw-ink focus:ring-2 focus:ring-rw-crimson/30 focus:border-rw-crimson transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-rw-muted uppercase tracking-wider">Category</label>
                                <select
                                    value={categoryId}
                                    onChange={(e) => setCategoryId(e.target.value)}
                                    className="w-full rounded-xl border border-[var(--rw-border)] px-4 py-3 text-sm font-semibold text-rw-ink bg-white focus:ring-2 focus:ring-rw-crimson/30 focus:border-rw-crimson transition-all appearance-none"
                                >
                                    <option value="" disabled>Select Category...</option>
                                    {categories.map((c) => (
                                        <option key={c.id} value={c.id}>{c.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-rw-muted uppercase tracking-wider">Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={4}
                                placeholder="Details about fabric, fit, and meaning..."
                                className="w-full rounded-xl border border-[var(--rw-border)] px-4 py-3 text-sm font-medium text-rw-ink focus:ring-2 focus:ring-rw-crimson/30 focus:border-rw-crimson transition-all resize-y"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-rw-muted uppercase tracking-wider">Tags (Enter to add)</label>
                            <div className="flex flex-wrap gap-2 items-center p-2 rounded-xl border border-[var(--rw-border)] bg-white focus-within:ring-2 focus-within:ring-rw-crimson/30 focus-within:border-rw-crimson transition-all">
                                {tags.map((t) => (
                                    <span key={t} className="flex items-center gap-1 rounded-full bg-rw-bg-alt px-3 py-1 text-xs font-bold text-rw-ink border border-[var(--rw-border)]">
                                        {t}
                                        <button onClick={() => removeTag(t)} className="text-rw-muted hover:text-red-500 rounded-full ml-1">
                                            &times;
                                        </button>
                                    </span>
                                ))}
                                <input
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyDown={handleTagKeyDown}
                                    placeholder={tags.length === 0 ? "e.g. bestseller, new" : ""}
                                    className="flex-1 min-w-[120px] bg-transparent border-none text-sm font-medium px-2 py-1 focus:outline-none focus:ring-0"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Variants Builder */}
                    <div className="rw-card p-6 sm:p-8 space-y-6 bg-white">
                        <div className="flex items-center gap-3 border-b border-[var(--rw-border)] pb-4 mb-2">
                            <div className="h-8 w-8 rounded-full bg-rw-ink text-white flex items-center justify-center font-bold text-sm">2</div>
                            <h2 className="font-display font-bold text-xl text-rw-ink">Variants & Inventory</h2>
                        </div>

                        {/* Variant List */}
                        {variants.length > 0 && (
                            <div className="space-y-3 mb-6">
                                {variants.map((v, i) => (
                                    <div key={v.tempId} className="flex items-center gap-4 rounded-xl border border-[var(--rw-border)] p-3 bg-rw-bg-alt/30 transition-all hover:bg-rw-bg-alt">
                                        <div className="h-12 w-10 shrink-0 rounded overflow-hidden bg-white border border-[var(--rw-border)]">
                                            {v.imagePreviewUrl ? (
                                                <img src={v.imagePreviewUrl} alt="Variant" className="h-full w-full object-cover" />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center bg-gray-100">
                                                    <span className="text-[8px] text-rw-muted uppercase">No Img</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-sm text-rw-ink flex items-center gap-2">
                                                    {v.color || "No Color"} &middot; {v.size || "No Size"}
                                                    {(v.colorHex || COLOR_HEX[v.color]) && (
                                                        <span className="h-3 w-3 rounded-full border border-black/10 inline-block" style={{ background: v.colorHex || COLOR_HEX[v.color] }} />
                                                    )}
                                                </span>
                                                <span className="text-xs text-rw-muted">
                                                    {v.design ? `${v.design} ` : ""}{v.sku ? `(SKU: ${v.sku})` : ""}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4 text-sm font-bold text-rw-ink">
                                                {v.priceOverride ? (
                                                    <span className="text-rw-crimson">₦{v.priceOverride.toLocaleString()}</span>
                                                ) : (
                                                    <span className="text-rw-muted">Base: ₦{(basePrice || 0).toLocaleString()}</span>
                                                )}
                                                <button onClick={() => handleRemoveVariant(v.tempId)} className="text-rw-muted hover:text-red-500 h-8 w-8 rounded-lg flex items-center justify-center hover:bg-red-50 transition-colors">
                                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12"/></svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Add Variant Inline Form */}
                        <div className="rounded-xl border border-dashed border-rw-muted/40 p-5 bg-white space-y-5">
                            <h3 className="font-bold text-sm text-rw-ink uppercase tracking-wider">Add a Variant</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-rw-muted uppercase tracking-widest">Color Name</label>
                                    <input value={nvColor} onChange={(e) => setNvColor(e.target.value)} placeholder="e.g. Space Grey" className="w-full rounded-lg border border-[var(--rw-border)] px-3 py-2 text-sm font-semibold focus:ring-2 focus:ring-rw-crimson/30" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-rw-muted uppercase tracking-widest">Color Hex (Optional)</label>
                                    <div className="flex gap-2 items-center">
                                        <input type="color" value={nvColorHex || "#000000"} onChange={(e) => setNvColorHex(e.target.value)} className="h-9 w-10 shrink-0 rounded border border-[var(--rw-border)] bg-white p-0.5" />
                                        <input value={nvColorHex} onChange={(e) => setNvColorHex(e.target.value)} placeholder="#333333" className="w-full rounded-lg border border-[var(--rw-border)] px-3 py-2 text-sm font-semibold focus:ring-2 focus:ring-rw-crimson/30" />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-rw-muted uppercase tracking-widest">Size</label>
                                    <input value={nvSize} onChange={(e) => setNvSize(e.target.value)} placeholder="e.g. XL, 42" className="w-full rounded-lg border border-[var(--rw-border)] px-3 py-2 text-sm font-semibold focus:ring-2 focus:ring-rw-crimson/30" />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-rw-muted uppercase tracking-widest">Design Text</label>
                                    <input value={nvDesign} onChange={(e) => setNvDesign(e.target.value)} placeholder="e.g. Holy Spirit" className="w-full rounded-lg border border-[var(--rw-border)] px-3 py-2 text-sm font-semibold focus:ring-2 focus:ring-rw-crimson/30" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-rw-muted uppercase tracking-widest">SKU</label>
                                    <input value={nvSku} onChange={(e) => setNvSku(e.target.value)} placeholder="e.g. RW-TEE-BLK-M" className="w-full rounded-lg border border-[var(--rw-border)] px-3 py-2 text-sm font-semibold focus:ring-2 focus:ring-rw-crimson/30" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-rw-muted uppercase tracking-widest">Price Override</label>
                                    <input type="number" value={nvPriceOverride} onChange={(e) => setNvPriceOverride(e.target.value)} placeholder="Leave blank for base" className="w-full rounded-lg border border-[var(--rw-border)] px-3 py-2 text-sm font-semibold focus:ring-2 focus:ring-rw-crimson/30" />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-rw-muted uppercase tracking-widest">Variant Image (360x480)</label>
                                <div className="flex items-center gap-4">
                                    {nvImagePreview && (
                                        <div className="h-16 w-12 rounded border border-[var(--rw-border)] overflow-hidden shrink-0 shadow-sm">
                                            <img src={nvImagePreview} alt="Preview" className="h-full w-full object-cover" />
                                        </div>
                                    )}
                                    <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} className="text-xs text-rw-muted file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-rw-bg-alt file:text-rw-ink hover:file:bg-rw-border cursor-pointer transition-all" />
                                </div>
                            </div>
                            <div className="pt-2">
                                <button type="button" onClick={handleAddVariant} className="btn-secondary !h-9 text-xs flex items-center gap-2">
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                                    Add This Variant
                                </button>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Right: Sidebar Preview & Publish (4 cols) */}
                <div className="lg:col-span-4 flex flex-col gap-8 sticky top-8">
                    <div className="rw-card p-6 space-y-6 bg-white border border-rw-crimson/10 shadow-xl shadow-rw-crimson/5">
                        <h2 className="font-display font-bold text-xl text-rw-ink border-b border-[var(--rw-border)] pb-3">Publish</h2>
                        
                        <div className="space-y-4">
                            <label className="flex items-center justify-between p-4 rounded-xl border border-[var(--rw-border)] bg-rw-bg-alt cursor-pointer hover:border-rw-crimson/30 transition-colors">
                                <div className="flex flex-col gap-0.5">
                                    <span className="font-bold text-sm text-rw-ink">Visible on Storefront</span>
                                    <span className="text-[10px] font-medium text-rw-muted">Allow customers to order</span>
                                </div>
                                <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 ${isAvailable ? "bg-green-500" : "bg-gray-300"}`}>
                                    <span className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-300 ${isAvailable ? "translate-x-6" : "translate-x-1"}`} />
                                </div>
                                {/* Hidden input to trigger state change on full container click */}
                                <input type="checkbox" className="sr-only" checked={isAvailable} onChange={(e) => setIsAvailable(e.target.checked)} />
                            </label>

                            <button
                                onClick={() => handleSave(true)}
                                disabled={isPending}
                                className="w-full btn-primary !h-12 text-sm flex items-center justify-center gap-2 shadow-lg shadow-rw-crimson/20"
                            >
                                {isPending ? "Saving..." : "Publish Product"}
                                {!isPending && (
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                                )}
                            </button>
                            
                            <button
                                onClick={() => handleSave(false)}
                                disabled={isPending}
                                className="w-full btn-secondary !h-11 text-xs text-rw-muted hover:text-rw-ink border border-[var(--rw-border)]"
                            >
                                Save as Draft (Hidden)
                            </button>
                        </div>
                    </div>

                    {/* Live Preview Card */}
                    <div className="rw-card p-6 space-y-4 bg-rw-bg-alt/50 border-dashed">
                        <h3 className="font-bold text-xs text-rw-muted uppercase tracking-widest">Storefront Preview</h3>
                        <div className="pointer-events-none">
                            <div className="rw-card group flex flex-col bg-white border-none shadow-md overflow-hidden">
                                <div className="relative aspect-[3/4] overflow-hidden bg-rw-bg-alt">
                                    <img
                                        src={productImageUrl(name, uniqueColors[0] as string | undefined ?? null, primaryImage)}
                                        alt={name}
                                        className="w-full h-full object-cover transition-transform duration-700"
                                    />
                                    <div className="absolute top-3 left-3">
                                        <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest bg-rw-crimson/90 text-white backdrop-blur-sm shadow-sm">
                                            Pre-order
                                        </span>
                                    </div>
                                    <div className="absolute bottom-3 left-3">
                                        <span className="px-2 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest bg-white/90 backdrop-blur-sm shadow-sm text-rw-ink">
                                            {catLabel}
                                        </span>
                                    </div>
                                    {tags.length > 0 && (
                                        <div className="absolute bottom-3 right-3 flex gap-1">
                                            {tags.slice(0, 2).map((tag) => (
                                                <span key={tag} className="px-2 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest bg-rw-crimson/90 text-white shadow-sm">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="p-4 flex flex-col gap-3">
                                    <div className="flex flex-col gap-0.5">
                                        <h3 className="font-display font-bold text-rw-ink text-sm line-clamp-1">{name || "Product Name"}</h3>
                                        <div className="flex items-baseline justify-between">
                                            <span className="font-display font-black text-rw-crimson text-base">
                                                ₦{(basePrice || 0).toLocaleString()}
                                            </span>
                                            <span className="text-[9px] font-bold text-rw-muted uppercase tracking-wider">Base Price</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between py-2 border-y border-[var(--rw-border)]">
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-[9px] font-bold text-rw-muted uppercase tracking-wider">Variants</span>
                                            <span className="text-xs font-bold text-rw-ink">{variants.length}</span>
                                        </div>
                                        <div className="flex flex-col items-end gap-0.5">
                                            <span className="text-[9px] font-bold text-rw-muted uppercase tracking-wider">Colors</span>
                                            <div className="flex gap-1 mt-0.5">
                                                {uniqueColors.slice(0, 4).map((c) => (
                                                    <span key={c} className="h-2.5 w-2.5 rounded-full border border-black/10" style={{ background: COLOR_HEX[c] || "#ddd" }} />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
