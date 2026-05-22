// ─── Cloudinary Server Helper ─────────────────────────────────────────────────
// Server-only — uses API key + secret for signed operations.
// Used in admin API routes and Server Actions for product image management.
// NEVER import this file in a client component or browser-facing code.

import { env } from "@/lib/env";

interface CloudinaryUploadResult {
    public_id: string;
    secure_url: string;
    width: number;
    height: number;
    format: string;
    resource_type: string;
}

interface CloudinaryDeleteResult {
    result: "ok" | "not found";
}

/**
 * Upload a product variant image to Cloudinary using a signed upload.
 * Only call from Server Actions or API Route Handlers.
 *
 * @param file     - Buffer or base64 data URI of the image
 * @param variantId - The product variant ID (used to build the public_id)
 * @returns The Cloudinary public ID and delivery URL
 */
export async function uploadProductImage(
    file: Buffer | string,
    variantId: string
): Promise<{ publicId: string; url: string }> {
    const { cloudName, apiKey, apiSecret, productsFolder } = env.cloudinary;

    if (!cloudName || !apiKey || !apiSecret) {
        throw new Error(
            "Cloudinary server credentials are not set. " +
            "Ensure NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET are defined."
        );
    }

    const timestamp = Math.round(Date.now() / 1000);
    const folder    = productsFolder;
    const publicId  = `${folder}/${variantId}`;

    // Build signature string (fields in alphabetical order)
    const signaturePayload = `folder=${folder}&public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
    const signature = await sha1(signaturePayload);

    const formData = new FormData();
    formData.append("timestamp", String(timestamp));
    formData.append("api_key", apiKey);
    formData.append("signature", signature);
    formData.append("folder", folder);
    formData.append("public_id", publicId);
    formData.append(
        "file",
        Buffer.isBuffer(file)
            ? `data:image/jpeg;base64,${file.toString("base64")}`
            : file
    );

    const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: "POST", body: formData }
    );

    if (!res.ok) {
        const err = await res.text();
        throw new Error(`Cloudinary signed upload failed: ${err}`);
    }

    const data = await res.json() as CloudinaryUploadResult;
    return { publicId: data.public_id, url: data.secure_url };
}

/**
 * Delete an asset from Cloudinary by public ID.
 * Only call from Server Actions or API Route Handlers.
 *
 * @param publicId - The Cloudinary public ID to delete
 */
export async function deleteCloudinaryAsset(publicId: string): Promise<void> {
    const { cloudName, apiKey, apiSecret } = env.cloudinary;

    if (!cloudName || !apiKey || !apiSecret) {
        throw new Error("Cloudinary server credentials are not set.");
    }

    const timestamp = Math.round(Date.now() / 1000);
    const signaturePayload = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
    const signature = await sha1(signaturePayload);

    const params = new URLSearchParams({
        public_id: publicId,
        api_key: apiKey,
        timestamp: String(timestamp),
        signature,
    });

    const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`,
        { method: "POST", body: params }
    );

    if (!res.ok) {
        const err = await res.text();
        throw new Error(`Cloudinary delete failed: ${err}`);
    }

    const data = await res.json() as CloudinaryDeleteResult;
    if (data.result !== "ok") {
        throw new Error(`Cloudinary delete returned: ${data.result}`);
    }
}

// ─── Internal: SHA-1 digest ───────────────────────────────────────────────────
// Cloudinary uses HMAC-SHA1 for signatures. Web Crypto API is available in
// Next.js Edge and Node.js runtimes.

async function sha1(input: string): Promise<string> {
    const encoder = new TextEncoder();
    const data     = encoder.encode(input);
    const hashBuf  = await crypto.subtle.digest("SHA-1", data);
    const hashArr  = Array.from(new Uint8Array(hashBuf));
    return hashArr.map((b) => b.toString(16).padStart(2, "0")).join("");
}
