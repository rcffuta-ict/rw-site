"use client";

export function AddProductButton() {
    return (
        <button
            onClick={() => alert("Add Product — stub in demo build")}
            className="flex items-center gap-2 rounded-xl bg-fire-gradient px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:opacity-90 transition-opacity"
        >
            <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
            >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Product
        </button>
    );
}

export function UpdateAvailabilityButton({ isAvailable }: { isAvailable: boolean }) {
    return (
        <button
            onClick={() => alert(`Toggle availability — stub in demo build`)}
            className="rounded-xl border border-[var(--rw-border-mid)] px-3 py-2 text-sm font-semibold text-rw-muted hover:bg-rw-bg-alt transition-colors"
        >
            {isAvailable ? "Deactivate" : "Activate"}
        </button>
    );
}
