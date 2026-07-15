// @/lib/utils/cloudinaryLoader.ts

export default function cloudinaryLoader({
    src,
    width,
    quality,
}: {
    src: string;
    width: number;
    quality?: number;
}) {
    if (!src) return "";

    // External non-Cloudinary links can't be transformed this way — pass through.
    if (src.startsWith("http") && !src.includes("res.cloudinary.com")) {
        return src;
    }

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const publicId = getCloudinaryPublicId(src);
    if (!cloudName || !publicId) return src;

    // Honour an explicit numeric quality (from next/image's `quality` prop);
    // otherwise let Cloudinary pick the fewest bytes that preserve perceived
    // quality. `q_auto` (content-aware) is typically 15–30% smaller than a fixed
    // q_80 at the same visual quality.
    const q = typeof quality === "number" ? `q_${quality}` : "q_auto";

    // Delivery transformation, ordered for readability:
    //   c_fill,g_auto   → cover-crop to the box, auto-focus the salient region
    //   f_auto          → serve AVIF/WebP when the browser supports it
    //   q_auto          → content-aware compression (biggest byte win)
    //   fl_progressive  → progressive render on the JPEG fallback (faster first paint)
    //   w_<width>       → next/image drives this via its responsive srcset
    //
    // Deliberately NO dpr_auto: next/image already bakes device pixel density into
    // `width` (its srcset picks a larger width on retina screens), so dpr_auto
    // would double-scale and inflate the payload.
    const optimizationParams = `c_fill,g_auto,f_auto,${q},fl_progressive,w_${width}`;

    // Build a fresh, optimized URL every time.
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
