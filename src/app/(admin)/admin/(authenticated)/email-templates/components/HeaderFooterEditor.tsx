"use client";

import { getLogoUrl, getHeaderImageUrl } from "../utils";
import type { SiteEmailLayout } from "../types";

interface HeaderFooterEditorProps {
  layout: SiteEmailLayout;
  onChange: (field: keyof SiteEmailLayout, value: string) => void;
}

export function HeaderFooterEditor({ layout, onChange }: HeaderFooterEditorProps) {
  return (
    <div className="space-y-6 p-6 bg-rw-bg-alt rounded-lg border border-[var(--rw-border)]">
      <div>
        <h3 className="text-sm font-bold text-rw-ink mb-4">Header Configuration</h3>

        {/* Header Text */}
        <div className="mb-4">
          <label className="text-xs font-bold text-rw-muted uppercase tracking-wider mb-2 block">
            Header Text
          </label>
          <textarea
            value={layout.header_text}
            onChange={(e) => onChange("header_text", e.target.value)}
            className="w-full px-3 py-2 border border-[var(--rw-border)] rounded-lg text-xs font-mono text-rw-ink bg-white focus:outline-none focus:border-rw-crimson focus:ring-1 focus:ring-rw-crimson/20"
            rows={3}
            placeholder="Header text (supports HTML)…"
          />
          <p className="text-xs text-rw-muted mt-1">Displayed at the top of all email templates.</p>
        </div>

        {/* Header Image URL */}
        <div className="mb-4">
          <label className="text-xs font-bold text-rw-muted uppercase tracking-wider mb-2 block">
            Header Image URL
          </label>
          <input
            type="text"
            value={layout.header_image_url}
            onChange={(e) => onChange("header_image_url", e.target.value)}
            className="w-full px-3 py-2 border border-[var(--rw-border)] rounded-lg text-xs font-mono text-rw-ink bg-white focus:outline-none focus:border-rw-crimson focus:ring-1 focus:ring-rw-crimson/20"
            placeholder={getHeaderImageUrl()}
          />
          <p className="text-xs text-rw-muted mt-1">Absolute URL. Leave blank to use default.</p>
        </div>

        {/* Header Preview */}
        {layout.header_image_url && (
          <div className="mt-3 p-3 bg-white border border-[var(--rw-border)] rounded-lg">
            <img
              src={layout.header_image_url}
              alt="Header preview"
              className="max-h-20 w-auto mx-auto"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
        )}
      </div>

      <hr className="border-[var(--rw-border)]" />

      <div>
        <h3 className="text-sm font-bold text-rw-ink mb-4">Footer Configuration</h3>

        {/* Footer Text */}
        <div className="mb-4">
          <label className="text-xs font-bold text-rw-muted uppercase tracking-wider mb-2 block">
            Footer Text
          </label>
          <textarea
            value={layout.footer_text}
            onChange={(e) => onChange("footer_text", e.target.value)}
            className="w-full px-3 py-2 border border-[var(--rw-border)] rounded-lg text-xs font-mono text-rw-ink bg-white focus:outline-none focus:border-rw-crimson focus:ring-1 focus:ring-rw-crimson/20"
            rows={3}
            placeholder="Footer text (supports HTML)…"
          />
          <p className="text-xs text-rw-muted mt-1">Displayed at the bottom of all email templates.</p>
        </div>

        {/* Footer Image URL */}
        <div>
          <label className="text-xs font-bold text-rw-muted uppercase tracking-wider mb-2 block">
            Footer Image URL
          </label>
          <input
            type="text"
            value={layout.footer_image_url}
            onChange={(e) => onChange("footer_image_url", e.target.value)}
            className="w-full px-3 py-2 border border-[var(--rw-border)] rounded-lg text-xs font-mono text-rw-ink bg-white focus:outline-none focus:border-rw-crimson focus:ring-1 focus:ring-rw-crimson/20"
            placeholder={getLogoUrl()}
          />
          <p className="text-xs text-rw-muted mt-1">Absolute URL. Leave blank to use default.</p>
        </div>

        {/* Footer Preview */}
        {layout.footer_image_url && (
          <div className="mt-3 p-3 bg-white border border-[var(--rw-border)] rounded-lg">
            <img
              src={layout.footer_image_url}
              alt="Footer preview"
              className="max-h-16 w-auto mx-auto"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
