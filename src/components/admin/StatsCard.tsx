import React from "react";
import { Card } from "../ui/Card";

interface StatsCardProps {
    label: string;
    value: string | number;
    sub?: string;
    trend?: {
        value: number;
        isUp: boolean;
    };
    icon?: React.ReactNode;
}

export function StatsCard({ label, value, sub, trend, icon }: StatsCardProps) {
    return (
        <Card className="p-5 flex flex-col gap-1 overflow-hidden relative group hover:border-rw-crimson/30 transition-colors">
            {icon && (
                <div className="absolute top-4 right-4 text-rw-muted/10 group-hover:text-rw-crimson/5 transition-colors">
                    {icon}
                </div>
            )}
            <p className="text-[10px] font-bold text-rw-muted uppercase tracking-widest">{label}</p>
            <div className="flex items-baseline gap-2 mt-1">
                <p className="font-display font-bold text-3xl text-rw-ink tracking-tight">{value}</p>
                {trend && (
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                        trend.isUp ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                    }`}>
                        {trend.isUp ? "↑" : "↓"} {trend.value}%
                    </span>
                )}
            </div>
            {sub && <p className="text-xs text-rw-muted font-medium mt-0.5">{sub}</p>}
        </Card>
    );
}
