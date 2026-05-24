"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import {
  SidebarItem,
  VariableChip,
  PreviewPane,
  HeaderFooterEditor,
} from "./components";
import { TEMPLATES, VARIABLES, DEFAULT_SUBJECTS, DEFAULT_BODIES } from "./constants";
import type { TemplateData, ViewMode, FieldType, SaveState, SiteEmailLayout } from "./types";

export default function EmailTemplatesClient() {
  // ─── State ────────────────────────────────────────────────────────────────────

  const [activeKey, setActiveKey] = useState("pending");
  const [templates, setTemplates] = useState<Record<string, TemplateData>>(() => {
    const initial: Record<string, TemplateData> = {};
    TEMPLATES.forEach((t) => {
      initial[t.key] = {
        subject: DEFAULT_SUBJECTS[t.key] || "",
        body_html: DEFAULT_BODIES[t.key] || "",
        is_active: true,
      };
    });
    return initial;
  });
  const [dirty, setDirty] = useState<Record<string, boolean>>({});
  const [saveState, setSaveState] = useState<SaveState>(null);
  const [view, setView] = useState<ViewMode>("split");
  const [activeField, setActiveField] = useState<FieldType>("body_html");
  const [siteLayout, setSiteLayout] = useState<SiteEmailLayout>({
    header_text: "<h1>Welcome to RwFFUTA</h1>",
    header_image_url: "",
    footer_text: "<p>&copy; 2026 RwFFUTA. All rights reserved.</p>",
    footer_image_url: "",
  });
  const [showSettings, setShowSettings] = useState(false);

  // ─── Derived State ────────────────────────────────────────────────────────────

  const current = templates[activeKey];
  const activeTemplate = TEMPLATES.find((t) => t.key === activeKey);

  // ─── Handlers ─────────────────────────────────────────────────────────────────

  const updateField = useCallback(
    (key: string, field: FieldType | "is_active", value: string | boolean) => {
      setTemplates((prev) => ({
        ...prev,
        [key]: { ...prev[key], [field]: value },
      }));
      setDirty((prev) => ({ ...prev, [key]: true }));
      setSaveState(null);
    },
    []
  );

  const handleSave = useCallback(async () => {
    setSaveState("saving");
    // TODO: Replace with actual API call to save templates
    await new Promise((r) => setTimeout(r, 700));
    setDirty((prev) => ({ ...prev, [activeKey]: false }));
    setSaveState("saved");
    toast.success("Template saved successfully");
    setTimeout(() => setSaveState(null), 2500);
  }, [activeKey]);

  const insertVariable = useCallback(
    (varName: string) => {
      const tag = `{{${varName}}}`;
      const field = activeField;
      const currentValue = current?.[field] || "";
      updateField(activeKey, field, currentValue + tag);
    },
    [activeKey, activeField, current, updateField]
  );

  const handleSelect = (key: string) => {
    setActiveKey(key);
    setSaveState(null);
  };

  const handleLayoutUpdate = useCallback((field: keyof SiteEmailLayout, value: string) => {
    setSiteLayout((prev) => ({ ...prev, [field]: value }));
  }, []);

  // ─── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--rw-border)] bg-white flex-shrink-0">
        <div>
          <h1 className="text-xl font-bold text-rw-ink">Email Templates</h1>
          <p className="text-sm text-rw-muted mt-0.5">Manage automated customer email templates</p>
        </div>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            showSettings
              ? "bg-rw-crimson text-white"
              : "bg-rw-bg-alt text-rw-muted hover:text-rw-ink border border-[var(--rw-border)]"
          }`}
        >
          {showSettings ? "← Back" : "⚙️ Layout Settings"}
        </button>
      </div>

      {/* Main Content Area */}
      {showSettings ? (
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          <div className="max-w-2xl">
            <h2 className="text-lg font-bold text-rw-ink mb-4">Email Layout Settings</h2>
            <p className="text-sm text-rw-muted mb-6">Configure the header and footer that appear on all email templates.</p>
            <HeaderFooterEditor layout={siteLayout} onChange={handleLayoutUpdate} />
          </div>
        </div>
      ) : (
        <div className="flex flex-1 overflow-hidden gap-6 p-6">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0 flex flex-col gap-4 overflow-y-auto">
            {/* Order Section */}
            <div>
              <p className="text-xs font-bold text-rw-muted uppercase tracking-wider mb-3 px-2">Order Status</p>
              <div className="flex flex-col gap-1">
                {TEMPLATES.filter(t => t.category === "order").map(t => (
                  <SidebarItem
                    key={t.key}
                    template={t}
                    isActive={activeKey === t.key}
                    isDirty={!!dirty[t.key]}
                    onClick={handleSelect}
                  />
                ))}
              </div>
            </div>

            {/* Payment Section */}
            <div>
              <p className="text-xs font-bold text-rw-muted uppercase tracking-wider mb-3 px-2">Payment Status</p>
              <div className="flex flex-col gap-1">
                {TEMPLATES.filter(t => t.category === "payment").map(t => (
                  <SidebarItem
                    key={t.key}
                    template={t}
                    isActive={activeKey === t.key}
                    isDirty={!!dirty[t.key]}
                    onClick={handleSelect}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Main Editor Area */}
          <div className="flex-1 flex flex-col gap-4 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between gap-4 pb-4 border-b border-[var(--rw-border)]">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{activeTemplate?.icon}</span>
                <div>
                  <h2 className="text-base font-bold text-rw-ink">{activeTemplate?.label}</h2>
                  <code className="text-xs text-rw-muted font-mono bg-rw-bg-alt px-2 py-1 rounded">{activeKey}</code>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Active toggle */}
                <label className="flex items-center gap-2 text-sm text-rw-muted cursor-pointer hover:text-rw-ink transition-colors">
                  <input
                    type="checkbox"
                    checked={current?.is_active ?? true}
                    onChange={e => updateField(activeKey, "is_active", e.target.checked)}
                    className="rounded"
                  />
                  Active
                </label>

                {/* View toggle */}
                <div className="flex border border-[var(--rw-border)] rounded-lg overflow-hidden">
                  {[["editor", "Edit"], ["split", "Split"], ["preview", "Preview"]].map(([v, label]) => (
                    <button
                      key={v}
                      onClick={() => setView(v as "editor" | "preview" | "split")}
                      className={`px-3 py-1.5 text-xs font-medium transition-all ${
                        view === v
                          ? "bg-rw-crimson text-white"
                          : "bg-white text-rw-text-2 hover:text-rw-ink border-r border-[var(--rw-border)] last:border-r-0"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                {/* Save button */}
                <button
                  onClick={handleSave}
                  disabled={saveState === "saving" || !dirty[activeKey]}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    dirty[activeKey]
                      ? "bg-rw-crimson text-white hover:bg-rw-crimson/90"
                      : "bg-rw-bg-alt text-rw-muted cursor-default"
                  }`}
                >
                  {saveState === "saving" ? "Saving…" : saveState === "saved" ? "✓ Saved" : "Save"}
                </button>
              </div>
            </div>

            {/* Variables bar */}
            <div className="flex flex-wrap gap-2 items-center p-3 bg-rw-bg-alt rounded-lg">
              <span className="text-xs text-rw-muted font-medium">Insert {activeField}:</span>
              {VARIABLES.map(v => (
                <VariableChip key={v.name} name={v.name} desc={v.desc} onInsert={insertVariable} />
              ))}
            </div>

            {/* Content area */}
            <div className="flex-1 flex gap-4 min-h-0">
              {/* Editor pane */}
              {(view === "editor" || view === "split") && (
                <div className={`flex flex-col gap-3 ${view === "split" ? "flex-1" : "w-full"}`}>
                  {/* Subject */}
                  <div>
                    <label className="text-xs font-bold text-rw-muted uppercase tracking-wider mb-2 block">Subject Line</label>
                    <input
                      type="text"
                      value={current?.subject || ""}
                      onFocus={() => setActiveField("subject")}
                      onChange={e => updateField(activeKey, "subject", e.target.value)}
                      className="w-full px-3 py-2 border border-[var(--rw-border)] rounded-lg text-sm font-mono text-rw-ink bg-white focus:outline-none focus:border-rw-crimson focus:ring-1 focus:ring-rw-crimson/20"
                      placeholder="Email subject line…"
                    />
                  </div>

                  {/* Body */}
                  <div className="flex-1 flex flex-col min-h-0">
                    <label className="text-xs font-bold text-rw-muted uppercase tracking-wider mb-2 block">Body HTML</label>
                    <textarea
                      value={current?.body_html || ""}
                      onFocus={() => setActiveField("body_html")}
                      onChange={e => updateField(activeKey, "body_html", e.target.value)}
                      className="flex-1 px-3 py-2 border border-[var(--rw-border)] rounded-lg text-xs font-mono text-rw-ink bg-white focus:outline-none focus:border-rw-crimson focus:ring-1 focus:ring-rw-crimson/20 resize-none"
                      placeholder="Enter email body HTML… Use {{customer_name}}, {{order_ref}} etc."
                    />
                    <p className="text-xs text-rw-muted mt-2">Supports HTML tags. Use the variable chips above to insert dynamic values.</p>
                  </div>
                </div>
              )}

              {/* Preview pane */}
              {(view === "preview" || view === "split") && (
                <div className={`flex flex-col gap-3 overflow-y-auto ${view === "split" ? "flex-1" : "w-full"}`}>
                  <p className="text-xs font-bold text-rw-muted uppercase tracking-wider">Preview (Sample Data)</p>
                  <PreviewPane data={current} layout={siteLayout} />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
