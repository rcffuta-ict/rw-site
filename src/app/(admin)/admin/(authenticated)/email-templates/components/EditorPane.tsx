import type { TemplateData, FieldType } from "../types";

interface EditorPaneProps {
  data: TemplateData | undefined;
  activeField: FieldType;
  onFieldChange: (field: FieldType, value: string) => void;
  onFieldFocus: (field: FieldType) => void;
}

export function EditorPane({ data, activeField, onFieldChange, onFieldFocus }: EditorPaneProps) {
  return (
    <div className="flex flex-col gap-3">
      {/* Subject */}
      <div>
        <label className="text-xs font-bold text-rw-muted uppercase tracking-wider mb-2 block">Subject Line</label>
        <input
          type="text"
          value={data?.subject || ""}
          onFocus={() => onFieldFocus("subject")}
          onChange={(e) => onFieldChange("subject", e.target.value)}
          className="w-full px-3 py-2 border border-(--rw-border) rounded-lg text-sm font-mono text-rw-ink bg-white focus:outline-none focus:border-rw-crimson focus:ring-1 focus:ring-rw-crimson/20"
          placeholder="Email subject line…"
        />
      </div>

      {/* Body */}
      <div className="flex-1 flex flex-col min-h-0">
        <label className="text-xs font-bold text-rw-muted uppercase tracking-wider mb-2 block">Body HTML</label>
        <textarea
          value={data?.body_html || ""}
          onFocus={() => onFieldFocus("body_html")}
          onChange={(e) => onFieldChange("body_html", e.target.value)}
          className="flex-1 px-3 py-2 border border-(--rw-border) rounded-lg text-xs font-mono text-rw-ink bg-white focus:outline-none focus:border-rw-crimson focus:ring-1 focus:ring-rw-crimson/20 resize-none"
          placeholder="Enter email body HTML… Use {{customer_name}}, {{order_ref}} etc."
        />
        <p className="text-xs text-rw-muted mt-2">Supports HTML tags. Use the variable chips above to insert dynamic values.</p>
      </div>
    </div>
  );
}
