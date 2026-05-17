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

    const isLink = variant === "nav" && !isDark;
    const Wrapper = isLink ? Link : "div";
    const wrapperProps = isLink ? { href: "/", id: "site-logo" } : {};

    const gap = variant === "hero" ? "gap-5" : isLarge ? "gap-4" : "gap-3";

    // Logo sizes
    const rcfLogoH = variant === "hero" ? "h-14" : isLarge ? "h-11" : "h-9";
    const rwLogoH = variant === "hero" ? "h-16" : isLarge ? "h-14" : "h-10";

    // Use appropriate RCF logo variant based on bg
    const rcfLogoSrc = isDark ? LOGOS.rcfFutaLight : LOGOS.rcfFuta;
    const rwLogoSrc = LOGOS.redemptionWeek;

    // Title sizes
    const titleSize =
        variant === "hero" ? "text-2xl" : isLarge ? "text-lg" : "text-[14px]";
    const subSize = variant === "hero" ? "text-sm" : isLarge ? "text-xs" : "text-[10px]";

    return (
        // @ts-expect-error — dynamic wrapper
        <Wrapper
            {...wrapperProps}
            className={`flex items-center ${gap} shrink-0 group ${className}`}
        >
            {/* Logo pair */}
            <div className="flex items-center gap-2">
                {/* RCF FUTA logo */}
                <div
                    className={`${rcfLogoH} aspect-square overflow-hidden flex items-center justify-center
                                  group-hover:scale-105 transition-transform`}
                >
                    <img
                        src={rcfLogoSrc}
                        alt="RCF FUTA"
                        className="h-full w-full object-contain"
                    />
                </div>

                {/* RW 2026 logo — rendered on its natural white bg */}
                <div
                    className={`${rwLogoH} aspect-square rounded-xl overflow-hidden flex items-center justify-center p-1
                                  group-hover:scale-105 transition-transform`}
                    style={{ transitionDelay: "40ms" }}
                >
                    <img
                        src={rwLogoSrc}
                        alt={`Redemption Week ${TENURE.shortYear}`}
                        className="h-full w-full object-contain"
                    />
                </div>
            </div>

            {/* Tagline */}
            {showTagline && (
                <div className={`${isLink ? "hidden sm:block" : ""} leading-tight`}>
                    <p
                        className={`font-display font-bold ${titleSize} ${isDark ? "text-white" : "text-[#1C0003]"}
                                   group-hover:text-[#FF0015] transition-colors`}
                    >
                        {TENURE.eventName}{" "}
                        <span className="text-[#FF0015]">{TENURE.shortYear}</span>
                    </p>
                    <p
                        className={`${subSize} ${isDark ? "text-white/40" : "text-[#9a8085]"} font-medium tracking-wide mt-0.5`}
                    >
                        {TENURE.anniversaryLabel} · RCF FUTA
                    </p>
                </div>
            )}
        </Wrapper>
    );
}
