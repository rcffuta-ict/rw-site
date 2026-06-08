"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

interface RefreshButtonProps {
    /** Optional visible label. Omit for an icon-only button. */
    label?: string;
    className?: string;
}

/**
 * Re-fetches the current route's server data via router.refresh() — updating
 * tables/stats in place without a full page reload or losing client state
 * (filters, scroll, open menus). Shows a spinning state until the refetch
 * completes (router.refresh() resolves inside the transition).
 */
export function RefreshButton({ label = "Refresh", className = "" }: RefreshButtonProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    return (
        <button
            type="button"
            onClick={() => startTransition(() => router.refresh())}
            disabled={isPending}
            title="Refresh data"
            aria-label="Refresh data"
            className={`inline-flex items-center gap-2 rounded-xl border border-[var(--rw-border)] bg-white px-3.5 py-2 text-sm font-semibold text-rw-text-2 hover:text-rw-ink hover:bg-rw-bg-alt transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-sm ${className}`}
        >
            <svg
                className={`h-4 w-4 ${isPending ? "animate-spin" : ""}`}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 0 0 4.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 0 1-15.357-2m15.357 2H15"
                />
            </svg>
            {label && <span>{isPending ? "Refreshing…" : label}</span>}
        </button>
    );
}
