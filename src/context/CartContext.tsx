"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { CartItem } from "@/lib/data/types";
import { createOrder, type OrderResult } from "@/lib/services/orders.service";

const CART_KEY = "rw_cart";

export interface CustomerInfo {
    name: string;
    email: string;
    phone: string;
    note?: string;
}

interface CartContextValue {
    items: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (variantId: string) => void;
    updateQuantity: (variantId: string, qty: number) => void;
    clearCart: () => void;
    total: number;
    itemCount: number;
    isOpen: boolean;
    openCart: () => void;
    closeCart: () => void;
    /** Submit the current cart as an order */
    submitOrder: (customer: CustomerInfo) => Promise<OrderResult>;
    isSubmitting: boolean;
    submitError: string | null;
    clearError: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [hydrated, setHydrated] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    // Hydrate from localStorage
    useEffect(() => {
        try {
            const stored = localStorage.getItem(CART_KEY);
            if (stored) setItems(JSON.parse(stored));
        } catch {}
        setHydrated(true);
    }, []);

    // Persist on change
    useEffect(() => {
        if (!hydrated) return;
        try {
            localStorage.setItem(CART_KEY, JSON.stringify(items));
        } catch {}
    }, [items, hydrated]);

    const addItem = useCallback((item: CartItem) => {
        setItems((prev) => {
            const existing = prev.find((i) => i.variantId === item.variantId);
            if (existing) {
                return prev.map((i) =>
                    i.variantId === item.variantId
                        ? { ...i, quantity: i.quantity + item.quantity }
                        : i
                );
            }
            return [...prev, item];
        });
        setIsOpen(true);
    }, []);

    const removeItem = useCallback((variantId: string) => {
        setItems((prev) => prev.filter((i) => i.variantId !== variantId));
    }, []);

    const updateQuantity = useCallback((variantId: string, qty: number) => {
        setItems((prev) => {
            if (qty <= 0) return prev.filter((i) => i.variantId !== variantId);
            return prev.map((i) => (i.variantId === variantId ? { ...i, quantity: qty } : i));
        });
    }, []);

    const clearCart = useCallback(() => {
        setItems([]);
        try { localStorage.removeItem(CART_KEY); } catch {}
    }, []);

    const clearError = useCallback(() => setSubmitError(null), []);

    const submitOrder = useCallback(async (customer: CustomerInfo): Promise<OrderResult> => {
        setIsSubmitting(true);
        setSubmitError(null);
        try {
            const result = await createOrder({
                customerName: customer.name,
                customerEmail: customer.email,
                customerPhone: customer.phone,
                customerNote: customer.note ?? null,
                lines: items.map((i) => ({
                    variantId: i.variantId,
                    productId: i.productId,
                    productName: i.productName,
                    variantLabel: i.variantLabel,
                    unitPrice: i.unitPrice,
                    quantity: i.quantity,
                })),
            });
            if (result.success) {
                clearCart();
            } else {
                setSubmitError(result.error ?? "Something went wrong. Please try again.");
            }
            return result;
        } catch (e) {
            const msg = e instanceof Error ? e.message : "Network error — please try again.";
            setSubmitError(msg);
            return { success: false, error: msg };
        } finally {
            setIsSubmitting(false);
        }
    }, [items, clearCart]);

    const total = items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
    const itemCount = items.reduce((s, i) => s + i.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                items,
                addItem,
                removeItem,
                updateQuantity,
                clearCart,
                total,
                itemCount,
                isOpen,
                openCart: () => setIsOpen(true),
                closeCart: () => setIsOpen(false),
                submitOrder,
                isSubmitting,
                submitError,
                clearError,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart(): CartContextValue {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
    return ctx;
}
