"use server";

// ─── Sponsor Leads Service — Supabase ─────────────────────────────────────────
// Lead collection for sponsor partnerships (e.g. Skybil). Confirmed customers are
// auto-included by an admin-initiated import; anyone can sign up via the public
// page, and anyone can opt out. See docs/sponsor-leads.sql for the schema.

import { z } from "zod";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { listOrders } from "@/lib/services/orders.service";
import { CONFIRMED_ORDER_STATUSES, getSponsor } from "@/lib/config";
import type { ServiceResult } from "@/lib/data/types";
import { revalidatePath } from "next/cache";

const TABLE = "rw_sponsor_leads";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SponsorLead {
    id: string;
    sponsorSlug: string;
    email: string;
    fullName: string;
    whatsapp: string | null;
    skill: string | null;
    signedUp: boolean;
    autoIncluded: boolean;
    optedOut: boolean;
    consent: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface SponsorStats {
    /** Effective leads eligible for export (not opted out). */
    effective: number;
    signedUp: number;
    autoIncluded: number;
    optedOut: number;
}

export interface RegisterSponsorLeadInput {
    fullName: string;
    email: string;
    whatsapp: string;
    skill?: string | null;
    consent: boolean;
    /** Snapshot of the exact consent wording the person accepted. */
    consentText: string;
}

export interface AutoIncludeResult {
    total: number;
    added: number;
    updated: number;
}

// ─── DB row mapper ────────────────────────────────────────────────────────────

interface SponsorLeadRow {
    id: string;
    sponsor_slug: string;
    email: string;
    full_name: string;
    whatsapp: string | null;
    skill: string | null;
    signed_up: boolean;
    auto_included: boolean;
    opted_out: boolean;
    consent: boolean;
    created_at: string;
    updated_at: string;
}

function mapLead(row: SponsorLeadRow): SponsorLead {
    return {
        id: row.id,
        sponsorSlug: row.sponsor_slug,
        email: row.email,
        fullName: row.full_name,
        whatsapp: row.whatsapp,
        skill: row.skill,
        signedUp: row.signed_up,
        autoIncluded: row.auto_included,
        optedOut: row.opted_out,
        consent: row.consent,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
}

const normalizeEmail = (email: string) => email.trim().toLowerCase();

// ─── Validation ───────────────────────────────────────────────────────────────

const registerSchema = z.object({
    fullName: z.string().trim().min(2, "Please enter your full name."),
    email: z.string().trim().toLowerCase().email("Enter a valid email address."),
    whatsapp: z
        .string()
        .trim()
        .min(7, "Enter a valid WhatsApp number.")
        .regex(/^[0-9+()\-\s]+$/, "Enter a valid WhatsApp number."),
    skill: z.string().trim().max(120).optional().nullable(),
    consent: z.literal(true, {
        message: "You must agree to the consent statement to sign up.",
    }),
    consentText: z.string().trim().min(1),
});

// ─── Public: register a sign-up ───────────────────────────────────────────────

export async function registerSponsorLead(
    slug: string,
    input: RegisterSponsorLeadInput
): Promise<ServiceResult<SponsorLead>> {
    const sponsor = getSponsor(slug);
    if (!sponsor) return { success: false, error: "Unknown sponsor." };

    const parsed = registerSchema.safeParse(input);
    if (!parsed.success) {
        return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid details." };
    }
    const v = parsed.data;

    const supabase = await createSupabaseAdminClient();

    // Upsert by (sponsor_slug, email). We omit auto_included so an existing
    // auto-included customer keeps that flag; signing up also clears any prior
    // opt-out (re-consent). Columns not listed are preserved on update.
    const { data, error } = await supabase
        .from(TABLE)
        .upsert(
            {
                sponsor_slug: slug,
                email: normalizeEmail(v.email),
                full_name: v.fullName,
                whatsapp: v.whatsapp,
                skill: v.skill || null,
                signed_up: true,
                opted_out: false,
                consent: true,
                consent_text: v.consentText,
            },
            { onConflict: "sponsor_slug,email" }
        )
        .select("*")
        .single();

    if (error) return { success: false, error: error.message };
    return { success: true, data: mapLead(data as SponsorLeadRow) };
}

// ─── Public: opt out ──────────────────────────────────────────────────────────

export async function optOutSponsorLead(
    slug: string,
    email: string
): Promise<ServiceResult> {
    const sponsor = getSponsor(slug);
    if (!sponsor) return { success: false, error: "Unknown sponsor." };

    const clean = normalizeEmail(email);
    if (!z.string().email().safeParse(clean).success) {
        return { success: false, error: "Enter a valid email address." };
    }

    const supabase = await createSupabaseAdminClient();

    const { data: existing } = await supabase
        .from(TABLE)
        .select("id")
        .eq("sponsor_slug", slug)
        .eq("email", clean)
        .maybeSingle();

    if (existing) {
        const { error } = await supabase
            .from(TABLE)
            .update({ opted_out: true })
            .eq("id", existing.id);
        if (error) return { success: false, error: error.message };
    } else {
        // Record the opt-out even if we have no record yet, so a later
        // auto-include of confirmed customers respects it.
        const { error } = await supabase.from(TABLE).insert({
            sponsor_slug: slug,
            email: clean,
            full_name: "Opted-out subscriber",
            opted_out: true,
        });
        if (error) return { success: false, error: error.message };
    }

    return { success: true };
}

// ─── Admin: auto-include confirmed customers ──────────────────────────────────

export async function autoIncludeConfirmedCustomers(
    slug: string
): Promise<ServiceResult<AutoIncludeResult>> {
    const sponsor = getSponsor(slug);
    if (!sponsor) return { success: false, error: "Unknown sponsor." };

    const supabase = await createSupabaseAdminClient();

    // 1. Confirmed customers, deduped by email (listOrders is newest-first).
    const orders = await listOrders();
    const customers = new Map<string, { name: string; phone: string }>();
    for (const o of orders) {
        if (!CONFIRMED_ORDER_STATUSES.includes(o.status)) continue;
        const email = normalizeEmail(o.customerEmail);
        if (!email || customers.has(email)) continue;
        customers.set(email, { name: o.customerName, phone: o.customerPhone });
    }

    if (customers.size === 0) {
        return { success: true, data: { total: 0, added: 0, updated: 0 } };
    }

    // 2. Existing leads for this sponsor, to preserve their own name/whatsapp and
    //    know added vs updated.
    const { data: existingRows, error: readErr } = await supabase
        .from(TABLE)
        .select("email, full_name, whatsapp")
        .eq("sponsor_slug", slug);
    if (readErr) return { success: false, error: readErr.message };

    const existing = new Map(
        (existingRows ?? []).map((r) => [
            r.email as string,
            { fullName: r.full_name as string, whatsapp: r.whatsapp as string | null },
        ])
    );

    // 3. Merge in JS, then upsert. We only fill name/whatsapp when missing, and we
    //    omit signed_up/consent/opted_out so those are preserved on update.
    const payload = Array.from(customers.entries()).map(([email, c]) => {
        const prior = existing.get(email);
        return {
            sponsor_slug: slug,
            email,
            full_name: prior?.fullName || c.name,
            whatsapp: prior?.whatsapp || c.phone,
            auto_included: true,
        };
    });

    const { error: upsertErr } = await supabase
        .from(TABLE)
        .upsert(payload, { onConflict: "sponsor_slug,email" });
    if (upsertErr) return { success: false, error: upsertErr.message };

    let added = 0;
    for (const email of customers.keys()) {
        if (!existing.has(email)) added += 1;
    }

    revalidatePath(`/admin/sponsors/${slug}`);

    return {
        success: true,
        data: {
            total: customers.size,
            added,
            updated: customers.size - added,
        },
    };
}

// ─── Admin: list & stats ──────────────────────────────────────────────────────

export async function listSponsorLeads(slug: string): Promise<SponsorLead[]> {
    const supabase = await createSupabaseAdminClient();
    const { data, error } = await supabase
        .from(TABLE)
        .select("*")
        .eq("sponsor_slug", slug)
        .order("created_at", { ascending: false });

    if (error) throw new Error(`Failed to load sponsor leads: ${error.message}`);
    return (data ?? []).map((r) => mapLead(r as SponsorLeadRow));
}

export async function getSponsorStats(slug: string): Promise<SponsorStats> {
    const leads = await listSponsorLeads(slug);
    return {
        effective: leads.filter((l) => !l.optedOut).length,
        signedUp: leads.filter((l) => l.signedUp).length,
        autoIncluded: leads.filter((l) => l.autoIncluded).length,
        optedOut: leads.filter((l) => l.optedOut).length,
    };
}
