import type { SampleData } from "./types";

/**
 * Injects sample data into template by replacing {{variable}} placeholders
 */
export function injectSampleData(html: string, sampleData: SampleData): string {
  return html.replace(/\{\{(\w+)\}\}/g, (_: string, key: string) => sampleData[key] || `{{${key}}}`);
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
