import { CartProvider } from "@/context/CartContext";
import { PublicHeader } from "@/components/public/PublicHeader";
import { PublicFooter } from "@/components/public/PublicFooter";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    return (
        <CartProvider>
            <PublicHeader />
            <main>{children}</main>
            <PublicFooter />
        </CartProvider>
    );
}
