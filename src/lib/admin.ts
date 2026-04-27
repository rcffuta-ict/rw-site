import { env } from "@/lib/env";

export function isAdminToken(token: string | null): boolean {
    const expected = process.env.RW_ADMIN_TOKEN;
    if (!expected || expected.trim().length === 0) return false;
    return token === expected;
}

export function adminEnabled(): boolean {
    return Boolean(process.env.RW_ADMIN_TOKEN && process.env.RW_ADMIN_TOKEN.trim());
}

export function getAdminEmails(): string[] {
    return env.adminEmails;
}
