import type { Metadata } from "next";
import { Inter, Syne, JetBrains_Mono, Bebas_Neue, DM_Sans } from "next/font/google";
import { AppStatusProvider } from "@/context/AppStatusContext";
import { AdminAuthProvider } from "@/context/AdminAuthContext";
import { TENURE, FELLOWSHIP } from "@/lib/config";
import "./globals.css";

// 1. Font configurations with anti-aliasing helpers
const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
    display: "swap",
});

const syne = Syne({
    subsets: ["latin"],
    variable: "--font-syne",
    weight: ["400", "600", "700", "800"],
    display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
    subsets: ["latin"],
    variable: "--font-jetbrains",
    display: "swap",
});

const bebasNeue = Bebas_Neue({
    weight: "400",
    subsets: ["latin"],
    variable: "--font-bebas",
    display: "swap",
});

const dmSans = DM_Sans({
    subsets: ["latin"],
    variable: "--font-dm-sans",
    display: "swap",
});

// 2. Optimized Metadata
export const metadata: Metadata = {
    metadataBase: "https://rw.rcffuta.com",
    title: {
        default: `${TENURE.eventName} ${TENURE.shortYear} — ${FELLOWSHIP.shortName}`,
        template: `%s | ${TENURE.eventName} ${TENURE.shortYear} — ${FELLOWSHIP.shortName}`,
    },
    description: `${TENURE.anniversaryLabel} ${TENURE.eventName} — ${TENURE.theme}. A full week of Word, Prayer, Worship & Community for sponsors, attendees, and partners. ${FELLOWSHIP.fullName}.`,
    keywords: [
        TENURE.eventName,
        FELLOWSHIP.shortName,
        FELLOWSHIP.acronym,
        `RW${TENURE.year.slice(2)}`,
        `RW26`,
        TENURE.anniversaryLabel,
        "FUTA",
        "Akure",
        "Redeemed Christian Fellowship",
        "Worship FUTA",
        "RCFFUTA Sponsorship",
        "RCFFUTA Pre-order",
    ],
    authors: [{ name: `${FELLOWSHIP.shortName} ICT Team`, url: FELLOWSHIP.website }],
    creator: `${FELLOWSHIP.shortName} ICT Team`,
    openGraph: {
        title: `${TENURE.eventName} ${TENURE.shortYear} — ${FELLOWSHIP.shortName}`,
        description: `Join us for the ${TENURE.anniversaryLabel} ${TENURE.eventName}. Partner with us through sponsorship or explore our exclusive event pre-order store.`,
        url: "https://rw.rcffuta.com", // Next.js automatically resolves this against metadataBase
        siteName: `${TENURE.eventName} ${TENURE.shortYear}`,
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: `${TENURE.eventName} ${TENURE.shortYear} — ${FELLOWSHIP.shortName}`,
        description: `${TENURE.anniversaryLabel} ${TENURE.eventName} — Awareness, Sponsorship & Merch Store.`,
        creator: "@rcffuta",
    },
    icons: {
        icon: [
            { url: "/favicon.ico" },
            { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
            { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
        ],
        shortcut: "/favicon.ico",
        apple: "/apple-touch-icon.png",
    },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className="scroll-smooth">
            <body
                className={`
                    ${inter.variable}
                    ${syne.variable}
                    ${jetbrainsMono.variable}
                    ${bebasNeue.variable}
                    ${dmSans.variable}
                    antialiased font-dm-sans bg-neutral-950 text-neutral-50
                `}
            >
                <AdminAuthProvider>
                    <AppStatusProvider>{children}</AppStatusProvider>
                </AdminAuthProvider>
            </body>
        </html>
    );
}
