export default function AdminLoading() {
    return (
        <div className="flex flex-col gap-8 animate-pulse w-full">
            {/* Header Skeleton */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-[var(--rw-border)] pb-8">
                <div className="flex flex-col gap-3">
                    <div className="h-10 w-48 bg-rw-bg-alt rounded-xl" />
                    <div className="h-4 w-64 bg-rw-bg-alt/60 rounded-md" />
                </div>
                <div className="h-12 w-32 bg-rw-bg-alt rounded-xl" />
            </div>

            {/* Stats Skeleton */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-32 bg-white border border-[var(--rw-border)] rounded-[24px] shadow-sm" />
                ))}
            </div>

            {/* Content / Table Skeleton */}
            <div className="bg-white border border-[var(--rw-border)] rounded-[24px] h-[500px] shadow-sm flex flex-col p-6 gap-6">
                <div className="flex justify-between items-center mb-2">
                    <div className="h-6 w-32 bg-rw-bg-alt rounded-md" />
                    <div className="h-10 w-64 bg-rw-bg-alt rounded-xl" />
                </div>
                <div className="flex flex-col gap-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="h-14 w-full bg-rw-bg-alt/40 rounded-xl" />
                    ))}
                </div>
            </div>
        </div>
    );
}
