function required(name: string): string {
    const v = process.env[name];
    if (!v) throw new Error(`Missing environment variable: ${name}`);
    return v;
}

function optional(name: string): string | undefined {
    const v = process.env[name];
    return v && v.trim().length > 0 ? v : undefined;
}

export const env = {
    siteUrl: optional("NEXT_PUBLIC_SITE_URL") ?? "http://localhost:3000",

    /** ISO 8601 date-time string for the countdown timer. Change via NEXT_PUBLIC_EVENT_START_DATE. */
    eventStartDate: optional("NEXT_PUBLIC_EVENT_START_DATE") ?? "2026-07-06T18:00:00",

    supabase: {
        url: optional("NEXT_PUBLIC_SUPABASE_URL"),
        anonKey: optional("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
        /** Server-only — bypasses RLS. Never expose to browser. */
        serviceRoleKey: optional("SUPABASE_SERVICE_ROLE_KEY"),
    },

    /**
     * Cloudinary configuration.
     * - `cloudName` and `uploadPreset` are public — safe to use on the browser.
     * - `apiKey` and `apiSecret` are server-only — used for signed uploads in admin routes.
     */
    cloudinary: {
        /** Public — available in browser for unsigned receipt uploads on the /fulfil page. */
        cloudName: optional("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME"),
        /** Unsigned preset name — configured in Cloudinary Dashboard for customer receipt uploads. */
        uploadPreset: optional("NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET") ?? "rw26_receipts",

        /** Server-only — used for signed product image uploads in admin. */
        apiKey: optional("CLOUDINARY_API_KEY"),
        /** Server-only — never expose to browser. */
        apiSecret: optional("CLOUDINARY_API_SECRET"),

        /** Cloudinary folder for product images (admin-managed). */
        productsFolder: optional("CLOUDINARY_PRODUCTS_FOLDER") ?? "rw26/products",
        /** Cloudinary folder for payment receipts (customer-uploaded). */
        receiptsFolder: optional("CLOUDINARY_RECEIPTS_FOLDER") ?? "rw26/receipts",
    },

    adminEmails: (optional("RW_ADMIN_EMAILS") ?? "")
        .split(",")
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean),

    bank: {
        bankName:      optional("RW_BANK_NAME")           ?? "First Bank",
        accountName:   optional("RW_BANK_ACCOUNT_NAME")   ?? "RCF FUTA",
        accountNumber: optional("RW_BANK_ACCOUNT_NUMBER") ?? "3012345678",
    },

    payment: {
        minPercent:          Number(optional("RW_PAYMENT_MIN_PERCENT") ?? "50"),
        installmentAllowed:  optional("RW_PAYMENT_INSTALLMENT") !== "false",
    },

    required,
};
