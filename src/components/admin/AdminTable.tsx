import React from "react";

interface Column<T> {
    label: string;
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
}

export function AdminTable<T>({
    columns,
    data,
    keyExtractor,
    emptyMessage = "No data found",
    footer,
    className = "",
}: AdminTableProps<T>) {
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
                            data.map((item) => (
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
            {footer && (
                <div className="bg-rw-bg-alt/50 px-6 py-4 border-t border-[var(--rw-border)]">
                    {footer}
                </div>
            )}
        </div>
    );
}
