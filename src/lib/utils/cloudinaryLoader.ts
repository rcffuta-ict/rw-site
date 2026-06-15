// @/lib/utils/cloudinaryLoader.ts

export default function cloudinaryLoader({
    src,
    width,
    quality = 80,
}: {
    src: string;
    width: number;
    quality?: number;
}) {
    if (!src) return "";

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

    // f_auto handles WebP/AVIF delivery perfectly!
    const optimizationParams = `c_fill,g_auto,w_${width},q_${quality || "auto"},f_auto`;

    // If it's an external non-Cloudinary HTTPS link, we can't optimize it this way
    if (src.includes("https://") && !src.includes("res.cloudinary.com")) {
        return src;
    }

    // Extract the clean public ID if it's a full Cloudinary URL
    const publicId = getCloudinaryPublicId(src);

    // Build a fresh, perfectly optimized URL every time
    return `https://res.cloudinary.com/${cloudName}/image/upload/${optimizationParams}/${publicId}`;
}

/**
 * Strips extensions and folders to grab just the clean Cloudinary public ID,
 * or returns the string directly if it's already just the name.
 */
export function getCloudinaryPublicId(urlOrId: string | null | undefined): string | null {
    if (!urlOrId) return null;
    if (!urlOrId.includes("/upload/")) return urlOrId;

    // 1. Fixed the regex by escaping forward slashes properly: \/
    const match = urlOrId.match(
        /\/upload\/(?:[a-zA-Z0-9_,]+\/)*(?:v\d+\/)?(.+?)(?:\.\w+)?$/
    );

    // 2. Added a strict check to ensure 'match' is not null before accessing index 1
    return match && match[1] ? match[1] : urlOrId;
}
