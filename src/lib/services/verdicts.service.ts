"use server";

// ─── Verdicts Service — Supabase ──────────────────────────────────────────────
//
// A verdict is the official, admin-issued declaration of what to produce and how
// much to debit from the fellowship bank account. Issuing one:
//   1. is restricted to ADMINs (not moderators),
//   2. requires ≥1 fully-paid order that isn't already in a verdict,
//   3. freezes a snapshot (manifest + financials + bank account + signature),
//   4. locks the covered orders (UNIQUE(order_id)) and moves them to
//      in_production, broadcasting the in_production email to each customer.

import { createSupabaseAdminClient, createSupabaseServerClient } from "@/lib/supabase/server";
import { resolveAdminRole } from "@/lib/auth/roles";
import { getIctAdminClient } from "@/lib/ict";
import { mapVerdictFromDb, mapOrderFromDb } from "@/lib/supabase/mappers";
import { listOrders } from "@/lib/services/orders.service";
import { enqueueOrderStatusEmail } from "@/lib/services/email.service";
import { getSettings } from "@/lib/services/settings.service";
import type {
    Order,
    Verdict,
    VerdictManifestItem,
    ServiceResult,
} from "@/lib/data/types";
import { revalidateTag } from "next/cache";

// ─── Shared select fragment ───────────────────────────────────────────────────

const VERDICT_SELECT = `
    *,
    orders:rw_verdict_orders ( * )
` as const;

// ─── Helpers ──────────────────────────────────────────────────────────────────

interface ResolvedStaff {
    profileId: string;
    name: string;
    email: string;
    role: "ADMIN" | "MODERATOR";
}

/**
 * Resolve the currently authenticated staff member (admin or moderator) from the
 * session — authoritatively, server-side. Returns null when not signed in or not
 * a staff member. `requireAdmin` rejects moderators (used for issuing verdicts).
 * Never trust a client-supplied identity.
 */
async function resolveActingStaff(
    requireAdmin = false
): Promise<ResolvedStaff | null> {
    const supabase = await createSupabaseServerClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const role = await resolveAdminRole(user.id);
    if (role !== "ADMIN" && role !== "MODERATOR") return null;
    if (requireAdmin && role !== "ADMIN") return null;

    const adminClient = getIctAdminClient();
    const { data: profile } = await adminClient.supabase
        .from("profiles")
        .select("first_name, last_name")
        .eq("id", user.id)
        .maybeSingle();

    const name = profile
        ? `${profile.first_name ?? ""} ${profile.last_name ?? ""}`.trim()
        : "";

    return {
        profileId: user.id,
        name: name || user.email || "Staff",
        email: user.email ?? "",
        role,
    };
}

// ─── Pickup codes ─────────────────────────────────────────────────────────────

// Friendly, sayable words paired with a short random code → e.g. "GRACE-7K2".
// Memorable for the customer, easy to read aloud at the desk, unguessable enough
// to authenticate the rightful collector.
const PICKUP_WORDS = [
    "GRACE", "MERCY", "FAITH", "LIGHT", "SHALOM", "AGAPE", "ZION", "REFUGE",
    "ANCHOR", "BEACON", "CROWN", "EMBER", "GLORY", "HAVEN", "MANNA", "PSALM",
    "REVIVE", "SPIRIT", "TEMPLE", "VICTORY", "WONDER", "JUBILEE", "HARVEST", "COVENANT",
];
// Unambiguous alphabet (no O/0, I/1) for the random suffix.
const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

/** Generate a fresh pickup code like "GRACE-7K2". */
function generatePickupToken(): string {
    const word = PICKUP_WORDS[Math.floor(Math.random() * PICKUP_WORDS.length)];
    let code = "";
    for (let i = 0; i < 3; i++) {
        code += CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)];
    }
    return `${word}-${code}`;
}

/** Normalize a pickup code for comparison — case/space/punctuation-insensitive. */
function normalizeToken(value: string): string {
    return value.toUpperCase().replace(/[^A-Z0-9]/g, "");
}

/** An order can be bundled only if it is fully paid and not cancelled. */
function isFullyPaid(order: Order): boolean {
    return order.status !== "cancelled" && order.amountPaid >= order.totalAmount;
}

