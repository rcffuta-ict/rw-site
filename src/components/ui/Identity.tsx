import { ph } from "@/lib/utils/functions";
import Link from "next/link";

interface IdentityProps {
    variant?: "nav" | "footer" | "hero";
    mode?: "light" | "dark";
    dark?: boolean; // Backward compatibility
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

    const rcfLogo = "/images/logos/rcf-futa.jpeg";
    const anniversaryLogo = ph(120, 120, "38th", "c41230", "ffffff");

    const logoSize =
        variant === "hero" ? "h-20 w-20" : isLarge ? "h-14 w-14" : "h-10 w-10";
    const titleSize =
        variant === "hero" ? "text-3xl" : isLarge ? "text-xl" : "text-[15px]";
    const subSize = variant === "hero" ? "text-sm" : isLarge ? "text-xs" : "text-[10px]";
    const gap = variant === "hero" ? "gap-6" : isLarge ? "gap-5" : "gap-3 sm:gap-4";

    const isLink = variant === "nav" && !isDark;
    const Wrapper = isLink ? Link : "div";
    const wrapperProps = isLink ? { href: "/", id: "site-logo" } : {};

    const logos = [
        {
            src: rcfLogo,
            alt: "RCF FUTA Logo",
            style: isDark
                ? "bg-white/5 border-white/10"
                : "bg-white border-[var(--rw-border)]",
            delay: "",
        },
        {
            src: anniversaryLogo,
            alt: "38th Anniversary",
            style: isDark
                ? "bg-rw-crimson/20 border-rw-crimson/30"
                : "bg-rw-crimson/5 border-rw-crimson/10",
            delay: "delay-75",
        },
    ];

    return (
        // @ts-expect-error - Dynamic wrapper
        <Wrapper
            {...wrapperProps}
            className={`flex items-center ${gap} shrink-0 group ${className}`}
        >
            <div
                className={`flex items-center ${isLarge ? "gap-2 sm:gap-3" : "gap-1.5"}`}
            >
                {logos.map((logo, i) => (
                    <div
                        key={i}
                        className={`${logoSize} rounded-2xl overflow-hidden ${logo.style} border p-0.5 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform ${logo.delay}`}
                    >
                        <img
                            src={logo.src}
                            alt={logo.alt}
                            className="h-full w-full rounded-xl object-cover"
                        />
                    </div>
                ))}
            </div>

            {showTagline && (
                <div className={`${isLink ? "hidden sm:block" : ""} leading-tight`}>
                    <p
                        className={`font-display font-bold ${titleSize} ${isDark ? "text-white" : "text-rw-ink"} group-hover:text-rw-crimson transition-colors`}
                    >
                        Redemption Week <span className="text-rw-crimson">&apos;26</span>
                    </p>
                    <p
                        className={`${subSize} ${isDark ? "text-white/40" : "text-rw-muted"} font-medium tracking-wide mt-0.5`}
                    >
                        38th Anniversary · RCF FUTA
                    </p>
                </div>
            )}
        </Wrapper>
    );
}
