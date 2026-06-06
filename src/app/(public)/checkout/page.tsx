import { Metadata } from "next";
import { CheckoutClient } from "./CheckoutClient";

import { TENURE } from "@/lib/config";

export const metadata: Metadata = {
    title: `Checkout — ${TENURE.brandLabel}`,
};

export default function CheckoutPage() {
    return (
        <>
            <CheckoutClient />
            <br />
            <br />
        </>
    );
}
