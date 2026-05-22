// ─── Cloudinary Client Helper ─────────────────────────────────────────────────
// Browser-safe — uses unsigned upload preset.
// Used on the /fulfil page for customer payment receipt uploads.
// No API secret is needed or exposed here.

/**
 * Upload a payment receipt image from the browser via Cloudinary's unsigned upload API.
 * Uses the NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET preset (must be set to "Unsigned" in
 * Cloudinary Dashboard → Settings → Upload Presets).
 *
 * @param file - The File object from the file input
 * @returns The Cloudinary public ID and delivery URL
 */
export async function uploadReceiptClient(
    file: File
): Promise<{ publicId: string; url: string }> {
    const cloudName    = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? "rw26_receipts";

    if (!cloudName) {
        throw new Error("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is not set.");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
    formData.append("folder", "rw26/receipts");

    const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: "POST", body: formData }
    );

    if (!res.ok) {
        const err = await res.text();
        throw new Error(`Cloudinary upload failed: ${err}`);
    }

    const data = await res.json() as { public_id: string; secure_url: string };
    return { publicId: data.public_id, url: data.secure_url };
}

/**
 * Delete a payment receipt from Cloudinary via a server-side API route.
 * Deletion cannot be done from the browser (requires API secret), so this
 * function calls the internal API route `/api/cloudinary/delete`.
 *
 * @param publicId - The Cloudinary public ID of the receipt to delete
 */
export async function deleteReceiptClient(publicId: string): Promise<void> {
    const res = await fetch("/api/cloudinary/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicId }),
    });

    if (!res.ok) {
        const err = await res.text();
        throw new Error(`Failed to delete receipt: ${err}`);
    }
}
