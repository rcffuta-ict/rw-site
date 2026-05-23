import type { Metadata } from "next";
import { headers } from "next/headers";
import ProductsClient from "./ProductsClient";
import { getAllProducts } from "@/lib/services/products.service";
import { listCategories } from "@/lib/services/categories.service";

export const metadata: Metadata = {
    title: "Products — RW'26 Admin",
    description: "Manage product inventory, variants, and visibility for Redemption Week '26.",
};

// Server Component — fetches from Supabase, passes data to client
export default async function ProductsPage() {
    const [products, categories, hdrs] = await Promise.all([
        getAllProducts(),
        listCategories(true),  // include inactive so admin can see + toggle them
        headers(),
    ]);
    const isAdmin = hdrs.get("x-admin-role") === "ADMIN";

    return <ProductsClient products={products} categories={categories} isAdmin={isAdmin} />;
}

