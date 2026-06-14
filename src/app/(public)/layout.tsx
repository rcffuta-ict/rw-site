// Force all public pages to render dynamically so product/order
// changes in Supabase are reflected on every request — no redeploy needed.
export const dynamic = "force-dynamic";

import { CartProvider } from "@/context/CartContext";
import { PublicHeader } from "@/components/public/PublicHeader";
import { PublicFooter } from "@/components/public/PublicFooter";
import { CartSidebar } from "@/components/public/CartSidebar";
// import { ScrollReveal } from "@/components/common/ScrollReveal";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    return (
        <CartProvider>
            {/* <ScrollReveal /> */}
            <PublicHeader />
            <main>
                {children}

                <CartSidebar />
            </main>
            <PublicFooter />
        </CartProvider>
    );
}
