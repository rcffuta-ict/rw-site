"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function AdminError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error("Admin Error Boundary caught:", error);
    }, [error]);

    const isSupabaseError = error.message.toLowerCase().includes("fetch") || error.message.toLowerCase().includes("supabase") || error.message.toLowerCase().includes("network");

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-rw-bg-alt/80 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl ring-1 ring-[var(--rw-border)] max-w-md w-full overflow-hidden flex flex-col">
                <div className="p-6 border-b border-[var(--rw-border)] flex items-center gap-4 bg-red-50/50">
                    <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                        <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="font-display font-bold text-xl text-rw-ink">
                            {isSupabaseError ? "Connection Error" : "Something went wrong"}
                        </h2>
                        <p className="text-sm text-rw-muted font-medium mt-0.5">
                            {isSupabaseError ? "Unable to load data from Supabase." : "An unexpected error occurred in the admin panel."}
                        </p>
                    </div>
                </div>
                
                <div className="p-6 bg-rw-bg-alt/30 border-b border-[var(--rw-border)] max-h-48 overflow-y-auto">
                    <p className="text-xs font-mono text-red-600 break-words leading-relaxed">
                        {error.message || "Unknown error"}
                    </p>
                </div>

                <div className="p-6 flex items-center justify-end gap-3 bg-white">
                    <Link
                        href="/admin"
                        className="btn-secondary !h-10 px-4 text-xs font-bold"
                    >
                        Go to Dashboard
                    </Link>
                    <button
                        onClick={reset}
                        className="btn-primary !h-10 px-6 text-xs font-bold shadow-md shadow-rw-crimson/20"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        </div>
    );
}
