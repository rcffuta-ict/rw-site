import { MemoryStore } from "@/lib/data/memoryStore";
import { Audit } from "@/lib/data/audit";

function badRequest(message: string) {
  return Response.json({ error: message }, { status: 400 });
}

export async function POST(req: Request) {
  const form = await req.formData().catch(() => null);
  if (!form) return badRequest("Invalid form data.");

  const orderId = form.get("orderId");
  if (typeof orderId !== "string" || orderId.trim().length === 0)
    return badRequest("Missing orderId.");

  const file = form.get("file");
  if (!(file instanceof File)) return badRequest("Missing file.");
  if (file.size <= 0) return badRequest("Empty file.");
  if (file.size > 6 * 1024 * 1024) return badRequest("File too large (max 6MB).");

  // For now, we do not persist to disk (to stay deployment-safe). We only
  // record metadata and treat this as “submitted”. Supabase Storage will replace this.
  const safeName = file.name.replace(/[^\w.\-() ]+/g, "_").slice(0, 80);
  const updated = MemoryStore.attachReceipt(orderId, safeName);
  if (!updated) return badRequest("Unknown orderId.");
  Audit.record({
    type: "receipt_submitted",
    orderId: updated.id,
    meta: { filename: safeName },
  });

  return Response.json({ order: updated });
}

