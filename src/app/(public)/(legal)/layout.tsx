"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandDisplay } from "@/components/common/BrandDisplay";
import { TENURE } from "@/lib/config";

export default function LegalLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isTerms = pathname?.includes("terms");
    const lastUpdated = "May 29, 2026";

    const title = isTerms ? "Terms of Service" : "Privacy Policy";
    const desc = isTerms
        ? `Please read these terms carefully before using the ${TENURE.brandLabel} Pre-Order Platform.`
        : "We respect your privacy and are committed to protecting your personal data. Please read this policy carefully.";

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Banner */}
            <div className="relative overflow-hidden bg-linear-to-br from-rw-crimson via-rw-crimson/95 to-purple-900 min-h-85 md:min-h-105 flex items-center border-b border-black/10">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,white_0.5px,transparent_0.5px)] bg-size-[20px_20px]" />
                </div>
                <div className="absolute inset-0 bg-linear-to-r from-rw-crimson via-rw-crimson/60 to-transparent md:block hidden" />
                <div className="absolute inset-0 bg-rw-crimson/80 md:hidden block" />
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-rw-crimson via-rw-crimson/40 to-transparent pointer-events-none" />
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-linear-to-t from-white/10 to-transparent pointer-events-none" />

                <div className="section-container relative z-10 w-full py-16 md:py-24">
                    <p className="eyebrow mb-3 text-amber-300! tracking-widest text-xs uppercase font-semibold">
                        Legal Information
                    </p>
                    <h1
                        className="font-display font-extrabold text-white leading-none tracking-tight"
                        style={{ fontSize: "clamp(2.5rem, 5.5vw, 4.5rem)" }}
                    >
                        {title}
                    </h1>
                    <p className="mt-4 text-white/80 text-sm md:text-base leading-relaxed max-w-50ch">
                        {desc}
                    </p>
                </div>
            </div>

            {/* Brand Display */}
            <div className="bg-linear-to-b from-slate-50/60 to-white">
                <BrandDisplay />
            </div>

            {/* Content */}
            <div className="bg-white py-16">
                <div className="section-container max-w-4xl">
                    <div className="mb-12 p-4 bg-slate-50 rounded-lg border border-slate-200">
                        <p className="text-sm text-slate-600">
                            <strong>Last Updated:</strong> {lastUpdated}
                        </p>
                    </div>

                    <div className="prose prose-slate max-w-none space-y-8">
                        {children}
                    </div>

                    {/* Links to other policies */}
                    <div className="mt-16 pt-8 border-t border-slate-200">
                        <p className="text-sm text-slate-600 mb-4">Related Documents:</p>
                        <div className="flex flex-wrap gap-3">
                            {!isTerms && (
                                <>
                                    <Link
                                        href="/terms"
                                        className="text-rw-crimson hover:text-rw-crimson/80 font-semibold"
                                    >
                                        Terms of Service
                                    </Link>
                                    <span className="text-slate-300">•</span>
                                </>
                            )}
                            {isTerms && (
                                <>
                                    <Link
                                        href="/privacy"
                                        className="text-rw-crimson hover:text-rw-crimson/80 font-semibold"
                                    >
                                        Privacy Policy
                                    </Link>
                                    <span className="text-slate-300">•</span>
                                </>
                            )}
                            <Link
                                href="/docs"
                                className="text-rw-crimson hover:text-rw-crimson/80 font-semibold"
                            >
                                How to Order
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
