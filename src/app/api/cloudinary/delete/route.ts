// POST /api/cloudinary/delete
// Server-side delete endpoint — requires API secret (never exposed to browser).
// Body: { publicId: string }

import { deleteCloudinaryAsset } from "@/lib/cloudinary/server";

export async function POST(request: Request) {
    try {
        const body      = await request.json() as { publicId?: string };
        const publicId  = body?.publicId;

        if (!publicId || typeof publicId !== "string") {
            return Response.json({ error: "publicId is required." }, { status: 400 });
        }

        await deleteCloudinaryAsset(publicId);
        return Response.json({ success: true });
    } catch (err) {
        console.error("[cloudinary/delete]", err);
        return Response.json(
            { error: err instanceof Error ? err.message : "Delete failed." },
            { status: 500 }
        );
    }
}
