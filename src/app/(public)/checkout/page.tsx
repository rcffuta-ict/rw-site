import { CheckoutClient } from "./CheckoutClient";

import { TENURE } from "@/lib/config";

export const metadata = {
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
