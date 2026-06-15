"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AdminTable } from "@/components/admin/AdminTable";
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

    return (
        <AdminTable<EmailQueueRow>
            data={deliveries}
            keyExtractor={(row) => row.id}
            pageSize={12}
            emptyMessage="No emails sent yet. Status updates and messages will appear here."
            columns={[
                {
                    key: "when",
                    label: "When",
                    render: (row) => (
                        <span className="whitespace-nowrap text-rw-muted">
                            {when(row.created_at)}
                        </span>
                    ),
                },
                {
                    key: "to",
                    label: "To",
                    render: (row) => (
                        <span className="block text-rw-ink truncate max-w-[180px]">
                            {row.recipient_email || "—"}
                        </span>
                    ),
                },
                {
                    key: "message",
                    label: "Message",
                    render: (row) => (
                        <span className="block text-rw-text-2 truncate max-w-[260px]">
                            {describe(row)}
                        </span>
                    ),
                },
                {
                    key: "status",
                    label: "Status",
                    render: (row) => (
                        <span
                            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${STATUS_STYLES[row.status]}`}
                            title={row.last_error ?? undefined}
                        >
                            {row.status}
                        </span>
                    ),
                },
                {
                    key: "tries",
                    label: "Tries",
                    render: (row) => (
                        <span className="text-rw-muted tabular-nums">{row.attempts}</span>
                    ),
                },
                {
                    key: "action",
                    label: "",
                    align: "right",
                    render: (row) =>
                        row.status === "failed" || row.status === "sending" ? (
                            <button
                                onClick={() => handleRetry(row.id)}
                                disabled={retrying === row.id}
                                className="text-xs font-semibold text-rw-crimson hover:underline disabled:opacity-50"
                            >
                                {retrying === row.id ? "…" : "Retry"}
                            </button>
                        ) : null,
                },
            ]}
        />
    );
}
