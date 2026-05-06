export function AdminHeader({ onOpenMobileMenu }: { onOpenMobileMenu: () => void }) {
    return (
        <header className="md:hidden h-14 shrink-0 bg-white border-b border-[var(--rw-border)] px-4 flex items-center justify-between z-30">
            <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-rw-crimson">
                    <svg
                        className="h-4 w-4 text-white"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                    >
                        <path d="M12 2C9 7 6 9 6 13a6 6 0 0 0 12 0c0-4-3-6-6-11z" />
                    </svg>
                </span>
                <span className="text-sm font-bold text-rw-ink">RW&apos;26 Admin</span>
            </div>
            <button
                onClick={onOpenMobileMenu}
                className="h-10 w-10 flex items-center justify-center rounded-xl hover:bg-rw-bg-alt transition-colors"
            >
                <svg
                    className="h-6 w-6 text-rw-ink"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                    />
                </svg>
            </button>
        </header>
    );
}
