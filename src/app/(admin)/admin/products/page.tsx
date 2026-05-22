import type { Metadata } from "next";
import ProductsClient from "./ProductsClient";
import { getAllProducts } from "@/lib/services/products.service";
import { listCategories } from "@/lib/services/categories.service";

export const metadata: Metadata = {
    title: "Products — RW'26 Admin",
    description: "Manage product inventory, variants, and visibility for Redemption Week '26.",
};

// Server Component — fetches from Supabase, passes data to client
export default async function ProductsPage() {
    const [products, categories] = await Promise.all([
        getAllProducts(),
        listCategories(true),  // include inactive so admin can see + toggle them
    ]);

    return <ProductsClient products={products} categories={categories} />;
}
