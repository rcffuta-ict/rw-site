"use client";
import Image from "next/image";
import { ph } from "@/lib/utils/functions";
import cloudinaryLoader, { getCloudinaryPublicId } from "@/lib/utils/cloudinaryLoader";
import clsx from "clsx";

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
    /**
     * Optional lower-res variant. No longer required for responsiveness —
     * next/image generates the responsive srcset from `desktopSrc` and the
     * Cloudinary loader serves the best size/format (WebP/AVIF) per device.
     */
    mobileSrc?: string;
    alt: string;
    priority?: boolean;
    className?: string;
    sizes?: string;
    imageTop?: boolean;
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
    alt,
    priority = false,
    className = "",
    sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
    imageTop = false,
}: ResponsiveSiteImageProps) {
    const publicId = getCloudinaryPublicId(desktopSrc);
    if (!publicId) return null;

    // next/image + the Cloudinary loader (c_fill, g_auto, f_auto) build the
    // responsive srcset and serve WebP/AVIF at the optimal size per device.
    return (
        <Image
            loader={cloudinaryLoader}
            src={publicId}
            alt={alt}
            fill
            priority={priority}
            sizes={sizes}
            className={clsx(
                "object-cover",
                { "object-top": imageTop === true },
                className
            )}
        />
    );
}
