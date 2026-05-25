import { injectSampleData, getHeaderImageUrl } from "../utils";
import { SAMPLE_DATA } from "../constants";
import type { SiteEmailLayout } from "../types";

interface EmailPreviewProps {
    subject: string;
    bodyHtml: string;
    layout?: SiteEmailLayout;
}

export function EmailPreview({ subject, bodyHtml, layout }: EmailPreviewProps) {
    const rendered = injectSampleData(bodyHtml, SAMPLE_DATA);
    const renderedSubject = injectSampleData(subject, SAMPLE_DATA);
    const headerImageUrl = layout?.header_image_url || getHeaderImageUrl();
    const headerText = layout?.header_text || "<h3>Welcome</h3>";
    const footerText = layout?.footer_text || "<p>Thank you for your order</p>";

    return (
        <div className="bg-rw-bg-alt border border-[var(--rw-border)] rounded-lg overflow-hidden">
            {/* Subject line */}
            <div className="px-4 py-3 bg-white border-b border-[var(--rw-border)]">
                <p className="text-xs text-rw-muted font-medium mb-1">Subject:</p>
                <p className="text-sm font-semibold text-rw-ink">
                    {renderedSubject || "(empty subject)"}
                </p>
            </div>

            {/* Email preview */}
            <div className="p-4">
                <div className="bg-white rounded-lg border border-[var(--rw-border)] overflow-hidden max-w-lg mx-auto">
                    {/* Header */}
                    <div className="bg-rw-crimson/95 px-6 py-8 text-center">
                        {headerImageUrl && (
                            <div className="flex justify-center mb-3">
                                <img
                                    src={headerImageUrl}
                                    alt="Email Header"
                                    className="max-h-16 w-auto"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).style.display =
                                            "none";
                                    }}
                                />
                            </div>
                        )}
                        <div
                            className="text-white text-sm font-serif"
                            dangerouslySetInnerHTML={{ __html: headerText }}
                        />
                    </div>

                    {/* Body */}
                    <div className="px-6 py-6 text-sm text-rw-text-2 leading-relaxed font-serif">
                        <div
                            dangerouslySetInnerHTML={{
                                __html: rendered || "<p><em>No content yet.</em></p>",
                            }}
                        />
                    </div>

                    {/* Footer */}
                    <div className="bg-rw-bg-alt px-6 py-4 border-t border-[var(--rw-border)] text-center">
                        {layout?.footer_image_url && (
                            <div className="mb-3 flex justify-center">
                                <img
                                    src={layout.footer_image_url}
                                    alt="Email Footer"
                                    className="max-h-12 w-auto"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).style.display =
                                            "none";
                                    }}
                                />
                            </div>
                        )}
                        <div
                            className="text-xs text-rw-muted font-serif"
                            dangerouslySetInnerHTML={{ __html: footerText }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
