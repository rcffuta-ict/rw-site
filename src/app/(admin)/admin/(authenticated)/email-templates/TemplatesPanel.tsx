"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import {
    RichTextEditor,
    type EditorVariable,
} from "@/components/ui/forms/RichTextEditor";
import {
    PillInput,
    type PillInputHandle,
} from "@/components/ui/forms/richtext/PillInput";
import { SidebarItem, VariableChip, PreviewPane } from "./components";
import { TEMPLATES, VARIABLES, DEFAULT_SUBJECTS, DEFAULT_BODIES } from "./constants";
import { saveEmailTemplateAction } from "@/app/actions/email-templates";
import type { EmailTemplate } from "@/lib/services/email-templates.service";
import type { ViewMode } from "./types";

interface TemplatesPanelProps {
    initialTemplates: EmailTemplate[];
    loadError: string | null;
}

interface TemplateState {
    id: string | null;
    subject: string;
    body_html: string;
    is_active: boolean;
}

const VARIABLE_LABELS: Record<string, string> = {
    customer_name: "Customer name",
    order_ref: "Order Reference",
    total_amount: "Order total",
    amount_paid: "Amount paid",
    balance: "Balance left",
    items_html: "Items table",
};

const EDITOR_VARIABLES: EditorVariable[] = VARIABLES.map((v) => ({
    name: v.name,
    label: VARIABLE_LABELS[v.name] ?? v.name,
}));

