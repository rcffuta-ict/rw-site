"use server";

// ─── Verdicts Service — Supabase ──────────────────────────────────────────────
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { mapOrderFromDb } from "@/lib/supabase/mappers";
import type {
    Verdict,
    VerdictInput,
    VerdictStatus,
    Order,
    ServiceResult,
} from "@/lib/data/types";
import { revalidateTag } from "next/cache";

// ─── Mapper ───────────────────────────────────────────────────────────────────

function mapVerdictFromDb(
    row: Record<string, unknown>,
    orders: Order[] = []
): Verdict {
    return {
        id: row.id as string,
        verdictRef: row.verdict_ref as string,
        issuedBy: row.issued_by as string,
        issuedAt: row.issued_at as string,
        status: row.status as VerdictStatus,
        pdfCloudinaryUrl: (row.pdf_cloudinary_url as string | null) ?? null,
        pdfCloudinaryId: (row.pdf_cloudinary_id as string | null) ?? null,
        totalAmount: row.total_amount as number,
        notes: (row.notes as string | null) ?? null,
        orders,
        createdAt: row.created_at as string,
        updatedAt: row.updated_at as string,
    };
}

// ─── Order select fragment ─────────────────────────────────────────────────────

const ORDER_SELECT = `
    *,
    items:rw_order_items ( * ),
    payments:rw_payments ( * )
` as const;

// ─── Read ─────────────────────────────────────────────────────────────────────

/** List all verdicts ordered by issuedAt DESC, with their covered orders. */
export async function listVerdicts(): Promise<Verdict[]> {
    const supabase = await createSupabaseAdminClient();

    const { data: verdicts, error } = await supabase
        .from("rw_verdicts")
        .select("*")
        .order("issued_at", { ascending: false });

    if (error) throw new Error(`Failed to load verdicts: ${error.message}`);
    if (!verdicts || verdicts.length === 0) return [];

    // Fetch all verdict-order links
    const verdictIds = verdicts.map((v) => v.id);
    const { data: links } = await supabase
        .from("rw_verdict_orders")
        .select("verdict_id, order_id")
        .in("verdict_id", verdictIds);

    if (!links || links.length === 0) {
        return verdicts.map((v) => mapVerdictFromDb(v, []));
    }

    // Fetch all referenced orders
    const orderIds = [...new Set(links.map((l) => l.order_id))];
    const { data: ordersData } = await supabase
        .from("rw_orders")
        .select(ORDER_SELECT)
        .in("id", orderIds);

    const ordersMap = new Map<string, Order>();
    for (const o of (ordersData ?? [])) {
        ordersMap.set(o.id, mapOrderFromDb(o));
    }

    return verdicts.map((v) => {
        const coverageLinks = links.filter((l) => l.verdict_id === v.id);
        const orders = coverageLinks
            .map((l) => ordersMap.get(l.order_id))
            .filter(Boolean) as Order[];
        return mapVerdictFromDb(v, orders);
    });
}

/** Get a single verdict by ID, with full order data. */
export async function getVerdictById(id: string): Promise<Verdict | undefined> {
    const supabase = await createSupabaseAdminClient();

    const { data: verdict } = await supabase
        .from("rw_verdicts")
        .select("*")
        .eq("id", id)
        .single();

    if (!verdict) return undefined;

    const { data: links } = await supabase
        .from("rw_verdict_orders")
        .select("order_id")
        .eq("verdict_id", id);

    if (!links || links.length === 0) return mapVerdictFromDb(verdict, []);

    const orderIds = links.map((l) => l.order_id);
    const { data: ordersData } = await supabase
        .from("rw_orders")
        .select(ORDER_SELECT)
        .in("id", orderIds);

    const orders = (ordersData ?? []).map(mapOrderFromDb);
    return mapVerdictFromDb(verdict, orders);
}

/** Find which verdict covers a given order (if any). */
export async function getVerdictForOrder(
    orderId: string
): Promise<Verdict | undefined> {
    const supabase = await createSupabaseAdminClient();

    const { data: link } = await supabase
        .from("rw_verdict_orders")
        .select("verdict_id")
        .eq("order_id", orderId)
        .single();

    if (!link) return undefined;
    return getVerdictById(link.verdict_id);
}

// ─── Create ───────────────────────────────────────────────────────────────────

/**
 * Issue a new verdict covering the given orders.
 * The DB trigger will automatically set all covered orders → in_production.
 */
export async function createVerdict(
    input: VerdictInput
): Promise<ServiceResult<Verdict>> {
    const supabase = await createSupabaseAdminClient();

    if (input.orderIds.length === 0) {
        return { success: false, error: "At least one order must be selected." };
    }

    // Fetch orders to sum totalAmount
    const { data: ordersData, error: ordErr } = await supabase
        .from("rw_orders")
        .select("id, total_amount")
        .in("id", input.orderIds);

    if (ordErr || !ordersData) {
        return { success: false, error: ordErr?.message ?? "Failed to fetch orders." };
    }

    const totalAmount = ordersData.reduce((s, o) => s + (o.total_amount ?? 0), 0);

    // Insert verdict
    const { data: verdict, error: verdictErr } = await supabase
        .from("rw_verdicts")
        .insert({
            issued_by: input.issuedBy,
            total_amount: totalAmount,
            notes: input.notes ?? null,
        })
        .select("*")
        .single();

    if (verdictErr || !verdict) {
        return { success: false, error: verdictErr?.message ?? "Failed to create verdict." };
    }

    // Insert junction rows (trigger fires per row → sets each order in_production)
    const junctionRows = input.orderIds.map((orderId) => ({
        verdict_id: verdict.id,
        order_id: orderId,
    }));

    const { error: linkErr } = await supabase
        .from("rw_verdict_orders")
        .insert(junctionRows);

    if (linkErr) {
        return { success: false, error: linkErr.message };
    }

    revalidateTag("verdicts", "max");
    revalidateTag("orders", "max");

    const full = await getVerdictById(verdict.id);
    if (!full) return { success: false, error: "Verdict created but could not retrieve it." };

    return { success: true, data: full };
}

// ─── Update PDF ───────────────────────────────────────────────────────────────

/** Store the Cloudinary PDF reference after client-side upload. */
export async function updateVerdictPdf(
    id: string,
    pdfCloudinaryUrl: string,
    pdfCloudinaryId: string
): Promise<ServiceResult<Verdict>> {
    const supabase = await createSupabaseAdminClient();

    const { error } = await supabase
        .from("rw_verdicts")
        .update({ pdf_cloudinary_url: pdfCloudinaryUrl, pdf_cloudinary_id: pdfCloudinaryId })
        .eq("id", id);

    if (error) return { success: false, error: error.message };

    revalidateTag("verdicts", "max");
    const updated = await getVerdictById(id);
    return updated
        ? { success: true, data: updated }
        : { success: false, error: "Verdict updated but could not retrieve." };
}

// ─── Mark Ready ───────────────────────────────────────────────────────────────

/**
 * Mark a verdict as ready (physical merch has arrived).
 * The DB trigger will automatically set all covered orders → ready.
 */
export async function markVerdictReady(
    id: string
): Promise<ServiceResult<Verdict>> {
    const supabase = await createSupabaseAdminClient();

    const { error } = await supabase
        .from("rw_verdicts")
        .update({ status: "ready" as VerdictStatus })
        .eq("id", id);

    if (error) return { success: false, error: error.message };

    revalidateTag("verdicts", "max");
    revalidateTag("orders", "max");

    const updated = await getVerdictById(id);
    return updated
        ? { success: true, data: updated }
        : { success: false, error: "Verdict updated but could not retrieve." };
}
