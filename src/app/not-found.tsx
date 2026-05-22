"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NotFound() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-rw-bg-warm flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background cinematic elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] bg-gradient-to-r from-rw-crimson/5 to-rw-gold/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] pointer-events-none mix-blend-overlay" />

            <div className="relative z-10 flex flex-col items-center text-center animate-fade-in-up">
                {/* 404 Header */}
                <h1 className="font-display font-black text-[120px] sm:text-[160px] leading-none text-transparent bg-clip-text bg-gradient-to-b from-rw-ink to-rw-ink/60 tracking-tighter drop-shadow-sm mb-6">
                    404
                </h1>

                {/* Accent line */}
                <div className="h-1.5 w-16 bg-rw-crimson rounded-full mb-8" />

                <h2 className="font-display font-bold text-3xl sm:text-4xl text-rw-ink tracking-tight mb-4 uppercase">
                    Lost in the Vault
                </h2>

                <p className="text-rw-text-2 text-base sm:text-lg max-w-md mx-auto mb-12 font-medium">
                    The page or resource you are looking for does not exist, has been
                    moved, or you don&apos;t have access to it.
                </p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                    <button
                        onClick={() => router.back()}
                        className="btn-secondary !h-14 px-8 w-full sm:w-auto text-[11px] font-bold uppercase tracking-widest flex items-center justify-center gap-3 bg-white hover:bg-rw-bg-alt shadow-sm border border-[var(--rw-border)]"
                    >
                        <svg
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                            />
                        </svg>
                        Go Back
                    </button>
                    <Link
                        href="/"
                        className="btn-primary !h-14 px-8 w-full sm:w-auto text-[11px] font-bold uppercase tracking-widest shadow-xl shadow-rw-crimson/20 hover:shadow-rw-crimson/30 hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
                    >
                        <svg
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-1.125 1.125-1.125V9.75M8.25 21h8.25"
                            />
                        </svg>
                        Return Home
                    </Link>
                </div>
            </div>

            {/* Footer text */}
            <div className="absolute bottom-10 left-0 right-0 text-center text-[10px] font-bold text-rw-muted uppercase tracking-[0.2em] animate-fade-in delay-500">
                Redemption Week &apos;26 System
            </div>
        </div>
    );
}
