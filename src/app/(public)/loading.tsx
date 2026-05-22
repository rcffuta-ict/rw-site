import { LOGOS } from "@/lib/config";

export default function PublicLoading() {
    return (
        <div className="flex items-center justify-center min-h-[75vh] w-full">
            <div className="relative flex flex-col items-center gap-6 animate-pulse-soft">
                <img
                    src={LOGOS.redemptionWeek}
                    alt="Redemption Week"
                    className="h-24 w-auto object-contain animate-bounce-subtle"
                />
                <div className="h-1 w-24 bg-rw-border rounded-full overflow-hidden">
                    <div className="h-full bg-rw-crimson animate-marquee w-1/2 rounded-full" />
                </div>
            </div>
        </div>
    );
}
