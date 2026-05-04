"use client";

import { useCart } from "@/components/public/CartContext";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function CartSidebar({ onClose }: { onClose: () => void }) {
    const { items, removeItem, updateQuantity, total, itemCount } = useCart();

    return (
        <>
            <div className="fixed inset-0 z-40 bg-black/20" onClick={onClose} aria-hidden />
            <aside className="fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col bg-rw-surface border-l border-[var(--rw-border)] shadow-xl animate-slide-in-right" aria-label="Cart">
                <div className="flex items-center justify-between border-b border-[var(--rw-border)] px-5 py-4 sticky top-0 bg-rw-surface">
                    <h2 className="font-display font-bold text-rw-ink">
                        Cart <span className="font-normal text-sm text-rw-muted">({itemCount})</span>
                    </h2>
                    <button onClick={onClose} aria-label="Close" className="rounded-lg p-1.5 text-rw-muted hover:text-rw-ink hover:bg-rw-bg-alt transition-colors">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                {items.length === 0 ? (
                    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rw-bg-alt border border-[var(--rw-border)]">
                            <svg className="h-7 w-7 text-rw-muted" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" /></svg>
                        </div>
                        <p className="text-rw-muted text-sm">Your cart is empty</p>
                        <Button variant="outlined" size="sm" onClick={onClose}>Browse Merch</Button>
                    </div>
                ) : (
                    <>
                        <ul className="flex-1 overflow-y-auto divide-y divide-[var(--rw-border)]">
                            {items.map((item) => (
                                <li key={item.variantId} className="flex gap-3 p-4">
                                    <div className="h-16 w-16 rounded-xl img-placeholder shrink-0 relative">
                                        <span className="sr-only">{item.productName}</span>
                                    </div>
                                    <div className="flex flex-1 flex-col gap-1 min-w-0">
                                        <p className="font-semibold text-sm text-rw-ink truncate">{item.productName}</p>
                                        <p className="text-xs text-rw-muted truncate">{item.variantLabel}</p>
                                        <p className="text-sm font-bold text-rw-crimson">₦{(item.unitPrice * item.quantity).toLocaleString()}</p>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <button onClick={() => updateQuantity(item.variantId, item.quantity - 1)} className="h-6 w-6 rounded border border-[var(--rw-border-mid)] flex items-center justify-center text-rw-ink hover:bg-rw-bg-alt text-xs">−</button>
                                            <span className="text-xs font-bold text-rw-ink w-4 text-center tabular-nums">{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.variantId, item.quantity + 1)} className="h-6 w-6 rounded border border-[var(--rw-border-mid)] flex items-center justify-center text-rw-ink hover:bg-rw-bg-alt text-xs">+</button>
                                            <button onClick={() => removeItem(item.variantId)} className="ml-auto text-xs text-rw-muted hover:text-rw-crimson transition-colors">Remove</button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        <div className="border-t border-[var(--rw-border)] p-4 flex flex-col gap-3">
                            <div className="flex justify-between font-bold">
                                <span className="text-rw-text-2 text-sm">Total</span>
                                <span className="text-rw-crimson">₦{total.toLocaleString()}</span>
                            </div>
                            <Link href="/checkout" onClick={onClose} id="cart-checkout-cta">
                                <Button variant="primary" size="lg" className="w-full">Checkout →</Button>
                            </Link>
                            <button onClick={onClose} className="text-xs text-center text-rw-muted hover:text-rw-ink transition-colors">Continue shopping</button>
                        </div>
                    </>
                )}
            </aside>
        </>
    );
}
