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
 * Extracts the clean Cloudinary public ID from a delivery URL, or returns the
 * string directly if it's already a bare public ID.
 *
 * The public ID INCLUDES any folder path (e.g. `rw26/products/<id>`) — folders
 * are part of the ID in Cloudinary, so they must be preserved. Only the
 * transformation block, the version segment, and the file extension are removed.
 */
export function getCloudinaryPublicId(urlOrId: string | null | undefined): string | null {
    if (!urlOrId) return null;
    // Already a bare public ID (may legitimately contain folder segments).
    if (!urlOrId.includes("/upload/")) return urlOrId;

    // Everything after the delivery-type segment.
    let rest = urlOrId.split("/upload/")[1] ?? "";

    // A version marker (`v1700000000/`) sits between any transformations and the
    // public ID. When present, the public ID is everything after it — so drop
    // the version and any transformation segment(s) that preceded it.
    const version = rest.match(/(?:^|\/)v\d+\//);
    if (version) {
        rest = rest.slice(version.index! + version[0].length);
    } else {
        // No version segment. Drop a leading transformation block if present —
        // Cloudinary transforms are comma-joined params (e.g. `c_fill,w_400`),
        // which a real folder name never is.
        const firstSlash = rest.indexOf("/");
        if (firstSlash !== -1 && rest.slice(0, firstSlash).includes(",")) {
            rest = rest.slice(firstSlash + 1);
        }
    }

    // Strip the file extension only — folder slashes are part of the public ID.
    rest = rest.replace(/\.[^/.]+$/, "");

    return rest || urlOrId;
}
