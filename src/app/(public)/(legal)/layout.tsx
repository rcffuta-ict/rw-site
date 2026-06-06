"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandDisplay } from "@/components/common/BrandDisplay";
import { TENURE } from "@/lib/config";
import { HeaderBanner } from "@/components/common/HeaderBanner";

function determinProps(pathname: string | null) {
    const props: {
        title: string;
        description: string;
        header: string;
        related: { label: string; href: string }[];
        showDate: boolean;
    } = {
        title: "",
        description: "",
        header: "Legal Information",
        related: [],
        showDate: true,
    };

    switch (pathname) {
        case "/terms":
            props.title = "Terms of Service";
            props.description = `Please read these terms carefully before using the ${TENURE.brandLabel} Pre-Order Platform.`;
            props.related.push(
                { label: "Privacy Policy", href: "/privacy" }
                // { label: "How to Order", href: "/docs" }
            );
            break;
        case "/privacy":
            props.title = "Privacy Policy";
            props.description =
                "We respect your privacy and are committed to protecting your personal data. Please read this policy carefully.";
            props.related.push(
                { label: "Terms of Service", href: "/terms" }
                // { label: "How to Order", href: "/docs" }
            );
            break;
        case "/docs":
            props.header = "Complete Ordering Guide";
            props.title = "How to Order";
            props.description = `Everything you need to know about shopping, paying, and completing
                                    your ${TENURE.brandLabel} order. Follow our simple step-by-step
                                    guide.`;
            props.showDate = false;
            break;
        default:
            props.title = "Legal Information";
            props.description = "";
    }

    return props;
}

export default function LegalLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const lastUpdated = "May 29, 2026";

    const {
        title,
        description: desc,
        header,
        related,
        showDate,
    } = determinProps(pathname);

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Banner */}

            <HeaderBanner
                bannerDescription="Formal Banner Background with Event Branding"
                title={title}
                description={desc}
                header={header}
            />

            {/* Brand Display */}

            {/* Content */}
            <div className="bg-white py-10">
                <div className="section-container max-w-4xl">
                    <BrandDisplay center={false} />
                    {showDate && (
                        <div className="mb-12 p-4 bg-slate-50 rounded-lg border border-slate-200">
                            <p className="text-sm text-slate-600">
                                <strong>Last Updated:</strong> {lastUpdated}
                            </p>
                        </div>
                    )}

                    <div className="prose prose-slate max-w-none space-y-8">
                        {children}
                    </div>

                    {/* Links to other policies */}
                    {related.length > 0 && (
                        <div className="mt-16 pt-8 border-t border-slate-200">
                            <p className="text-sm text-slate-600 mb-4">
                                Related Documents:
                            </p>
                            <div className="flex flex-wrap gap-3">
                                {related.map((link, index) => (
                                    <>
                                        <Link
                                            key={index}
                                            href={link.href}
                                            className="text-rw-crimson hover:text-rw-crimson/80 font-semibold"
                                        >
                                            {link.label}
                                        </Link>
                                        {index < related.length - 1 && (
                                            <span className="text-slate-300">•</span>
                                        )}
                                    </>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
