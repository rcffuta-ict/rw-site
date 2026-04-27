import { isAdminToken } from "@/lib/admin";
import { Audit } from "@/lib/data/audit";
import { MemoryStore } from "@/lib/data/memoryStore";
import type { OrderStatus } from "@/lib/data/types";

function badRequest(message: string) {
    return Response.json({ error: message }, { status: 400 });
}

export async function POST(req: Request) {
    const token = req.headers.get("x-rw-admin-token");
    if (!isAdminToken(token)) {
        return Response.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body = (await req.json().catch(() => null)) as {
        orderId?: unknown;
        status?: unknown;
    } | null;
    if (!body) return badRequest("Invalid JSON body.");

    const orderId = typeof body.orderId === "string" ? body.orderId : "";
    const status = typeof body.status === "string" ? body.status : "";
    const allowed: OrderStatus[] = [
        "pending_payment",
        "receipt_submitted",
        "confirmed",
        "rejected",
        "fulfilled",
    ];
    if (!orderId) return badRequest("Missing orderId.");
    if (!allowed.includes(status as OrderStatus)) return badRequest("Invalid status.");

    const order = MemoryStore.setStatus(orderId, status as OrderStatus);
    if (!order) return badRequest("Unknown orderId.");
    Audit.record({
        type: "status_changed",
        orderId: order.id,
        meta: { status: order.status },
    });

    return Response.json({ order });
}
