// ─── RW Site — Central Configuration ─────────────────────────────────────────
// This is the single source of truth for all tenure-specific content.
// To reuse for the 39th, 40th, etc. anniversary — update the values here.

// ─── Demo / Live Switch ───────────────────────────────────────────────────────
// Set to false when integrating Supabase. All services check this flag.
export const DEMO_MODE = true;

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
    /** Event theme */
    theme: "The Lord's Witnesses: The Purified Army",
    /** Event dates — ISO strings */
    startDate: "2026-07-06T18:00:00",
    endDate: "2026-07-12T23:59:00",
    /** Human-readable date range */
    dateRange: "July 6–12, 2026",
    /** Venue */
    venue: "RCFFUTA Southgate Auditorium, Akure",
    /** Google Maps navigation URL — replace with real link when available */
    googleMapsUrl:
        "https://www.google.com/maps/dir/?api=1&destination=7.325683648594797,5.188835270364391",
    /** Venue short address */
    venueAddress: "Besides His Grace Pavilion, FUTA Southgate, Akure",
    /** Full branding label */
    get brandLabel() {
        return `${this.eventName} ${this.shortYear}`;
    },
    /** Anniversary label */
    get anniversaryLabel() {
        return `${this.anniversary}th Anniversary`;
    },
} as const;

// ─── Fellowship Identity ───────────────────────────────────────────────────────
export const FELLOWSHIP = {
    fullName: "Redeemed Christian Fellowship, Federal University of Technology, Akure",
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
    /** RCFFUTA fellowship logo */
    rcfFuta: "/images/logos/rcf-futa.jpeg",
    /** Anniversary/Redemption Week event logo — replace when design team provides it */
    redemptionWeek: null as string | null, // e.g. "/images/logos/rw26.png"
    /** Tenure theme logo — replace when design team provides it */
    tenureTheme: null as string | null, // e.g. "/images/logos/lords-witnesses.png"
    /** Parent church logos */
    crm: "/images/logos/crm.png",
    rccg: "/images/logos/rccg.png",
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
    bankName: "Access Bank",
    accountNumber: "0123456789", // ← Replace with real account number
    accountName: "RCF FUTA Welfare Fund",
    /** Minimum suggested donation */
    minimumAmount: 1000,
} as const;

// ─── Sponsorship Prospectus ────────────────────────────────────────────────────
export const PROSPECTUS_URL: string | null = null; // e.g. "/docs/rw26-prospectus.pdf"
