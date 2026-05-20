import type { Metadata } from "next";
import { Inter, Syne, JetBrains_Mono } from "next/font/google";
import { AppStatusProvider } from "@/context/AppStatusContext";
import "./globals.css";
import { TENURE, FELLOWSHIP } from "@/lib/config";
import { env } from "@/lib/env";

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

export const metadata: Metadata = {
    metadataBase: new URL(env.siteUrl),
    title: {
        default: `${TENURE.eventName} ${TENURE.shortYear} — ${FELLOWSHIP.shortName}`,
        template: `%s | ${TENURE.eventName} ${TENURE.shortYear} — ${FELLOWSHIP.shortName}`,
    },
    description: `${TENURE.anniversaryLabel} ${TENURE.eventName} — ${TENURE.theme}. A full week of Word, Prayer, Worship & Community. ${FELLOWSHIP.fullName}.`,
    keywords: [
        TENURE.eventName,
        FELLOWSHIP.shortName,
        FELLOWSHIP.acronym,
        `RW${TENURE.year.slice(2)}`,
        TENURE.anniversaryLabel,
        "FUTA",
        "Akure",
        "Redeemed Christian Fellowship",
        "Worship",
        "Worship FUTA",
    ],
    authors: [{ name: `${FELLOWSHIP.shortName} ICT Team`, url: FELLOWSHIP.website }],
    creator: `${FELLOWSHIP.shortName} ICT Team`,
    openGraph: {
        title: `${TENURE.eventName} ${TENURE.shortYear} — ${FELLOWSHIP.shortName}`,
        description: `${TENURE.anniversaryLabel} ${TENURE.eventName} — ${TENURE.theme}. A full week of Word, Prayer, Worship & Community.`,
        url: env.siteUrl,
        siteName: `${TENURE.eventName} ${TENURE.shortYear}`,
        images: [
            {
                url: "/images/og/og-image.jpg",
                width: 1200,
                height: 630,
                alt: `${TENURE.eventName} ${TENURE.shortYear} — ${TENURE.theme}`,
            },
            {
                url: "/images/og/og-image-square.jpg",
                width: 600,
                height: 600,
                alt: `${TENURE.eventName} ${TENURE.shortYear} Square Share Icon`,
            },
        ],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: `${TENURE.eventName} ${TENURE.shortYear} — ${FELLOWSHIP.shortName}`,
        description: `${TENURE.anniversaryLabel} ${TENURE.eventName} — ${TENURE.theme}.`,
        images: ["/images/og/og-image.jpg"],
        creator: "@rcffuta",
    },
    icons: {
        icon: "/favicon.ico",
        shortcut: "/favicon.ico",
        apple: "/apple-touch-icon.png",
    },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body
                className={`${inter.variable} ${syne.variable} ${jetbrainsMono.variable}`}
            >
                <AppStatusProvider>{children}</AppStatusProvider>
            </body>
        </html>
    );
}
