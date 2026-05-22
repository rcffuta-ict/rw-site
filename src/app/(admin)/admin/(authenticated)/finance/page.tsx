import type { Metadata } from "next";
import { getFinanceSummary } from "@/lib/services/finance.service";
import FinanceClient from "./FinanceClient";
import { fmtNaira as fmt } from "@/lib/utils/functions";

export const metadata: Metadata = {
    title: "Finance — RW'26 Admin",
    description: "Financial overview, payment inflow, and audit ledger for Redemption Week '26.",
};

export default async function FinancePage() {
    const { collected, pending, flagged, totalOrdered, outstanding, payments } =
        await getFinanceSummary();

    const summaryCards = [
        {
            label: "Collected",
            value: fmt(collected),
            sub: "Approved payments",
            color: "green" as const,
            icon: "M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
        },
        {
            label: "Pending",
            value: fmt(pending),
            sub: "Awaiting review",
            color: "amber" as const,
            icon: "M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
        },
        {
            label: "Flagged",
            value: fmt(flagged),
            sub: "Needs manual check",
            color: "red" as const,
            icon: "M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z",
        },
        {
            label: "Outstanding",
            value: fmt(outstanding),
            sub: "Remaining balance",
            color: "blue" as const,
            icon: "M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z",
        },
    ];

    return (
        <FinanceClient
            payments={payments}
            summaryCards={summaryCards}
            collected={collected}
            totalOrdered={totalOrdered}
        />
    );
}
