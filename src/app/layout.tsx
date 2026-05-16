import type { Metadata } from "next";
import { Inter, Syne, JetBrains_Mono } from "next/font/google";
import { AppStatusProvider } from "@/context/AppStatusContext";
import "./globals.css";

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
    title: "Redemption Week '26 — RCF FUTA",
    description:
        "38th Anniversary Redemption Week — The Lord's Witnesses: The Purified Army. A full week of Word, Prayer, Worship & Community. Redeemed Christian Fellowship, FUTA Akure.",
    keywords: ["Redemption Week", "RCFFUTA", "RCF FUTA", "RW26", "38th Anniversary", "FUTA", "Akure"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className={`${inter.variable} ${syne.variable} ${jetbrainsMono.variable}`}>
                <AppStatusProvider>
                    {children}
                </AppStatusProvider>
            </body>
        </html>
    );
}
