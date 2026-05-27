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
