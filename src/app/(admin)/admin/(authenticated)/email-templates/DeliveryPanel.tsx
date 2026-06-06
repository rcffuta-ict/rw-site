"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { TEMPLATES } from "./constants";
import { retryEmailAction } from "@/app/actions/email-templates";
import type { EmailQueueRow } from "@/lib/services/email-queue.service";

interface DeliveryPanelProps {
    deliveries: EmailQueueRow[];
}

const TEMPLATE_LABELS: Record<string, string> = Object.fromEntries(
    TEMPLATES.map((t) => [t.key, t.label])
);

const STATUS_STYLES: Record<EmailQueueRow["status"], string> = {
    sent: "bg-green-50 text-green-700 border-green-200",
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    sending: "bg-blue-50 text-blue-700 border-blue-200",
    failed: "bg-rw-crimson/10 text-rw-crimson border-rw-crimson/25",
};

function describe(row: EmailQueueRow): string {
    if (row.mode === "custom") return row.subject || "Custom message";
    if (row.template_key && TEMPLATE_LABELS[row.template_key]) {
        return TEMPLATE_LABELS[row.template_key];
    }
    return row.new_status ?? "Status update";
}

function when(iso: string): string {
    const d = new Date(iso);
    return d.toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export function DeliveryPanel({ deliveries }: DeliveryPanelProps) {
    const router = useRouter();
    const [retrying, setRetrying] = useState<string | null>(null);

    const handleRetry = async (id: string) => {
        setRetrying(id);
        const toastId = toast.loading("Re-queuing email…");
        const res = await retryEmailAction(id);
        if (res.success) {
            toast.success("Email re-queued", { id: toastId });
            router.refresh();
        } else {
            toast.error(res.error || "Failed to retry", { id: toastId });
        }
        setRetrying(null);
    };

    if (deliveries.length === 0) {
        return (
            <div className="rounded-xl border border-(--rw-border) bg-rw-bg-alt/40 px-6 py-12 text-center">
                <p className="text-sm text-rw-muted">
                    No emails sent yet. Status updates and messages will appear here.
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto rounded-2xl border border-(--rw-border) bg-white">
            <table className="w-full text-sm">
                <thead className="bg-rw-bg-alt/50 border-b border-(--rw-border)">
                    <tr className="text-left">
                        {["When", "To", "Message", "Status", "Tries", ""].map((h) => (
                            <th
                                key={h}
                                className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-rw-muted"
                            >
                                {h}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-(--rw-border)">
                    {deliveries.map((row) => (
                        <tr key={row.id} className="hover:bg-rw-bg-alt/30 transition-colors">
                            <td className="px-4 py-3 whitespace-nowrap text-rw-muted">
                                {when(row.created_at)}
                            </td>
                            <td className="px-4 py-3 text-rw-ink truncate max-w-[180px]">
                                {row.recipient_email || "—"}
                            </td>
                            <td className="px-4 py-3 text-rw-text-2 truncate max-w-[260px]">
                                {describe(row)}
                            </td>
                            <td className="px-4 py-3">
                                <span
                                    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${STATUS_STYLES[row.status]}`}
                                    title={row.last_error ?? undefined}
                                >
                                    {row.status}
                                </span>
                            </td>
                            <td className="px-4 py-3 text-rw-muted tabular-nums">
                                {row.attempts}
                            </td>
                            <td className="px-4 py-3 text-right">
                                {(row.status === "failed" || row.status === "sending") && (
                                    <button
                                        onClick={() => handleRetry(row.id)}
                                        disabled={retrying === row.id}
                                        className="text-xs font-semibold text-rw-crimson hover:underline disabled:opacity-50"
                                    >
                                        {retrying === row.id ? "…" : "Retry"}
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
