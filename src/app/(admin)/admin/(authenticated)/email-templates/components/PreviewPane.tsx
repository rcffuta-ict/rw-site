import { EmailPreview } from "./EmailPreview";
import type { TemplateData, SiteEmailLayout } from "../types";

interface PreviewPaneProps {
    data: TemplateData | undefined;
    layout?: SiteEmailLayout;
}

export function PreviewPane({ data, layout }: PreviewPaneProps) {
    return (
        <div className="flex flex-col gap-3 overflow-y-auto">
            <EmailPreview
                subject={data?.subject || ""}
                bodyHtml={data?.body_html || ""}
                layout={layout}
            />
        </div>
    );
}
