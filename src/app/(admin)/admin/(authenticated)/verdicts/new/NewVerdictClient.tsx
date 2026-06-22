"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import { createVerdict } from "@/lib/services/verdicts.service";
import { VerdictPdfPreview } from "@/components/admin/verdicts/VerdictPdfPreview";
import { formatNaira } from "@/lib/utils/functions";
import type { Order, Verdict, VerdictManifestItem } from "@/lib/data/types";

interface NewVerdictClientProps {
    eligibleOrders: Order[];
}

// Mirror of the server-side consolidation so the manifest preview is live.
function buildManifest(orders: Order[]): VerdictManifestItem[] {
    const map = new Map<string, VerdictManifestItem>();
    for (const order of orders) {
        for (const item of order.items) {
            const key = `${item.productName}__${item.variantLabel}`;
            const existing = map.get(key);
            if (existing) existing.quantity += item.quantity;
            else
                map.set(key, {
                    productName: item.productName,
                    variantLabel: item.variantLabel,
                    quantity: item.quantity,
                });
        }
    }
    return [...map.values()].sort(
        (a, b) =>
            a.productName.localeCompare(b.productName) ||
            a.variantLabel.localeCompare(b.variantLabel)
    );
}

function groupByProduct(manifest: VerdictManifestItem[]) {
    const groups = new Map<string, { product: string; total: number; lines: VerdictManifestItem[] }>();
    for (const item of manifest) {
        const g = groups.get(item.productName) ?? { product: item.productName, total: 0, lines: [] };
        g.lines.push(item);
        g.total += item.quantity;
        groups.set(item.productName, g);
    }
    return [...groups.values()];
}

