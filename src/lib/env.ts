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
    },

    adminEmails: (optional("RW_ADMIN_EMAILS") ?? "")
        .split(",")
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean),

    bank: {
        bankName: optional("RW_BANK_NAME") ?? "First Bank",
        accountName: optional("RW_BANK_ACCOUNT_NAME") ?? "RCF FUTA",
        accountNumber: optional("RW_BANK_ACCOUNT_NUMBER") ?? "3012345678",
    },

    payment: {
        minPercent: Number(optional("RW_PAYMENT_MIN_PERCENT") ?? "50"),
        installmentAllowed: optional("RW_PAYMENT_INSTALLMENT") !== "false",
    },

    required,
};
