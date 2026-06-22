"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

export interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface AdminBreadcrumbProps {
    items: BreadcrumbItem[];
    /**
     * Fallback destination if there's no browser history to go back to (e.g. the
     * page was opened directly). Defaults to the nearest parent crumb with an href.
     */
    fallbackHref?: string;
    /** Hide the back button (the trail still renders). */
    showBack?: boolean;
    className?: string;
}

export function AdminBreadcrumb({
    items,
    fallbackHref,
    showBack = true,
    className = "",
}: AdminBreadcrumbProps) {
    const router = useRouter();

    const parentHref =
        fallbackHref ?? [...items].reverse().find((i) => i.href)?.href;

    // Prefer real history so "Back" returns the user to wherever they came from
    // (e.g. a different section). Fall back to the parent crumb on a cold load.
    function goBack() {
        if (typeof window !== "undefined" && window.history.length > 1) {
            router.back();
        } else if (parentHref) {
            router.push(parentHref);
        }
    }

    return (
        <nav
            className={`flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-widest text-rw-muted ${className}`}
        >
            {showBack && (
                <button
                    type="button"
                    onClick={goBack}
                    aria-label="Go back"
                    className="group flex items-center gap-1.5 rounded-lg border border-[var(--rw-border)] bg-white px-2.5 py-1.5 text-rw-ink hover:border-rw-crimson hover:text-rw-crimson transition-colors"
                >
                    <svg
                        className="h-3.5 w-3.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2.5}
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 19l-7-7 7-7"
                        />
                    </svg>
                    Back
                </button>
            )}

            {items.map((item, index) => {
                const isLast = index === items.length - 1;

                return (
                    <React.Fragment key={index}>
                        {item.href && !isLast ? (
                            <Link
                                href={item.href}
                                className="hover:text-rw-crimson transition-colors border-b border-transparent hover:border-rw-crimson"
                            >
                                {item.label}
                            </Link>
                        ) : (
                            <span className={isLast ? "text-rw-ink font-bold" : ""}>
                                {item.label}
                            </span>
                        )}

                        {!isLast && (
                            <svg
                                className="h-3 w-3 opacity-30"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2.5}
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="m8.25 4.5 7.5 7.5-7.5 7.5"
                                />
                            </svg>
                        )}
                    </React.Fragment>
                );
            })}
        </nav>
    );
}
