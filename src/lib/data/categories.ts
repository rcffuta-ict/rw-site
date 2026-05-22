import type { Category } from "./types";

// ─── Demo categories ──────────────────────────────────────────────────────────
// Used when DEMO_MODE = true. In live mode, categories come from Supabase.

export const DEMO_CATEGORIES: Category[] = [
    {
        id: "cat-tshirt",
        slug: "tshirt",
        label: "T-Shirt",
        description: "Comfort-fit cotton tees with event prints.",
        sortOrder: 1,
        isActive: true,
        createdAt: "2026-04-01T00:00:00Z",
    },
    {
        id: "cat-hoodie",
        slug: "hoodie",
        label: "Hoodie",
        description: "Heavyweight fleece pullovers for the cold nights.",
        sortOrder: 2,
        isActive: true,
        createdAt: "2026-04-01T00:00:00Z",
    },
    {
        id: "cat-accessory",
        slug: "accessory",
        label: "Accessory",
        description: "Caps, sticker packs, and other branded items.",
        sortOrder: 3,
        isActive: true,
        createdAt: "2026-04-01T00:00:00Z",
    },
];

export function getDemoCategoryBySlug(slug: string): Category | undefined {
    return DEMO_CATEGORIES.find((c) => c.slug === slug);
}

export function getDemoCategoryById(id: string): Category | undefined {
    return DEMO_CATEGORIES.find((c) => c.id === id);
}
