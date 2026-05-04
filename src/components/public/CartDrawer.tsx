"use client";

import { useCart } from "./CartContext";
import Link from "next/link";

export function CartDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const { items, removeItem, updateQuantity, total } = useCart();

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden"
                    onClick={onClose}
                    aria-hidden
                />
            )}

            {/* Drawer — slides up from bottom on mobile */}
            <div
                className={`fixed bottom-0 left-0 right-0 z-50 md:hidden bg-rw-surface rounded-t-3xl border-t border-[var(--rw-border-mid)] shadow-2xl transition-transform duration-300 ease-out ${isOpen ? "translate-y-0" : "translate-y-full"}`}
                style={{ maxHeight: "85dvh" }}
            >
                {/* Drag handle */}
                <div className="flex justify-center pt-3 pb-1">
                    <div className="h-1 w-10 rounded-full bg-rw-muted/30" />
                </div>

                {/* Header */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--rw-border)]">
                    <div className="flex items-center gap-2">
                        <span className="font-display font-bold text-rw-ink">Cart</span>
                        {items.length > 0 && (
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rw-crimson text-white text-xs font-bold">
                                {items.reduce((s, i) => s + i.quantity, 0)}
                            </span>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-full p-1.5 text-rw-muted hover:text-rw-ink hover:bg-rw-bg-alt transition-colors"
                        aria-label="Close cart"
                    >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Items */}
                <div className="overflow-y-auto px-5 py-4 flex flex-col gap-3" style={{ maxHeight: "45dvh" }}>
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center gap-3 py-8 text-center">
                            <span className="text-3xl">🛒</span>
                            <p className="text-rw-muted text-sm">Your cart is empty.</p>
                            <button onClick={onClose} className="text-sm font-semibold text-rw-crimson hover:underline">
                                Continue shopping
                            </button>
                        </div>
                    ) : (
                        items.map(item => (
                            <div key={item.variantId} className="flex items-center gap-3">
                                {/* Thumbnail */}
                                <div className="img-placeholder h-14 w-14 rounded-xl shrink-0">
                                    <svg className="h-6 w-6 text-rw-crimson/30 z-10 relative" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2C9 7 6 9 6 13a6 6 0 0 0 12 0c0-4-3-6-6-11z" />
                                    </svg>
                                </div>
                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-rw-ink truncate">{item.productName}</p>
                                    <p className="text-xs text-rw-muted truncate">{item.variantLabel}</p>
                                    <p className="text-sm font-bold text-rw-crimson mt-0.5">₦{(item.unitPrice * item.quantity).toLocaleString()}</p>
                                </div>
                                {/* Qty stepper */}
                                <div className="flex items-center gap-1.5 shrink-0">
                                    <button
                                        onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                                        className="h-7 w-7 rounded-full border border-[var(--rw-border-mid)] flex items-center justify-center text-rw-text-2 hover:border-rw-crimson hover:text-rw-crimson transition-colors text-sm font-bold"
                                        aria-label="Decrease quantity"
                                    >−</button>
                                    <span className="w-5 text-center text-sm font-bold text-rw-ink">{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                                        className="h-7 w-7 rounded-full border border-[var(--rw-border-mid)] flex items-center justify-center text-rw-text-2 hover:border-rw-crimson hover:text-rw-crimson transition-colors text-sm font-bold"
                                        aria-label="Increase quantity"
                                    >+</button>
                                    <button
                                        onClick={() => removeItem(item.variantId)}
                                        className="ml-1 h-7 w-7 rounded-full flex items-center justify-center text-rw-muted hover:text-rw-crimson transition-colors"
                                        aria-label="Remove item"
                                    >
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="px-5 pt-3 pb-6 border-t border-[var(--rw-border)] flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                            <span className="font-semibold text-rw-ink">Total</span>
                            <span className="font-display font-bold text-xl text-rw-crimson">₦{total.toLocaleString()}</span>
                        </div>
                        <Link
                            href="/checkout"
                            onClick={onClose}
                            className="w-full rounded-xl bg-fire-gradient px-4 py-3.5 text-sm font-bold text-white text-center shadow-md hover:opacity-90 transition-opacity"
                        >
                            Proceed to Checkout →
                        </Link>
                    </div>
                )}
            </div>
        </>
    );
}
