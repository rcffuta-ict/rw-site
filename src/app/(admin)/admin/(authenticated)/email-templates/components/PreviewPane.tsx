import { EmailPreview } from "./EmailPreview";

interface PreviewPaneProps {
    subject: string;
    bodyHtml: string;
}

export function PreviewPane({ subject, bodyHtml }: PreviewPaneProps) {
    return (
        <div className="flex flex-col gap-3 overflow-y-auto">
            <EmailPreview subject={subject} bodyHtml={bodyHtml} />
        </div>
    );
}
