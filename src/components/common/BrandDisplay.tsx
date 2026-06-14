import { LOGOS } from "@/lib/config";
import { clsx } from "clsx";
import Image from "next/image";

type BrandDisplayProps = {
    /** Optional className for the container */
    className?: string;
    /** If true, centers the logos on all sizes; otherwise left-aligns from sm up. */
    center?: boolean;
};

const BRAND_LOGOS = [
    { src: LOGOS.rcfFutaMix, alt: "RCF FUTA", h: "h-20 md:h-25 w-auto md:w-30!" },
    {
        src: LOGOS.crm,
        alt: "Christ the Redeemer's Ministries",
        h: "h-12 md:h-20 w-auto",
    },
    { src: LOGOS.tenureIcon, alt: "The Lord's Witnesses", h: "h-12 md:h-20 w-auto" },
    { src: LOGOS.redemptionWeek, alt: "Redemption Week '26", h: "h-12 md:h-20 w-auto" },
    { src: LOGOS.anniversary, alt: "38th Anniversary", h: "h-12 md:h-20 w-auto" },
];

export function BrandDisplay({ className = "", center = true }: BrandDisplayProps) {
    return (
        <div
            className={clsx(
                "flex flex-wrap items-center gap-x-6 gap-y-5 md:gap-x-12",
                center ? "justify-center" : "justify-center sm:justify-start",
                className
            )}
        >
            {BRAND_LOGOS.map((l) => (
                <img
                    key={l.alt}
                    src={l.src}
                    alt={l.alt}
                    loading="lazy"
                    className={clsx(
                        l.h,
                        "object-cover opacity-90 transition-all duration-300",
                        "hover:opacity-100 hover:-translate-y-0.5"
                    )}
                />
            ))}
        </div>
    );
}
