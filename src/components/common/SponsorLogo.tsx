"use client";

import Image from "next/image";
import cloudinaryLoader, { getCloudinaryPublicId } from "@/lib/utils/cloudinaryLoader";

interface SponsorLogoProps {
    src?: string | null;
    alt: string;
    /** Rendered box size in px (square). */
    size?: number;
    className?: string;
}

/**
 * Renders a sponsor logo from either a local /public path (e.g. the Skybil seed)
 * or a Cloudinary URL (admin uploads) — picking the right next/image loader for
 * each. Falls back to a neutral placeholder when no logo is set.
 */
export function SponsorLogo({ src, alt, size = 48, className = "" }: SponsorLogoProps) {
    if (!src) {
        return (
            <div
                aria-hidden
                className={`flex items-center justify-center bg-rw-bg-alt text-rw-muted ${className}`}
                style={{ width: size, height: size }}
            >
                <svg className="h-1/2 w-1/2" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M18 8.25h.008v.008H18V8.25z" />
                </svg>
            </div>
        );
    }

    const isCloud = src.includes("res.cloudinary.com");
    if (isCloud) {
        const publicId = getCloudinaryPublicId(src) ?? src;
        return (
            <Image
                loader={cloudinaryLoader}
                src={publicId}
                alt={alt}
                width={size}
                height={size}
                className={className}
            />
        );
    }

    // Local /public asset — the default next/image loader handles it.
    return <Image src={src} alt={alt} width={size} height={size} className={className} />;
}
