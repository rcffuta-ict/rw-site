/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { toast } from "sonner";

export interface UploadResult {
    success: boolean;
    publicId?: string;
    url?: string;
    error?: string;
}

export function useCloudinaryUpload() {
    const [isUploading, setIsUploading] = useState(false);

    const uploadImage = async (
        file: File,
        variantId: string,
        toastId?: string
    ): Promise<UploadResult> => {
        setIsUploading(true);

        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("variantId", variantId);

            const res = await fetch("/api/cloudinary/upload", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            if (res.ok && data.publicId && data.url) {
                return {
                    success: true,
                    publicId: data.publicId,
                    url: data.url,
                };
            } else {
                return {
                    success: false,
                    error: data.error || "Failed to upload image",
                };
            }
        } catch (err: any) {
            return {
                success: false,
                error: err.message || "Failed to upload image",
            };
        } finally {
            setIsUploading(false);
        }
    };

    return { uploadImage, isUploading };
}
