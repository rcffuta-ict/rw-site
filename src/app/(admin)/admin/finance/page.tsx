import type { Metadata } from "next";
import FinanceClient from "./FinanceClient";

export const metadata: Metadata = { 
    title: "Finance — RW'26 Admin",
    description: "Financial overview, collection progress, and payment audit for Redemption Week '26."
};

export default function FinancePage() {
    return <FinanceClient />;
}
