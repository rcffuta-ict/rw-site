import { injectSampleData } from "../utils";
import { SAMPLE_DATA } from "../constants";
import { LOGOS } from "@/lib/config";

interface EmailPreviewProps {
    subject: string;
    bodyHtml: string;
}

const SITE_URL = "https://rw.rcffuta.com";

export function EmailPreview({ subject, bodyHtml }: EmailPreviewProps) {
    const body = injectSampleData(bodyHtml, SAMPLE_DATA);
    const renderedSubject = injectSampleData(subject, SAMPLE_DATA);
    const orderRef = SAMPLE_DATA.order_ref;

    return (
        <div className="border border-(--rw-border) rounded-lg bg-rw-white font-sans max-w-2xl mx-auto">
            {/* Subject Line */}
            <div className="px-4 py-3 bg-rw-white border-b border-(--rw-border)">
                <p className="text-[10px] uppercase tracking-wider text-rw-muted font-bold mb-1">
                    SUBJECT
                </p>
                <p className="text-sm font-semibold text-rw-ink">
                    {renderedSubject
                        ? `${renderedSubject} - Redemption Week '26`
                        : "(empty subject)"}
                </p>
            </div>

            {/* Email Preview Container */}
            <div className="p-6 bg-rw-bg-alt">
                <div className="mx-auto max-w-[600px] bg-white rounded-2xl overflow-hidden border border-[#e8d0d4] shadow-sm">
                    {/* HEADER */}
                    <div className="bg-rw-ink px-2 py-4 text-center">
                        <div className="flex items-center justify-center gap-4 mx-auto">
                            {/* Tenure Icon */}
                            <img
                                src={`${SITE_URL}${LOGOS.tenureIcon}`}
                                alt="RCF FUTA"
                                width={30}
                                height={30}
                                // className="rounded-2xl"
                            />
                            {/* Title Section */}
                            <div className="text-left">
                                <p className="text-rw-orange text-[13px] font-bold tracking-[3px] uppercase mb-1">
                                    RCF FUTA
                                </p>
                                <h1 className="text-white text-3xl font-bold tracking-tight leading-none mb-1">
                                    Redemption Week
                                </h1>
                                <p className="text-rw-orange text-[17px] font-semibold">
                                    38th Anniversary
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Accent Line */}
                    <div className="h-1.5 bg-rw-crimson" />

                    {/* Body Content */}
                    <div
                        className="px-8 py-10 text-rw-text text-[15.5px] leading-relaxed
                       [&_p]:my-3 [&_strong]:font-semibold
                       [&_h2]:text-xl [&_h2]:font-bold [&_h2]:my-4
                       [&_table]:w-full [&_th]:text-left
                       [&_td]:py-3
                       [&_a]:text-rw-crimson [&_a]:underline"
                        dangerouslySetInnerHTML={{
                            __html: body || "<p><em>No content yet.</em></p>",
                        }}
                    />

                    {/* FOOTER */}
                    <div className="bg-[#fdf5f5] px-8 py-9 border-t border-[#e8d0d4] text-center">
                        {orderRef && (
                            <p className="text-[13px] text-rw-muted mb-4">
                                Order Reference:{" "}
                                <strong className="text-rw-ink font-semibold">
                                    #{orderRef}
                                </strong>
                            </p>
                        )}

                        <p className="text-[13px] font-bold text-rw-ink mb-1">
                            Redemption Week &lsquo;26 • RCFFUTA
                        </p>
                        <p className="text-[12.5px] text-rw-text-2 italic mb-6">
                            The Lord&lsquo;s Witnesses: The Purified Army
                        </p>

                        <div className="w-3/4 border-t border-[#e8d0d4] mx-auto mb-6" />

                        <p className="text-[11px] text-rw-muted leading-relaxed">
                            <span>
                                This is an official communication from the Redeemed
                                Christian Fellowship, FUTA Chapter.
                                <br />
                                Please do not reply to this email. For enquiries, contact
                                the committee.
                            </span>
                            <span>
                                You are receiving this email because you placed an order
                                on the{" "}
                                <a
                                    href="https://rw.rcffuta.com"
                                    className="text-rw-crimson hover:underline"
                                >
                                    Redemption Week platform
                                </a>
                                .
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
