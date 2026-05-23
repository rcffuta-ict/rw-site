import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getProductById } from "@/lib/services/products.service";
import ProductDetailClient from "./ProductDetailClient";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const product = await getProductById(id);
    return {
        title: product
            ? `${product.name} — RW'26 Admin`
            : "Product Not Found — RW'26 Admin",
    };
}

export default async function ProductDetailPage({ params }: Props) {
    const { id } = await params;
    const product = await getProductById(id);
    if (!product) redirect("/admin/products");

    const hdrs = await headers();
    const isAdmin = hdrs.get("x-admin-role") === "ADMIN";

    return <ProductDetailClient product={product} isAdmin={isAdmin} />;
}

