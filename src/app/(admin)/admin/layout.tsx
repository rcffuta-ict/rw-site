// File: src/app/(admin)/admin/layout.tsx
// The proxy (src/proxy.ts) is the sole gatekeeper for all /admin routes.
// Unauthenticated requests never reach here — they are redirected to /admin/login
// by the proxy before the layout even runs. This layout only provides client context.
import { AdminModalProvider } from "@/context/AdminModalContext";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <AdminModalProvider>{children}</AdminModalProvider>;
}
