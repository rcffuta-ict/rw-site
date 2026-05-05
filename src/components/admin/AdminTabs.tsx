import React from "react";

export interface TabItem {
    key: string;
    label: string;
    icon?: React.ReactNode;
}

interface AdminTabsProps {
    tabs: TabItem[];
    activeTab: string;
    onChange: (key: string) => void;
    className?: string;
}

/**
 * Reusable Admin Tabs component for page-level navigation.
 * Designed with a premium, modern aesthetic.
 */
export function AdminTabs({ tabs, activeTab, onChange, className = "" }: AdminTabsProps) {
    return (
        <div className={`flex items-center gap-1 p-1 bg-rw-bg-alt border border-[var(--rw-border)] rounded-[20px] self-start overflow-x-auto scrollbar-hide max-w-full ${className}`}>
            {tabs.map((t) => (
                <button
                    key={t.key}
                    onClick={() => onChange(t.key)}
                    className={`flex items-center gap-2.5 px-6 py-3 rounded-[16px] text-[11px] font-bold uppercase tracking-wider transition-all duration-300 whitespace-nowrap ${
                        activeTab === t.key
                            ? "bg-white text-rw-crimson shadow-sm scale-[1.02] border border-[var(--rw-border)]"
                            : "text-rw-muted hover:text-rw-ink hover:bg-white/50"
                    }`}
                >
                    {t.icon}
                    {t.label}
                </button>
            ))}
        </div>
    );
}
