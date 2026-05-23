import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { listCategories } from "@/lib/services/categories.service";
import NewProductClient from "./NewProductClient";

export const metadata: Metadata = {
    title: "New Product — RW'26 Admin",
    description: "Initialize a new base product and configure its primary attributes.",
};

export default async function NewProductPage() {
    const hdrs = await headers();
    if (hdrs.get("x-admin-role") !== "ADMIN") {
        redirect("/admin/products");
    }

    const categories = await listCategories(false); // Only active categories
    return <NewProductClient categories={categories} />;
}

