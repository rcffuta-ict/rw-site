"use client";

import { LOGOS, TENURE, FELLOWSHIP } from "@/lib/config";

interface AdminLogoProps {
    variant?: "login" | "sidebar";
    role?: string | null;
}

/**
 * Reusable Admin Logo Component.
 * Supports a larger "login" format (vertical stack) and a smaller "sidebar" format (horizontal).
 * Renders the custom tenure icon if available in the config, falling back to the standard fire/witness SVG.
 * Displays the logged-in role dynamically as a premium badge/tag.
 */
export function AdminLogo({ variant = "sidebar", role }: AdminLogoProps) {
    const isModerator = role === "MODERATOR";
    const badgeClass = isModerator
        ? "bg-amber-500/10 text-amber-600 border border-amber-500/10"
        : "bg-rw-crimson/8 text-rw-crimson border border-rw-crimson/10";

    if (variant === "login") {
        return (
            <div className="flex flex-col items-center gap-4 mb-10">
                <span className="flex h-24 w-24 items-center justify-center">
                    {LOGOS.tenureIcon ? (
                        <img
                            src={LOGOS.tenureIcon}
                            alt={`${TENURE.brandLabel} Icon`}
                            className="h-16 w-16 object-contain"
                        />
                    ) : (
                        <svg
                            className="h-7 w-7 text-white"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path d="M12 2C9 7 6 9 6 13a6 6 0 0 0 12 0c0-4-3-6-6-11z" />
                        </svg>
                    )}
                </span>
                <div className="text-center flex flex-col items-center">
                    <div className="flex items-center gap-2">
                        <p className="font-display font-bold text-2xl text-rw-ink">
                            {TENURE.brandLabel}
                        </p>
                        <span
                            className={`text-[9px] font-extrabold tracking-wider px-2 py-0.5 rounded-full uppercase select-none ${badgeClass}`}
                        >
                            Admin
                        </span>
                    </div>
                    <p className="text-xs text-rw-muted mt-1.5 font-medium">
                        {TENURE.eventName} · {FELLOWSHIP.shortName}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center shrink-0">
                {LOGOS.tenureIcon ? (
                    <img
                        src={LOGOS.tenureIcon}
                        alt={`${TENURE.brandLabel} Icon`}
                        className="h-7 w-7 object-contain"
                    />
                ) : (
                    <svg
                        className="h-4.5 w-4.5 text-white"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                    >
                        <path d="M12 2C9 7 6 9 6 13a6 6 0 0 0 12 0c0-4-3-6-6-11z" />
                    </svg>
                )}
            </span>
            <div className="leading-tight">
                <div className="flex items-center">
                    <p className="text-sm font-bold text-rw-ink tracking-tight">
                        {TENURE.brandLabel}
                    </p>
                </div>
                <span
                    className={`text-[8px] font-extrabold tracking-wider px-1.5 py-0.5 rounded uppercase select-none leading-none ${badgeClass} inline-block my-2`}
                >
                    {role || "Admin"}
                </span>
            </div>
        </div>
    );
}
