// Force all public pages to render dynamically so product/order
// changes in Supabase are reflected on every request — no redeploy needed.
export const dynamic = "force-dynamic";

import { CartProvider } from "@/context/CartContext";
import { PublicHeader } from "@/components/public/PublicHeader";
import { PublicFooter } from "@/components/public/PublicFooter";
import { CartSidebar } from "@/components/public/CartSidebar";
import { listSponsors } from "@/lib/services/sponsors.service";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
    // Active sponsors power the footer's "Our Sponsors" links.
    let sponsors: { slug: string; name: string; logoUrl: string; brandColor: string }[] = [];
    try {
        sponsors = (await listSponsors(true)).map((s) => ({
            slug: s.slug,
            name: s.name,
            logoUrl: s.logoUrl,
            brandColor: s.brandColor,
        }));
    } catch {
        sponsors = [];
    }

    return (
        <CartProvider>
            <PublicHeader />
            <main>
                {children}

                <CartSidebar />
            </main>
            <PublicFooter sponsors={sponsors} />
        </CartProvider>
    );
}
