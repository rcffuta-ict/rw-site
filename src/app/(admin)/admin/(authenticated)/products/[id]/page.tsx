import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductById } from "@/lib/services/products.service";
import ProductDetailClient from "./ProductDetailClient";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const product = await getProductById(id);
    return { title: product ? `${product.name} — RW'26 Admin` : "Product Not Found — RW'26 Admin" };
}

export default async function ProductDetailPage({ params }: Props) {
    const { id } = await params;
    const product = await getProductById(id);
    if (!product) notFound();
    return <ProductDetailClient product={product} />;
}