export function NewVerdictClient({ eligibleOrders }: NewVerdictClientProps) {
    const router = useRouter();
    const { user } = useAdminAuth();

    // Auto-select every eligible order by default.
    const [selected, setSelected] = useState<Set<string>>(
        () => new Set(eligibleOrders.map((o) => o.id))
    );
    const [note, setNote] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [issued, setIssued] = useState<Verdict | null>(null);

    const selectedOrders = useMemo(
        () => eligibleOrders.filter((o) => selected.has(o.id)),
        [eligibleOrders, selected]
    );
    const manifest = useMemo(() => buildManifest(selectedOrders), [selectedOrders]);
    const groups = useMemo(() => groupByProduct(manifest), [manifest]);
    const totalAmount = selectedOrders.reduce((s, o) => s + o.totalAmount, 0);
    const totalUnits = manifest.reduce((s, m) => s + m.quantity, 0);

    function toggle(id: string) {
        setSelected((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    }

    async function handleIssue() {
        if (selected.size === 0 || submitting) return;
        setSubmitting(true);
        try {
            const res = await createVerdict({
                orderIds: [...selected],
                note: note.trim() || null,
            });
            if (res.success && res.data) {
                toast.success(`Verdict ${res.data.verdictRef} issued`, {
                    description: `${res.data.orderCount} order(s) moved to production · customers notified.`,
                });
                setIssued(res.data);
                router.refresh();
            } else {
                toast.error("Could not issue verdict", { description: res.error });
            }
        } catch (err) {
            toast.error("Could not issue verdict", {
                description: (err as Error).message,
            });
        } finally {
            setSubmitting(false);
        }
    }

    // ─── Issued: show the official document ──────────────────────────────────
    if (issued) {
        return (
            <div className="flex flex-col gap-6 animate-fade-in pb-16 max-w-4xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl bg-rw-ink text-white p-6 shadow-xl">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                            <svg className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="font-display font-black text-xl uppercase tracking-tight">
                                Verdict Issued
                            </h2>
                            <p className="text-[11px] text-white/60 font-bold uppercase tracking-[0.2em] mt-0.5">
                                {issued.verdictRef} · {issued.orderCount} orders in production
                            </p>
                        </div>
                    </div>
                    <Link
                        href="/admin/verdicts"
                        className="btn-secondary !bg-white/10 !text-white !border-white/20 !h-12 px-6 text-[11px] font-black uppercase tracking-widest hover:!bg-white hover:!text-rw-ink text-center"
                    >
                        All Verdicts
                    </Link>
                </div>

                <div className="rw-card p-5 sm:p-6">
                    <VerdictPdfPreview verdict={issued} height={620} />
                </div>
            </div>
        );
    }

    // ─── No eligible orders ──────────────────────────────────────────────────
    if (eligibleOrders.length === 0) {
        return (
            <div className="flex flex-col gap-8 animate-fade-in max-w-3xl">
                <AdminBreadcrumb
                    items={[
                        { label: "Verdicts", href: "/admin/verdicts" },
                        { label: "Issue" },
                    ]}
                />
                <div>
                    <h1 className="font-display font-black text-2xl lg:text-3xl uppercase tracking-tight text-rw-ink">
                        Issue Verdict
                    </h1>
                    <p className="text-sm text-rw-muted mt-1 font-medium">
                        Bundle fully-paid orders into an official production directive.
                    </p>
                </div>
                <div className="rw-card flex flex-col items-center gap-5 py-16 text-center border-dashed bg-rw-bg-alt/30">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white border border-[var(--rw-border)]">
                        <svg className="h-8 w-8 text-rw-muted" fill="none" stroke="currentColor" strokeWidth={1.4} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                    </div>
                    <div>
                        <p className="font-display font-black text-xl text-rw-ink uppercase tracking-tight">
                            No orders ready
                        </p>
                        <p className="text-rw-muted mt-1.5 font-medium text-sm max-w-sm">
                            A verdict needs at least one fully-paid order that isn&apos;t
                            already in production. Approve payments to full, then return.
                        </p>
                    </div>
                    <Link href="/admin/orders" className="btn-secondary !h-11 px-7 text-[11px] font-bold uppercase tracking-widest">
                        Go To Orders
                    </Link>
                </div>
            </div>
        );
    }

    // ─── Compose ─────────────────────────────────────────────────────────────
    return (
        <div className="flex flex-col gap-8 animate-fade-in pb-36 lg:pb-28">
            <AdminBreadcrumb
                items={[
                    { label: "Verdicts", href: "/admin/verdicts" },
                    { label: "Issue" },
                ]}
            />
            <div>
                <h1 className="font-display font-black text-2xl lg:text-3xl uppercase tracking-tight text-rw-ink">
                    Issue Verdict
                </h1>
                <p className="text-sm text-rw-muted mt-1 font-medium">
                    Bundle fully-paid orders into an official production &amp; debit
                    directive. Issuing locks them into production and notifies customers.
                </p>
            </div>

            <div className="grid lg:grid-cols-[1fr_1.1fr] gap-8 items-start">
                {/* Left: directive details + live manifest */}
                <div className="flex flex-col gap-6">
                    <section className="rw-card p-5 flex flex-col gap-4">
                        <h4 className="text-[10px] font-black text-rw-muted uppercase tracking-[0.25em]">
                            Authorizing Officer
                        </h4>
                        <div className="flex items-center gap-3">
                            {user?.avatarUrl ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={user.avatarUrl}
                                    alt={user.name || "Admin"}
                                    className="h-11 w-11 rounded-xl object-cover"
                                />
                            ) : (
                                <div className="h-11 w-11 rounded-xl bg-rw-crimson/10 text-rw-crimson flex items-center justify-center font-display font-black text-lg">
                                    {(user?.name || user?.email || "A").charAt(0).toUpperCase()}
                                </div>
                            )}
                            <div className="min-w-0">
                                <p className="font-bold text-rw-ink truncate">
                                    {user?.name || "Administrator"}
                                </p>
                                <p className="text-xs text-rw-muted truncate">{user?.email}</p>
                            </div>
                        </div>
                        <p className="text-[11px] text-rw-muted leading-relaxed">
                            Your identity is stamped on the verdict as the authorizing
                            administrator — this is the official, auditable signature.
                        </p>

                        <div className="pt-1">
                            <label className="text-[10px] font-black text-rw-muted uppercase tracking-[0.25em]">
                                Directive note <span className="opacity-50">(optional)</span>
                            </label>
                            <textarea
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                rows={3}
                                placeholder="e.g. Priority batch — collect before Friday."
                                className="mt-2 w-full rounded-xl border border-[var(--rw-border)] bg-rw-bg-alt/40 px-4 py-3 text-sm text-rw-ink outline-none focus:bg-white focus:border-rw-crimson transition-colors resize-none"
                            />
                        </div>
                    </section>

                    {/* Live manifest */}
                    <section className="rw-card p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-[10px] font-black text-rw-muted uppercase tracking-[0.25em]">
                                Production Manifest
                            </h4>
                            <span className="text-[10px] font-black bg-rw-ink text-white px-2.5 py-1 rounded-full uppercase tracking-widest">
                                {totalUnits} units
                            </span>
                        </div>
                        {groups.length === 0 ? (
                            <p className="text-sm text-rw-muted italic py-6 text-center">
                                Select orders to build the manifest.
                            </p>
                        ) : (
                            <div className="flex flex-col gap-4">
                                {groups.map((g) => (
                                    <div key={g.product}>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <p className="font-display font-black text-rw-ink uppercase tracking-tight">
                                                {g.product}
                                            </p>
                                            <span className="text-[10px] font-black text-rw-crimson uppercase tracking-widest">
                                                {g.total}
                                            </span>
                                        </div>
                                        <div className="flex flex-col gap-1 border-l-2 border-[var(--rw-border)] pl-3">
                                            {g.lines.map((line, i) => (
                                                <div key={i} className="flex items-center gap-3 text-sm">
                                                    <span className="font-mono font-black text-rw-ink w-8">
                                                        {line.quantity}×
                                                    </span>
                                                    <span className="text-rw-ink/80">
                                                        {line.variantLabel}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </div>

                {/* Right: order selection */}
                <section className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <h4 className="text-[10px] font-black text-rw-muted uppercase tracking-[0.25em]">
                            Eligible Orders · {selected.size}/{eligibleOrders.length}
                        </h4>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setSelected(new Set(eligibleOrders.map((o) => o.id)))}
                                className="text-[10px] font-black text-rw-crimson uppercase tracking-widest hover:underline"
                            >
                                Select all
                            </button>
                            <button
                                onClick={() => setSelected(new Set())}
                                className="text-[10px] font-black text-rw-muted uppercase tracking-widest hover:text-rw-ink"
                            >
                                Clear
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2.5 max-h-[560px] overflow-y-auto scrollbar-hide pr-1">
                        {eligibleOrders.map((o) => {
                            const isSel = selected.has(o.id);
                            const units = o.items.reduce((s, it) => s + it.quantity, 0);
                            return (
                                <label
                                    key={o.id}
                                    className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all border-2 ${
                                        isSel
                                            ? "border-rw-crimson bg-white shadow-sm"
                                            : "border-[var(--rw-border)] bg-rw-bg-alt/30 hover:bg-white"
                                    }`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={isSel}
                                        onChange={() => toggle(o.id)}
                                        className="h-5 w-5 rounded-md accent-rw-crimson shrink-0"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2">
                                            <span className="font-mono font-black text-sm text-rw-crimson">
                                                {o.orderRef}
                                            </span>
                                            <span className="font-display font-black text-sm text-rw-ink">
                                                {formatNaira(o.totalAmount)}
                                            </span>
                                        </div>
                                        <p className="text-sm text-rw-ink font-bold mt-0.5 truncate">
                                            {o.customerName}
                                        </p>
                                        <p className="text-[10px] text-rw-muted font-bold uppercase tracking-wide mt-0.5">
                                            {o.items.length} line{o.items.length === 1 ? "" : "s"} ·{" "}
                                            {units} unit{units === 1 ? "" : "s"}
                                        </p>
                                    </div>
                                </label>
                            );
                        })}
                    </div>
                </section>
            </div>

            {/* Sticky action bar */}
            <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-3xl">
                <div className="rw-card p-4 sm:p-5 bg-rw-ink text-white border-none shadow-2xl flex items-center justify-between gap-4 rounded-3xl">
                    <div className="flex items-center gap-5 min-w-0">
                        <div className="flex flex-col">
                            <span className="text-[8px] font-black uppercase tracking-[0.25em] opacity-50">
                                Orders
                            </span>
                            <span className="font-display font-black text-xl">{selected.size}</span>
                        </div>
                        <div className="h-7 w-px bg-white/15" />
                        <div className="flex flex-col">
                            <span className="text-[8px] font-black uppercase tracking-[0.25em] opacity-50">
                                Total To Debit
                            </span>
                            <span className="font-display font-black text-xl text-rw-gold truncate">
                                {formatNaira(totalAmount)}
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={handleIssue}
                        disabled={selected.size === 0 || submitting}
                        className="h-12 px-6 sm:px-8 rounded-2xl bg-rw-crimson text-white font-display font-black uppercase tracking-widest text-xs hover:scale-[1.02] active:scale-[0.98] transition-transform disabled:opacity-40 disabled:grayscale disabled:scale-100 flex items-center gap-2 shrink-0"
                    >
                        {submitting ? (
                            <>
                                <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                                Issuing…
                            </>
                        ) : (
                            <>
                                Issue Verdict
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                </svg>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
