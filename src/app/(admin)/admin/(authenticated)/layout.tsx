// File: src/app/(admin)/admin/(authenticated)/layout.tsx
// Force dynamic rendering so all admin pages always see live Supabase data.
// Without this, orders, payments, and products would be stale after a deploy.
export const dynamic = "force-dynamic";

import { AdminLayoutWrapper } from "@/components/admin/AdminLayoutWrapper";

export default async function AuthenticatedSectionLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <AdminLayoutWrapper>{children}</AdminLayoutWrapper>;
}
