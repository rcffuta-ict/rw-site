import type { Metadata } from "next";
import VerdictsClient from "./VerdictsClient";

export const metadata: Metadata = { 
    title: "Verdicts — RW'26 Admin",
    description: "Manage and download production manifests and fulfillment permits for Redemption Week '26."
};

export default function VerdictsPage() {
    return <VerdictsClient />;
}
