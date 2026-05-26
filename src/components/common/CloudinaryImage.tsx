import cloudinaryLoader from "@/lib/utils/cloudinaryLoader";
import Image from "next/image";

interface ProductImageProps {
    imageUrl: string;
    alt: string;
}

export function ProductImage({ imageUrl, alt }: ProductImageProps) {
    return (
        <Image
            loader={cloudinaryLoader}
            src={imageUrl}
            alt={alt}
            fill // Replaces w-full h-full object-cover since aspect ratio is on parent
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            priority={false} // Keeps lazy loading active for items down the page
        />
    );
}
