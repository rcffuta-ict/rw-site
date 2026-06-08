"use client";

import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/forms/Input";
import {
    RichTextEditor,
    type EditorVariable,
} from "@/components/ui/forms/RichTextEditor";
import { VariableChip, PreviewPane } from "./components";
import { VARIABLES } from "./constants";
import { sendCustomEmailAction } from "@/app/actions/email-templates";
import type { Recipient } from "./types";

interface ComposePanelProps {
    recipients: Recipient[];
}

const VARIABLE_LABELS: Record<string, string> = {
    customer_name: "Customer name",
    order_ref: "Order number",
    total_amount: "Order total",
    amount_paid: "Amount paid",
    balance: "Balance left",
    items_html: "Items table",
};

const EDITOR_VARIABLES: EditorVariable[] = VARIABLES.map((v) => ({
    name: v.name,
    label: VARIABLE_LABELS[v.name] ?? v.name,
    description: v.desc,
}));

export function ComposePanel({ recipients }: ComposePanelProps) {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [query, setQuery] = useState("");
    const [open, setOpen] = useState(false);
    const [subject, setSubject] = useState("");
    const [body, setBody] = useState("");
    const [sending, setSending] = useState(false);
    // Bumped after a successful send to reset the rich-text editor's content.
    const [composeKey, setComposeKey] = useState(0);
    const subjectRef = useRef<HTMLInputElement>(null);

    const selected = useMemo(
        () =>
            selectedIds
                .map((id) => recipients.find((r) => r.id === id))
                .filter((r): r is Recipient => Boolean(r)),
        [selectedIds, recipients]
    );

    // Distinct recipient emails across the selected orders (combined on send).
    const recipientCount = useMemo(
        () =>
            new Set(selected.map((r) => r.customerEmail.trim().toLowerCase())).size,
        [selected]
    );

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        const list = recipients.filter((r) => {
            if (selectedIds.includes(r.id)) return false;
            if (!q) return true;
            return (
                r.customerName.toLowerCase().includes(q) ||
                r.orderRef.toLowerCase().includes(q) ||
                r.customerEmail.toLowerCase().includes(q)
            );
        });
        return list.slice(0, 8);
    }, [query, recipients, selectedIds]);

    const insertIntoSubject = (name: string) => {
        const token = `{{${name}}}`;
        const el = subjectRef.current;
        if (el && document.activeElement === el) {
            const start = el.selectionStart ?? subject.length;
            const end = el.selectionEnd ?? subject.length;
            setSubject(subject.slice(0, start) + token + subject.slice(end));
            requestAnimationFrame(() => {
                el.focus();
                el.setSelectionRange(start + token.length, start + token.length);
            });
        } else {
            setSubject(subject + token);
        }
    };

    const handleSend = async () => {
        if (selectedIds.length === 0)
            return toast.error("Pick at least one customer to message.");
        if (!subject.trim()) return toast.error("Add a subject line.");
        if (!body.trim()) return toast.error("Write a message first.");

        setSending(true);
        const toastId = toast.loading("Sending message…");
        const res = await sendCustomEmailAction({
            orderIds: selectedIds,
            subject: subject.trim(),
            bodyHtml: body.trim(),
        });
        if (res.success) {
            const n = res.sent ?? recipientCount;
            toast.success(
                n === 1 ? "Message sent" : `Message sent to ${n} customers`,
                { id: toastId }
            );
            setSubject("");
            setBody("");
            setSelectedIds([]);
            setQuery("");
            setComposeKey((k) => k + 1);
        } else {
            toast.error(res.error || "Failed to send message", { id: toastId });
        }
        setSending(false);
    };

    return (
        <div className="flex flex-col gap-5">
            {/* Recipient picker */}
            <div className="max-w-xl">
                <label className="text-[11px] font-bold uppercase tracking-widest text-rw-muted mb-2 block">
                    To customers{" "}
                    {selected.length > 0 && (
                        <span className="text-rw-muted/70 normal-case font-semibold tracking-normal">
                            · {selected.length} order
                            {selected.length === 1 ? "" : "s"}
                            {recipientCount !== selected.length &&
                                ` · ${recipientCount} email${recipientCount === 1 ? "" : "s"}`}
                        </span>
                    )}
                </label>

                {selected.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-2">
                        {selected.map((r) => (
                            <span
                                key={r.id}
                                className="inline-flex items-center gap-1.5 rounded-full border border-(--rw-border) bg-rw-bg-alt/60 pl-3 pr-1.5 py-1 text-xs"
                            >
                                <span className="font-medium text-rw-ink">
                                    {r.customerName}
                                </span>
                                <span className="font-mono text-rw-muted">
                                    #{r.orderRef}
                                </span>
                                <button
                                    type="button"
                                    onClick={() =>
                                        setSelectedIds((ids) =>
                                            ids.filter((id) => id !== r.id)
                                        )
                                    }
                                    className="h-4 w-4 inline-flex items-center justify-center rounded-full text-rw-muted hover:bg-rw-crimson/10 hover:text-rw-crimson"
                                    title="Remove"
                                >
                                    ×
                                </button>
                            </span>
                        ))}
                    </div>
                )}

                <div className="relative">
                    <Input
                        type="text"
                        value={query}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setQuery(e.currentTarget.value);
                            setOpen(true);
                        }}
                        onFocus={() => setOpen(true)}
                        placeholder="Add by name, order number, or email…"
                    />
                    {open && filtered.length > 0 && (
                        <>
                            <div
                                className="fixed inset-0 z-10"
                                onClick={() => setOpen(false)}
                            />
                            <div className="absolute left-0 right-0 top-full mt-1 z-20 max-h-72 overflow-y-auto rounded-xl border border-(--rw-border) bg-white shadow-xl py-1">
                                {filtered.map((r) => (
                                    <button
                                        key={r.id}
                                        onClick={() => {
                                            setSelectedIds((ids) => [...ids, r.id]);
                                            setQuery("");
                                        }}
                                        className="w-full text-left px-4 py-2.5 hover:bg-rw-bg-alt transition-colors"
                                    >
                                        <p className="text-sm font-medium text-rw-ink">
                                            {r.customerName}{" "}
                                            <span className="font-mono text-xs text-rw-muted">
                                                #{r.orderRef}
                                            </span>
                                        </p>
                                        <p className="text-xs text-rw-muted truncate">
                                            {r.customerEmail}
                                        </p>
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                    {recipients.length === 0 && (
                        <p className="text-xs text-rw-muted mt-2">
                            No orders yet — customers appear here once they place an
                            order.
                        </p>
                    )}
                </div>
            </div>

            {/* Editor + preview */}
            <div className="flex gap-4 h-[560px]">
                <div className="flex flex-col gap-4 min-h-0 flex-1">
                    <div>
                        <Input
                            ref={subjectRef}
                            label="Subject line"
                            type="text"
                            value={subject}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                setSubject(e.currentTarget.value)
                            }
                            placeholder="e.g. An update on your order #{{order_ref}}"
                        />
                        <div className="flex flex-wrap gap-1.5 mt-2">
                            {VARIABLES.map((v) => (
                                <VariableChip
                                    key={v.name}
                                    name={v.name}
                                    desc={VARIABLE_LABELS[v.name] ?? v.desc}
                                    onInsert={insertIntoSubject}
                                />
                            ))}
                        </div>
                    </div>

                    <RichTextEditor
                        label="Message"
                        value={body}
                        onChange={setBody}
                        variables={EDITOR_VARIABLES}
                        reloadKey={`compose-${composeKey}`}
                        placeholder="Write your message to the customer…"
                        containerClassName="flex-1 min-h-0"
                    />

                    <button
                        onClick={handleSend}
                        disabled={sending || selectedIds.length === 0}
                        className={`self-start px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                            !sending && selectedIds.length > 0
                                ? "bg-rw-crimson text-white hover:bg-rw-crimson/90 shadow-lg shadow-rw-crimson/20"
                                : "bg-rw-bg-alt text-rw-muted cursor-not-allowed"
                        }`}
                    >
                        {sending
                            ? "Sending…"
                            : recipientCount > 1
                              ? `Send to ${recipientCount} customers`
                              : "Send message"}
                    </button>
                </div>

                <div className="flex flex-col gap-3 overflow-y-auto flex-1">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-rw-muted">
                        Preview{" "}
                        {selected.length === 1
                            ? `(to ${selected[0].customerName})`
                            : selected.length > 1
                              ? `(${recipientCount} recipients · sample data)`
                              : "(sample data)"}
                    </p>
                    <PreviewPane subject={subject} bodyHtml={body} />
                </div>
            </div>
        </div>
    );
}
