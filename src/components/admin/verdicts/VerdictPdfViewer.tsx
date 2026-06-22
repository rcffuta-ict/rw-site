"use client";

// Inner client component — imports @react-pdf/renderer directly. Always loaded
// through VerdictPdfPreview's dynamic(ssr:false) wrapper so the (browser-only)
// renderer never runs during SSR.

import { useState } from "react";
import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";
import { VerdictPdfDocument } from "./VerdictPdfDocument";
import type { Verdict } from "@/lib/data/types";

export function VerdictPdfViewer({
    verdict,
    height = 560,
}: {
    verdict: Verdict;
    height?: number;
}) {
    // Re-mount the document per verdict so the preview refreshes correctly.
    const [doc] = useState(() => <VerdictPdfDocument verdict={verdict} />);
    const fileName = `Verdict-${verdict.verdictRef}.pdf`;

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
                <p className="text-xs text-rw-muted font-medium">
                    Official production directive ·{" "}
                    <span className="font-mono font-bold text-rw-ink">
                        {verdict.verdictRef}
                    </span>
                </p>
                <PDFDownloadLink
                    document={doc}
                    fileName={fileName}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-rw-ink text-white! px-5 py-3 text-xs font-black uppercase tracking-[0.18em] hover:bg-rw-crimson transition-colors hover:text-rw-ink!"
                >
                    {({ loading }) => (
                        <>
                            <svg
                                className="h-4 w-4"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2.5}
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                            </svg>
                            {loading ? "Preparing…" : "Download PDF"}
                        </>
                    )}
                </PDFDownloadLink>
            </div>

            <div
                className="w-full overflow-hidden rounded-2xl border border-[var(--rw-border)] bg-rw-bg-alt/40 shadow-inner"
                style={{ height }}
            >
                <PDFViewer
                    width="100%"
                    height="100%"
                    showToolbar
                    style={{ border: "none" }}
                >
                    {doc}
                </PDFViewer>
            </div>
        </div>
    );
}
