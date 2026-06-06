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

export interface SiteEmailLayout {
  header_text: string;
  header_image_url: string;
  footer_text: string;
  footer_image_url: string;
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

export interface Recipient {
    id: string;
    orderRef: string;
    customerName: string;
    customerEmail: string;
    status: string;
}
