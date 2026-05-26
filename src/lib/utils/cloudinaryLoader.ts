// @/lib/utils/cloudinaryLoader.ts

export default function cloudinaryLoader({
    src,
    width,
    // quality,
}: {
    src: string;
    width: number;
    // quality?: number;
}) {
    // If it's not a Cloudinary asset URL, pass it back unchanged
    if (!src.includes("res.cloudinary.com")) return src;

    // Inject f_auto, q_auto, and matching width transformations right after '/upload/'
    const optimizationParams = `upload/f_auto,q_auto,w_${width},c_limit`;
    return src.replace("upload/", optimizationParams);
}
