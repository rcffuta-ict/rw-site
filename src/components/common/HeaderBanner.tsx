import { SiteImage } from "../ui/SiteImage";

type HeaderBannerProps = {
    header?: string;
    title: string;
    bannerDescription: string; // For accessibility, if the title is purely decorative, it can be hidden from screen readers.
    description: string;
};

export function HeaderBanner({
    header,
    title,
    bannerDescription,
    description,
}: HeaderBannerProps) {
    return (
        <div className="relative overflow-hidden bg-[#1C0003] min-h-[340px] md:min-h-[420px] flex items-center border-b border-black/10">
            {/* The Real Dynamic Asset Loader */}
            <SiteImage
                src="shop_banner_usufiq"
                alt={bannerDescription}
                fill
                priority
                sizes="100vw"
                placeholderLabel={bannerDescription}
                className="absolute inset-0 w-full h-full object-cover object-right md:object-center"
                colors={{
                    bg: "1C0003",
                    fg: "FF6A00",
                }}
            />

            {/* Text Protection Gradients */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#1C0003] via-[#1C0003]/50 to-transparent md:block hidden" />
            <div className="absolute inset-0 bg-[#1C0003]/70 md:hidden block" />

            {/* THE ULTRA-SMOOTH BOTTOM FEATHER:
                     Instead of a harsh white block, we use a deep rich tone fading out,
                     paired with a subtle overlay that catches the white background below it.
                   */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#1C0003] via-[#1C0003]/40 to-transparent pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white/10 to-transparent pointer-events-none" />

            <div className="section-container relative z-10 w-full py-16 md:py-24">
                {header && (
                    <p className="eyebrow mb-3 !text-[#FF6A00] tracking-widest text-xs uppercase font-semibold">
                        {header}
                    </p>
                )}

                <h1
                    className="font-display font-extrabold text-white leading-none tracking-tight"
                    style={{ fontSize: "clamp(2.5rem, 5.5vw, 4.5rem)" }}
                >
                    {title}
                </h1>

                <p className="mt-4 text-white/80 text-sm md:text-base leading-relaxed max-w-[48ch]">
                    {description}
                </p>

                {/* Info Pills */}
                {/* <div className="mt-8 flex flex-wrap gap-2 max-w-[50ch]">
                           {[
                               "Quick",
                               "Limited quantities",
                               "Let other",
                           ].map((tag) => (
                               <span
                                   key={tag}
                                   className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full
                                              border border-white/15 bg-white/5 text-white/95 text-xs font-medium
                                              backdrop-blur-md shadow-sm"
                               >
                                   <span className="h-1.5 w-1.5 rounded-full bg-[#FF6A00]" />
                                   {tag}
                               </span>
                           ))}
                       </div> */}
            </div>
        </div>
    );
}
