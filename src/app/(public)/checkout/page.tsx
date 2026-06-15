import { Metadata } from "next";
import { CheckoutClient } from "./CheckoutClient";
import { PreordersClosed } from "@/components/public/PreordersClosed";
import { getSettings } from "@/lib/services/settings.service";

import { TENURE } from "@/lib/config";

export const metadata: Metadata = {
    title: `Checkout — ${TENURE.brandLabel}`,
};

export default async function CheckoutPage() {
    const settings = await getSettings();

    if (!settings.preorders_enabled) {
        return (
            <PreordersClosed
                title="Checkout is closed"
                message={`Pre-orders for ${TENURE.brandLabel} merch are currently paused, so checkout is unavailable. Reach out to our team below if you have a question.`}
            />
        );
    }

    return (
        <>
            <CheckoutClient />
            <br />
            <br />
        </>
    );
}
