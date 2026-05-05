import type { Metadata } from "next";
import ProductsClient from "./ProductsClient";

export const metadata: Metadata = { 
    title: "Products — RW'26 Admin",
    description: "Manage product inventory, variants, and visibility for Redemption Week '26."
};

export default function ProductsPage() {
    return <ProductsClient />;
}