/** Consolidate line items across orders into a single production manifest. */
function buildManifest(orders: Order[]): VerdictManifestItem[] {
    const map = new Map<string, VerdictManifestItem>();
    for (const order of orders) {
        for (const item of order.items) {
            const key = `${item.productName}__${item.variantLabel}`;
            const existing = map.get(key);
            if (existing) {
                existing.quantity += item.quantity;
            } else {
                map.set(key, {
                    productName: item.productName,
                    variantLabel: item.variantLabel,
                    quantity: item.quantity,
                });
            }
        }
    }
    // Stable, readable order: by product then variant.
    return [...map.values()].sort(
        (a, b) =>
            a.productName.localeCompare(b.productName) ||
            a.variantLabel.localeCompare(b.variantLabel)
    );
}

// ─── Read ─────────────────────────────────────────────────────────────────────

/** All issued verdicts, newest first, with their covered-order snapshots. */
export async function listVerdicts(): Promise<Verdict[]> {
    const supabase = await createSupabaseAdminClient();
    const { data, error } = await supabase
        .from("rw_verdicts")
        .select(VERDICT_SELECT)
        .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return (data ?? []).map(mapVerdictFromDb);
}

/** A single verdict by its ref (e.g. "RW26-V-0007"). */
export async function getVerdictByRef(ref: string): Promise<Verdict | undefined> {
    const supabase = await createSupabaseAdminClient();
    const { data, error } = await supabase
        .from("rw_verdicts")
        .select(VERDICT_SELECT)
        .eq("verdict_ref", ref)
        .maybeSingle();

    if (error) throw new Error(error.message);
    return data ? mapVerdictFromDb(data) : undefined;
}

/**
 * A verdict plus the *live* orders it covers (with current status, pickup token,
 * delivery stamp) — for the verdict detail / pickup-desk page.
 */
export async function getVerdictDetail(
    ref: string
): Promise<{ verdict: Verdict; orders: Order[] } | undefined> {
    const verdict = await getVerdictByRef(ref);
    if (!verdict) return undefined;

    const coveredIds = new Set(verdict.orders.map((o) => o.orderId));
    const orders = (await listOrders()).filter((o) => coveredIds.has(o.id));
    return { verdict, orders };
}

/**
 * Orders eligible to be bundled into a new verdict: fully paid AND not already
 * locked into any verdict. The set of locked order ids comes from the junction
 * table (UNIQUE(order_id) means presence === locked).
 */
export async function getEligibleOrdersForVerdict(): Promise<Order[]> {
    const supabase = await createSupabaseAdminClient();
    const [orders, locked] = await Promise.all([
        listOrders(),
        supabase.from("rw_verdict_orders").select("order_id"),
    ]);

    if (locked.error) throw new Error(locked.error.message);
    const lockedIds = new Set((locked.data ?? []).map((r) => r.order_id));

    return orders.filter((o) => isFullyPaid(o) && !lockedIds.has(o.id));
}

// ─── Write ────────────────────────────────────────────────────────────────────

export interface CreateVerdictInput {
    orderIds: string[];
    note?: string | null;
}

/**
 * Issue a verdict over the given orders. Admin-only. Validates eligibility
 * server-side, freezes the snapshot, locks + advances the orders, and broadcasts
 * the in_production email to each customer.
 */
