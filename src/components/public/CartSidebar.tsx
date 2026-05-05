"use client";

import { useCart } from "@/components/public/CartContext";
import { ph } from "@/lib/utils/functions";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function CartSidebar({ onClose }: { onClose: () => void }) {
    const { items, removeItem, updateQuantity, total, itemCount } = useCart();

    return (
        <>
            <div
                className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
                onClick={onClose}
                aria-hidden
            />
            <aside
                className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-white shadow-2xl animate-slide-in-right"
                aria-label="Cart"
            >
                <div className="flex items-center justify-between border-b border-[var(--rw-border)] px-6 py-4 sticky top-0 bg-white">
                    <h2 className="font-display font-bold text-lg text-rw-ink">
                        Shopping Cart{" "}
                        <span className="font-normal text-sm text-rw-muted">
                            ({itemCount})
                        </span>
                    </h2>
                    <button
                        onClick={onClose}
                        aria-label="Close"
                        className="rounded-full p-2 text-rw-muted hover:text-rw-ink hover:bg-rw-bg-alt transition-colors"
                    >
                        <svg
                            className="h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={1.8}
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18 18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                {items.length === 0 ? (
                    <div className="flex flex-1 flex-col items-center justify-center gap-5 p-8 text-center">
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-rw-bg-alt">
                            <svg
                                className="h-8 w-8 text-rw-muted"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={1.5}
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                                />
                            </svg>
                        </div>
                        <p className="text-rw-muted">Your cart is empty</p>
                        <Button variant="outlined" size="md" onClick={onClose}>
                            Browse Merch
                        </Button>
                    </div>
                ) : (
                    <>
                        <ul className="flex-1 overflow-y-auto divide-y divide-[var(--rw-border)]">
                            {items.map((item) => (
                                <li key={item.variantId} className="flex gap-4 p-5">
                                    <div className="h-20 w-20 rounded-xl overflow-hidden shrink-0 bg-rw-bg-alt">
                                        <img
                                            src={ph(80, 80, item.productName.slice(0, 8))}
                                            alt={item.productName}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                    <div className="flex flex-1 flex-col gap-1.5 min-w-0">
                                        <p className="font-semibold text-sm text-rw-ink truncate">
                                            {item.productName}
                                        </p>
                                        <p className="text-xs text-rw-muted truncate">
                                            {item.variantLabel}
                                        </p>
                                        <p className="text-sm font-bold text-rw-crimson">
                                            ₦
                                            {(
                                                item.unitPrice * item.quantity
                                            ).toLocaleString()}
                                        </p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <div className="flex items-center border border-[var(--rw-border)] rounded-lg overflow-hidden">
                                                <button
                                                    onClick={() =>
                                                        updateQuantity(
                                                            item.variantId,
                                                            item.quantity - 1
                                                        )
                                                    }
                                                    className="h-7 w-7 flex items-center justify-center text-rw-ink hover:bg-rw-bg-alt text-xs font-bold"
                                                >
                                                    −
                                                </button>
                                                <span className="w-7 text-center text-xs font-bold text-rw-ink border-x border-[var(--rw-border)]">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() =>
                                                        updateQuantity(
                                                            item.variantId,
                                                            item.quantity + 1
                                                        )
                                                    }
                                                    className="h-7 w-7 flex items-center justify-center text-rw-ink hover:bg-rw-bg-alt text-xs font-bold"
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => removeItem(item.variantId)}
                                                className="ml-auto text-xs text-rw-muted hover:text-rw-crimson transition-colors font-medium"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        <div className="border-t border-[var(--rw-border)] p-5 flex flex-col gap-4 bg-white sticky bottom-0">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-rw-text-2">
                                    Subtotal
                                </span>
                                <span className="font-display font-bold text-xl text-rw-ink">
                                    ₦{total.toLocaleString()}
                                </span>
                            </div>
                            <Link
                                href="/checkout"
                                onClick={onClose}
                                id="cart-checkout-cta"
                            >
                                <Button variant="primary" size="lg" className="w-full">
                                    Proceed to Checkout
                                </Button>
                            </Link>
                            <button
                                onClick={onClose}
                                className="text-xs text-center text-rw-muted hover:text-rw-ink transition-colors"
                            >
                                Continue shopping
                            </button>
                        </div>
                    </>
                )}
            </aside>
        </>
    );
}
