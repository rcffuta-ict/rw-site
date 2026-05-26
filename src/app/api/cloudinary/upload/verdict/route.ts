// POST /api/cloudinary/upload/verdict
// Server-side signed upload for verdict PDFs.
// Accepts multipart/form-data with a `file` (PDF blob) and an optional `verdictRef`.
// Stores under rw26/verdicts/. Returns { publicId, url }.

import { env } from "@/lib/env";

async function sha1(input: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuf = await crypto.subtle.digest("SHA-1", data);
    return Array.from(new Uint8Array(hashBuf))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
}

export async function POST(request: Request) {
    try {
        const formData   = await request.formData();
        const fileEntry  = formData.get("file");
        const verdictRef = (formData.get("verdictRef") as string) || `verdict-${Date.now()}`;

        if (!fileEntry || typeof fileEntry === "string") {
            return Response.json({ error: "No file provided." }, { status: 400 });
        }

        const { cloudName, apiKey, apiSecret, verdictsFolder } = env.cloudinary;

        if (!cloudName || !apiKey || !apiSecret) {
            return Response.json(
                { error: "Cloudinary server credentials are not configured." },
                { status: 500 }
            );
        }

        const arrayBuffer = await (fileEntry as File).arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64 = `data:application/pdf;base64,${buffer.toString("base64")}`;

        const folder    = verdictsFolder ?? "rw26/verdicts";
        const publicId  = `${folder}/${verdictRef.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
        const timestamp = Math.round(Date.now() / 1000);

        const signaturePayload = `folder=${folder}&public_id=${publicId}&resource_type=raw&timestamp=${timestamp}${apiSecret}`;
        const signature = await sha1(signaturePayload);

        const uploadForm = new FormData();
        uploadForm.append("timestamp", String(timestamp));
        uploadForm.append("api_key", apiKey);
        uploadForm.append("signature", signature);
        uploadForm.append("folder", folder);
        uploadForm.append("public_id", publicId);
        uploadForm.append("resource_type", "raw");
        uploadForm.append("file", base64);

        const res = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`,
            { method: "POST", body: uploadForm }
        );

        if (!res.ok) {
            const err = await res.text();
            throw new Error(`Cloudinary verdict upload failed: ${err}`);
        }

        const data = await res.json() as { public_id: string; secure_url: string };
        return Response.json({ publicId: data.public_id, url: data.secure_url });
    } catch (err) {
        console.error("[cloudinary/upload/verdict]", err);
        return Response.json(
            { error: err instanceof Error ? err.message : "Upload failed." },
            { status: 500 }
        );
    }
}
