import { injectSampleData, getLogoUrl } from "../utils";
import { SAMPLE_DATA } from "../constants";

interface EmailPreviewProps {
  subject: string;
  bodyHtml: string;
}

export function EmailPreview({ subject, bodyHtml }: EmailPreviewProps) {
  const rendered = injectSampleData(bodyHtml, SAMPLE_DATA);
  const renderedSubject = injectSampleData(subject, SAMPLE_DATA);
  const logoUrl = getLogoUrl();

  return (
    <div className="bg-rw-bg-alt border border-[var(--rw-border)] rounded-lg overflow-hidden">
      {/* Subject line */}
      <div className="px-4 py-3 bg-white border-b border-[var(--rw-border)]">
        <p className="text-xs text-rw-muted font-medium mb-1">Subject:</p>
        <p className="text-sm font-semibold text-rw-ink">{renderedSubject || "(empty subject)"}</p>
      </div>

      {/* Email preview */}
      <div className="p-4">
        <div className="bg-white rounded-lg border border-[var(--rw-border)] overflow-hidden max-w-lg mx-auto">
          {/* Header */}
          <div className="bg-rw-crimson/95 px-6 py-8 text-center">
            <div className="flex justify-center mb-3">
              <img
                src={logoUrl}
                alt="RCF FUTA Logo"
                className="h-10 w-auto"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
            <p className="text-xs font-bold text-white tracking-widest uppercase">RCF FUTA</p>
            <h3 className="text-lg font-serif text-white mt-1">Redemption Week '26</h3>
          </div>

          {/* Body */}
          <div className="px-6 py-6 text-sm text-rw-text-2 leading-relaxed font-serif">
            <div dangerouslySetInnerHTML={{ __html: rendered || "<p><em>No content yet.</em></p>" }} />
          </div>

          {/* Footer */}
          <div className="bg-rw-bg-alt px-6 py-4 border-t border-[var(--rw-border)] text-center">
            <p className="text-xs text-rw-muted font-medium">Order reference: <strong>#FF3A9C</strong></p>
            <p className="text-[10px] text-rw-muted mt-1">RCF FUTA · Federal University of Technology, Akure</p>
          </div>
        </div>
      </div>
    </div>
  );
}
