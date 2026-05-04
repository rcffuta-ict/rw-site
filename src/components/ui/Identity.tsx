import { ph } from "@/lib/utils";
import Link from "next/link";

export function Identity({ dark }: { dark?: boolean }) {
    const rcfLogo = "/images/logos/rcf-futa.jpeg";
    const anniversaryLogo = ph(120, 120, "38th", "c41230", "ffffff");

    if (!dark) {
        return (
            <Link
                href="/"
                id="site-logo"
                className="flex items-center gap-3 sm:gap-4 shrink-0 group"
            >
                <div className="flex items-center gap-1.5">
                    <img
                        src={rcfLogo}
                        alt="RCF FUTA Logo"
                        className="h-10 w-10 rounded-lg object-cover shadow-sm border border-[var(--rw-border)] group-hover:scale-105 transition-transform"
                    />
                    <img
                        src={anniversaryLogo}
                        alt="38th Anniversary Logo"
                        className="h-10 w-10 rounded-lg object-cover shadow-sm border border-rw-crimson/20 group-hover:scale-105 transition-transform delay-75"
                    />
                </div>
                <div className="hidden sm:block leading-tight">
                    <p className="font-display font-bold text-rw-ink text-[15px] group-hover:text-rw-crimson transition-colors">
                        Redemption Week <span className="text-rw-crimson">&apos;26</span>
                    </p>
                    <p className="text-[10px] text-rw-muted font-medium tracking-wide">
                        38th Anniversary · RCF FUTA
                    </p>
                </div>
            </Link>
        );
    }

    return (
        <div className="flex items-center gap-5">
            <div className="flex items-center gap-2 sm:gap-3">
                <div className="h-14 w-14 rounded-2xl bg-white/5 border border-white/10 p-1 flex items-center justify-center shrink-0">
                    <img
                        src={rcfLogo}
                        alt="RCF FUTA Logo"
                        className="h-full w-full rounded-xl object-cover"
                    />
                </div>
                <div className="h-14 w-14 rounded-2xl bg-rw-crimson/20 border border-rw-crimson/30 p-1 flex items-center justify-center shrink-0">
                    <img
                        src={anniversaryLogo}
                        alt="38th Anniversary"
                        className="h-full w-full rounded-xl object-cover"
                    />
                </div>
            </div>
            <div>
                <p className="font-display font-bold text-xl text-white leading-tight">
                    Redemption Week <span className="text-rw-crimson">&apos;26</span>
                </p>
                <p className="text-xs text-white/40 font-medium tracking-wide mt-1.5">
                    38th Anniversary · RCF FUTA · rw.rcffuta.com
                </p>
            </div>
        </div>
    );
}
