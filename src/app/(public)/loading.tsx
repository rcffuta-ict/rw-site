export default function PublicLoading() {
    return (
        <div className="section-container py-8 lg:py-12 flex flex-col gap-10 animate-pulse w-full min-h-[75vh]">
            {/* Header Skeleton */}
            <div className="flex flex-col gap-4 max-w-2xl border-b border-[var(--rw-border)] pb-8">
                <div className="h-5 w-32 bg-rw-crimson/10 rounded-md" />
                <div className="h-12 sm:h-16 w-3/4 max-w-md bg-rw-bg-alt border border-[var(--rw-border)] rounded-2xl" />
                <div className="h-5 w-5/6 max-w-lg bg-rw-bg-alt/50 rounded-md mt-2" />
            </div>

            {/* Content Grid Skeleton */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <div key={i} className="flex flex-col gap-4">
                        <div className="w-full aspect-[4/5] bg-white border border-[var(--rw-border)] rounded-[2rem] shadow-sm" />
                        <div className="flex flex-col gap-2 px-2">
                            <div className="h-6 w-3/4 bg-rw-bg-alt rounded-lg" />
                            <div className="h-5 w-1/3 bg-rw-bg-alt/60 rounded-md" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
