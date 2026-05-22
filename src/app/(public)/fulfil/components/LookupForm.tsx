"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/forms/Button";
import { getOrderByRefAction } from "@/app/actions/orders";
import type { Order } from "@/lib/data/types";
import { PAYMENT_CONFIG } from "./constants";
import Link from "next/link";

interface LookupFormProps {
    initialRef: string;
    onOrderFound: (order: Order, ref: string) => void;
}

export function LookupForm({ initialRef, onOrderFound }: LookupFormProps) {
    const [refInput, setRefInput] = useState(initialRef);
    const [notFound, setNotFound] = useState(false);
    const [loadingLookup, setLoadingLookup] = useState(false);

    async function handleLookup() {
        const cleanRef = refInput.trim().toUpperCase();
        if (cleanRef.length !== 6) return;

        setNotFound(false);
        setLoadingLookup(true);
        // Artificial delay for elegant animation
        await new Promise((r) => setTimeout(r, 800));

        const found = await getOrderByRefAction(cleanRef);
        if (found) {
            onOrderFound(found, cleanRef);
        } else {
            setNotFound(true);
        }
        setLoadingLookup(false);
    }

    return (
        <div className="min-h-[75vh] flex flex-col items-center justify-center section-container py-12 animate-fade-in-up">
            <div className="max-w-xl w-full text-center mb-12">
                <div className="inline-flex h-24 w-24 items-center justify-center rounded-[2.5rem] bg-rw-bg-warm border border-rw-gold/20 shadow-xl shadow-rw-gold/5 mb-10 relative group">
                    <div className="absolute inset-0 bg-rw-gold/5 rounded-[2.5rem] animate-pulse group-hover:scale-110 transition-transform" />
                    <svg
                        className="h-10 w-10 text-rw-gold relative z-10"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                        />
                    </svg>
                </div>
                <h1 className="section-heading text-4xl lg:text-5xl mb-4 text-gradient-crimson">
                    Locate Your Order
                </h1>
                <p className="text-rw-text-2 text-lg font-medium max-w-md mx-auto">
                    Enter your 6-character reference code to access payment and
                    fulfillment details.
                </p>
            </div>

            <div className="w-full max-w-lg relative">
                {/* Background accent */}
                <div className="absolute -inset-1 bg-gradient-to-r from-rw-crimson/5 to-rw-gold/5 rounded-[3rem] blur-xl opacity-50" />

                <div className="relative bg-white rounded-[3rem] p-10 lg:p-14 shadow-2xl shadow-rw-ink/5 border border-[var(--rw-border)] flex flex-col gap-8">
                    <div className="space-y-4">
                        <label className="block text-center text-[10px] font-black text-rw-muted uppercase tracking-[0.3em]">
                            Reference Code
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={refInput}
                                onChange={(e) =>
                                    setRefInput(
                                        e.target.value
                                            .toUpperCase()
                                            .replace(/[^A-Z0-9]/g, "")
                                            .slice(0, 6)
                                    )
                                }
                                onKeyDown={(e) => e.key === "Enter" && handleLookup()}
                                placeholder="FF0000"
                                className="w-full h-24 text-center font-mono text-5xl lg:text-6xl font-black tracking-[0.2em] text-rw-ink uppercase bg-rw-bg-alt/30 border-2 border-transparent focus:border-rw-crimson/20 focus:bg-white rounded-3xl transition-all outline-none"
                                spellCheck={false}
                                autoComplete="off"
                            />
                            {loadingLookup && (
                                <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-3xl backdrop-blur-sm">
                                    <div className="h-10 w-10 border-4 border-rw-crimson border-t-transparent rounded-full animate-spin" />
                                </div>
                            )}
                        </div>
                    </div>

                    {notFound && (
                        <div className="p-5 rounded-2xl bg-red-50 border border-red-100 flex items-center gap-4 animate-shake">
                            <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center text-red-500 shadow-sm shrink-0">
                                <svg
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2.5}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                    />
                                </svg>
                            </div>
                            <div className="flex flex-col">
                                <p className="text-sm font-black text-red-900 uppercase tracking-tight leading-none">
                                    Order Not Found
                                </p>
                                <p className="text-xs text-red-700 font-medium mt-1">
                                    Please double-check your reference code.
                                </p>
                            </div>
                        </div>
                    )}

                    <Button
                        variant="primary"
                        size="lg"
                        className="w-full h-16 text-lg font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-rw-crimson/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                        onClick={handleLookup}
                        disabled={refInput.trim().length !== 6 || loadingLookup}
                    >
                        {loadingLookup ? "Locating..." : "Find My Order →"}
                    </Button>
                </div>
            </div>

            <div className="mt-12 text-center text-rw-muted text-sm font-medium">
                <p className="mb-3">
                    Need help or facing issues? Contact our support team via WhatsApp:
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                    {PAYMENT_CONFIG.supportContacts.map((c) => (
                        <Link
                            key={c.phone}
                            href={`https://wa.me/${c.phone}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-rw-ink hover:text-rw-crimson transition-colors bg-rw-surface-1 px-4 py-2 rounded-full border border-[var(--rw-border)] shadow-sm font-semibold"
                        >
                            <svg
                                className="w-5 h-5 text-green-500"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                            </svg>
                            {c.name}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
