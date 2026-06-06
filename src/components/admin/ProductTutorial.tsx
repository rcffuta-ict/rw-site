"use client";

import { useState, useEffect } from "react";

const STORAGE_KEY = "rw26_product_tutorial_dismissed";

const STEPS = [
    {
        id: "overview",
        emoji: "🧭",
        title: "Products Overview",
        content: [
            "The Products page is your merch catalog manager. You can view, create, edit, and toggle availability for all Redemption Week products here.",
            "The left sidebar shows category filters. The grid shows all products — each card has a quick-action menu for editing or toggling availability.",
            "Only ADMIN users can create, edit, or delete products. Moderators have read-only access.",
        ],
    },
    {
        id: "categories",
        emoji: "🏷️",
        title: "Managing Categories (Important!)",
        highlight: true,
        content: [
            "Categories organize your products into groups like T-Shirts, Hoodies, and Accessories. They appear as filter tabs on the public storefront.",
            "To add, rename, reorder, or toggle a category — click the \"Manage Categories\" button in the top-right area of the Products page. This opens a sliding drawer panel.",
            "In the drawer: type a category name + optional description, then press \"Add Category\". You can reorder categories using the ↑ ↓ arrows. Toggle the green/grey switch to activate/deactivate a category without deleting it.",
            "⚠️ You cannot delete a category that still has products assigned to it. Reassign or delete those products first.",
        ],
    },
    {
        id: "creating",
        emoji: "➕",
        title: "Creating a New Product",
        content: [
            "Click \"Add Product\" in the top-right. You'll fill in: Product Name, Category (required), Base Price (in Naira), Tags (comma-separated), and Description.",
            "After saving the basic info, you'll be taken to the Product Detail page where you can add variants (size × color combinations) and upload images.",
            "A product is visible on the storefront only when its \"Available\" toggle is ON and it has at least one active variant.",
        ],
    },
    {
        id: "variants",
        emoji: "🎨",
        title: "Product Variants",
        content: [
            "Each product can have multiple variants — different size/color/design combos. Customers select a variant when ordering.",
            "To add a variant: scroll to the \"Variants\" section on the product detail page, fill in Size, Color, Design (optional), and optionally a Price Override. Leave Price Override empty to inherit the base product price.",
            "You can upload a product image per variant. Images are stored on Cloudinary and automatically optimized. Recommended: 360×480 portrait ratio.",
            "The SKU field is optional — it's for your internal tracking only.",
        ],
    },
    {
        id: "availability",
        emoji: "👁️",
        title: "Availability & Draft Mode",
        content: [
            "Each product has an \"Available\" toggle. When OFF, the product is hidden from the public storefront — useful for drafting products before launch.",
            "Individual variants also have their own availability toggle. A product is only shown on the storefront if the product itself AND at least one of its variants are both set to Available.",
            "You can use this to pre-load your entire catalog privately, then flip everything to Available right before the event opens.",
        ],
    },
];

interface ProductTutorialProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ProductTutorial({ isOpen, onClose }: ProductTutorialProps) {
    const [step, setStep] = useState(0);

    function handleClose() {
        try { localStorage.setItem(STORAGE_KEY, "true"); } catch {}
        onClose();
    }

    if (!isOpen) return null;

    const current = STEPS[step]!;
    const isLast = step === STEPS.length - 1;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm animate-fade-in"
                onClick={handleClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="relative w-full max-w-lg bg-white rounded-[28px] shadow-2xl overflow-hidden animate-fade-in-up">
                    {/* Header bar */}
                    <div className="bg-[#1C0003] px-8 pt-8 pb-6">
                        <div className="flex items-center justify-between mb-6">
                            <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">
                                Product Guide · Step {step + 1} of {STEPS.length}
                            </p>
                            <button
                                onClick={handleClose}
                                className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                            >
                                <svg className="h-4 w-4 text-white/60" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-4xl">{current.emoji}</span>
                            <div>
                                {current.highlight && (
                                    <span className="inline-block text-[9px] font-black bg-amber-400 text-amber-900 px-2 py-0.5 rounded-full uppercase tracking-widest mb-1">
                                        ✦ Often missed
                                    </span>
                                )}
                                <h2 className="font-display font-black text-xl text-white leading-tight">
                                    {current.title}
                                </h2>
                            </div>
                        </div>

                        {/* Step dots */}
                        <div className="flex gap-1.5 mt-6">
                            {STEPS.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setStep(i)}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${
                                        i === step
                                            ? "w-6 bg-white"
                                            : i < step
                                            ? "w-3 bg-white/40"
                                            : "w-3 bg-white/20"
                                    }`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="px-8 py-6 space-y-4 max-h-[50vh] overflow-y-auto">
                        {current.content.map((paragraph, i) => (
                            <p key={i} className="text-sm text-rw-ink/80 leading-relaxed">
                                {paragraph}
                            </p>
                        ))}
                    </div>

                    {/* Footer navigation */}
                    <div className="px-8 py-5 border-t border-[var(--rw-border)] flex items-center justify-between gap-4">
                        <button
                            onClick={() => setStep((s) => Math.max(0, s - 1))}
                            disabled={step === 0}
                            className="flex items-center gap-2 text-[11px] font-bold text-rw-muted uppercase tracking-widest hover:text-rw-ink transition-colors disabled:opacity-30"
                        >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                            </svg>
                            Back
                        </button>

                        {isLast ? (
                            <button
                                onClick={handleClose}
                                className="flex items-center gap-2 rounded-xl bg-rw-crimson text-white px-6 py-2.5 text-[11px] font-black uppercase tracking-widest hover:bg-rw-crimson-dk transition-colors"
                            >
                                Got it, thanks!
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                </svg>
                            </button>
                        ) : (
                            <button
                                onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
                                className="flex items-center gap-2 rounded-xl bg-rw-ink text-white px-6 py-2.5 text-[11px] font-black uppercase tracking-widest hover:bg-rw-crimson transition-colors"
                            >
                                Next
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

/** Button that opens the tutorial. Auto-opens on first visit. */
export function ProductTutorialTrigger({
    onOpen,
}: {
    onOpen: () => void;
}) {
    useEffect(() => {
        try {
            const dismissed = localStorage.getItem(STORAGE_KEY);
            if (!dismissed) {
                // Slight delay for page to settle
                const t = setTimeout(onOpen, 800);
                return () => clearTimeout(t);
            }
        } catch {}
    }, [onOpen]);

    return (
        <button
            onClick={onOpen}
            title="Open product guide"
            className="h-9 w-9 rounded-full bg-rw-bg-alt border border-[var(--rw-border)] flex items-center justify-center text-rw-muted hover:text-rw-ink hover:border-rw-ink hover:bg-white transition-all shadow-sm"
        >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
            </svg>
        </button>
    );
}