export async function createVerdict(
    input: CreateVerdictInput
): Promise<ServiceResult<Verdict>> {
    const admin = await resolveActingStaff(true);
    if (!admin) {
        return { success: false, error: "Only administrators can issue a verdict." };
    }

    const requestedIds = [...new Set(input.orderIds)];
    if (requestedIds.length === 0) {
        return { success: false, error: "Select at least one fully-paid order." };
    }

    // Re-validate eligibility from source of truth (don't trust the client).
    const eligible = await getEligibleOrdersForVerdict();
    const eligibleById = new Map(eligible.map((o) => [o.id, o]));

    const chosen: Order[] = [];
    for (const id of requestedIds) {
        const order = eligibleById.get(id);
        if (!order) {
            return {
                success: false,
                error:
                    "One or more selected orders are no longer eligible (not fully paid, or already in a verdict). Refresh and try again.",
            };
        }
        chosen.push(order);
    }

    const manifest = buildManifest(chosen);
    const totalAmount = chosen.reduce((sum, o) => sum + o.totalAmount, 0);
    const totalUnits = manifest.reduce((sum, m) => sum + m.quantity, 0);
    const settings = await getSettings();

    const supabase = await createSupabaseAdminClient();

    // 1. Insert the verdict header (verdict_ref defaults via generate_verdict_ref()).
    const { data: verdictRow, error: verdictErr } = await supabase
        .from("rw_verdicts")
        .insert({
            status: "active",
            issued_by_profile_id: admin.profileId,
            issued_by_name: admin.name,
            issued_by_email: admin.email,
            note: input.note ?? null,
            manifest,
            total_amount: totalAmount,
            total_units: totalUnits,
            order_count: chosen.length,
            bank_name: settings.bank_name || null,
            bank_account_name: settings.bank_account_name || null,
            bank_account_number: settings.bank_account_number || null,
        })
        .select("id")
        .single();

    if (verdictErr || !verdictRow) {
        return { success: false, error: verdictErr?.message ?? "Failed to create verdict." };
    }

    const verdictId = verdictRow.id as string;

    // 2. Lock the orders into the verdict. UNIQUE(order_id) rejects any order
    //    that was bundled concurrently — clean up the header if that happens.
    const { error: junctionErr } = await supabase.from("rw_verdict_orders").insert(
        chosen.map((o) => ({
            verdict_id: verdictId,
            order_id: o.id,
            order_ref: o.orderRef,
            customer_name: o.customerName,
            customer_email: o.customerEmail,
            total_amount: o.totalAmount,
        }))
    );

    if (junctionErr) {
        await supabase.from("rw_verdicts").delete().eq("id", verdictId);
        const conflict = junctionErr.code === "23505";
        return {
            success: false,
            error: conflict
                ? "One of the selected orders was just bundled into another verdict. Refresh and try again."
                : junctionErr.message,
        };
    }

    // 3. Advance each order to in_production and broadcast the customer email.
    await supabase
        .from("rw_orders")
        .update({ status: "in_production" })
        .in(
            "id",
            chosen.map((o) => o.id)
        );

    for (const o of chosen) {
        await enqueueOrderStatusEmail(o.id, "in_production", o.customerEmail);
    }

    revalidateTag("orders", "max");
    revalidateTag("verdicts", "max");

    // 4. Return the full, freshly-persisted verdict.
    const { data: full, error: readErr } = await supabase
        .from("rw_verdicts")
        .select(VERDICT_SELECT)
        .eq("id", verdictId)
        .single();

    if (readErr || !full) {
        return { success: false, error: "Verdict issued but could not be re-read." };
    }

    return { success: true, data: mapVerdictFromDb(full) };
}

/**
 * Mark a verdict fulfilled — production is complete. Allowed for admins AND
 * moderators. Generates a personal pickup code for every covered order, moves
 * those orders to ready_for_pickup, and emails each customer their code.
 */
export async function fulfilVerdict(
    verdictId: string
): Promise<ServiceResult<Verdict>> {
    const staff = await resolveActingStaff();
    if (!staff) {
        return { success: false, error: "You don't have permission to do this." };
    }

    const supabase = await createSupabaseAdminClient();

    const { data: verdictRow, error: vErr } = await supabase
        .from("rw_verdicts")
        .select("id, status")
        .eq("id", verdictId)
        .maybeSingle();

    if (vErr) return { success: false, error: vErr.message };
    if (!verdictRow) return { success: false, error: "Verdict not found." };
    if (verdictRow.status !== "active") {
        return { success: false, error: `Verdict is already ${verdictRow.status}.` };
    }

    // Covered orders (live — they're locked to this verdict).
    const { data: junctions, error: jErr } = await supabase
        .from("rw_verdict_orders")
        .select("order_id, customer_email")
        .eq("verdict_id", verdictId);

    if (jErr) return { success: false, error: jErr.message };
    const rows = junctions ?? [];

    // Give each order a fresh pickup code and advance it to ready_for_pickup.
    for (const row of rows) {
        const token = generatePickupToken();
        await supabase
            .from("rw_orders")
            .update({ status: "ready_for_pickup", pickup_token: token })
            .eq("id", row.order_id);
        await enqueueOrderStatusEmail(
            row.order_id,
            "ready_for_pickup",
            row.customer_email ?? undefined
        );
    }

    // Flip the verdict to fulfilled with the actor stamp.
    const { error: updErr } = await supabase
        .from("rw_verdicts")
        .update({
            status: "fulfilled",
            fulfilled_at: new Date().toISOString(),
            fulfilled_by_profile_id: staff.profileId,
            fulfilled_by_name: staff.name,
            fulfilled_by_email: staff.email,
        })
        .eq("id", verdictId);

    if (updErr) return { success: false, error: updErr.message };

    revalidateTag("orders", "max");
    revalidateTag("verdicts", "max");

    const { data: full } = await supabase
        .from("rw_verdicts")
        .select(VERDICT_SELECT)
        .eq("id", verdictId)
        .single();

    return { success: true, data: full ? mapVerdictFromDb(full) : undefined };
}

