import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen bg-rw-bg">
            <AdminSidebar />
            <div className="flex-1 min-w-0">
                <div className="mx-auto max-w-5xl px-6 py-8">
                    {children}
                </div>
            </div>
        </div>
    );
}
