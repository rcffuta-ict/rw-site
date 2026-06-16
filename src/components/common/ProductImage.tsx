import cloudinaryLoader, { getCloudinaryPublicId } from "@/lib/utils/cloudinaryLoader";
import clsx from "clsx";
import Image from "next/image";

interface ProductImageProps {
    imageUrl: string;
    alt: string;
    minimal?: boolean;
    config?: {
        h?: string;
        w?: string;
        className?: string;
    };
    size?: `${number}px`;
}

export function ProductImageMinimal({
    imageUrl,
    alt,
    size = "64px",
    config,
}: Omit<ProductImageProps, "minimal">) {
    // Extract properties with safe fallback defaults cleanly
    const h = config?.h ?? "h-16";
    const w = config?.w ?? "w-16";
    const className = config?.className ?? "";

    const publicId = getCloudinaryPublicId(imageUrl);

    return (
        <div
            className={clsx(
                "rounded-xl overflow-hidden shrink-0 bg-rw-bg-alt border border-(--rw-border) relative",
                h,
                w,
                className
            )}
        >
            <Image
                loader={publicId ? cloudinaryLoader : undefined}
                src={publicId ?? imageUrl}
                alt={alt}
                fill
                sizes={size}
                className="object-cover transition-transform group-hover:scale-110"
            />
        </div>
    );
}

export function ProductImage({
    imageUrl,
    alt,
    minimal = false,
    ...rest
}: ProductImageProps) {
    if (minimal) {
        return <ProductImageMinimal imageUrl={imageUrl} alt={alt} {...rest} />;
    }

    return (
        <Image
            loader={cloudinaryLoader}
            src={imageUrl}
            alt={alt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            priority={false}
        />
    );
}
