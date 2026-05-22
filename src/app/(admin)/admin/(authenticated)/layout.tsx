// File: src/app/(admin)/admin/(authenticated)/layout.tsx
import { AdminLayoutWrapper } from "@/components/admin/AdminLayoutWrapper";

export default async function AuthenticatedSectionLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <AdminLayoutWrapper>{children}</AdminLayoutWrapper>;
}
