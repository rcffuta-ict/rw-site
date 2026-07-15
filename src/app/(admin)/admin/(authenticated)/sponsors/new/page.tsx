import type { Metadata } from "next";
import Link from "next/link";
import { SponsorForm } from "../SponsorForm";

export const metadata: Metadata = {
    title: "New Sponsor — RW'26 Admin",
};

export default function NewSponsorPage() {
    return (
        <div className="max-w-2xl">
            <Link
                href="/admin/sponsors"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-rw-muted hover:text-rw-ink mb-5"
            >
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                All sponsors
            </Link>
            <h1 className="font-display font-black text-2xl text-rw-ink mb-6">New Sponsor</h1>
            <SponsorForm />
        </div>
    );
}
