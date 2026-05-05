import Link from "next/link";
import React from "react";

export interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface AdminBreadcrumbProps {
    items: BreadcrumbItem[];
    className?: string;
}

export function AdminBreadcrumb({ items, className = "" }: AdminBreadcrumbProps) {
    return (
        <nav className={`flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-rw-muted ${className}`}>
            {items.map((item, index) => {
                const isLast = index === items.length - 1;

                return (
                    <React.Fragment key={index}>
                        {item.href && !isLast ? (
                            <Link
                                href={item.href}
                                className="hover:text-rw-crimson transition-colors border-b border-transparent hover:border-rw-crimson"
                            >
                                {item.label}
                            </Link>
                        ) : (
                            <span className={isLast ? "text-rw-ink font-bold" : ""}>
                                {item.label}
                            </span>
                        )}

                        {!isLast && (
                            <svg
                                className="h-3 w-3 opacity-30"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2.5}
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="m8.25 4.5 7.5 7.5-7.5 7.5"
                                />
                            </svg>
                        )}
                    </React.Fragment>
                );
            })}
        </nav>
    );
}
