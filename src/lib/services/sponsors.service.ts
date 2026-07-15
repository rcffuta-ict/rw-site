"use server";

// ─── Sponsors Service — Supabase ──────────────────────────────────────────────
// Admin-managed sponsor profiles (rw_sponsors) + lead collection for the sponsors
// that opt into it (rw_sponsor_leads). See docs/sponsors.sql and
// docs/sponsor-leads.sql. Data-collecting sponsors support opt-in sign-ups,
// admin-initiated auto-include of confirmed customers, and opt-out by email/phone.

import { z } from "zod";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { listOrders } from "@/lib/services/orders.service";
import { CONFIRMED_ORDER_STATUSES } from "@/lib/config";
import type { ServiceResult } from "@/lib/data/types";
import { revalidatePath } from "next/cache";

const SPONSORS = "rw_sponsors";
const LEADS = "rw_sponsor_leads";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Sponsor {
    id: string;
    slug: string;
    name: string;
    tagline: string;
    description: string;
    url: string;
    logoUrl: string;
    brandColor: string;
    courses: string[];
    collectsData: boolean;
    active: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface SponsorInput {
    slug: string;
    name: string;
    tagline?: string;
    description?: string;
    url?: string;
    logoUrl?: string;
    brandColor?: string;
    courses?: string[];
    collectsData?: boolean;
    active?: boolean;
}

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
    consentText: string;
}

export interface AutoIncludeResult {
    total: number;
    added: number;
    updated: number;
}

export interface OptOutResult {
    matched: number;
}

// ─── Row mappers ──────────────────────────────────────────────────────────────

