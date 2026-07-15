// ─── RW Site — Central Configuration ─────────────────────────────────────────
// This is the single source of truth for all tenure-specific content.
// To reuse for the 39th, 40th, etc. anniversary — update the values here.

import type { OrderStatus } from "@/lib/data/types";

// ─── Demo / Live Switch ───────────────────────────────────────────────────────
// Set to false when integrating Supabase. All services check this flag.
export const DEMO_MODE = process.env.NEXT_PUBLIC_VERCEL_ENV
    ? process.env.NEXT_PUBLIC_VERCEL_ENV !== "production"
    : process.env.NODE_ENV !== "production";

// ─── Tenure Details ───────────────────────────────────────────────────────────
export const TENURE = {
    /** e.g. "2026", "2027" */
    year: "2026",
    /** Short year suffix used in branding e.g. "'26" */
    shortYear: "'26",
    /** The anniversary number */
    anniversary: 38,
    /** Event name */
    eventName: "Redemption Week",
    eventNameShort: "RW",
    /** Event theme */
    theme: "The Lord's Witnesses: The Purified Army",
    /** Event dates — ISO strings */
    startDate: "2026-07-13T18:00:00",
    endDate: "2026-07-19T23:59:00",
    /** Human-readable date range */
    dateRange: "July 13–19, 2026",
    /** Venue */
    venue: "RCFFUTA Southgate Auditorium, Akure",
    /** Exact venue coordinates */
    coordinates: { lat: 7.292981908522477, lng: 5.154444984239195 },
    /** Google Maps turn-by-turn navigation URL to the venue */
    get googleMapsUrl() {
        return `https://www.google.com/maps/dir/?api=1&destination=${this.coordinates.lat},${this.coordinates.lng}`;
    },
    /** Keyless interactive Google Maps embed URL (for iframes) */
    get mapEmbedUrl() {
        return `https://maps.google.com/maps?q=${this.coordinates.lat},${this.coordinates.lng}&z=16&hl=en&output=embed`;
    },
    /** Venue short address */
    venueAddress: "Besides His Grace Pavilion, FUTA Southgate, Akure",
    /** Full branding label */
    get brandLabel() {
        return `${this.eventName} ${this.shortYear}`;
    },
    get brandLabelShort() {
        return `${this.eventNameShort}${this.shortYear}`;
    },
    /** Anniversary label */
    get anniversaryLabel() {
        return `${this.anniversary}th Anniversary`;
    },
} as const;

// ─── Fellowship Identity ───────────────────────────────────────────────────────
export const FELLOWSHIP = {
    fullName: "Redeemed Christian Fellowship, FUTA Chapter",
    shortName: "RCF FUTA",
    acronym: "RCFFUTA",
    founded: "1983",
    website: "https://rcffuta.com",
    /** Known stats */
    stats: {
        alumni: "9,000+",
        members: "900+",
        units: 16,
    },
} as const;

// ─── Logos ────────────────────────────────────────────────────────────────────
// Replace placeholder paths with real asset paths when provided.
export const LOGOS = {
    /** RCFFUTA fellowship logo — dark mark, use on light backgrounds */
    rcfFuta: "/images/logos/rcffuta-dark-on-white.png",
    /** RCFFUTA full logo — dark version (for light bg) */
    rcfFutaDark: "/images/logos/rcffuta-dark.png",
    /** RCFFUTA full logo — light version (for dark bg) */
    rcfFutaLight: "/images/logos/rcffuta-light.png",
    rcfFutaMix: "/images/logos/rcffuta-dark-on-white.png",
    /** Plain RCF badge mark */
    rcf: "/images/logos/rcf.png",
    /** Redemption Week 2026 event logo */
    redemptionWeek: "/images/logos/rw-2026-logo.png",
    /** 38th Anniversary logo */
    anniversary: "/images/logos/rw-38th-logo.png",
    /** Tenure torch/flame icon */
    tenureIcon: "/images/logos/tenure-icon.png",
    /** Parent church logos */
    crm: "/images/logos/crm.png",
    rccg: null as string | null, // replace with "/images/logos/rccg.png" if available
} as const;

