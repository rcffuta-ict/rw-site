"use client";

// Public entry for the in-app PDF preview. Dynamically loads the heavy,
// browser-only @react-pdf/renderer viewer with ssr:false so it never executes
// during server rendering and is code-split out of the initial bundle.

import dynamic from "next/dynamic";
import type { Verdict } from "@/lib/data/types";

const Viewer = dynamic(
    () => import("./VerdictPdfViewer").then((m) => m.VerdictPdfViewer),
    {
        ssr: false,
        loading: () => (
            <div className="flex h-[560px] w-full items-center justify-center rounded-2xl border border-[var(--rw-border)] bg-rw-bg-alt/40">
                <div className="flex flex-col items-center gap-3 text-rw-muted">
                    <span className="h-8 w-8 rounded-full border-[3px] border-rw-crimson border-t-transparent animate-spin" />
                    <p className="text-xs font-bold uppercase tracking-[0.2em]">
                        Rendering document…
                    </p>
                </div>
            </div>
        ),
    }
);

export function VerdictPdfPreview({
    verdict,
    height,
}: {
    verdict: Verdict;
    height?: number;
}) {
    return <Viewer verdict={verdict} height={height} />;
}