/* eslint-disable @typescript-eslint/no-explicit-any */
function mapSponsor(row: any): Sponsor {
    return {
        id: row.id,
        slug: row.slug,
        name: row.name,
        tagline: row.tagline ?? "",
        description: row.description ?? "",
        url: row.url ?? "",
        logoUrl: row.logo_url ?? "",
        brandColor: row.brand_color ?? "#1B4DF5",
        courses: Array.isArray(row.courses) ? row.courses : [],
        collectsData: !!row.collects_data,
        active: !!row.active,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
}

function mapLead(row: any): SponsorLead {
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
/* eslint-enable @typescript-eslint/no-explicit-any */

const normalizeEmail = (email: string) => email.trim().toLowerCase();

/** Last 10 digits — robust for comparing NG numbers stored in varied formats. */
function phoneKey(raw: string): string {
    const digits = (raw || "").replace(/\D/g, "");
    return digits.slice(-10);
}

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

// ═══════════════════════════════════════════════════════════════════════════
// Sponsor CRUD
// ═══════════════════════════════════════════════════════════════════════════

export async function listSponsors(activeOnly = false): Promise<Sponsor[]> {
    const supabase = await createSupabaseAdminClient();
    let query = supabase.from(SPONSORS).select("*").order("created_at", { ascending: true });
    if (activeOnly) query = query.eq("active", true);
    const { data, error } = await query;
    if (error) throw new Error(`Failed to load sponsors: ${error.message}`);
    return (data ?? []).map(mapSponsor);
}

export async function getSponsorBySlug(slug: string): Promise<Sponsor | undefined> {
    const supabase = await createSupabaseAdminClient();
    const { data } = await supabase.from(SPONSORS).select("*").eq("slug", slug).maybeSingle();
    return data ? mapSponsor(data) : undefined;
}

export async function getSponsorById(id: string): Promise<Sponsor | undefined> {
    const supabase = await createSupabaseAdminClient();
    const { data } = await supabase.from(SPONSORS).select("*").eq("id", id).maybeSingle();
    return data ? mapSponsor(data) : undefined;
}

const slugSchema = z
    .string()
    .trim()
    .min(2, "Slug is too short.")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens only.");

function toDbSponsor(input: Partial<SponsorInput>): Record<string, unknown> {
    const patch: Record<string, unknown> = {};
    if (input.slug !== undefined) patch.slug = input.slug.trim().toLowerCase();
    if (input.name !== undefined) patch.name = input.name.trim();
    if (input.tagline !== undefined) patch.tagline = input.tagline;
    if (input.description !== undefined) patch.description = input.description;
    if (input.url !== undefined) patch.url = input.url.trim();
    if (input.logoUrl !== undefined) patch.logo_url = input.logoUrl.trim();
    if (input.brandColor !== undefined) patch.brand_color = input.brandColor.trim();
    if (input.courses !== undefined) patch.courses = input.courses;
    if (input.collectsData !== undefined) patch.collects_data = input.collectsData;
    if (input.active !== undefined) patch.active = input.active;
    return patch;
}

export async function createSponsor(input: SponsorInput): Promise<ServiceResult<Sponsor>> {
    const slugCheck = slugSchema.safeParse(input.slug);
    if (!slugCheck.success) return { success: false, error: slugCheck.error.issues[0]?.message };
    if (!input.name?.trim()) return { success: false, error: "Name is required." };

    const supabase = await createSupabaseAdminClient();
    const { data, error } = await supabase
        .from(SPONSORS)
        .insert(toDbSponsor(input))
        .select("*")
        .single();

    if (error) {
        if (error.code === "23505")
            return { success: false, error: "A sponsor with that slug already exists." };
        return { success: false, error: error.message };
    }
    revalidatePaths(data.slug);
    return { success: true, data: mapSponsor(data) };
}

export async function updateSponsor(
    id: string,
    patch: Partial<SponsorInput>
): Promise<ServiceResult<Sponsor>> {
    if (patch.slug !== undefined) {
        const slugCheck = slugSchema.safeParse(patch.slug);
        if (!slugCheck.success)
            return { success: false, error: slugCheck.error.issues[0]?.message };
    }

    const supabase = await createSupabaseAdminClient();
    const { data, error } = await supabase
        .from(SPONSORS)
        .update(toDbSponsor(patch))
        .eq("id", id)
        .select("*")
        .single();

    if (error) {
        if (error.code === "23505")
            return { success: false, error: "A sponsor with that slug already exists." };
        return { success: false, error: error.message };
    }
    revalidatePaths(data.slug);
    return { success: true, data: mapSponsor(data) };
}

export async function deleteSponsor(id: string): Promise<ServiceResult> {
    const supabase = await createSupabaseAdminClient();
    const existing = await getSponsorById(id);
    const { error } = await supabase.from(SPONSORS).delete().eq("id", id);
    if (error) return { success: false, error: error.message };
    if (existing) revalidatePaths(existing.slug);
    return { success: true };
}

function revalidatePaths(slug?: string) {
    revalidatePath("/");
    revalidatePath("/admin/sponsors");
    if (slug) {
        revalidatePath(`/sponsors/${slug}`);
        revalidatePath(`/admin/sponsors/${slug}`);
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// Lead collection
// ═══════════════════════════════════════════════════════════════════════════

const registerSchema = z.object({
    fullName: z.string().trim().min(2, "Please enter your full name."),
    email: z.string().trim().toLowerCase().email("Enter a valid email address."),
    whatsapp: z
        .string()
        .trim()
        .min(7, "Enter a valid WhatsApp number.")
        .regex(/^[0-9+()\-\s]+$/, "Enter a valid WhatsApp number."),
    skill: z.string().trim().max(120).optional().nullable(),
    consent: z.literal(true, { message: "You must agree to the consent statement to sign up." }),
    consentText: z.string().trim().min(1),
});

export async function registerSponsorLead(
    slug: string,
    input: RegisterSponsorLeadInput
): Promise<ServiceResult<SponsorLead>> {
    const sponsor = await getSponsorBySlug(slug);
    if (!sponsor || !sponsor.active) return { success: false, error: "Unknown sponsor." };
    if (!sponsor.collectsData)
        return { success: false, error: "This sponsor is not collecting sign-ups." };

    const parsed = registerSchema.safeParse(input);
    if (!parsed.success)
        return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid details." };
    const v = parsed.data;

    const supabase = await createSupabaseAdminClient();
    const { data, error } = await supabase
        .from(LEADS)
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
    return { success: true, data: mapLead(data) };
}

/**
 * Opt out by email OR phone (auto-detected).
 *  - email  → suppress that email.
 *  - phone  → resolve the person's email(s) via their confirmed orders (matched on
 *             last-10-digits) and via any existing lead whose WhatsApp matches, then
 *             suppress each. A matched order-email that isn't a lead yet is inserted
 *             as a suppression row so a later auto-include respects it.
 */
export async function optOutSponsorLead(
    slug: string,
    identifier: string
): Promise<ServiceResult<OptOutResult>> {
    const sponsor = await getSponsorBySlug(slug);
    if (!sponsor) return { success: false, error: "Unknown sponsor." };

    const raw = (identifier || "").trim();
    if (!raw) return { success: false, error: "Enter your email or phone number." };

    const supabase = await createSupabaseAdminClient();

    // Collect the set of lead emails to suppress, plus any new suppression rows.
    const emailsToSuppress = new Set<string>();
    const newRows: { email: string; fullName: string }[] = [];

    if (isEmail(raw)) {
        emailsToSuppress.add(normalizeEmail(raw));
    } else {
        const key = phoneKey(raw);
        if (key.length < 7) return { success: false, error: "Enter a valid email or phone number." };

        // Existing leads for this sponsor whose WhatsApp matches.
        const { data: leadRows } = await supabase
            .from(LEADS)
            .select("email, whatsapp")
            .eq("sponsor_slug", slug);
        for (const r of leadRows ?? []) {
            if (r.whatsapp && phoneKey(r.whatsapp) === key) emailsToSuppress.add(r.email);
        }

        // Confirmed customers with that phone → suppress their email.
        const orders = await listOrders();
        for (const o of orders) {
            if (phoneKey(o.customerPhone) !== key) continue;
            const email = normalizeEmail(o.customerEmail);
            if (!email) continue;
            emailsToSuppress.add(email);
            newRows.push({ email, fullName: o.customerName });
        }
    }

    if (emailsToSuppress.size === 0) {
        return { success: true, data: { matched: 0 } };
    }

    // Suppress existing lead rows.
    const { error: updErr } = await supabase
        .from(LEADS)
        .update({ opted_out: true })
        .eq("sponsor_slug", slug)
        .in("email", Array.from(emailsToSuppress));
    if (updErr) return { success: false, error: updErr.message };

    // Insert suppression rows for emails that have no lead yet (upsert is safe:
    // existing rows were already handled above and won't be clobbered on name).
    if (newRows.length > 0) {
        const { data: present } = await supabase
            .from(LEADS)
            .select("email")
            .eq("sponsor_slug", slug)
            .in("email", newRows.map((r) => r.email));
        const have = new Set((present ?? []).map((r) => r.email));
        const inserts = newRows
            .filter((r) => !have.has(r.email))
            .map((r) => ({
                sponsor_slug: slug,
                email: r.email,
                full_name: r.fullName,
                opted_out: true,
            }));
        if (inserts.length > 0) {
            await supabase.from(LEADS).insert(inserts);
        }
    }

    // For direct email opt-out where no lead exists yet, create a suppression row.
    if (isEmail(raw)) {
        const email = normalizeEmail(raw);
        const { data: exists } = await supabase
            .from(LEADS)
            .select("id")
            .eq("sponsor_slug", slug)
            .eq("email", email)
            .maybeSingle();
        if (!exists) {
            await supabase.from(LEADS).insert({
                sponsor_slug: slug,
                email,
                full_name: "Opted-out subscriber",
                opted_out: true,
            });
        }
    }

    return { success: true, data: { matched: emailsToSuppress.size } };
}

export async function autoIncludeConfirmedCustomers(
    slug: string
): Promise<ServiceResult<AutoIncludeResult>> {
    const sponsor = await getSponsorBySlug(slug);
    if (!sponsor) return { success: false, error: "Unknown sponsor." };

    const supabase = await createSupabaseAdminClient();

    const orders = await listOrders();
    const customers = new Map<string, { name: string; phone: string }>();
    for (const o of orders) {
        if (!CONFIRMED_ORDER_STATUSES.includes(o.status)) continue;
        const email = normalizeEmail(o.customerEmail);
        if (!email || customers.has(email)) continue;
        customers.set(email, { name: o.customerName, phone: o.customerPhone });
    }

    if (customers.size === 0) return { success: true, data: { total: 0, added: 0, updated: 0 } };

    const { data: existingRows, error: readErr } = await supabase
        .from(LEADS)
        .select("email, full_name, whatsapp")
        .eq("sponsor_slug", slug);
    if (readErr) return { success: false, error: readErr.message };

    const existing = new Map(
        (existingRows ?? []).map((r) => [
            r.email as string,
            { fullName: r.full_name as string, whatsapp: r.whatsapp as string | null },
        ])
    );

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
        .from(LEADS)
        .upsert(payload, { onConflict: "sponsor_slug,email" });
    if (upsertErr) return { success: false, error: upsertErr.message };

    let added = 0;
    for (const email of customers.keys()) if (!existing.has(email)) added += 1;

    revalidatePath(`/admin/sponsors/${slug}`);
    return {
        success: true,
        data: { total: customers.size, added, updated: customers.size - added },
    };
}

export async function listSponsorLeads(slug: string): Promise<SponsorLead[]> {
    const supabase = await createSupabaseAdminClient();
    const { data, error } = await supabase
        .from(LEADS)
        .select("*")
        .eq("sponsor_slug", slug)
        .order("created_at", { ascending: false });
    if (error) throw new Error(`Failed to load sponsor leads: ${error.message}`);
    return (data ?? []).map(mapLead);
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
