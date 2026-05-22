// File: src/app/(admin)/admin/layout.tsx
import { headers } from "next/headers";
import { AdminModalProvider } from "@/context/AdminModalContext";

export default async function TopLevelAdminGuardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const headerList = await headers();

    // 1. Grab the current URL path to check if the user is hitting the login endpoint
    const currentPath = headerList.get("x-current-path") || "";
    const isLoginPage = currentPath.endsWith("/admin/login");

    // 2. Fetch the secure gateway header
    const adminRole = headerList.get("x-admin-role");

    // 3. Security Check: Only block if they are NOT on the login page AND missing the header
    if (!isLoginPage && !adminRole) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#f9fafb]">
                <div className="rw-card p-8 max-w-md text-center border border-red-100 shadow-sm animate-fade-in">
                    <p className="text-sm text-red-600 font-bold tracking-wide uppercase mb-1">
                        Security Violation
                    </p>
                    <p className="text-sm text-gray-600">
                        Administrative context missing. Please sign in via the authorized
                        gateway.
                    </p>
                </div>
            </div>
        );
    }

    // 4. Let them through safely
    return <AdminModalProvider>{children}</AdminModalProvider>;
}
