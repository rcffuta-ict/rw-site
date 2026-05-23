import type { Template, TemplateData, ViewMode, SaveState } from "../types";

interface TemplateToolbarProps {
  template: Template | undefined;
  templateKey: string;
  templateData: TemplateData | undefined;
  isDirty: boolean;
  saveState: SaveState;
  view: ViewMode;
  onToggleActive: () => void;
  onViewChange: (view: ViewMode) => void;
  onSave: () => void;
}

export function TemplateToolbar({
  template,
  templateKey,
  templateData,
  isDirty,
  saveState,
  view,
  onToggleActive,
  onViewChange,
  onSave,
}: TemplateToolbarProps) {
  return (
    <div className="flex items-center justify-between gap-4 pb-4 border-b border-[var(--rw-border)]">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{template?.icon}</span>
        <div>
          <h2 className="text-base font-bold text-rw-ink">{template?.label}</h2>
          <code className="text-xs text-rw-muted font-mono bg-rw-bg-alt px-2 py-1 rounded">{templateKey}</code>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Active toggle */}
        <label className="flex items-center gap-2 text-sm text-rw-muted cursor-pointer hover:text-rw-ink transition-colors">
          <input
            type="checkbox"
            checked={templateData?.is_active ?? true}
            onChange={onToggleActive}
            className="rounded"
          />
          Active
        </label>

        {/* View toggle */}
        <div className="flex border border-[var(--rw-border)] rounded-lg overflow-hidden">
          {(["editor", "split", "preview"] as const).map((v) => (
            <button
              key={v}
              onClick={() => onViewChange(v)}
              className={`px-3 py-1.5 text-xs font-medium transition-all ${
                view === v
                  ? "bg-rw-crimson text-white"
                  : "bg-white text-rw-text-2 hover:text-rw-ink border-r border-[var(--rw-border)] last:border-r-0"
              }`}
            >
              {v === "editor" ? "Edit" : v === "split" ? "Split" : "Preview"}
            </button>
          ))}
        </div>

        {/* Save button */}
        <button
          onClick={onSave}
          disabled={saveState === "saving" || !isDirty}
          className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
            isDirty
              ? "bg-rw-crimson text-white hover:bg-rw-crimson/90"
              : "bg-rw-bg-alt text-rw-muted cursor-default"
          }`}
        >
          {saveState === "saving" ? "Saving…" : saveState === "saved" ? "✓ Saved" : "Save"}
        </button>
      </div>
    </div>
  );
}
