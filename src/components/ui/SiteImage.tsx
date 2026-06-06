"use client";
import Image from "next/image";
import { ph } from "@/lib/utils/functions";
import cloudinaryLoader, { getCloudinaryPublicId } from "@/lib/utils/cloudinaryLoader";

export interface SiteImageProps {
    src?: string | null;
    alt: string;
    width?: number; // Optional now if you use fill
    height?: number;
    priority?: boolean;
    className?: string;
    sizes?: string;
    fill?: boolean;
    placeholderLabel: string;
    colors?: {
        bg?: string;
        fg?: string;
    };
}

export interface ResponsiveSiteImageProps {
    desktopSrc: string;
    mobileSrc: string;
    alt: string;
    priority?: boolean;
    className?: string;
}

export function SiteImage({
    src,
    alt,
    width,
    height,
    priority = false,
    className = "",
    sizes = "100vw",
    fill = false,
    colors,
    placeholderLabel,
}: SiteImageProps) {
    const publicId = getCloudinaryPublicId(src);

    // Dynamic clean fallback logic
    if (!publicId) {
        const fallbackWidth = width || 1200;
        const fallbackHeight = height || 400;
        return (
            <img
                src={ph(
                    fallbackWidth,
                    fallbackHeight,
                    placeholderLabel,
                    colors?.bg,
                    colors?.fg
                )}
                alt={alt}
                className={className}
                style={
                    fill
                        ? { width: "100%", height: "100%", objectFit: "cover" }
                        : undefined
                }
            />
        );
    }

    return (
        <Image
            loader={cloudinaryLoader}
            src={publicId} // Passes clean publicId (e.g., 'shop_banner_usufiq') to loader
            alt={alt}
            width={!fill ? width : undefined}
            height={!fill ? height : undefined}
            fill={fill}
            priority={priority}
            sizes={sizes}
            className={className}
        />
    );
}

export function ResponsiveSiteImage({
    desktopSrc,
    mobileSrc,
    alt,
    priority = false,
    className = "",
}: ResponsiveSiteImageProps) {
    const desktopId = getCloudinaryPublicId(desktopSrc);
    const mobileId = getCloudinaryPublicId(mobileSrc);

    if (!desktopId || !mobileId) return null;

    // Generate responsive transformed URLs directly from your loader logic
    const mobileUrl = cloudinaryLoader({ src: mobileId, width: 640, quality: 80 });
    const tabletUrl = cloudinaryLoader({ src: desktopId, width: 1024, quality: 80 });
    const desktopUrl = cloudinaryLoader({ src: desktopId, width: 1920, quality: 80 });

    return (
        <picture className={className}>
            {/* Desktop Viewports */}
            <source media="(min-width: 1024px)" srcSet={desktopUrl} />
            {/* Tablet Viewports */}
            <source media="(min-width: 640px)" srcSet={tabletUrl} />
            {/* Mobile Viewports / Fallback Img */}
            <img
                src={mobileUrl}
                alt={alt}
                loading={priority ? "eager" : "lazy"}
                fetchPriority={priority ? "high" : "low"}
                className="absolute inset-0 w-full h-full object-cover object-center"
            />
        </picture>
    );
}
