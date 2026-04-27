import { MemoryStore } from "@/lib/data/memoryStore";

export async function GET() {
  return Response.json({ items: MemoryStore.listMerch() });
}

