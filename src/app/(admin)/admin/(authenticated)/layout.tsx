// File: src/app/(admin)/admin/(authenticated)/layout.tsx
// Force dynamic rendering so all admin pages always see live Supabase data.
// Without this, orders, payments, and products would be stale after a deploy.
export const dynamic = "force-dynamic";

import { AdminLayoutWrapper } from "@/components/admin/AdminLayoutWrapper";
import { getPendingPaymentsCount } from "@/lib/services/finance.service";

export default async function AuthenticatedSectionLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pendingFinanceCount = await getPendingPaymentsCount();

    return (
        <AdminLayoutWrapper pendingFinanceCount={pendingFinanceCount}>
            {children}
        </AdminLayoutWrapper>
    );
}
