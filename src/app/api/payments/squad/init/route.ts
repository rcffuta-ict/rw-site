import { MemoryStore } from "@/lib/data/memoryStore";

/**
 * Placeholder endpoint for Squad payment initialization.
 *
 * When we enable Squad:
 * - call Squad "initiate payment" API
 * - persist a payment reference for the order
 * - return checkout url / reference to client
 */
export async function POST(req: Request) {
    const body = (await req.json().catch(() => null)) as { orderId?: unknown } | null;
    const orderId = body && typeof body.orderId === "string" ? body.orderId : "";
    if (!orderId) return Response.json({ error: "Missing orderId." }, { status: 400 });

    const order = MemoryStore.getOrder(orderId);
    if (!order) return Response.json({ error: "Unknown orderId." }, { status: 400 });

    return Response.json({
        message: "Squad integration not enabled yet. Use manual transfer.",
        orderId: order.id,
    });
}
