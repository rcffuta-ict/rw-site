import { ph } from "@/lib/utils/functions";
import { LOGOS, TENURE } from "@/lib/config";
import Link from "next/link";

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

    const logoSize =
        variant === "hero" ? "h-16 w-16" : isLarge ? "h-12 w-12" : "h-9 w-9";
    const titleSize =
        variant === "hero" ? "text-2xl" : isLarge ? "text-lg" : "text-[14px]";
    const subSize = variant === "hero" ? "text-sm" : isLarge ? "text-xs" : "text-[10px]";
    const gap = variant === "hero" ? "gap-5" : isLarge ? "gap-4" : "gap-2.5 sm:gap-3";

    const isLink = variant === "nav" && !isDark;
    const Wrapper = isLink ? Link : "div";
    // @ts-expect-error — dynamic wrapper
    const wrapperProps = isLink ? { href: "/", id: "site-logo" } : {};

    // Build logo slots — RCF FUTA always shown; RW logo shown if provided else placeholder
    const logos = [
        {
            src: LOGOS.rcfFuta,
            alt: "RCF FUTA",
            style: isDark
                ? "bg-white/5 border-white/10"
                : "bg-white border-[#e8d0d4]",
        },
        {
            // Redemption Week event logo — placeholder until design team delivers it
            src: LOGOS.redemptionWeek ?? ph(120, 120, `RW${TENURE.shortYear}`, "FF0015", "ffffff"),
            alt: `Redemption Week ${TENURE.shortYear} Logo`,
            style: isDark
                ? "bg-[#FF0015]/20 border-[#FF0015]/30"
                : "bg-[#fff0f0] border-[#FF0015]/20",
        },
    ];

    return (
        // @ts-expect-error — dynamic wrapper
        <Wrapper
            {...wrapperProps}
            className={`flex items-center ${gap} shrink-0 group ${className}`}
        >
            {/* Logo row */}
            <div className={`flex items-center ${isLarge ? "gap-2" : "gap-1.5"}`}>
                {logos.map((logo, i) => (
                    <div
                        key={i}
                        className={`${logoSize} rounded-2xl overflow-hidden ${logo.style} border
                                    p-0.5 flex items-center justify-center shrink-0
                                    group-hover:scale-105 transition-transform`}
                        style={{ transitionDelay: `${i * 40}ms` }}
                    >
                        <img
                            src={logo.src}
                            alt={logo.alt}
                            className="h-full w-full rounded-xl object-cover"
                        />
                    </div>
                ))}
            </div>

            {/* Tagline */}
            {showTagline && (
                <div className={`${isLink ? "hidden sm:block" : ""} leading-tight`}>
                    <p className={`font-display font-bold ${titleSize} ${isDark ? "text-white" : "text-[#1C0003]"}
                                   group-hover:text-[#FF0015] transition-colors`}>
                        {TENURE.eventName}{" "}
                        <span className="text-[#FF0015]">{TENURE.shortYear}</span>
                    </p>
                    <p className={`${subSize} ${isDark ? "text-white/40" : "text-[#9a8085]"} font-medium tracking-wide mt-0.5`}>
                        {TENURE.anniversaryLabel} · RCF FUTA
                    </p>
                </div>
            )}
        </Wrapper>
    );
}
