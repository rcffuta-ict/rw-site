import { createSupabaseServerClient } from "@/lib/supabase/server";
import { resolveAdminRole } from "@/lib/auth/roles";
import { getSponsorBySlug, listSponsorLeads } from "@/lib/services/sponsors.service";

function csvEscape(v: string | null | undefined): string {
    const s = (v ?? "").replaceAll('"', '""');
    return `"${s}"`;
}

/**
 * GET /api/admin/sponsors/[slug]/export
 *
 * Streams the sponsor's effective leads (everyone NOT opted out) as CSV.
 * Guarded by the admin session — middleware only matches /admin/*, so /api/*
 * routes must verify the session themselves (same pattern as /api/admin/me).
 */
export async function GET(
    _req: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;

    const sponsor = await getSponsorBySlug(slug);
    if (!sponsor) {
        return new Response("Unknown sponsor", { status: 404 });
    }

    // ── Auth ──
    const supabase = await createSupabaseServerClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user || !(await resolveAdminRole(user.id))) {
        return new Response("Unauthorized", { status: 401 });
    }

    // ── Build CSV (exclude opted-out) ──
    const leads = (await listSponsorLeads(slug)).filter((l) => !l.optedOut);

    const header = [
        "full_name",
        "email",
        "whatsapp",
        "skill",
        "source",
        "signed_up",
        "auto_included",
        "added_at",
    ].join(",");

    const rows = leads.map((l) => {
        const source = [l.signedUp ? "sign-up" : null, l.autoIncluded ? "customer" : null]
            .filter(Boolean)
            .join(" + ");
        return [
            csvEscape(l.fullName),
            csvEscape(l.email),
            csvEscape(l.whatsapp),
            csvEscape(l.skill),
            csvEscape(source),
            l.signedUp ? "yes" : "no",
            l.autoIncluded ? "yes" : "no",
            csvEscape(l.createdAt),
        ].join(",");
    });

    const body = [header, ...rows].join("\n");
    const filename = `${slug}_leads_${new Date().toISOString().slice(0, 10)}.csv`;

    return new Response(body, {
        headers: {
            "content-type": "text/csv; charset=utf-8",
            "content-disposition": `attachment; filename="${filename}"`,
        },
    });
}
