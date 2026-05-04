"use client";

export function VerdictDownloadButton() {
    const handleClick = () => {
        alert("PDF download — stub in demo build");
    };
    return (
        <button
            onClick={handleClick}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-[var(--rw-border-mid)] px-4 py-2 text-sm font-semibold text-rw-text-2 hover:bg-rw-bg-alt transition-colors"
        >
            <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
            </svg>
            Download PDF
        </button>
    );
}
