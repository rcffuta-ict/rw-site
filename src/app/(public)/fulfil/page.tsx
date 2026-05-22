import type { Metadata } from "next";
import { FulfilClient } from "./FulfilClient";
import { TENURE } from "@/lib/config";
import { getOrderByRef } from "@/lib/services/orders.service";

type Props = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
    const searchParams = await props.searchParams;
    const refParam = searchParams?.ref;
    const ref = typeof refParam === "string" ? refParam.trim() : null;

    if (ref) {
        const order = await getOrderByRef(ref);
        if (order) {
            const balance = Math.max(0, order.totalAmount - order.amountPaid);
            const title = `Pay for ${order.customerName.split(" ")[0]}'s Order | ${TENURE.brandLabel}`;
            const description = balance > 0
                ? `Help pay for ${order.customerName}'s Redemption Week merch. Outstanding balance: ₦${balance.toLocaleString()}. Ref: ${order.orderRef}`
                : `${order.customerName}'s Redemption Week merch order is fully paid! Ref: ${order.orderRef}`;

            return {
                title,
                description,
                openGraph: {
                    title,
                    description,
                    type: "website",
                    siteName: TENURE.brandLabel,
                },
                twitter: {
                    card: "summary",
                    title,
                    description,
                },
            };
        }
    }

    return {
        title: `Pay Order — ${TENURE.brandLabel}`,
        description: `Enter your order reference to complete payment for your ${TENURE.brandLabel} merchandise.`,
    };
}

export default function FulfilPage() {
    return <FulfilClient />;
}