export function TemplatesPanel({ initialTemplates, loadError }: TemplatesPanelProps) {
    const [templates, setTemplates] = useState<Record<string, TemplateState>>(() => {
        const map: Record<string, TemplateState> = {};
        for (const t of TEMPLATES) {
            const row = initialTemplates.find((r) => r.template_key === t.key);
            map[t.key] = row
                ? {
                      id: row.id,
                      subject: row.subject,
                      body_html: row.body_html,
                      is_active: row.is_active,
                  }
                : {
                      id: null,
                      subject: DEFAULT_SUBJECTS[t.key] ?? "",
                      body_html: DEFAULT_BODIES[t.key] ?? "",
                      is_active: true,
                  };
        }
        return map;
    });

    const [activeKey, setActiveKey] = useState(TEMPLATES[0]?.key ?? "pending");
    const [dirty, setDirty] = useState<Record<string, boolean>>({});
    const [savingKey, setSavingKey] = useState<string | null>(null);
    const [view, setView] = useState<ViewMode>("split");
    const subjectPillRef = useRef<PillInputHandle>(null);

    const current = templates[activeKey];
    const activeTemplate = TEMPLATES.find((t) => t.key === activeKey);
    const missingCount = useMemo(
        () => Object.values(templates).filter((t) => t.id === null).length,
        [templates]
    );

    const updateField = useCallback(
        (field: keyof TemplateState, value: string | boolean) => {
            setTemplates((prev) => ({
                ...prev,
                [activeKey]: { ...prev[activeKey], [field]: value },
            }));
            setDirty((prev) => ({ ...prev, [activeKey]: true }));
        },
        [activeKey]
    );

    const insertIntoSubject = useCallback((name: string) => {
        const v = EDITOR_VARIABLES.find((x) => x.name === name);
        if (v) subjectPillRef.current?.insertVariable(v);
    }, []);

    const handleSave = useCallback(async () => {
        const row = templates[activeKey];
        if (!row?.id) {
            toast.error(
                "This template isn't in the database yet. Run the setup SQL, then refresh."
            );
            return;
        }
        setSavingKey(activeKey);
        const toastId = toast.loading("Saving template…");
        const res = await saveEmailTemplateAction(row.id, {
            subject: row.subject,
            body_html: row.body_html,
            is_active: row.is_active,
        });
        if (res.success) {
            toast.success("Template saved", { id: toastId });
            setDirty((prev) => ({ ...prev, [activeKey]: false }));
        } else {
            toast.error(res.error || "Failed to save template", { id: toastId });
        }
        setSavingKey(null);
    }, [templates, activeKey]);

    const isSaving = savingKey === activeKey;
    const isDirty = !!dirty[activeKey];

    return (
        <div className="flex flex-col gap-5">
            {loadError && (
                <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-800">
                    Couldn&apos;t load saved templates: {loadError}. You&apos;re seeing
                    defaults — saving is disabled until the database is reachable.
                </div>
            )}
            {!loadError && missingCount > 0 && (
                <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-900">
                    {missingCount} template{missingCount === 1 ? "" : "s"} not set up in
                    the database yet. Run the setup SQL (docs/email-setup.sql) and refresh
                    to enable saving.
                </div>
            )}

            <div className="flex gap-6">
                {/* Sidebar */}
                <div className="w-56 shrink-0 flex flex-col gap-4">
                    {(["order", "payment", "follow-up"] as const).map((category) => (
                        <div key={category}>
                            <p className="text-xs font-bold text-rw-muted uppercase tracking-wider mb-3 px-2">
                                {category === "order"
                                    ? "Order Status"
                                    : category === "payment"
                                      ? "Payment Status"
                                      : "Follow-up"}
                            </p>
                            <div className="flex flex-col gap-1">
                                {TEMPLATES.filter((t) => t.category === category).map(
                                    (t) => (
                                        <SidebarItem
                                            key={t.key}
                                            template={t}
                                            isActive={activeKey === t.key}
                                            isDirty={!!dirty[t.key]}
                                            onClick={(key: string) => setActiveKey(key)}
                                        />
                                    )
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Editor */}
                <div className="flex-1 flex flex-col gap-4 min-w-0">
                    {/* Toolbar */}
                    <div className="flex items-center justify-between gap-4 pb-4 border-b border-(--rw-border)">
                        <div className="flex items-center gap-3 min-w-0">
                            <span className="text-2xl">{activeTemplate?.icon}</span>
                            <div className="min-w-0">
                                <h2 className="text-base font-bold text-rw-ink truncate">
                                    {activeTemplate?.label}
                                </h2>
                                <p className="text-xs text-rw-muted">
                                    {activeTemplate?.description}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                            <label className="flex items-center gap-2 text-sm text-rw-muted cursor-pointer hover:text-rw-ink transition-colors">
                                <input
                                    type="checkbox"
                                    checked={current?.is_active ?? true}
                                    onChange={(e) =>
                                        updateField("is_active", e.target.checked)
                                    }
                                    className="rounded"
                                />
                                Active
                            </label>

                            <div className="flex border border-(--rw-border) rounded-lg overflow-hidden">
                                {(
                                    [
                                        ["editor", "Edit"],
                                        ["split", "Split"],
                                        ["preview", "Preview"],
                                    ] as const
                                ).map(([v, label]) => (
                                    <button
                                        key={v}
                                        onClick={() => setView(v)}
                                        className={`px-3 py-1.5 text-xs font-medium transition-all ${
                                            view === v
                                                ? "bg-rw-crimson text-white"
                                                : "bg-white text-rw-text-2 hover:text-rw-ink border-r border-(--rw-border) last:border-r-0"
                                        }`}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={handleSave}
                                disabled={!isDirty || isSaving || !current?.id}
                                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                    isDirty && current?.id && !isSaving
                                        ? "bg-rw-crimson text-white hover:bg-rw-crimson/90"
                                        : "bg-rw-bg-alt text-rw-muted cursor-not-allowed"
                                }`}
                            >
                                {isSaving ? "Saving…" : isDirty ? "Save" : "Saved"}
                            </button>
                        </div>
                    </div>

                    {/* Content row */}
                    <div className="flex gap-4 h-[560px]">
                        {(view === "editor" || view === "split") && (
                            <div
                                className={`flex flex-col gap-4 min-h-0 ${view === "split" ? "flex-1" : "w-full"}`}
                            >
                                <div>
                                    <div className="flex flex-wrap gap-1.5 mb-2">
                                        {VARIABLES.map((v) => (
                                            <VariableChip
                                                key={v.name}
                                                name={v.name}
                                                desc={VARIABLE_LABELS[v.name] ?? v.desc}
                                                onInsert={insertIntoSubject}
                                            />
                                        ))}
                                    </div>
                                    <PillInput
                                        ref={subjectPillRef}
                                        label="Subject line"
                                        value={current?.subject || ""}
                                        onChange={(text) => updateField("subject", text)}
                                        variables={EDITOR_VARIABLES}
                                        reloadKey={activeKey}
                                        placeholder="e.g. Your order {{order_ref}} is confirmed"
                                    />
                                </div>

                                <RichTextEditor
                                    label="Message"
                                    value={current?.body_html || ""}
                                    onChange={(html) => updateField("body_html", html)}
                                    variables={EDITOR_VARIABLES}
                                    reloadKey={activeKey}
                                    placeholder="Write the email message here…"
                                    containerClassName="flex-1 min-h-0"
                                />
                            </div>
                        )}

                        {(view === "preview" || view === "split") && (
                            <div
                                className={`flex flex-col gap-3 overflow-y-auto ${view === "split" ? "flex-1" : "w-full"}`}
                            >
                                <p className="text-[11px] font-bold uppercase tracking-widest text-rw-muted">
                                    Preview (with sample customer data)
                                </p>
                                <PreviewPane
                                    subject={current?.subject || ""}
                                    bodyHtml={current?.body_html || ""}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
