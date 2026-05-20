import { FulfilClient } from "./FulfilClient";

import { TENURE } from "@/lib/config";

export const metadata = {
    title: `Pay Order — ${TENURE.brandLabel}`,
    description: `Enter your order reference to complete payment for your ${TENURE.brandLabel} merchandise.`,
};

export default function FulfilPage() {
    return <FulfilClient />;
}
