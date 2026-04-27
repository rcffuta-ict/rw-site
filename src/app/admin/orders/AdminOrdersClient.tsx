"use client";

import { useEffect, useMemo, useState } from "react";
import type { Order, OrderStatus } from "@/lib/data/types";
import { ui } from "../../shared/ui";

function statusLabel(s: OrderStatus) {
    switch (s) {
        case "pending_payment":
            return "Pending payment";
        case "receipt_submitted":
            return "Receipt submitted";
        case "confirmed":
            return "Confirmed";
        case "rejected":
            return "Rejected";
        case "fulfilled":
            return "Fulfilled";
    }
}

export function AdminOrdersClient() {
    const [orders, setOrders] = useState<Order[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [q, setQ] = useState("");

    async function load() {
        setError(null);
        const token = sessionStorage.getItem("rw_admin_token");
        const res = await fetch("/api/admin/orders", {
            headers: token ? { "x-rw-admin-token": token } : {},
        });
        const data: unknown = await res.json();
        if (!res.ok) {
            const msg =
                typeof data === "object" && data && "error" in data
                    ? String((data as { error: unknown }).error)
                    : "Failed to load orders.";
            throw new Error(msg);
        }
        const ordersPayload =
            typeof data === "object" && data && "orders" in data
                ? (data as { orders: Order[] }).orders
                : null;
        if (!Array.isArray(ordersPayload)) throw new Error("Unexpected response.");
        setOrders(ordersPayload);
    }

    useEffect(() => {
        (async () => {
            try {
                await load();
            } catch (e: unknown) {
                setError(e instanceof Error ? e.message : "Failed to load.");
            }
        })();
    }, []);

    const filtered = useMemo(() => {
        if (!orders) return null;
        const s = q.trim().toLowerCase();
        if (!s) return orders;
        return orders.filter((o) => {
            return (
                o.id.toLowerCase().includes(s) ||
                o.customerName.toLowerCase().includes(s) ||
                o.phone.toLowerCase().includes(s) ||
                (o.email ?? "").toLowerCase().includes(s)
            );
        });
    }, [orders, q]);

    async function setStatus(orderId: string, status: OrderStatus) {
        setError(null);
        const token = sessionStorage.getItem("rw_admin_token");
        const res = await fetch("/api/admin/orders/status", {
            method: "POST",
            headers: {
                "content-type": "application/json",
                ...(token ? { "x-rw-admin-token": token } : {}),
            },
            body: JSON.stringify({ orderId, status }),
        });
        const data: unknown = await res.json();
        if (!res.ok) {
            const msg =
                typeof data === "object" && data && "error" in data
                    ? String((data as { error: unknown }).error)
                    : "Failed to update.";
            throw new Error(msg);
        }
        const nextOrder =
            typeof data === "object" && data && "order" in data
                ? (data as { order: Order }).order
                : null;
        if (!nextOrder?.id) throw new Error("Unexpected response.");
        setOrders((prev) =>
            prev ? prev.map((o) => (o.id === nextOrder.id ? nextOrder : o)) : prev
        );
    }

    async function downloadCsv() {
        setError(null);
        try {
            const token = sessionStorage.getItem("rw_admin_token");
            const res = await fetch("/api/admin/orders/export", {
                headers: token ? { "x-rw-admin-token": token } : {},
            });
            if (!res.ok) {
                const data = (await res.text().catch(() => "")) as string;
                throw new Error(data || "Export failed.");
            }
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "rw_orders.csv";
            a.click();
            URL.revokeObjectURL(url);
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : "Export failed.");
        }
    }

    return (
        <section className={ui.card}>
            <div className={ui.cardTitle}>Orders</div>

            <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
                <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Search name / phone / order id..."
                    style={{
                        height: 44,
                        minWidth: 260,
                        flex: 1,
                        padding: "0 12px",
                        borderRadius: 14,
                        border: "1px solid var(--rw-border)",
                        background: "#fff",
                        fontWeight: 700,
                    }}
                />
                <button
                    onClick={() =>
                        load().catch((e: unknown) =>
                            setError(e instanceof Error ? e.message : "Failed.")
                        )
                    }
                    style={{
                        height: 44,
                        padding: "0 16px",
                        borderRadius: 14,
                        border: "1px solid var(--rw-border)",
                        background: "#fff",
                        color: "var(--rw-fg)",
                        fontWeight: 900,
                        cursor: "pointer",
                    }}
                >
                    Refresh
                </button>
                <button
                    onClick={downloadCsv}
                    style={{
                        height: 44,
                        padding: "0 16px",
                        borderRadius: 14,
                        border: "1px solid var(--rw-border)",
                        background: "#fff",
                        color: "var(--rw-fg)",
                        fontWeight: 900,
                        cursor: "pointer",
                    }}
                >
                    Export CSV
                </button>
            </div>

            {error ? (
                <div className="mt-3 font-extrabold text-red-700">
                    {error}{" "}
                    <span className="font-semibold text-slate-500">
                        (If you’re not logged in, go to{" "}
                        <a className={ui.inlineLink} href="/admin/login">
                            /admin/login
                        </a>
                        .)
                    </span>
                </div>
            ) : null}

            <div style={{ marginTop: 12, display: "grid", gap: 12 }}>
                {filtered?.length ? (
                    filtered.map((o) => (
                        <div
                            key={o.id}
                            style={{
                                border: "1px solid var(--rw-border)",
                                borderRadius: 16,
                                padding: 12,
                                background: "#fff",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    gap: 10,
                                }}
                            >
                                <div style={{ fontWeight: 900 }}>
                                    {o.customerName}{" "}
                                    <span
                                        style={{
                                            color: "var(--rw-muted)",
                                            fontWeight: 800,
                                        }}
                                    >
                                        ({o.phone})
                                    </span>
                                </div>
                                <div
                                    style={{
                                        fontWeight: 900,
                                        color: "var(--rw-primary)",
                                    }}
                                >
                                    ₦{o.totalNgn.toLocaleString()}
                                </div>
                            </div>

                            <div
                                style={{
                                    marginTop: 6,
                                    color: "var(--rw-muted)",
                                    fontSize: 13,
                                }}
                            >
                                {o.id} · {statusLabel(o.status)} ·{" "}
                                {new Date(o.createdAt).toLocaleString()}
                            </div>

                            <div style={{ marginTop: 10, display: "grid", gap: 6 }}>
                                {o.lines.map((l, idx) => (
                                    <div
                                        key={idx}
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                        }}
                                    >
                                        <span style={{ fontWeight: 800 }}>
                                            {l.merchItemName} ({l.size}) × {l.qty}
                                        </span>
                                        <span
                                            style={{
                                                color: "var(--rw-muted)",
                                                fontWeight: 800,
                                            }}
                                        >
                                            ₦{(l.unitPriceNgn * l.qty).toLocaleString()}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div
                                style={{
                                    marginTop: 10,
                                    color: "var(--rw-muted)",
                                    fontSize: 13,
                                }}
                            >
                                Receipt:{" "}
                                {o.receipt ? (
                                    <span style={{ fontWeight: 800 }}>
                                        {o.receipt.filename} (uploaded{" "}
                                        {new Date(o.receipt.uploadedAt).toLocaleString()})
                                    </span>
                                ) : (
                                    <span style={{ fontWeight: 800 }}>none</span>
                                )}
                            </div>

                            <div
                                style={{
                                    marginTop: 10,
                                    display: "flex",
                                    gap: 8,
                                    flexWrap: "wrap",
                                }}
                            >
                                <button
                                    onClick={() => setStatus(o.id, "confirmed")}
                                    style={miniBtn}
                                >
                                    Confirm
                                </button>
                                <button
                                    onClick={() => setStatus(o.id, "rejected")}
                                    style={miniBtn}
                                >
                                    Reject
                                </button>
                                <button
                                    onClick={() => setStatus(o.id, "fulfilled")}
                                    style={miniBtn}
                                >
                                    Fulfilled
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div style={{ marginTop: 12, color: "var(--rw-muted)" }}>
                        {orders ? "No orders yet." : "Loading..."}
                    </div>
                )}
            </div>
        </section>
    );
}

const miniBtn: React.CSSProperties = {
    height: 38,
    padding: "0 12px",
    borderRadius: 12,
    border: "1px solid var(--rw-border)",
    background: "#fff",
    color: "var(--rw-fg)",
    fontWeight: 900,
    cursor: "pointer",
};
