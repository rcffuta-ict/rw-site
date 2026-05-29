import type { Metadata } from "next";
import { OrdersClient } from "./OrdersClient";
import Link from "next/link";
import { Button } from "@/components/ui/forms/Button";

import { TENURE } from "@/lib/config";

export const metadata: Metadata = {
    title: `My Orders — ${TENURE.brandLabel}`,
    description: `Look up your ${TENURE.eventName} merchandise orders by phone number or email address.`,
};

export default function OrdersPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Header CTA */}
            <div className="section-container py-16 md:py-24">
                <div className="max-w-4xl mb-12">
                    <h1 className="font-display font-black text-5xl md:text-6xl text-rw-ink mb-4">
                        Track Your Order
                    </h1>
                    <p className="text-xl text-rw-text-2 mb-8">
                        Look up any order using your reference number and email address
                    </p>

                    <div className="rw-card p-6 md:p-8 bg-blue-50 border-l-4 border-l-blue-500 mb-8">
                        <p className="text-sm text-blue-900 mb-4">
                            <strong>💡 Tip:</strong> Need help understanding the payment
                            process or how orders work? Check out our complete guide.
                        </p>
                        <Link href="/docs">
                            <Button variant="outlined" size="lg">
                                View Complete Guide
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Orders Client */}
            <div className="section-container pb-24">
                <OrdersClient />
            </div>
        </div>
    );
}
