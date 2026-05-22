export default function AdminLoading() {
    return (
        <div className="flex flex-col gap-8 animate-pulse w-full">
            {/* Generic Header Skeleton */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-[var(--rw-border)] pb-8">
                <div className="flex flex-col gap-3">
                    <div className="h-10 w-48 sm:w-64 bg-rw-bg-alt rounded-xl" />
                    <div className="h-4 w-32 sm:w-48 bg-rw-bg-alt/60 rounded-md" />
                </div>
                <div className="flex gap-3">
                    <div className="h-10 w-24 bg-rw-bg-alt rounded-xl hidden sm:block" />
                    <div className="h-10 w-32 bg-rw-bg-alt rounded-xl" />
                </div>
            </div>

            {/* Generic Content Skeleton */}
            <div className="flex flex-col gap-4">
                {/* Optional Toolbar/Filter skeleton */}
                <div className="flex items-center gap-4 mb-4">
                    <div className="h-12 w-full sm:max-w-md bg-white border border-[var(--rw-border)] rounded-xl" />
                    <div className="h-12 w-24 bg-white border border-[var(--rw-border)] rounded-xl hidden sm:block" />
                </div>

                {/* Main Generic Content Area */}
                <div className="bg-white border border-[var(--rw-border)] rounded-[24px] shadow-sm flex flex-col p-6 min-h-[500px] relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-rw-bg-alt/5 pointer-events-none" />
                    
                    {/* Simulated generic rows/items */}
                    <div className="flex flex-col gap-6 relative z-10 w-full">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="flex gap-4 items-center border-b border-[var(--rw-border)]/50 pb-6 last:border-0 last:pb-0">
                                <div className="h-14 w-14 bg-rw-bg-alt rounded-2xl shrink-0" />
                                <div className="flex flex-col gap-2.5 flex-1">
                                    <div className="h-4 w-1/3 min-w-[150px] bg-rw-bg-alt rounded-md" />
                                    <div className="h-3 w-1/4 min-w-[100px] bg-rw-bg-alt/60 rounded-md" />
                                </div>
                                <div className="h-8 w-24 bg-rw-bg-alt rounded-lg hidden sm:block shrink-0" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
