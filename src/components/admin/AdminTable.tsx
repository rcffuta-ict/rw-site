"use client";

import React, { useMemo, useState } from "react";

interface Column<T> {
    label: React.ReactNode;
    key: string;
    align?: "left" | "right" | "center";
    className?: string;
    render?: (item: T) => React.ReactNode;
}

interface AdminTableProps<T> {
    columns: Column<T>[];
    data: T[];
    keyExtractor: (item: T) => string | number;
    emptyMessage?: string;
    footer?: React.ReactNode;
    className?: string;
    /** When set, the table paginates client-side with this many rows per page. */
    pageSize?: number;
}

export function AdminTable<T>({
    columns,
    data,
    keyExtractor,
    emptyMessage = "No data found",
    footer,
    className = "",
    pageSize,
}: AdminTableProps<T>) {
    const [page, setPage] = useState(0);

    const totalPages = pageSize ? Math.max(1, Math.ceil(data.length / pageSize)) : 1;
    // Clamp during render so a shrinking dataset never leaves us past the end.
    const safePage = Math.min(page, totalPages - 1);

    const pageData = useMemo(() => {
        if (!pageSize) return data;
        const start = safePage * pageSize;
        return data.slice(start, start + pageSize);
    }, [data, safePage, pageSize]);

    const showPager = !!pageSize && data.length > pageSize;
    const rangeStart = data.length === 0 ? 0 : safePage * (pageSize ?? 0) + 1;
    const rangeEnd = Math.min(data.length, (safePage + 1) * (pageSize ?? data.length));

    return (
        <div className={`rw-card overflow-hidden border-none shadow-xl ring-1 ring-[var(--rw-border)] ${className}`}>
            <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                    <thead>
                        <tr className="bg-rw-bg-alt/80 backdrop-blur-sm text-rw-muted border-b border-[var(--rw-border)]">
                            {columns.map((col, idx) => (
                                <th
                                    key={idx}
                                    className={`px-6 py-5 text-[11px] font-bold uppercase tracking-wider ${
                                        col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : "text-left"
                                    } ${col.className || ""}`}
                                >
                                    {col.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--rw-border)]">
                        {data.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length} className="px-6 py-20 text-center">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="h-12 w-12 rounded-full bg-rw-bg-alt flex items-center justify-center">
                                            <svg className="h-6 w-6 text-rw-muted" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 15.803 7.5 7.5 0 0 0 15.803 15.803Z" />
                                            </svg>
                                        </div>
                                        <p className="text-rw-muted font-medium">{emptyMessage}</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            pageData.map((item) => (
                                <tr key={keyExtractor(item)} className="hover:bg-rw-bg-alt/30 transition-colors group">
                                    {columns.map((col, idx) => (
                                        <td
                                            key={idx}
                                            className={`px-6 py-5 ${
                                                col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : "text-left"
                                            } ${col.className || ""}`}
                                        >
                                            {col.render ? col.render(item) : (item[col.key as keyof T] as unknown as React.ReactNode)}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            {(footer || showPager) && (
                <div className="bg-rw-bg-alt/50 px-6 py-4 border-t border-[var(--rw-border)] flex items-center justify-between gap-4">
                    <div className="min-w-0">{footer}</div>
                    {showPager && (
                        <div className="flex items-center gap-3 shrink-0">
                            <span className="text-xs text-rw-muted tabular-nums">
                                {rangeStart}–{rangeEnd} of {data.length}
                            </span>
                            <div className="flex items-center gap-1">
                                <button
                                    type="button"
                                    onClick={() => setPage(Math.max(0, safePage - 1))}
                                    disabled={safePage === 0}
                                    className="h-7 px-2.5 rounded-md text-xs font-semibold text-rw-text-2 hover:bg-white disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
                                >
                                    ‹ Prev
                                </button>
                                <span className="text-xs text-rw-muted tabular-nums px-1">
                                    {safePage + 1}/{totalPages}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setPage(Math.min(totalPages - 1, safePage + 1))}
                                    disabled={safePage >= totalPages - 1}
                                    className="h-7 px-2.5 rounded-md text-xs font-semibold text-rw-text-2 hover:bg-white disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
                                >
                                    Next ›
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
