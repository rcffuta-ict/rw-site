// POST /api/cloudinary/upload
// Server-side signed upload endpoint for admin variant images.
// Accepts multipart/form-data with a `file` field and an optional `variantId`.
// Returns { publicId, url }.

import { uploadProductImage } from "@/lib/cloudinary/server";

export async function POST(request: Request) {
    try {
        const formData   = await request.formData();
        const fileEntry  = formData.get("file");
        const variantId  = (formData.get("variantId") as string) || `upload-${Date.now()}`;

        if (!fileEntry || typeof fileEntry === "string") {
            return Response.json({ error: "No file provided." }, { status: 400 });
        }

        const arrayBuffer = await fileEntry.arrayBuffer();
        const buffer      = Buffer.from(arrayBuffer);

        const { publicId, url } = await uploadProductImage(buffer, variantId);

        return Response.json({ publicId, url });
    } catch (err) {
        console.error("[cloudinary/upload]", err);
        return Response.json(
            { error: err instanceof Error ? err.message : "Upload failed." },
            { status: 500 }
        );
    }
}
