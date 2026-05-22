"use server";

import { getOrderByRef, listOrders } from "@/lib/services/orders.service";

export async function getOrderByRefAction(ref: string) {
    return await getOrderByRef(ref);
}

export async function getOrdersByRefsAction(refs: string[]) {
    const all = await listOrders();
    return all.filter(o => refs.includes(o.orderRef));
}

export async function searchOrdersAction(query: string) {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const all = await listOrders();
    return all.filter(
        (o) =>
            o.customerPhone.replace(/\s/g, "").includes(q.replace(/\s/g, "")) ||
            o.customerEmail.toLowerCase().includes(q) ||
            o.orderRef.toLowerCase().includes(q)
    );
}
