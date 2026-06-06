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
}));

export function ComposePanel({ recipients }: ComposePanelProps) {
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [query, setQuery] = useState("");
    const [open, setOpen] = useState(false);
    const [subject, setSubject] = useState("");
    const [body, setBody] = useState("");
    const [sending, setSending] = useState(false);
    const subjectRef = useRef<HTMLInputElement>(null);

    const selected = recipients.find((r) => r.id === selectedId) ?? null;

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        const list = q
            ? recipients.filter(
                  (r) =>
                      r.customerName.toLowerCase().includes(q) ||
                      r.orderRef.toLowerCase().includes(q) ||
                      r.customerEmail.toLowerCase().includes(q)
              )
            : recipients;
        return list.slice(0, 8);
    }, [query, recipients]);

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
        if (!selectedId) return toast.error("Pick a customer to message.");
        if (!subject.trim()) return toast.error("Add a subject line.");
        if (!body.trim()) return toast.error("Write a message first.");

        setSending(true);
        const toastId = toast.loading("Sending message…");
        const res = await sendCustomEmailAction({
            orderId: selectedId,
            subject: subject.trim(),
            bodyHtml: body.trim(),
        });
        if (res.success) {
            toast.success(`Message sent to ${selected?.customerName ?? "customer"}`, {
                id: toastId,
            });
            setSubject("");
            setBody("");
            setSelectedId(null);
            setQuery("");
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
                    To customer
                </label>

                {selected ? (
                    <div className="flex items-center justify-between gap-3 rounded-xl border border-(--rw-border) bg-rw-bg-alt/40 px-4 py-3">
                        <div className="min-w-0">
                            <p className="text-sm font-semibold text-rw-ink truncate">
                                {selected.customerName}{" "}
                                <span className="font-mono text-xs text-rw-muted">
                                    #{selected.orderRef}
                                </span>
                            </p>
                            <p className="text-xs text-rw-muted truncate">
                                {selected.customerEmail}
                            </p>
                        </div>
                        <button
                            onClick={() => {
                                setSelectedId(null);
                                setQuery("");
                            }}
                            className="text-xs font-semibold text-rw-crimson hover:underline shrink-0"
                        >
                            Change
                        </button>
                    </div>
                ) : (
                    <div className="relative">
                        <Input
                            type="text"
                            value={query}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                setQuery(e.currentTarget.value);
                                setOpen(true);
                            }}
                            onFocus={() => setOpen(true)}
                            placeholder="Search by name, order number, or email…"
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
                                                setSelectedId(r.id);
                                                setOpen(false);
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
                )}
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
                        reloadKey="compose"
                        placeholder="Write your message to the customer…"
                        containerClassName="flex-1 min-h-0"
                    />

                    <button
                        onClick={handleSend}
                        disabled={sending || !selectedId}
                        className={`self-start px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                            !sending && selectedId
                                ? "bg-rw-crimson text-white hover:bg-rw-crimson/90 shadow-lg shadow-rw-crimson/20"
                                : "bg-rw-bg-alt text-rw-muted cursor-not-allowed"
                        }`}
                    >
                        {sending ? "Sending…" : "Send message"}
                    </button>
                </div>

                <div className="flex flex-col gap-3 overflow-y-auto flex-1">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-rw-muted">
                        Preview {selected ? `(to ${selected.customerName})` : "(sample data)"}
                    </p>
                    <PreviewPane subject={subject} bodyHtml={body} />
                </div>
            </div>
        </div>
    );
}
