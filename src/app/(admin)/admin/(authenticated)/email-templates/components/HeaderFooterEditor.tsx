"use client";

import { Input } from "@/components/ui/forms/Input";
import { Textarea } from "@/components/ui/forms/Textarea";
import { getLogoUrl, getHeaderImageUrl } from "../utils";
import type { SiteEmailLayout } from "../types";

interface HeaderFooterEditorProps {
    layout: SiteEmailLayout;
    onChange: (field: keyof SiteEmailLayout, value: string) => void;
}

export function HeaderFooterEditor({ layout, onChange }: HeaderFooterEditorProps) {
    return (
        <div className="space-y-6 p-6 bg-rw-bg-alt rounded-lg border border-(--rw-border)">
            <div>
                <h3 className="text-sm font-bold text-rw-ink mb-4">
                    Header Configuration
                </h3>

                {/* Header Text */}
                <div className="mb-4">
                    <Textarea
                        label="Header Text"
                        value={layout.header_text}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                            onChange("header_text", e.currentTarget.value)
                        }
                        placeholder="Header text (supports HTML)…"
                        description="Displayed at the top of all email templates."
                        rows={3}
                    />
                </div>

                {/* Header Image URL */}
                <div className="mb-4">
                    <Input
                        label="Header Image URL"
                        type="text"
                        value={layout.header_image_url}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            onChange("header_image_url", e.currentTarget.value)
                        }
                        placeholder={getHeaderImageUrl()}
                        description="Absolute URL. Leave blank to use default."
                    />
                </div>

                {/* Header Preview */}
                {layout.header_image_url && (
                    <div className="mt-3 p-3 bg-white border border-(--rw-border) rounded-lg">
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

            <hr className="border-(--rw-border)" />

            <div>
                <h3 className="text-sm font-bold text-rw-ink mb-4">
                    Footer Configuration
                </h3>

                {/* Footer Text */}
                <div className="mb-4">
                    <Textarea
                        label="Footer Text"
                        value={layout.footer_text}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                            onChange("footer_text", e.currentTarget.value)
                        }
                        placeholder="Footer text (supports HTML)…"
                        description="Displayed at the bottom of all email templates."
                        rows={3}
                    />
                </div>

                {/* Footer Image URL */}
                <div>
                    <Input
                        label="Footer Image URL"
                        type="text"
                        value={layout.footer_image_url}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            onChange("footer_image_url", e.currentTarget.value)
                        }
                        placeholder={getLogoUrl()}
                        description="Absolute URL. Leave blank to use default."
                    />
                </div>

                {/* Footer Preview */}
                {layout.footer_image_url && (
                    <div className="mt-3 p-3 bg-white border border-(--rw-border) rounded-lg">
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
