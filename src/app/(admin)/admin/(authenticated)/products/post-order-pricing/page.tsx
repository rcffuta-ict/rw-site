import type { Metadata } from "next";
import { getAllProducts } from "@/lib/services/products.service";
import PostOrderPricingClient from "./PostOrderPricingClient";

export const metadata: Metadata = {
    title: "Post-order Pricing — RW'26 Admin",
    description: "Set post-order prices across all products for the post-order phase.",
};

// Server Component — fetches all products, hands them to the bulk editor client.
export default async function PostOrderPricingPage() {
    const products = await getAllProducts();
    return <PostOrderPricingClient products={products} />;
}
