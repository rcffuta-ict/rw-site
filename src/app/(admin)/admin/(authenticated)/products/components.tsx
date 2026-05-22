"use client";

import Link from "next/link";

export function AddProductButton() {
    return (
        <Link
            href="/admin/products/new"
            className="flex items-center gap-2 rounded-xl bg-fire-gradient px-6 py-3 text-sm font-bold text-white shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200"
        >
            <svg
                className="h-4.5 w-4.5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                viewBox="0 0 24 24"
            >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add New Product
        </Link>
    );
}

export function UpdateAvailabilityButton({ isAvailable }: { isAvailable: boolean }) {
    return (
        <button
            onClick={() => alert(`Toggle availability — stub in demo build`)}
            className={`rounded-xl border px-3 py-2 text-[11px] font-bold uppercase tracking-wider transition-all ${
                isAvailable 
                    ? "border-red-100 text-red-600 hover:bg-red-50" 
                    : "border-green-100 text-green-600 hover:bg-green-50"
            }`}
        >
            {isAvailable ? "Deactivate" : "Activate"}
        </button>
    );
}
