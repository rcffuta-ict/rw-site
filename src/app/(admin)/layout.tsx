import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen bg-rw-bg-alt">
            <AdminSidebar />
            <div className="flex-1 min-w-0">
                <div className="mx-auto max-w-6xl px-6 lg:px-8 py-8">
                    {children}
                </div>
            </div>
        </div>
    );
}
