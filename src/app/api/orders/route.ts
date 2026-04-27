import { MemoryStore } from "@/lib/data/memoryStore";
import { Audit } from "@/lib/data/audit";
import type { OrderLineInput } from "@/lib/data/types";

function badRequest(message: string) {
    return Response.json({ error: message }, { status: 400 });
}

export async function POST(req: Request) {
    const body = (await req.json().catch(() => null)) as {
        customerName?: unknown;
        phone?: unknown;
        email?: unknown;
        lines?: unknown;
    } | null;

    if (!body) return badRequest("Invalid JSON body.");

    const customerName =
        typeof body.customerName === "string" ? body.customerName.trim() : "";
    const phone = typeof body.phone === "string" ? body.phone.trim() : "";
    const email =
        typeof body.email === "string" && body.email.trim().length > 0
            ? body.email.trim()
            : undefined;

    if (customerName.length < 2) return badRequest("Please enter your name.");
    if (phone.length < 7) return badRequest("Please enter a valid phone number.");

    const lines = Array.isArray(body.lines) ? (body.lines as unknown[]) : [];
    const parsed: OrderLineInput[] = [];
    for (const l of lines) {
        if (!l || typeof l !== "object") continue;
        const rec = l as Record<string, unknown>;
        const merchItemId = typeof rec.merchItemId === "string" ? rec.merchItemId : "";
        const size = typeof rec.size === "string" ? rec.size : "";
        const qty = typeof rec.qty === "number" ? rec.qty : Number(rec.qty);
        if (!merchItemId || !size || !Number.isFinite(qty) || qty <= 0) continue;
        parsed.push({ merchItemId, size, qty });
    }

    if (parsed.length === 0) return badRequest("Please select at least one item.");

    const order = MemoryStore.createOrder({ customerName, phone, email, lines: parsed });
    Audit.record({ type: "order_created", orderId: order.id });

    return Response.json({ order });
}
