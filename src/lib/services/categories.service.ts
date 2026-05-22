"use server";

// ─── Categories Service — Supabase ────────────────────────────────────────────
import {
    createSupabaseAdminClient,
    createSupabaseServerClient,
} from "@/lib/supabase/server";
import { mapCategoryFromDb } from "@/lib/supabase/mappers";
import type { Category, CategoryInput, ServiceResult } from "@/lib/data/types";

// ─── Read ─────────────────────────────────────────────────────────────────────

export async function listCategories(includeInactive = false): Promise<Category[]> {
    const supabase = await createSupabaseServerClient();
    let query = supabase
        .from("categories")
        .select("*")
        .order("sort_order", { ascending: true });

    if (!includeInactive) {
        query = query.eq("is_active", true);
    }

    const { data, error } = await query;
    if (error) throw new Error(`Failed to load categories: ${error.message}`);
    return (data ?? []).map(mapCategoryFromDb);
}

export async function getCategoryById(id: string): Promise<Category | undefined> {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase.from("categories").select("*").eq("id", id).single();
    return data ? mapCategoryFromDb(data) : undefined;
}

export async function getCategoryBySlug(slug: string): Promise<Category | undefined> {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase
        .from("categories")
        .select("*")
        .eq("slug", slug)
        .single();
    return data ? mapCategoryFromDb(data) : undefined;
}

// ─── Create ───────────────────────────────────────────────────────────────────

export async function createCategory(
    input: CategoryInput
): Promise<ServiceResult<Category>> {
    const supabase = await createSupabaseAdminClient();

    const { data, error } = await supabase
        .from("categories")
        .insert({
            slug: input.slug.toLowerCase().replace(/\s+/g, "-"),
            label: input.label,
            description: input.description ?? null,
            sort_order: input.sortOrder ?? 99,
            is_active: input.isActive ?? true,
        })
        .select()
        .single();

    if (error) return { success: false, error: error.message };
    return { success: true, data: mapCategoryFromDb(data) };
}

// ─── Update ───────────────────────────────────────────────────────────────────

export async function updateCategory(
    id: string,
    input: Partial<CategoryInput>
): Promise<ServiceResult<Category>> {
    const supabase = await createSupabaseAdminClient();

    const patch: Record<string, unknown> = {};
    if (input.slug !== undefined)
        patch.slug = input.slug.toLowerCase().replace(/\s+/g, "-");
    if (input.label !== undefined) patch.label = input.label;
    if (input.description !== undefined) patch.description = input.description ?? null;
    if (input.sortOrder !== undefined) patch.sort_order = input.sortOrder;
    if (input.isActive !== undefined) patch.is_active = input.isActive;

    const { data, error } = await supabase
        .from("categories")
        .update(patch)
        .eq("id", id)
        .select()
        .single();

    if (error) return { success: false, error: error.message };
    return { success: true, data: mapCategoryFromDb(data) };
}

// ─── Delete ───────────────────────────────────────────────────────────────────

export async function deleteCategory(id: string): Promise<ServiceResult> {
    const supabase = await createSupabaseAdminClient();

    const { error } = await supabase.from("categories").delete().eq("id", id);

    if (error) {
        // FK violation: products are still assigned to this category
        if (error.code === "23503") {
            return {
                success: false,
                error: "Cannot delete this category — products are still assigned to it. Reassign them first.",
            };
        }
        return { success: false, error: error.message };
    }

    return { success: true };
}

// ─── Reorder ──────────────────────────────────────────────────────────────────

export async function reorderCategories(orderedIds: string[]): Promise<ServiceResult> {
    const supabase = await createSupabaseAdminClient();

    const updates = orderedIds.map((id, idx) =>
        supabase
            .from("categories")
            .update({ sort_order: idx + 1 })
            .eq("id", id)
    );

    const results = await Promise.all(updates);
    const failed = results.find((r) => r.error);
    if (failed?.error) return { success: false, error: failed.error.message };

    return { success: true };
}
