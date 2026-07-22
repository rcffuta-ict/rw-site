import Link from "next/link";
import type { OrderPhase } from "@/lib/data/types";

interface Props {
    phase: OrderPhase;
}

/**
 * Site-wide notice shown to customers once ordering enters the post-order phase.
 * Announces that pre-orders have closed, prices have been updated, and asks
 * customers to re-read the Terms & Conditions before ordering. Renders nothing
 * during the pre-order phase.
 */
export function PostOrderBanner({ phase }: Props) {
    if (phase !== "postorder") return null;

    return (
        <div className="bg-rw-crimson text-white" role="status">
            <div className="mx-auto flex max-w-6xl flex-col items-start gap-1.5 px-4 py-2.5 text-sm sm:flex-row sm:items-center sm:justify-center sm:gap-3 sm:text-center">
                <span className="font-semibold">
                    Post-order is now open — pre-order pricing has closed and new prices
                    apply.
                </span>
                <Link
                    href="/terms"
                    className="font-bold underline underline-offset-2 hover:text-white/80"
                >
                    Please re-read the updated Terms &amp; Conditions →
                </Link>
            </div>
        </div>
    );
}
