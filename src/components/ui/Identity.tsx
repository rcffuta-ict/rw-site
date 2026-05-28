"use client";

import { LOGOS, TENURE } from "@/lib/config";
import Link from "next/link";
import React from "react";

interface IdentityProps {
    variant?: "nav" | "footer" | "hero";
    mode?: "light" | "dark";
    dark?: boolean;
    className?: string;
    showTagline?: boolean;
}

export function Identity({
    variant = "nav",
    mode,
    dark,
    className = "",
    showTagline = true,
}: IdentityProps) {
    const isDark = mode === "dark" || dark === true;
    const isLarge = variant === "footer" || variant === "hero" || isDark;

    // Determine polymorphic tag type safely without silencing TS
    const isLink = variant === "nav";
    const Wrapper = isLink ? Link : "div";

    const wrapperProps = isLink ? { href: "/", id: "site-logo" } : {};

    const gap = variant === "hero" ? "gap-6" : isLarge ? "gap-4" : "gap-3";

    /* * ── Scale Layout Metrics ───────────────────────────────────────
     * Dropping aspect-square from RCF's asset container completely.
     * We allow it to expand out horizontally (w-auto) on its natural
     * bounding box while scaling the exact vertical height target.
     */
    // const rcfLogoH = variant === "hero" ? "h-20" : isLarge ? "h-12 sm:h-14" : "h-10";
    // const rwLogoH = variant === "hero" ? "h-14" : isLarge ? "h-10 sm:h-11" : "h-8";
    const rcfLogoH = "h-20";
    const rwLogoH = "h-12";

    // Title & Subtext scales
    const titleSize =
        variant === "hero" ? "text-2xl sm:text-3xl" : isLarge ? "text-xl" : "text-base";
    const subSize =
        variant === "hero" ? "text-xs sm:text-sm" : isLarge ? "text-xs" : "text-[11px]";

    return (
        <Wrapper
            {...(wrapperProps as React.ComponentPropsWithoutRef<typeof Link> &
                React.ComponentPropsWithoutRef<"div">)}
            className={`inline-flex items-center ${gap} shrink-0 group ${className}`}
        >
            {/* Integrated Dual Brand Assets Display Layout */}
            <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                {/* RCF FUTA Horizontal Chapter Identity Banner (Wide Framework Container) */}
                <div
                    className={`${rcfLogoH} w-auto flex items-center justify-center group-hover:scale-[1.03] transition-transform duration-300 ease-out`}
                >
                    <img
                        src={LOGOS.rcfFutaMix}
                        alt="RCF FUTA Corporate Logo"
                        className="h-full w-auto object-cover filter max-w-none antialiased"
                    />
                </div>

                {/* Micro-Vertical Structural Partition */}
                <span
                    className={`w-[1px] ${variant === "hero" ? "h-10" : "h-6"} bg-neutral-500/20`}
                />

                {/* RW Campaign Variant Identity Box */}
                <div
                    className={`${rwLogoH} aspect-square overflow-hidden flex items-center justify-center p-0.5 group-hover:scale-105 transition-transform duration-300`}
                    style={{ transitionDelay: "30ms" }}
                >
                    <img
                        src={LOGOS.redemptionWeek}
                        alt={`Redemption Week ${TENURE.shortYear}`}
                        className="h-full w-full object-contain filter drop-shadow-sm"
                    />
                </div>
            </div>

            {/* Typography Content Wrapper */}
            {showTagline && (
                <div
                    className={`${isLink ? "hidden sm:block" : ""} flex flex-col justify-center leading-none select-none`}
                >
                    <p
                        className={`font-display font-bold ${titleSize} ${isDark ? "text-white" : "text-[#1C0003]"}
                                   group-hover:text-[#FF0015] transition-colors`}
                    >
                        {TENURE.eventName}{" "}
                        <span className="text-[#FF0015]">&apos;{TENURE.shortYear}</span>
                    </p>
                    <p
                        className={`${subSize} ${
                            isDark ? "text-neutral-400" : "text-[#9a8085]"
                        } font-dm-sans font-semibold tracking-wider mt-1 uppercase opacity-80`}
                    >
                        {TENURE.anniversaryLabel} · RCF FUTA
                    </p>
                </div>
            )}
        </Wrapper>
    );
}
