import { AdminLayoutWrapper } from "@/components/admin/AdminLayoutWrapper";
import { AdminModalProvider, useAdminModal } from "@/context/AdminModalContext";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <AdminModalProvider>
            <AdminLayoutWrapper>
                {children}
            </AdminLayoutWrapper>
        </AdminModalProvider>
    );
}
