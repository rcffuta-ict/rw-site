"use client";

import { useMemo, useState } from "react";
import type { MerchItem } from "@/lib/data/types";
import styles from "../shared/pageShell.module.css";

type LineState = { merchItemId: string; size: string; qty: number };

export function OrderClient({ items }: { items: MerchItem[] }) {
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [lines, setLines] = useState<LineState[]>([]);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);

  const total = useMemo(() => {
    let sum = 0;
    for (const l of lines) {
      const item = items.find((i) => i.id === l.merchItemId);
      if (!item) continue;
      sum += item.basePriceNgn * l.qty;
    }
    return sum;
  }, [items, lines]);

  function upsertLine(next: LineState) {
    setLines((prev) => {
      const without = prev.filter((p) => p.merchItemId !== next.merchItemId);
      if (next.qty <= 0) return without;
      return [...without, next];
    });
  }

  async function submitOrder() {
    setError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          customerName,
          phone,
          email,
          lines,
        }),
      });
      const data: unknown = await res.json();
      if (!res.ok) {
        const msg =
          typeof data === "object" && data && "error" in data
            ? String((data as { error: unknown }).error)
            : "Failed to create order.";
        throw new Error(msg);
      }
      const order =
        typeof data === "object" && data && "order" in data
          ? (data as { order: { id: string } }).order
          : null;
      if (!order?.id) throw new Error("Unexpected response.");
      setOrderId(order.id);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  async function uploadReceipt() {
    if (!orderId) return;
    if (!receiptFile) {
      setError("Please choose a receipt file first.");
      return;
    }
    setError(null);
    setBusy(true);
    try {
      const fd = new FormData();
      fd.set("orderId", orderId);
      fd.set("file", receiptFile);

      const res = await fetch("/api/receipts", { method: "POST", body: fd });
      const data: unknown = await res.json();
      if (!res.ok) {
        const msg =
          typeof data === "object" && data && "error" in data
            ? String((data as { error: unknown }).error)
            : "Upload failed.";
        throw new Error(msg);
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className={styles.card}>
      <div className={styles.cardTitle}>Order form</div>
      <p className={styles.muted}>
        Select items, submit your order, then upload your payment receipt.
      </p>

      <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
        <label>
          <span className={styles.tag}>Name</span>
          <input
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Your name"
            style={inputStyle}
          />
        </label>
        <label>
          <span className={styles.tag}>Phone</span>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="080..."
            style={inputStyle}
          />
        </label>
        <label>
          <span className={styles.tag}>Email</span>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="optional"
            style={inputStyle}
          />
        </label>
      </div>

      <div style={{ marginTop: 14, display: "grid", gap: 10 }}>
        {items.map((item) => {
          const current = lines.find((l) => l.merchItemId === item.id);
          const size = current?.size ?? item.sizes[0]!;
          const qty = current?.qty ?? 0;
          return (
            <div
              key={item.id}
              style={{
                border: "1px solid var(--rw-border)",
                borderRadius: 16,
                padding: 12,
                background: "#fff",
              }}
            >
              <div style={{ fontWeight: 900 }}>{item.name}</div>
              <div style={{ color: "var(--rw-muted)", marginTop: 6 }}>
                ₦{item.basePriceNgn.toLocaleString()} each
              </div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 10 }}>
                <select
                  value={size}
                  onChange={(e) =>
                    upsertLine({ merchItemId: item.id, size: e.target.value, qty })
                  }
                  style={inputStyle}
                >
                  {item.sizes.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  min={0}
                  value={qty}
                  onChange={(e) =>
                    upsertLine({
                      merchItemId: item.id,
                      size,
                      qty: Number(e.target.value),
                    })
                  }
                  style={inputStyle}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 12, fontWeight: 900 }}>
        Total: ₦{total.toLocaleString()}
      </div>

      {error ? (
        <div style={{ marginTop: 12, color: "#b42318", fontWeight: 700 }}>
          {error}
        </div>
      ) : null}

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12 }}>
        <button disabled={busy || Boolean(orderId)} onClick={submitOrder} style={btnPrimary}>
          {orderId ? "Order created" : busy ? "Submitting..." : "Submit order"}
        </button>
        {orderId ? (
          <span style={{ color: "var(--rw-muted)" }}>Order ID: {orderId}</span>
        ) : null}
      </div>

      <div style={{ marginTop: 16 }}>
        <div style={{ fontWeight: 900 }}>Receipt upload</div>
        <div style={{ marginTop: 10, display: "flex", gap: 10, flexWrap: "wrap" }}>
          <input
            type="file"
            accept="image/*,application/pdf"
            onChange={(e) => setReceiptFile(e.target.files?.[0] ?? null)}
          />
          <button disabled={busy || !orderId} onClick={uploadReceipt} style={btnSecondary}>
            {busy ? "Uploading..." : "Upload receipt"}
          </button>
        </div>
        <div style={{ marginTop: 8, color: "var(--rw-muted)", fontSize: 13 }}>
          Max 6MB. This is recorded now; Supabase Storage will store the file later.
        </div>
      </div>
    </section>
  );
}

const inputStyle: React.CSSProperties = {
  height: 44,
  padding: "0 12px",
  borderRadius: 14,
  border: "1px solid var(--rw-border)",
  background: "#fff",
  fontWeight: 700,
};

const btnPrimary: React.CSSProperties = {
  height: 44,
  padding: "0 16px",
  borderRadius: 14,
  border: "1px solid transparent",
  background: "var(--rw-primary)",
  color: "var(--rw-primary-contrast)",
  fontWeight: 900,
  cursor: "pointer",
};

const btnSecondary: React.CSSProperties = {
  height: 44,
  padding: "0 16px",
  borderRadius: 14,
  border: "1px solid var(--rw-border)",
  background: "#fff",
  color: "var(--rw-fg)",
  fontWeight: 900,
  cursor: "pointer",
};

