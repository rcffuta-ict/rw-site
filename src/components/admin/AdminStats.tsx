import React from "react";
import { StatsCard } from "@/components/ui/cards/StatsCard";

export interface AdminStatItem {
    label: string;
    value: string | number;
    sub?: string;
    icon?: React.ReactNode;
    trend?: {
        value: number;
        isUp: boolean;
    };
}

interface AdminStatsProps {
    stats: AdminStatItem[];
}

/**
 * Reusable Admin Stats component that provides a horizontal scrollable row of stats cards.
 * It ensures that the cards do not wrap on smaller screens, instead they overflow and scroll.
 */
export function AdminStats({ stats }: AdminStatsProps) {
    return (
        <div className="relative w-full">
            <div className="flex flex-nowrap gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-5 px-5 md:mx-0 md:px-0 md:pb-2">
                {stats.map((stat, idx) => (
                    <div 
                        key={idx} 
                        className="min-w-[280px] sm:min-w-[320px] lg:min-w-[0] lg:flex-1 shrink-0"
                    >
                        <StatsCard {...stat} />
                    </div>
                ))}
            </div>
            
            {/* Fade indicators for scrollable content on mobile */}
            <div className="absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-[var(--rw-bg)] to-transparent pointer-events-none md:hidden" />
            <div className="absolute left-0 top-0 bottom-4 w-12 bg-gradient-to-r from-[var(--rw-bg)] to-transparent pointer-events-none md:hidden" />
        </div>
    );
}
