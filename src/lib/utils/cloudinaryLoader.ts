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
    if (!src || !src.includes("res.cloudinary.com")) return src;

    // FIXED: Added a trailing slash at the end of the optimization string
    const optimizationParams = `upload/f_auto,q_auto,w_${width},c_limit/`;

    // Replace the first instance of 'upload/' with the optimization chunk + slash
    return src.replace("upload/", optimizationParams);
}
