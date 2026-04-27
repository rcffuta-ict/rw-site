import { MemoryStore } from "@/lib/data/memoryStore";
import { isAdminToken } from "@/lib/admin";

export async function GET(req: Request) {
  const token = req.headers.get("x-rw-admin-token");
  if (!isAdminToken(token)) {
    return Response.json({ error: "Unauthorized." }, { status: 401 });
  }

  return Response.json({ orders: MemoryStore.listOrders() });
}

