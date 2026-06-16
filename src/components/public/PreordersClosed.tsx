import Link from "next/link";
import { OrderSupportContact } from "../common/SupportContact";
import { TENURE } from "@/lib/config";

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
        <div className="section-container py-20 lg:py-28 my-20">
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
                <OrderSupportContact />

                <Link
                    href="/"
                    className="btn-primary !h-14 px-8 w-full sm:w-auto text-[11px] font-bold uppercase tracking-widest shadow-xl shadow-rw-crimson/20 hover:shadow-rw-crimson/30 hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
                >
                    <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-1.125 1.125-1.125V9.75M8.25 21h8.25"
                        />
                    </svg>
                    Return Home
                </Link>
            </div>
        </div>
    );
}
