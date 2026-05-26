/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { markVerdictReady, updateVerdictPdf } from "@/lib/services/verdicts.service";
import { VerdictDocument } from "../component";
import type { Verdict } from "@/lib/data/types";
import { formatNaira } from "@/lib/utils/functions";

interface VerdictDetailClientProps {
    verdict: Verdict;
    isAdmin: boolean;
}

export function VerdictDetailClient({ verdict, isAdmin }: VerdictDetailClientProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [generating, setGenerating] = useState(false);

    async function handleGenerateAndUpload() {
        if (!isAdmin) return;
        setGenerating(true);
        const toastId = toast.loading("Generating administrative PDF document...");

        try {
            // 1. Capture the DOM element
            const input = document.getElementById("verdict-document");
            if (!input) throw new Error("Document element not found");

            const canvas = await html2canvas(input, { scale: 2, useCORS: true });
            const imgData = canvas.toDataURL("image/jpeg", 0.95);

            // 2. Create PDF
            const pdf = new jsPDF("p", "mm", "a4");
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);

            // 3. Get Blob and upload to Cloudinary
            const blob = pdf.output("blob");
            const formData = new FormData();
            formData.append("file", blob, `${verdict.verdictRef}.pdf`);
            formData.append("verdictRef", verdict.verdictRef);

            const uploadRes = await fetch("/api/cloudinary/upload/verdict", {
                method: "POST",
                body: formData,
            });

            if (!uploadRes.ok) {
                throw new Error("Failed to upload PDF");
            }

            const { url, publicId } = await uploadRes.json();

            // 4. Update verdict record in DB
            startTransition(async () => {
                const res = await updateVerdictPdf(verdict.id, url, publicId);
                if (res.success) {
                    toast.success("Verdict PDF generated and securely saved.", { id: toastId });
                    router.refresh();
                } else {
                    toast.error("Failed to save PDF link", { id: toastId, description: res.error });
                }
            });
        } catch (error: any) {
            console.error(error);
            toast.error("Error generating PDF", { id: toastId, description: error.message });
        } finally {
            setGenerating(false);
        }
    }

    function handleMarkReady() {
        if (!isAdmin) return;
        if (!verdict.pdfCloudinaryUrl) {
            toast.error("Please generate and attach the PDF first.");
            return;
        }

        const toastId = toast.loading("Updating order statuses to Ready...");

        startTransition(async () => {
            const res = await markVerdictReady(verdict.id);
            if (res.success) {
                toast.success("Orders marked as Ready for Pickup!", { id: toastId });
                router.refresh();
            } else {
                toast.error("Failed to update status", { id: toastId, description: res.error });
            }
        });
    }

    return (
        <div className="flex flex-col gap-10 animate-fade-in max-w-5xl pb-20 mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-[var(--rw-border)] pb-8">
                <div className="flex flex-col gap-2">
                    <Link
                        href="/admin/verdicts"
                        className="text-[10px] font-bold text-rw-muted hover:text-rw-ink uppercase tracking-widest flex items-center gap-1 w-fit mb-2 transition-colors"
                    >
                        <svg
                            className="h-3 w-3"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={3}
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15.75 19.5L8.25 12l7.5-7.5"
                            />
                        </svg>
                        Back to Verdicts
                    </Link>
                    <h1 className="font-display font-black text-3xl text-rw-ink tracking-tight uppercase">
                        {verdict.verdictRef}
                    </h1>
                    <div className="flex items-center gap-3 mt-1">
                        <span
                            className={`inline-flex items-center rounded-lg border px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] ${verdict.status === "ready" ? "bg-cyan-50 text-cyan-600 border-cyan-200" : "bg-purple-50 text-purple-600 border-purple-200"}`}
                        >
                            {verdict.status === "ready"
                                ? "Ready for Pickup"
                                : "In Production"}
                        </span>
                        <span className="text-[10px] font-bold text-rw-muted uppercase tracking-widest">
                            Issued by {verdict.issuedBy}
                        </span>
                    </div>
                </div>

                <div className="flex gap-4">
                    {verdict.pdfCloudinaryUrl ? (
                        <a
                            href={verdict.pdfCloudinaryUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-secondary !h-12 px-8 text-[11px] font-black uppercase tracking-widest flex items-center gap-2"
                        >
                            <svg
                                className="h-4 w-4"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2.5}
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                                />
                            </svg>
                            View PDF
                        </a>
                    ) : (
                        isAdmin && (
                            <button
                                onClick={handleGenerateAndUpload}
                                disabled={generating || isPending}
                                className="btn-secondary !h-12 px-8 text-[11px] font-black uppercase tracking-widest flex items-center gap-2 disabled:opacity-50"
                            >
                                {generating ? "Generating..." : "Generate PDF"}
                            </button>
                        )
                    )}

                    {/* {isAdmin && verdict.status === "in_production" && ( */}
                    {isAdmin && (
                        <button
                            onClick={handleMarkReady}
                            disabled={!verdict.pdfCloudinaryUrl || isPending}
                            title={!verdict.pdfCloudinaryUrl ? "Generate PDF first" : ""}
                            className="btn-primary !h-12 px-8 text-[11px] font-black uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-rw-crimson/20 disabled:opacity-30 disabled:grayscale"
                        >
                            <svg
                                className="h-4 w-4"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2.5}
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                />
                            </svg>
                            {isPending ? "Processing..." : "Mark as Ready"}
                        </button>
                    )}
                </div>
            </div>

            <div className="grid lg:grid-cols-[1fr_320px] gap-8">
                {/* PDF PREVIEW */}
                <div className="overflow-x-auto p-4 bg-rw-bg-alt/50 border border-[var(--rw-border)] rounded-3xl">
                    <div className="min-w-[800px] scale-[0.85] origin-top mx-auto">
                        <VerdictDocument
                            id={verdict.id}
                            verdictRef={verdict.verdictRef}
                            orders={verdict.orders}
                            generatedBy={verdict.issuedBy}
                            generatedAt={verdict.issuedAt}
                        />
                    </div>
                </div>

                {/* INFO PANEL */}
                <div className="space-y-6">
                    <div className="rw-card p-6 bg-white border border-[var(--rw-border)]">
                        <p className="text-[10px] font-black text-rw-muted uppercase tracking-[0.2em] mb-4 border-b border-[var(--rw-border)] pb-2">
                            Verdict Summary
                        </p>
                        <div className="space-y-4">
                            <div>
                                <p className="text-[10px] text-rw-muted font-bold uppercase tracking-wider">
                                    Total Value
                                </p>
                                <p className="text-xl font-black text-rw-ink">
                                    {formatNaira(verdict.totalAmount)}
                                </p>
                            </div>
                            <div>
                                <p className="text-[10px] text-rw-muted font-bold uppercase tracking-wider">
                                    Orders Included
                                </p>
                                <p className="text-xl font-black text-rw-ink">
                                    {verdict.orders.length}
                                </p>
                            </div>
                            <div>
                                <p className="text-[10px] text-rw-muted font-bold uppercase tracking-wider">
                                    Timestamp
                                </p>
                                <p className="text-sm font-bold text-rw-ink">
                                    {new Date(verdict.issuedAt).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rw-card p-6 bg-purple-50 border border-purple-100">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="h-8 w-8 rounded-full bg-purple-200 text-purple-700 flex items-center justify-center">
                                <svg
                                    className="h-4 w-4"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0zm-9-3.75h.008v.008H12V8.25z"
                                    />
                                </svg>
                            </div>
                            <p className="text-[10px] font-black text-purple-900 uppercase tracking-widest">
                                Status Flow
                            </p>
                        </div>
                        <ul className="space-y-3 text-xs font-medium text-purple-800">
                            <li className="flex items-start gap-2">
                                <span
                                    className={
                                        verdict.status === "ready"
                                            ? "text-purple-400"
                                            : "font-black"
                                    }
                                >
                                    1. Wait for production to finish
                                </span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span
                                    className={
                                        verdict.status === "ready"
                                            ? "text-purple-400"
                                            : "font-black"
                                    }
                                >
                                    2. Generate & attach PDF
                                </span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span
                                    className={
                                        verdict.status === "ready"
                                            ? "font-black"
                                            : "text-purple-400"
                                    }
                                >
                                    3. Mark as Ready
                                </span>
                            </li>
                        </ul>
                        <p className="text-[10px] text-purple-600 mt-4 leading-relaxed italic">
                            Marking as ready will automatically update all{" "}
                            {verdict.orders.length} orders in this verdict to &quot;Ready
                            for Pickup&quot;.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
