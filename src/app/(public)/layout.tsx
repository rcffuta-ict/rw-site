import { CartProvider } from "@/context/CartContext";
import { PublicHeader } from "@/components/public/PublicHeader";
import { PublicFooter } from "@/components/public/PublicFooter";
import { CartSidebar } from "@/components/public/CartSidebar";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    return (
        <CartProvider>
            <PublicHeader />
            <main>
                {children}

                <CartSidebar />
            </main>
            <PublicFooter />
        </CartProvider>
    );
}
