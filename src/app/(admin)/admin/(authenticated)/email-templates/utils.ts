import type { SampleData } from "./types";

/**
 * Injects sample data into template by replacing {{variable}} placeholders.
 *
 * `order_ref` is stored bare (e.g. FF3A9C) but shown with a leading "#", added
 * automatically here — unless the author already typed one right before the
 * token (legacy "#{{order_ref}}") so we never double it up. This mirrors the
 * email worker's injectVars so the preview matches what gets sent.
 */
export function injectSampleData(html: string, sampleData: SampleData): string {
  return html.replace(
    /\{\{(\w+)\}\}/g,
    (match: string, key: string, offset: number, source: string) => {
      const value = sampleData[key];
      if (value === undefined) return match;
      if (key === "order_ref" && value && source[offset - 1] !== "#") {
        return `#${value}`;
      }
      return value;
    }
  );
}

/**
 * Get the logo URL from environment or return default
 */
export function getLogoUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL
    ? `${process.env.NEXT_PUBLIC_SITE_URL}/images/logos/rcf-logo.png`
    : "/images/logos/rcf-logo.png";
}

/**
 * Get the header background image URL
 */
export function getHeaderImageUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL
    ? `${process.env.NEXT_PUBLIC_SITE_URL}/images/email-header.png`
    : "/images/email-header.png";
}
