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
    const optimizationParams = `c_fill,g_auto,w_${width},q_${quality || "auto"},f_auto`;

    // Case 1: If it's already a full URL, inject transformations nicely
    if (src.includes("res.cloudinary.com")) {
        return src.replace("upload/", `upload/${optimizationParams}/`);
    }

    if (src.includes("https://")) {
        return src;
    }

    // Case 2: If it's just the public ID (e.g. 'shop_banner_usufiq'), build the full URL
    return `https://res.cloudinary.com/${cloudName}/image/upload/${optimizationParams}/${src}`;
}

/**
 * Strips extensions and folders to grab just the clean Cloudinary public ID,
 * or returns the string directly if it's already just the name.
 */
export function getCloudinaryPublicId(urlOrId: string | null | undefined): string | null {
    if (!urlOrId) return null;
    if (!urlOrId.includes("/upload/")) return urlOrId;

    const match = urlOrId.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.\w+)?$/);
    return match ? match[1] : urlOrId;
}
