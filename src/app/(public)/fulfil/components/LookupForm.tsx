"use client";

import { useState } from "react";
import { Button } from "@/components/ui/forms/Button";
import { getDemoOrder } from "@/lib/data/orders";
import type { Order } from "@/lib/data/types";
import { Input } from "@/components/ui/forms/Input";

interface LookupFormProps {
    initialRef: string;
    onOrderFound: (order: Order, ref: string) => void;
}

export function LookupForm({ initialRef, onOrderFound }: LookupFormProps) {
    const [refInput, setRefInput] = useState(initialRef);
    const [notFound, setNotFound] = useState(false);
    const [loadingLookup, setLoadingLookup] = useState(false);

    async function handleLookup() {
        if (refInput.length !== 6) return;

        setNotFound(false);
        setLoadingLookup(true);
        // Artificial delay for elegant animation
        await new Promise((r) => setTimeout(r, 600));

        try {
            const stored = JSON.parse(
                localStorage.getItem("rw_demo_orders") ?? "[]"
            ) as Order[];
            const local = stored.find(
                (o: Order) => o.orderRef.toUpperCase() === refInput.toUpperCase()
            );
            if (local) {
                setLoadingLookup(false);
                onOrderFound(local, refInput);
                return;
            }
        } catch {}

        const found = getDemoOrder(refInput);
        if (found) {
            onOrderFound(found, refInput);
        } else {
            setNotFound(true);
        }
        setLoadingLookup(false);
    }

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center section-container py-12 animate-fade-in-up">
            <div className="max-w-md w-full text-center mb-8">
                <div className="inline-flex h-20 w-20 items-center justify-center rounded-[2rem] bg-rw-crimson/10 border border-rw-crimson/20 shadow-sm mb-8">
                    <svg
                        className="h-10 w-10 text-rw-crimson"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                        />
                    </svg>
                </div>
                <h1 className="section-heading text-4xl mb-4">Lookup Order</h1>
                <p className="text-rw-text-2 text-lg">
                    Enter your 6-character reference code to securely pay for your order.
                </p>
            </div>

            <div className="w-full max-w-md bg-white rounded-[2rem] p-8 sm:p-10 shadow-2xl shadow-rw-ink/5 border border-[var(--rw-border)]">
                <Input
                    type="text"
                    value={refInput}
                    onChange={(e) =>
                        setRefInput(
                            e.target.value
                                .toUpperCase()
                                .replace(/[^A-F0-9]/g, "")
                                .slice(0, 6)
                        )
                    }
                    placeholder="000000"
                    maxLength={6}
                    className="h-20 text-center font-mono text-4xl tracking-[0.3em] text-rw-ink uppercase"
                    containerClassName="w-full"
                />
                {notFound && (
                    <div className="mt-5 p-4 rounded-xl bg-red-50 border border-red-100 flex items-center gap-3 animate-bounce-subtle">
                        <svg
                            className="h-5 w-5 text-red-500 shrink-0"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                        </svg>
                        <p className="text-sm text-red-700 font-medium">
                            Order not found. Please verify the code.
                        </p>
                    </div>
                )}
                <Button
                    variant="primary"
                    size="lg"
                    className="w-full mt-8 !h-14 text-lg rounded-xl"
                    onClick={handleLookup}
                    disabled={refInput.length !== 6 || loadingLookup}
                    loading={loadingLookup}
                >
                    {loadingLookup ? "Searching..." : "Locate Order"}
                </Button>
            </div>
        </div>
    );
}
