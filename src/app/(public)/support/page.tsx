import type { Metadata } from "next";

import { TENURE, FELLOWSHIP } from "@/lib/config";
import { SupportClient } from "./SupportClient";

export const metadata: Metadata = {
    title: `Support — ${TENURE.brandLabel} · ${FELLOWSHIP.shortName}`,
    description: `Partner with or support Redemption Week ${TENURE.shortYear}. Organisations can sponsor via our prospectus; individuals can give directly. Help us make the ${TENURE.anniversaryLabel} unforgettable.`,
};

export default function SupportPage() {
    return <SupportClient />;
}
