import { injectSampleData } from "../utils";
import { SAMPLE_DATA } from "../constants";
import { LOGOS } from "@/lib/config";

interface EmailPreviewProps {
    subject: string;
    bodyHtml: string;
}

const SITE_URL = "https://rw.rcffuta.com";

/**
 * Renders the email exactly as the customer receives it. The shell mirrors
 * `wrapInEmailShell` in the send-order-email Edge Function (ink #1C0003 header,
 * crimson #FF0015 accent, logo from the production site) so "what you see here
 * is what gets sent".
 */
export function EmailPreview({ subject, bodyHtml }: EmailPreviewProps) {
    const body = injectSampleData(bodyHtml, SAMPLE_DATA);
    const renderedSubject = injectSampleData(subject, SAMPLE_DATA);
    const orderRef = SAMPLE_DATA.order_ref;

    return (
        <div className="border border-(--rw-border) rounded-lg bg-white">
            {/* Subject line */}
            <div className="px-4 py-3 bg-white border-b border-(--rw-border)">
                <p className="text-[10px] uppercase tracking-wider text-rw-muted font-bold mb-1">
                    Subject
                </p>
                <p className="text-sm font-semibold text-rw-ink">
                    {renderedSubject || "(empty subject)"}
                </p>
            </div>

            {/* Email shell — matches the real sent email */}
            <div className="p-4 bg-[#fdf5f5]">
                <div className="mx-auto max-w-[600px] bg-white rounded-2xl overflow-hidden border border-[#e8d0d4]">
                    {/* Header */}
                    <div
                        className="bg-[#1C0003] px-8 py-7 text-center"
                        style={{ display: "flex" }}
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={`${SITE_URL}/${LOGOS.tenureIcon}`}
                            alt="RCF FUTA"
                            width={44}
                            height={44}
                            className="inline-block rounded-xl mb-2.5"
                        />
                        <div>
                            <p className="m-0 text-[#FF6A00] text-[11px] tracking-[3px] uppercase">
                                RCF FUTA
                            </p>
                            <h1 className="mt-1 mb-0 text-white text-[22px] font-bold">
                                Redemption Week &apos;26
                            </h1>
                        </div>
                    </div>

                    {/* Accent bar */}
                    <div className="h-1 bg-[#FF0015]" />

                    {/* Body */}
                    <div
                        className="px-8 py-7 text-[#18080a] text-[15px] leading-7
                            [&_p]:my-3 [&_strong]:font-semibold
                            [&_h2]:text-lg [&_h2]:font-bold [&_h2]:my-3
                            [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5
                            [&_a]:text-[#FF0015] [&_a]:underline"
                        dangerouslySetInnerHTML={{
                            __html: body || "<p><em>No content yet.</em></p>",
                        }}
                    />

                    {/* Footer */}
                    <div className="bg-[#fdf5f5] px-8 py-5 border-t border-[#e8d0d4] text-center">
                        <p className="m-0 text-[12px] text-rw-muted">
                            Order reference:{" "}
                            <strong className="text-[#1C0003]">#{orderRef}</strong>
                        </p>
                        <p className="mt-2 mb-0 text-[11px] text-rw-muted">
                            RCF FUTA · Federal University of Technology, Akure
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
