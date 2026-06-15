import Link from "next/link";
import { PAYMENT_CONFIG, TENURE } from "@/lib/config";
import { Button } from "@/components/ui/forms/Button";

function WhatsAppIcon({ className = "w-5 h-5" }: { className?: string }) {
    return (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
    );
}

/**
 * Shown across the storefront whenever the admin has switched pre-orders off.
 * Directs visitors to the WhatsApp support contacts configured in
 * PAYMENT_CONFIG so they can still reach the team.
 */
export function PreordersClosed({
    title = "Pre-orders are closed",
    message,
}: {
    title?: string;
    message?: string;
}) {
    const body =
        message ??
        `Merch pre-ordering for ${TENURE.brandLabel} is currently paused. ` +
            `No new orders or payments can be placed right now. ` +
            `If you have a question, reach out to our team below.`;

    return (
        <div className="section-container py-20 lg:py-28">
            <div className="rw-card max-w-2xl mx-auto p-8 sm:p-12 text-center flex flex-col items-center gap-6">
                <div className="h-20 w-20 rounded-[2rem] bg-rw-crimson/10 border border-rw-crimson/20 flex items-center justify-center">
                    <svg
                        className="h-10 w-10 text-rw-crimson"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.8}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                        />
                    </svg>
                </div>

                <div>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-rw-crimson mb-3">
                        Temporarily Closed
                    </p>
                    <h2 className="font-display font-black text-3xl sm:text-4xl text-rw-ink tracking-tight mb-4">
                        {title}
                    </h2>
                    <p className="text-rw-text-2 leading-relaxed max-w-md mx-auto">
                        {body}
                    </p>
                </div>

                {/* Support contacts from PAYMENT_CONFIG */}
                <div className="w-full flex flex-col sm:flex-row items-stretch justify-center gap-3 mt-2">
                    {PAYMENT_CONFIG.supportContacts.map((contact) => (
                        <a
                            key={contact.phone}
                            href={`https://wa.me/${contact.phone}?text=${encodeURIComponent(
                                `Hi, I'd like to ask about ${TENURE.brandLabel} merch pre-orders.`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex-1 flex items-center gap-3 rounded-2xl bg-[#1C0003] text-white px-5 py-4 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
                        >
                            <span className="shrink-0 h-10 w-10 rounded-xl bg-[#25D366]/20 text-[#25D366] flex items-center justify-center">
                                <WhatsAppIcon />
                            </span>
                            <span className="min-w-0 text-left">
                                <span className="block text-[11px] font-semibold uppercase tracking-wider text-white/50">
                                    WhatsApp
                                </span>
                                <span className="block font-bold leading-tight text-rw-bg-alt truncate">
                                    {contact.name}
                                </span>
                            </span>
                        </a>
                    ))}
                </div>

                <Link href="/" className="mt-2">
                    <Button variant="outlined" size="sm">
                        Back to Home
                    </Button>
                </Link>
            </div>
        </div>
    );
}
