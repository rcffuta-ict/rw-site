"use client";

import React from "react";
import type { Order } from "@/lib/data/types";
import { TENURE, FELLOWSHIP, LOGOS } from "@/lib/config";
import { formatNaira } from "@/lib/utils/functions";
import Image from "next/image";

interface VerdictDocumentProps {
    id: string;
    verdictRef?: string;
    orders: Order[];
    generatedBy: string;
    generatedAt: string;
}

export function VerdictDocument({
    id,
    verdictRef,
    orders,
    generatedBy,
    generatedAt,
}: VerdictDocumentProps) {
    const totalAmount = orders.reduce((sum, o) => sum + o.totalAmount, 0);
    const totalPaid = orders.reduce((sum, o) => sum + o.amountPaid, 0);
    const totalDebit = totalAmount - totalPaid;

    // 1. Consolidate items across all orders for the Production Manifest
    const consolidatedItems: Record<
        string,
        { label: string; quantity: number; unitPrice: number }
    > = {};
    orders.forEach((order) => {
        order.items.forEach((item) => {
            const key = `${item.productName}-${item.variantLabel}`;
            if (!consolidatedItems[key]) {
                consolidatedItems[key] = {
                    label: `${item.productName} (${item.variantLabel})`,
                    quantity: 0,
                    unitPrice: item.unitPrice,
                };
            }
            consolidatedItems[key].quantity += item.quantity;
        });
    });

    const items = Object.values(consolidatedItems);
    const totalUnits = items.reduce((s, i) => s + i.quantity, 0);

    return (
        <div
            id="verdict-document"
            className="bg-white border border-rw-ink/10 shadow-2xl rounded-sm overflow-hidden font-serif"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
        >
            {/* ── Letterhead ── */}
            <div
                style={{
                    padding: "48px",
                    borderBottom: "8px solid #FF0015",
                    background: "linear-gradient(135deg, #fdf5f5 0%, #fff 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "24px",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                    <div className="relative flex items-center justify-center h-20 w-20 bg-rw-ink rounded-2xl shadow-xl shadow-rw-ink/20">
                        <div className="absolute inset-0 border border-[var(--rw-border)]/10 rounded-2xl" />
                        {LOGOS.tenureIcon ? (
                            <Image
                                src={LOGOS.tenureIcon}
                                alt="Admin Preloader"
                                width={44}
                                height={44}
                                className="object-contain"
                                priority
                            />
                        ) : (
                            <div className="h-10 w-10 bg-white/20 rounded-full" />
                        )}
                    </div>

                    <div>
                        <p
                            style={{
                                fontSize: "22px",
                                fontWeight: "900",
                                color: "#1C0003",
                                textTransform: "uppercase",
                                letterSpacing: "-0.03em",
                                fontFamily: "sans-serif",
                                margin: 0,
                            }}
                        >
                            {TENURE.brandLabel}
                        </p>
                        <p
                            style={{
                                fontSize: "10px",
                                fontWeight: "700",
                                color: "#9c7080",
                                textTransform: "uppercase",
                                letterSpacing: "0.3em",
                                margin: "4px 0 0 0",
                                fontFamily: "sans-serif",
                            }}
                        >
                            {FELLOWSHIP.shortName} · Administrative Verdict
                        </p>
                    </div>
                </div>

                <div style={{ textAlign: "right" }}>
                    <p
                        style={{
                            fontSize: "10px",
                            fontWeight: "700",
                            color: "#9c7080",
                            textTransform: "uppercase",
                            letterSpacing: "0.3em",
                            margin: "0 0 4px 0",
                            fontFamily: "sans-serif",
                        }}
                    >
                        Document Reference
                    </p>
                    <p
                        style={{
                            fontSize: "20px",
                            fontWeight: "900",
                            color: "#1C0003",
                            fontFamily: "monospace",
                            margin: 0,
                        }}
                    >
                        {verdictRef || `#${id.toUpperCase()}`}
                    </p>
                    <p
                        style={{
                            fontSize: "10px",
                            color: "#9c7080",
                            margin: "4px 0 0 0",
                            fontFamily: "sans-serif",
                        }}
                    >
                        {new Date(generatedAt).toLocaleDateString("en-NG", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                        })}
                    </p>
                </div>
            </div>

            {/* ── Content: Two columns ── */}
            <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr" }}>
                {/* LEFT COLUMN — Item Manifest & Detailed Allocations */}
                <div style={{ padding: "40px", borderRight: "1px solid #e8d0d4" }}>
                    {/* Consolidated Manifest Title */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginBottom: "24px",
                            paddingBottom: "16px",
                            borderBottom: "1px solid #e8d0d4",
                        }}
                    >
                        <p
                            style={{
                                fontSize: "11px",
                                fontWeight: "900",
                                color: "#1C0003",
                                textTransform: "uppercase",
                                letterSpacing: "0.3em",
                                margin: 0,
                                fontFamily: "sans-serif",
                            }}
                        >
                            Production Manifest (Consolidated)
                        </p>
                        <span
                            style={{
                                fontSize: "10px",
                                fontWeight: "900",
                                background: "#1C0003",
                                color: "white",
                                padding: "4px 10px",
                                borderRadius: "999px",
                                fontFamily: "sans-serif",
                                letterSpacing: "0.1em",
                            }}
                        >
                            {totalUnits} Units
                        </span>
                    </div>

                    {/* Consolidated Manifest List */}
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "16px",
                            marginBottom: "40px",
                        }}
                    >
                        {items.map((item, idx) => (
                            <div
                                key={idx}
                                style={{
                                    display: "flex",
                                    alignItems: "flex-start",
                                    gap: "16px",
                                }}
                            >
                                <span
                                    style={{
                                        height: "36px",
                                        width: "36px",
                                        flexShrink: 0,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        borderRadius: "10px",
                                        background: "#fdf5f5",
                                        border: "1px solid #e8d0d4",
                                        color: "#FF0015",
                                        fontFamily: "monospace",
                                        fontWeight: "900",
                                        fontSize: "12px",
                                    }}
                                >
                                    {item.quantity}×
                                </span>
                                <div style={{ flex: 1 }}>
                                    <p
                                        style={{
                                            fontSize: "12px",
                                            fontWeight: "900",
                                            color: "#1C0003",
                                            textTransform: "uppercase",
                                            margin: "0 0 2px 0",
                                            fontFamily: "sans-serif",
                                        }}
                                    >
                                        {item.label.split(" (")[0]}
                                    </p>
                                    <p
                                        style={{
                                            fontSize: "10px",
                                            color: "#9c7080",
                                            fontStyle: "italic",
                                            margin: 0,
                                            fontFamily: "sans-serif",
                                        }}
                                    >
                                        {item.label.split(" (")[1]?.replace(")", "")}
                                    </p>
                                </div>
                                <span
                                    style={{
                                        fontSize: "11px",
                                        fontWeight: "700",
                                        color: "#9c7080",
                                        fontFamily: "monospace",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    {formatNaira(item.unitPrice * item.quantity)}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* ── New Section: Detailed Order Item Breakdowns ── */}
                    <div
                        style={{
                            marginBottom: "24px",
                            paddingBottom: "12px",
                            borderBottom: "1px solid #e8d0d4",
                        }}
                    >
                        <p
                            style={{
                                fontSize: "11px",
                                fontWeight: "900",
                                color: "#1C0003",
                                textTransform: "uppercase",
                                letterSpacing: "0.3em",
                                margin: 0,
                                fontFamily: "sans-serif",
                            }}
                        >
                            Order Specific Allocations
                        </p>
                    </div>

                    <div
                        style={{ display: "flex", flexDirection: "column", gap: "24px" }}
                    >
                        {orders.map((order) => (
                            <div
                                key={order.id}
                                style={{
                                    border: "1px solid #e8d0d4",
                                    borderRadius: "12px",
                                    padding: "16px",
                                    background: "#fff",
                                }}
                            >
                                {/* Order Header mapping to orderRef */}
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        marginBottom: "12px",
                                        borderBottom: "1px dashed #e8d0d4",
                                        paddingBottom: "8px",
                                    }}
                                >
                                    <span
                                        style={{
                                            fontFamily: "monospace",
                                            fontSize: "12px",
                                            fontWeight: "900",
                                            color: "#1C0003",
                                        }}
                                    >
                                        {order.orderRef}
                                    </span>
                                    <span
                                        style={{
                                            fontSize: "10px",
                                            color: "#9c7080",
                                            fontFamily: "sans-serif",
                                            fontWeight: "700",
                                        }}
                                    >
                                        {order.items.reduce(
                                            (acc, i) => acc + i.quantity,
                                            0
                                        )}{" "}
                                        Items
                                    </span>
                                </div>

                                {/* Order Nested Items mapped using OrderItem interface */}
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "10px",
                                    }}
                                >
                                    {order.items.map((item) => (
                                        <div
                                            key={item.id}
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "8px",
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        fontFamily: "monospace",
                                                        fontSize: "11px",
                                                        fontWeight: "700",
                                                        color: "#FF0015",
                                                    }}
                                                >
                                                    {item.quantity}x
                                                </span>
                                                <div>
                                                    <p
                                                        style={{
                                                            margin: 0,
                                                            fontSize: "11px",
                                                            fontWeight: "700",
                                                            color: "#1C0003",
                                                            fontFamily: "sans-serif",
                                                        }}
                                                    >
                                                        {item.productName}
                                                    </p>
                                                    <p
                                                        style={{
                                                            margin: 0,
                                                            fontSize: "9px",
                                                            color: "#9c7080",
                                                            fontFamily: "sans-serif",
                                                        }}
                                                    >
                                                        {item.variantLabel}
                                                    </p>
                                                </div>
                                            </div>
                                            <span
                                                style={{
                                                    fontFamily: "monospace",
                                                    fontSize: "11px",
                                                    color: "#1C0003",
                                                }}
                                            >
                                                {formatNaira(
                                                    item.unitPrice * item.quantity
                                                )}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Logistics advisory */}
                    <div
                        style={{
                            marginTop: "32px",
                            padding: "16px 20px",
                            background: "#fdf5f5",
                            borderRadius: "12px",
                            border: "1px solid #e8d0d4",
                        }}
                    >
                        <p
                            style={{
                                fontSize: "9px",
                                fontWeight: "900",
                                color: "#9c7080",
                                textTransform: "uppercase",
                                letterSpacing: "0.3em",
                                margin: "0 0 6px 0",
                                fontFamily: "sans-serif",
                            }}
                        >
                            Logistics Advisory
                        </p>
                        <p
                            style={{
                                fontSize: "11px",
                                color: "#1C0003",
                                lineHeight: "1.6",
                                fontStyle: "italic",
                                margin: 0,
                            }}
                        >
                            Verify unit counts against physical inventory before
                            distribution. Report any discrepancies to the Logistics Lead
                            immediately.
                        </p>
                    </div>
                </div>

                {/* RIGHT COLUMN — Financials & Sign-off */}
                <div
                    style={{
                        padding: "40px",
                        display: "flex",
                        flexDirection: "column",
                        background: "#fdf5f5",
                    }}
                >
                    <p
                        style={{
                            fontSize: "11px",
                            fontWeight: "900",
                            color: "#1C0003",
                            textTransform: "uppercase",
                            letterSpacing: "0.3em",
                            margin: "0 0 24px 0",
                            fontFamily: "sans-serif",
                            paddingBottom: "16px",
                            borderBottom: "1px solid #e8d0d4",
                        }}
                    >
                        Financial Breakdown
                    </p>

                    {/* Covered orders */}
                    <div style={{ marginBottom: "24px" }}>
                        <p
                            style={{
                                fontSize: "9px",
                                fontWeight: "700",
                                color: "#9c7080",
                                textTransform: "uppercase",
                                letterSpacing: "0.3em",
                                margin: "0 0 10px 0",
                                fontFamily: "sans-serif",
                            }}
                        >
                            Covered Orders ({orders.length})
                        </p>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                            {orders.map((o) => (
                                <span
                                    key={o.orderRef}
                                    style={{
                                        fontFamily: "monospace",
                                        fontSize: "10px",
                                        fontWeight: "900",
                                        color: "#1C0003",
                                        background: "white",
                                        border: "1px solid #e8d0d4",
                                        borderRadius: "8px",
                                        padding: "4px 10px",
                                    }}
                                >
                                    {o.orderRef}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Per-order debit breakdown */}
                    <div style={{ marginBottom: "20px" }}>
                        <p
                            style={{
                                fontSize: "9px",
                                fontWeight: "700",
                                color: "#9c7080",
                                textTransform: "uppercase",
                                letterSpacing: "0.3em",
                                margin: "0 0 10px 0",
                                fontFamily: "sans-serif",
                            }}
                        >
                            Per-Order Debit Summary
                        </p>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "6px",
                            }}
                        >
                            {orders.map((o) => {
                                const balance = o.totalAmount - o.amountPaid;
                                return (
                                    <div
                                        key={o.orderRef}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            fontSize: "10px",
                                            fontFamily: "sans-serif",
                                        }}
                                    >
                                        <span
                                            style={{
                                                fontFamily: "monospace",
                                                fontWeight: "700",
                                                color: "#1C0003",
                                            }}
                                        >
                                            {o.orderRef}
                                        </span>
                                        <span
                                            style={{
                                                color: "#FF0015",
                                                fontWeight: "900",
                                            }}
                                        >
                                            −{formatNaira(balance)}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Financial totals */}
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "10px",
                            paddingTop: "16px",
                            borderTop: "1px solid #e8d0d4",
                            marginBottom: "auto",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                fontSize: "11px",
                                fontWeight: "700",
                                color: "#9c7080",
                                fontFamily: "sans-serif",
                            }}
                        >
                            <span>Gross Valuation</span>
                            <span>{formatNaira(totalAmount)}</span>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                fontSize: "11px",
                                fontWeight: "700",
                                color: "#9c7080",
                                fontFamily: "sans-serif",
                            }}
                        >
                            <span>Amount Collected</span>
                            <span style={{ color: "#015500" }}>
                                {formatNaira(totalPaid)}
                            </span>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                fontSize: "14px",
                                fontWeight: "900",
                                color: "#1C0003",
                                paddingTop: "12px",
                                borderTop: "2px solid #1C0003",
                                fontFamily: "sans-serif",
                            }}
                        >
                            <span>Financial Debit Required</span>
                            <span style={{ color: "#FF0015" }}>
                                {formatNaira(totalDebit)}
                            </span>
                        </div>
                    </div>

                    {/* Authorization */}
                    <div
                        style={{
                            marginTop: "32px",
                            paddingTop: "24px",
                            borderTop: "2px dashed #FF0015",
                        }}
                    >
                        <p
                            style={{
                                fontSize: "9px",
                                fontWeight: "900",
                                color: "#9c7080",
                                textTransform: "uppercase",
                                letterSpacing: "0.4em",
                                margin: "0 0 40px 0",
                                fontFamily: "sans-serif",
                                textAlign: "center",
                            }}
                        >
                            Authorization & Sign-off
                        </p>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: "8px",
                            }}
                        >
                            <div
                                style={{
                                    height: "2px",
                                    background: "#1C0003",
                                    width: "70%",
                                    marginBottom: "4px",
                                }}
                            />
                            <p
                                style={{
                                    fontSize: "18px",
                                    fontWeight: "900",
                                    color: "#1C0003",
                                    textTransform: "uppercase",
                                    letterSpacing: "-0.02em",
                                    fontStyle: "italic",
                                    margin: 0,
                                    fontFamily: "sans-serif",
                                }}
                            >
                                {generatedBy}
                            </p>
                            <p
                                style={{
                                    fontSize: "9px",
                                    fontWeight: "900",
                                    color: "#FF0015",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.3em",
                                    margin: 0,
                                    fontFamily: "sans-serif",
                                }}
                            >
                                Logistics Directorate — Authorized
                            </p>
                            <p
                                style={{
                                    fontSize: "9px",
                                    color: "#9c7080",
                                    margin: 0,
                                    fontFamily: "sans-serif",
                                }}
                            >
                                {new Date(generatedAt).toLocaleDateString("en-NG", {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                })}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div
                style={{
                    padding: "20px 40px",
                    background: "#1C0003",
                    color: "rgba(255,255,255,0.35)",
                    fontSize: "9px",
                    fontWeight: "700",
                    textTransform: "uppercase",
                    letterSpacing: "0.5em",
                    textAlign: "center",
                    fontFamily: "sans-serif",
                }}
            >
                {FELLOWSHIP.fullName} · {TENURE.eventName} {TENURE.year} · Official
                Internal Document
            </div>
        </div>
    );
}
