import { LOGOS } from "@/lib/config";

export function BrandDisplay() {
    return (
        <div className="flex items-center gap-6 sm:gap-14 overflow-x-auto scrollbar-hide pb-2 justify-start sm:justify-center flex-nowrap sm:flex-wrap px-2 sm:px-0">
            {[
                { src: LOGOS.rcfFutaMix, alt: "RCF FUTA", h: "h-14 md:h-20" },
                { src: LOGOS.crm, alt: "Christ the Redeemers'", h: "h-9" },
                {
                    src: LOGOS.tenureIcon,
                    alt: "The Lord's Witnesses",
                    h: "h-10",
                },
                {
                    src: LOGOS.redemptionWeek,
                    alt: "Redemption Week '26",
                    h: "h-12",
                },
                {
                    src: LOGOS.anniversary,
                    alt: "38th Anniversary",
                    h: "h-12",
                },
            ].map((l) => (
                <img
                    key={l.alt}
                    src={l.src}
                    alt={l.alt}
                    className={`${l.h} w-auto object-cover opacity-60 hover:opacity-100 transition-opacity grayscale hover:grayscale-0`}
                />
            ))}
        </div>
    );
}
