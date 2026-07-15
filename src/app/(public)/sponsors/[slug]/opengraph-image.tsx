import { ImageResponse } from "next/og";
import { headers } from "next/headers";
import { getSponsorBySlug } from "@/lib/services/sponsors.service";
import { TENURE, FELLOWSHIP } from "@/lib/config";

// Node runtime so we can hit Supabase (service-role) to resolve the sponsor.
export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Sponsor";

interface Props {
    params: Promise<{ slug: string }>;
}

/**
 * Code-generated OpenGraph/Twitter card for each sponsor: brand-colour canvas,
 * the sponsor's own logo, name, and tagline. Rendered on demand by Next.
 */
export default async function OgImage({ params }: Props) {
    const { slug } = await params;
    const sponsor = await getSponsorBySlug(slug);

    const name = sponsor?.name ?? "Sponsor";
    const tagline = sponsor?.tagline ?? "";
    const color = sponsor?.brandColor ?? "#1B4DF5";

    // Build an absolute logo URL. Local /public paths need the request origin;
    // Cloudinary URLs are already absolute (URL() leaves them untouched).
    let logoSrc: string | null = null;
    if (sponsor?.logoUrl) {
        const h = await headers();
        const host = h.get("host");
        const proto = h.get("x-forwarded-proto") ?? "https";
        const origin = host ? `${proto}://${host}` : "https://rw.rcffuta.com";
        try {
            logoSrc = new URL(sponsor.logoUrl, origin).toString();
        } catch {
            logoSrc = null;
        }
    }

    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    padding: "72px",
                    backgroundColor: color,
                    color: "white",
                    fontFamily: "sans-serif",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        fontSize: 26,
                        fontWeight: 700,
                        letterSpacing: 2,
                        textTransform: "uppercase",
                        opacity: 0.85,
                    }}
                >
                    {TENURE.brandLabel} · Official Sponsor
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
                    {logoSrc && (
                        <div
                            style={{
                                display: "flex",
                                background: "white",
                                borderRadius: 32,
                                padding: 24,
                            }}
                        >
                            <img
                                src={logoSrc}
                                width={160}
                                height={160}
                                alt=""
                                style={{ borderRadius: 20, objectFit: "contain" }}
                            />
                        </div>
                    )}
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <div style={{ fontSize: 88, fontWeight: 800, lineHeight: 1 }}>{name}</div>
                        {tagline && (
                            <div style={{ fontSize: 36, opacity: 0.9, marginTop: 20, maxWidth: 760 }}>
                                {tagline}
                            </div>
                        )}
                    </div>
                </div>

                <div style={{ display: "flex", fontSize: 28, opacity: 0.8 }}>
                    Free for the {FELLOWSHIP.shortName} family · rw.rcffuta.com
                </div>
            </div>
        ),
        { ...size }
    );
}
