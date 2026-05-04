import { isAdminToken } from "@/lib/admin";
import { MemoryStore } from "@/lib/data/memoryStore";

function csvEscape(v: string) {
    const s = v.replaceAll('"', '""');
    return `"${s}"`;
}

export async function GET(req: Request) {
    const token = req.headers.get("x-rw-admin-token");
    if (!isAdminToken(token)) {
        return new Response("Unauthorized", { status: 401 });
    }

    const orders = MemoryStore.listOrders();
    const header = [
        "order_id",
        "created_at",
        "status",
        "customer_name",
        "phone",
        "email",
        "total_ngn",
        "lines",
        "receipt_filename",
    ].join(",");

    const rows = orders.map((o) => {
        const items = o.items
            .map((l) => `${l.productName} (${l.variantLabel}) x${l.quantity}`)
            .join("; ");
        const receipt = o.payments?.[0]?.receiptUrl ?? "";
        return [
            csvEscape(o.id),
            csvEscape(o.createdAt),
            csvEscape(o.status),
            csvEscape(o.customerName),
            csvEscape(o.customerPhone),
            csvEscape(o.customerEmail ?? ""),
            String(o.totalAmount),
            csvEscape(items),
            csvEscape(receipt),
        ].join(",");
    });

    const body = [header, ...rows].join("\n");
    return new Response(body, {
        headers: {
            "content-type": "text/csv; charset=utf-8",
            "content-disposition": 'attachment; filename="rw_orders.csv"',
        },
    });
}
