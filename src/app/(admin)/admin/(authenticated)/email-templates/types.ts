// ─── Types ───────────────────────────────────────────────────────────────────

export interface Template {
  key: string;
  label: string;
  category: "order" | "payment";
  icon: string;
}

export interface TemplateData {
  subject: string;
  body_html: string;
  is_active: boolean;
}

export interface SampleData {
  [key: string]: string;
}

export interface Variable {
  name: string;
  desc: string;
}

export type SaveState = null | "saving" | "saved" | "error";
export type ViewMode = "editor" | "preview" | "split";
export type FieldType = "subject" | "body_html";
