"use client";

import { useEffect } from "react";
import Image from "next/image";
import { LOGOS } from "@/lib/config";

export default function AdminLoading() {
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "instant" });
    }, []);

    return (
        <div className="flex items-center justify-center min-h-[60vh] w-full">
            <div className="flex flex-col items-center justify-center gap-6">
                <div className="relative flex items-center justify-center h-20 w-20 bg-rw-ink rounded-2xl shadow-xl shadow-rw-ink/20 animate-fade-in-up">
                    <div className="absolute inset-0 border border-[var(--rw-border)]/10 rounded-2xl" />
                    {LOGOS.tenureIcon ? (
                        <Image
                            src={LOGOS.tenureIcon}
                            alt="Admin Preloader"
                            width={44}
                            height={44}
                            className="object-contain animate-pulse"
                            priority
                        />
                    ) : (
                        <div className="h-10 w-10 bg-white/20 rounded-full animate-pulse" />
                    )}
                </div>

                <div
                    className="flex flex-col items-center gap-3 animate-fade-in-up"
                    style={{ animationDelay: "150ms" }}
                >
                    <p className="text-[11px] font-black text-rw-ink uppercase tracking-[0.25em] animate-pulse-soft">
                        Rw&#39;26 Admin Portal
                    </p>
                    <div className="flex items-center gap-1.5">
                        <div
                            className="h-1 w-6 bg-rw-crimson rounded-full animate-pulse"
                            style={{ animationDelay: "0ms" }}
                        />
                        <div
                            className="h-1 w-6 bg-rw-crimson/50 rounded-full animate-pulse"
                            style={{ animationDelay: "150ms" }}
                        />
                        <div
                            className="h-1 w-6 bg-rw-crimson/20 rounded-full animate-pulse"
                            style={{ animationDelay: "300ms" }}
                        />
                    </div>
                    <p className="text-[10px] text-rw-muted font-mono mt-1 uppercase tracking-widest">
                        Loading...
                    </p>
                </div>
            </div>
        </div>
    );
}
