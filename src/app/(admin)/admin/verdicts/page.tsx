import Link from "next/link";
import type { Metadata } from "next";
import { VerdictDownloadButton } from "./component";

export const metadata: Metadata = { title: "Verdicts — RW'26 Admin" };

const MOCK_VERDICTS = [
    { id: "v-001", type: "Withdrawal Permit",    orderRefs: ["FF891E", "FFAA52"],           generatedAt: "2026-05-03T11:00:00Z", generatedBy: "Admin", customerCount: 2 },
    { id: "v-002", type: "Production Manifest",  orderRefs: ["FF3A9C", "FF891E", "FFAA52"], generatedAt: "2026-05-03T12:30:00Z", generatedBy: "Admin", customerCount: 3 },
    { id: "v-003", type: "Combined",             orderRefs: ["FFAA52"],                     generatedAt: "2026-05-04T08:15:00Z", generatedBy: "Admin", customerCount: 1 },
];

const TYPE_COLORS: Record<string, string> = {
    "Withdrawal Permit":   "bg-blue-50 text-blue-700 border-blue-200",
    "Production Manifest": "bg-violet-50 text-violet-700 border-violet-200",
    Combined:              "bg-rw-crimson/10 text-rw-crimson border-rw-crimson/20",
};

export default function VerdictsPage() {
    return (
        <div className="flex flex-col gap-8">
            <div className="flex items-end justify-between flex-wrap gap-4">
                <div>
                    <h1 className="section-heading text-2xl lg:text-3xl">Verdicts</h1>
                    <p className="mt-1 text-sm text-rw-muted">Generated fulfilment documents for confirmed orders</p>
                </div>
                <Link href="/admin/verdicts/new" className="btn-primary !h-10 !px-5 text-sm flex items-center gap-2">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                    Generate Verdict
                </Link>
            </div>

            {/* Info banner */}
            <div className="rw-card p-5 flex items-start gap-3 border-blue-200 bg-blue-50/50">
                <svg className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" /></svg>
                <p className="text-sm text-blue-700">
                    <strong>Verdicts</strong> are official documents sent to the production team or used for order withdrawal.
                    Only <strong>Confirmed</strong> orders can be included. Demo build — PDF generation is stubbed.
                </p>
            </div>

            {/* Verdicts grid */}
            {MOCK_VERDICTS.length === 0 ? (
                <div className="rw-card flex flex-col items-center gap-5 py-20 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rw-bg-alt">
                        <svg className="h-8 w-8 text-rw-muted" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>
                    </div>
                    <p className="text-rw-muted">No verdicts generated yet.</p>
                    <Link href="/admin/verdicts/new" className="text-sm font-semibold text-rw-crimson hover:underline">Generate your first verdict →</Link>
                </div>
            ) : (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {MOCK_VERDICTS.map((v) => (
                        <div key={v.id} className="rw-card p-6 flex flex-col gap-5 hover:shadow-md hover:-translate-y-0.5 transition-all">
                            {/* Header */}
                            <div className="flex items-start justify-between gap-2">
                                <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${TYPE_COLORS[v.type] ?? "bg-gray-100 text-gray-600 border-gray-200"}`}>
                                    {v.type}
                                </span>
                                <span className="text-[10px] font-mono text-rw-muted">{v.id.toUpperCase()}</span>
                            </div>

                            {/* Order refs */}
                            <div>
                                <p className="text-[10px] font-bold text-rw-muted mb-2 uppercase tracking-[0.15em]">Orders</p>
                                <div className="flex flex-wrap gap-1.5">
                                    {v.orderRefs.map((ref) => (
                                        <Link key={ref} href={`/admin/orders/${ref}`}
                                            className="font-mono text-xs font-bold text-rw-crimson bg-rw-crimson/8 border border-rw-crimson/20 rounded-lg px-2.5 py-1 hover:bg-rw-crimson/15 transition-colors"
                                        >{ref}</Link>
                                    ))}
                                </div>
                            </div>

                            {/* Meta */}
                            <div className="flex items-center justify-between text-xs text-rw-muted border-t border-[var(--rw-border)] pt-4">
                                <span>{new Date(v.generatedAt).toLocaleDateString("en-NG", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</span>
                                <span>{v.customerCount} customer{v.customerCount !== 1 ? "s" : ""}</span>
                            </div>

                            <VerdictDownloadButton />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
