import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Verdicts — RW'26 Admin" };

const MOCK_VERDICTS = [
    {
        id: "v-001",
        type: "Withdrawal Permit",
        orderRefs: ["FF891E", "FFAA52"],
        generatedAt: "2026-05-03T11:00:00Z",
        generatedBy: "Admin",
        customerCount: 2,
    },
    {
        id: "v-002",
        type: "Production Manifest",
        orderRefs: ["FF3A9C", "FF891E", "FFAA52"],
        generatedAt: "2026-05-03T12:30:00Z",
        generatedBy: "Admin",
        customerCount: 3,
    },
    {
        id: "v-003",
        type: "Combined",
        orderRefs: ["FFAA52"],
        generatedAt: "2026-05-04T08:15:00Z",
        generatedBy: "Admin",
        customerCount: 1,
    },
];

const TYPE_COLORS: Record<string, string> = {
    "Withdrawal Permit": "bg-blue-50 text-blue-700 border-blue-200",
    "Production Manifest": "bg-violet-50 text-violet-700 border-violet-200",
    "Combined": "bg-rw-crimson/10 text-rw-crimson border-rw-crimson/20",
};

export default function VerdictsPage() {
    return (
        <div className="flex flex-col gap-8">
            <div className="flex items-end justify-between flex-wrap gap-4">
                <div>
                    <h1 className="section-heading text-2xl text-rw-ink">Verdicts</h1>
                    <p className="mt-1 text-sm text-rw-muted">Generated fulfilment documents for confirmed orders</p>
                </div>
                <Link
                    href="/admin/verdicts/new"
                    className="flex items-center gap-2 rounded-xl bg-fire-gradient px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:opacity-90 transition-opacity"
                >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    Generate New Verdict
                </Link>
            </div>

            {/* Info banner */}
            <div className="rounded-2xl border border-blue-200 bg-blue-50 px-5 py-4 flex items-start gap-3">
                <svg className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-blue-700">
                    <strong>Verdicts</strong> are official documents sent to the production team or used for order withdrawal.
                    Only <strong>Confirmed</strong> orders can be included. Demo build — PDF generation is stubbed.
                </p>
            </div>

            {/* Verdicts list */}
            {MOCK_VERDICTS.length === 0 ? (
                <div className="rw-card flex flex-col items-center gap-4 py-16 text-center">
                    <span className="text-4xl">📄</span>
                    <p className="text-rw-muted text-sm">No verdicts generated yet.</p>
                    <Link href="/admin/verdicts/new" className="text-sm font-semibold text-rw-crimson hover:underline">
                        Generate your first verdict →
                    </Link>
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {MOCK_VERDICTS.map(v => (
                        <div key={v.id} className="rw-card p-5 flex flex-col gap-4 hover:shadow-md transition-shadow">
                            {/* Header */}
                            <div className="flex items-start justify-between gap-2">
                                <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${TYPE_COLORS[v.type] ?? "bg-gray-100 text-gray-600 border-gray-200"}`}>
                                    {v.type}
                                </span>
                                <span className="text-[10px] font-mono text-rw-muted">{v.id.toUpperCase()}</span>
                            </div>

                            {/* Order refs */}
                            <div>
                                <p className="text-xs text-rw-muted mb-1.5 uppercase tracking-wider font-semibold">Orders</p>
                                <div className="flex flex-wrap gap-1.5">
                                    {v.orderRefs.map(ref => (
                                        <Link
                                            key={ref}
                                            href={`/admin/orders/${ref}`}
                                            className="font-mono text-xs font-bold text-rw-crimson bg-rw-crimson/8 border border-rw-crimson/20 rounded-lg px-2 py-0.5 hover:bg-rw-crimson/15 transition-colors"
                                        >
                                            {ref}
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Meta */}
                            <div className="flex items-center justify-between text-xs text-rw-muted border-t border-[var(--rw-border)] pt-3">
                                <span>
                                    {new Date(v.generatedAt).toLocaleDateString("en-NG", {
                                        day: "numeric",
                                        month: "short",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </span>
                                <span>{v.customerCount} customer{v.customerCount !== 1 ? "s" : ""}</span>
                            </div>

                            {/* Actions */}
                            <button
                                onClick={() => alert("PDF download — stub in demo build")}
                                className="w-full flex items-center justify-center gap-2 rounded-xl border border-[var(--rw-border-mid)] px-4 py-2 text-sm font-semibold text-rw-text-2 hover:bg-rw-bg-alt transition-colors"
                            >
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Download PDF
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