/**
 * All orders currently awaiting collection (ready_for_pickup) — the pickup desk
 * worklist. Visible to admins and moderators.
 */
export async function listPickupOrders(): Promise<Order[]> {
    const orders = await listOrders();
    return orders.filter((o) => o.status === "ready_for_pickup");
}

export interface VerdictsOverview {
    /** Fully-paid orders not yet bundled into any verdict (ready to bundle). */
    eligibleCount: number;
    /** Orders locked into an active verdict, being produced. */
    inProductionCount: number;
    /** Orders collected by their customers. */
    deliveredCount: number;
    /** Orders awaiting collection — also the pickup-desk worklist. */
    pickupOrders: Order[];
}

/**
 * System-wide verdict/fulfilment snapshot for the Verdicts tab — computed from a
 * single orders read + the lock table (avoids several round-trips).
 */
export async function getVerdictsOverview(): Promise<VerdictsOverview> {
    const supabase = await createSupabaseAdminClient();
    const [orders, locked] = await Promise.all([
        listOrders(),
        supabase.from("rw_verdict_orders").select("order_id"),
    ]);
    if (locked.error) throw new Error(locked.error.message);
    const lockedIds = new Set((locked.data ?? []).map((r) => r.order_id));

    return {
        eligibleCount: orders.filter((o) => isFullyPaid(o) && !lockedIds.has(o.id))
            .length,
        inProductionCount: orders.filter((o) => o.status === "in_production").length,
        deliveredCount: orders.filter((o) => o.status === "delivered").length,
        pickupOrders: orders.filter((o) => o.status === "ready_for_pickup"),
    };
}

export interface MarkDeliveredInput {
    orderId: string;
    token: string; // pickup code the customer presented at the desk
}

/**
 * Hand an order over to its customer. Admin/moderator only. The presented pickup
 * code must match the one emailed to the customer — this is the accountability
 * gate that confirms both a legitimate staff member and the rightful collector.
 */
export async function markOrderDelivered(
    input: MarkDeliveredInput
): Promise<ServiceResult<Order>> {
    const staff = await resolveActingStaff();
    if (!staff) {
        return { success: false, error: "You don't have permission to do this." };
    }

    const presented = normalizeToken(input.token ?? "");
    if (!presented) {
        return { success: false, error: "Enter the customer's pickup code." };
    }

    const supabase = await createSupabaseAdminClient();
    const { data: order, error: oErr } = await supabase
        .from("rw_orders")
        .select("id, status, pickup_token, customer_email")
        .eq("id", input.orderId)
        .maybeSingle();

    if (oErr) return { success: false, error: oErr.message };
    if (!order) return { success: false, error: "Order not found." };
    if (order.status === "delivered") {
        return { success: false, error: "This order was already collected." };
    }
    if (order.status !== "ready_for_pickup") {
        return { success: false, error: "This order is not ready for pickup yet." };
    }
    if (!order.pickup_token || normalizeToken(order.pickup_token) !== presented) {
        return {
            success: false,
            error: "That pickup code doesn't match. Ask the customer to check their email.",
        };
    }

    const { error: updErr } = await supabase
        .from("rw_orders")
        .update({
            status: "delivered",
            delivered_at: new Date().toISOString(),
            delivered_by_name: staff.name,
            delivered_by_email: staff.email,
        })
        .eq("id", input.orderId);

    if (updErr) return { success: false, error: updErr.message };

    await enqueueOrderStatusEmail(
        input.orderId,
        "delivered",
        order.customer_email ?? undefined
    );

    revalidateTag("orders", "max");
    revalidateTag("verdicts", "max");

    const { data: full } = await supabase
        .from("rw_orders")
        .select(`*, items:rw_order_items ( * ), payments:rw_payments ( * )`)
        .eq("id", input.orderId)
        .single();

    return {
        success: true,
        data: full ? mapOrderFromDb(full) : undefined,
    };
}
