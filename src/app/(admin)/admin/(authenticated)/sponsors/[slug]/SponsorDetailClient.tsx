"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/forms/Button";
import { SponsorLogo } from "@/components/common/SponsorLogo";
import {
    autoIncludeConfirmedCustomers,
    type Sponsor,
    type SponsorLead,
    type SponsorStats,
} from "@/lib/services/sponsors.service";
import { deleteSponsorAction } from "@/app/actions/sponsors";

interface Props {
    sponsor: Sponsor;
    leads: SponsorLead[];
    stats: SponsorStats;
}

type Tab = "auto" | "signups";

function fmtDate(iso: string): string {
    try {
        return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
    } catch {
        return iso;
    }
}

export function SponsorDetailClient({ sponsor, leads, stats }: Props) {
    const router = useRouter();
    const [tab, setTab] = useState<Tab>("auto");
    const [importing, setImporting] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const autoIncluded = useMemo(() => leads.filter((l) => l.autoIncluded), [leads]);
    const signUps = useMemo(() => leads.filter((l) => l.signedUp), [leads]);

    async function handleAutoInclude() {
        setImporting(true);
        try {
            const result = await autoIncludeConfirmedCustomers(sponsor.slug);
            if (result.success && result.data) {
                const { total, added } = result.data;
                toast.success(
                    total === 0
                        ? "No confirmed customers to include yet."
                        : `Auto-included ${total} customer${total === 1 ? "" : "s"} (${added} new).`
                );
                router.refresh();
            } else {
                toast.error(result.error || "Failed to auto-include customers.");
            }
        } catch {
            toast.error("Network error. Please try again.");
        } finally {
            setImporting(false);
        }
    }

    async function handleDelete() {
        if (!confirm(`Delete "${sponsor.name}"? This removes its page and all collected leads. This cannot be undone.`)) return;
        setDeleting(true);
        try {
            const result = await deleteSponsorAction(sponsor.id);
            if (result.success) {
                toast.success("Sponsor deleted.");
                router.push("/admin/sponsors");
                router.refresh();
            } else {
                toast.error(result.error || "Failed to delete.");
                setDeleting(false);
            }
        } catch {
            toast.error("Network error. Please try again.");
            setDeleting(false);
        }
    }

    const rows = tab === "auto" ? autoIncluded : signUps;

    return (
        <div className="max-w-6xl">
            <Link href="/admin/sponsors" className="inline-flex items-center gap-1.5 text-xs font-semibold text-rw-muted hover:text-rw-ink mb-5">
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                All sponsors
            </Link>

            {/* ── Profile header ── */}
            <header className="rw-card p-6 flex flex-col sm:flex-row sm:items-center gap-5 mb-6">
                <div className="shrink-0 rounded-2xl p-3" style={{ backgroundColor: sponsor.brandColor }}>
                    <SponsorLogo src={sponsor.logoUrl} alt={`${sponsor.name} logo`} size={48} className="h-12 w-12 rounded-xl object-contain" />
                </div>
                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                        <h1 className="font-display font-black text-2xl text-rw-ink">{sponsor.name}</h1>
                        {!sponsor.active && (
                            <span className="text-[10px] font-bold uppercase tracking-wide rounded-full bg-rw-bg-alt text-rw-muted px-2 py-0.5">Inactive</span>
                        )}
                        <span className="text-[10px] font-bold uppercase tracking-wide rounded-full px-2 py-0.5"
                            style={{ backgroundColor: `${sponsor.brandColor}18`, color: sponsor.brandColor }}>
                            {sponsor.collectsData ? "Collects data" : "Showcase only"}
                        </span>
                    </div>
                    <p className="text-sm text-rw-muted">{sponsor.tagline}</p>
                    <div className="flex items-center gap-3 mt-0.5">
                        <Link href={`/sponsors/${sponsor.slug}`} target="_blank" className="text-xs font-semibold text-rw-crimson hover:underline">
                            View public page ↗
                        </Link>
                        {sponsor.url && (
                            <a href={sponsor.url} target="_blank" rel="noreferrer" className="text-xs font-semibold text-rw-muted hover:text-rw-ink">
                                {sponsor.url.replace(/^https?:\/\//, "")}
                            </a>
                        )}
                    </div>
                </div>
                <div className="flex flex-wrap gap-2">
                    {sponsor.collectsData && (
                        <>
                            <Button onClick={handleAutoInclude} loading={importing} variant="outlined">
                                Auto-include customers
                            </Button>
                            <a href={`/api/admin/sponsors/${sponsor.slug}/export`} download>
                                <Button>Export CSV</Button>
                            </a>
                        </>
                    )}
                    <Link href={`/admin/sponsors/${sponsor.slug}/edit`}>
                        <Button variant="ghost">Edit</Button>
                    </Link>
                    <Button variant="danger" onClick={handleDelete} loading={deleting}>
                        Delete
                    </Button>
                </div>
            </header>

            {!sponsor.collectsData ? (
                <div className="rw-card p-10 text-center text-sm text-rw-muted">
                    This is a showcase-only sponsor — no member data is collected. Toggle
                    <strong> “Collects member data” </strong> in Edit to enable sign-ups.
                </div>
            ) : (
                <>
                    {/* ── Stats ── */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                        <StatCard label="Enrolled" value={stats.effective} accent={sponsor.brandColor} />
                        <StatCard label="Signed up" value={stats.signedUp} />
                        <StatCard label="Auto-included" value={stats.autoIncluded} />
                        <StatCard label="Opted out" value={stats.optedOut} muted />
                    </div>

                    {/* ── Tabs ── */}
                    <div className="flex items-center gap-1 border-b border-[var(--rw-border)] mb-4">
                        <TabButton active={tab === "auto"} onClick={() => setTab("auto")}>
                            Auto-included ({autoIncluded.length})
                        </TabButton>
                        <TabButton active={tab === "signups"} onClick={() => setTab("signups")}>
                            Form sign-ups ({signUps.length})
                        </TabButton>
                    </div>

                    {tab === "auto" && (
                        <p className="text-xs text-rw-muted mb-3">
                            Confirmed customers imported into this list. Opted-out people are greyed out and excluded from the export.
                        </p>
                    )}
                    {tab === "signups" && (
                        <p className="text-xs text-rw-muted mb-3">
                            People who filled the public form. Those already auto-included as customers are struck through (already covered).
                        </p>
                    )}

                    {rows.length === 0 ? (
                        <div className="rw-card p-10 text-center text-sm text-rw-muted">
                            {tab === "auto"
                                ? "No customers included yet. Click “Auto-include customers” to import confirmed customers."
                                : "No form sign-ups yet."}
                        </div>
                    ) : (
                        <div className="rw-card overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm min-w-[720px]">
                                    <thead>
                                        <tr className="border-b border-[var(--rw-border)] text-left text-[11px] uppercase tracking-widest text-rw-muted">
                                            <th className="px-5 py-3 font-bold">Name</th>
                                            <th className="px-5 py-3 font-bold">Email</th>
                                            <th className="px-5 py-3 font-bold">WhatsApp</th>
                                            <th className="px-5 py-3 font-bold">Skill</th>
                                            <th className="px-5 py-3 font-bold">Added</th>
                                            <th className="px-5 py-3 font-bold">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rows.map((l) => {
                                            const crossed = tab === "signups" && l.autoIncluded;
                                            const greyed = l.optedOut;
                                            return (
                                                <tr key={l.id} className={`border-b border-[var(--rw-border)]/60 last:border-0 ${greyed ? "opacity-45" : ""}`}>
                                                    <td className={`px-5 py-3 font-semibold text-rw-ink ${crossed ? "line-through" : ""}`}>{l.fullName}</td>
                                                    <td className={`px-5 py-3 text-rw-text-2 ${crossed ? "line-through" : ""}`}>{l.email}</td>
                                                    <td className="px-5 py-3 text-rw-text-2">{l.whatsapp || "—"}</td>
                                                    <td className="px-5 py-3 text-rw-text-2">{l.skill || "—"}</td>
                                                    <td className="px-5 py-3 text-rw-muted whitespace-nowrap">{fmtDate(l.createdAt)}</td>
                                                    <td className="px-5 py-3"><StatusBadges lead={l} tab={tab} /></td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

function StatCard({ label, value, accent, muted }: { label: string; value: number; accent?: string; muted?: boolean }) {
    return (
        <div className="rw-card p-4">
            <p className="text-[11px] font-bold uppercase tracking-widest text-rw-muted">{label}</p>
            <p className={`mt-1 text-2xl font-black tabular-nums ${muted ? "text-rw-muted" : "text-rw-ink"}`} style={accent ? { color: accent } : undefined}>
                {value}
            </p>
        </div>
    );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
    return (
        <button
            onClick={onClick}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-colors ${
                active ? "border-rw-crimson text-rw-ink" : "border-transparent text-rw-muted hover:text-rw-ink"
            }`}
        >
            {children}
        </button>
    );
}

function StatusBadges({ lead, tab }: { lead: SponsorLead; tab: Tab }) {
    const badges: { label: string; className: string }[] = [];
    if (lead.optedOut) badges.push({ label: "Opted out", className: "bg-rw-bg-alt text-rw-muted" });
    if (tab === "signups" && lead.autoIncluded) badges.push({ label: "Also a customer", className: "bg-amber-50 text-amber-700 border border-amber-200" });
    if (tab === "auto" && lead.signedUp) badges.push({ label: "Also signed up", className: "bg-blue-50 text-blue-700 border border-blue-200" });
    if (badges.length === 0) badges.push({ label: "Active", className: "bg-green-50 text-green-700 border border-green-200" });
    return (
        <div className="flex flex-wrap gap-1.5">
            {badges.map((b) => (
                <span key={b.label} className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${b.className}`}>
                    {b.label}
                </span>
            ))}
        </div>
    );
}