// ─── Brand Colors (CSS reference) ─────────────────────────────────────────────
// Defined here for JS usage (e.g. canvas, dynamic styles). CSS tokens are in globals.css.
export const BRAND = {
    deepMaroon: "#1C0003",
    red: "#FF0015",
    orange: "#FF6A00",
    forest: "#022400",
    white: "#FFFFFF",
} as const;

// ─── Support / Donations ───────────────────────────────────────────────────────
// This is the INDIVIDUAL SUPPORT account — different from the /fulfil commerce account.
export const SUPPORT_ACCOUNT = {
    bankName: "Wema Bank",
    accountNumber: "0222938198",
    accountName: "Christian Fellowship Redeemed",
    /** Minimum suggested donation */
    minimumAmount: 1000,
} as const;

// ─── Sponsorship Prospectus ────────────────────────────────────────────────────
export const PROSPECTUS_URL: string | null = "/files/RW-Prospectus.pdf";

export const CONTACTS = [
    {
        name: "Aiyejagbara Oluwatobi",
        phone: "09031676421",
        email: "tobi4saviour2@gmail.com",
        title: "Finance Lead",
    },
    {
        name: "Olatona Ayobami",
        phone: "09069948890",
        email: "ayobamioluwaseyi118@gmail.com",
        title: "Committe Chairperson",
    },
];

export const PAYMENT_CONFIG = {
    supportContacts: [
        { name: "Sis Mercy (WhatsApp)", phone: "2348116778900" },
        { name: "ICT Coord (WhatsApp)", phone: "2348122137834" },
    ],
};

// ─── Order status groups ──────────────────────────────────────────────────────
// A "confirmed customer" is anyone whose order has progressed past pending —
// i.e. they have committed to the fellowship. Used when auto-including customers
// into a sponsor's lead list. Excludes pending, flagged, and cancelled orders.
export const CONFIRMED_ORDER_STATUSES: OrderStatus[] = [
    "partially_paid",
    "paid",
    "confirmed",
    "in_production",
    "ready_for_pickup",
    "delivered",
];

// ─── Sponsors ─────────────────────────────────────────────────────────────────
// Config-driven sponsor profiles (sourced from each sponsor's public info).
// Drives the public /sponsors/<slug> page and the admin Sponsors tab.
export interface SponsorProfile {
    slug: string;
    name: string;
    tagline: string;
    /** Short paragraph describing the sponsor and the partnership. */
    description: string;
    /** Public website. */
    url: string;
    /** Local raster asset in /public — rendered with next/image. */
    logo: string;
    /** Brand accent (from the logo). Used sparingly for scoped accents. */
    blue: string;
    /** Courses/skills offered — feeds the sign-up form dropdown and page copy. */
    courses: string[];
    /** Highlighted benefits shown on the public page. */
    benefits: { title: string; body: string }[];
}

export const SPONSORS: Record<string, SponsorProfile> = {
    skybil: {
        slug: "skybil",
        name: "Skybil",
        tagline: "Elevate Your Skills in Tech and Finance",
        description:
            "Skybil is an EdTech academy empowering young Africans through smart, " +
            "self-paced digital learning. As a Redemption Week '26 sponsor, Skybil is " +
            "opening free access to its tech and finance courses for the RCF FUTA family.",
        url: "https://skybil.com.ng/home",
        logo: "/images/sponsors/skybil-logo.jpeg",
        blue: "#1B4DF5",
        courses: [
            "Web Development",
            "Python Programming",
            "Graphic Design",
            "Finance",
            "Other",
        ],
        benefits: [
            {
                title: "Free online courses",
                body: "Learn web development, Python, graphic design, finance and more — at no cost.",
            },
            {
                title: "Learn at your own pace",
                body: "Study anytime, anywhere. Every course is fully self-paced.",
            },
            {
                title: "AI-powered support",
                body: "Get instant answers from Skai, Skybil's AI learning assistant — no waiting.",
            },
            {
                title: "Certificate of completion",
                body: "Earn a digital certificate to showcase your new skills (optional).",
            },
        ],
    },
};

export function getSponsor(slug: string): SponsorProfile | undefined {
    return SPONSORS[slug];
}

export const SPONSOR_LIST: SponsorProfile[] = Object.values(SPONSORS);
