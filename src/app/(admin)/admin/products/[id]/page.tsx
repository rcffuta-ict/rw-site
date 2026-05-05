import ProductDetailClient from "./ProductDetailClient";
import { DEMO_PRODUCTS } from "@/lib/data/products";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const product = DEMO_PRODUCTS.find(p => p.id === id);
    return { title: product ? `${product.name} — RW'26 Admin` : "Product — RW'26 Admin" };
}

export default async function ProductDetailPage({ params }: Props) {
    const { id } = await params;
    const product = DEMO_PRODUCTS.find(p => p.id === id);
    if (!product) notFound();
    return <ProductDetailClient productId={id} />;
}
