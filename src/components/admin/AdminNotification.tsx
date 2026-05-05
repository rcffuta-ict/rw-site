"use client";

import React from "react";

type NotificationType = "demo" | "alert" | "info" | "success";

interface AdminNotificationProps {
    type?: NotificationType;
    message?: string;
    actionLabel?: string;
    onAction?: () => void;
}

export function AdminNotification({ 
    type = "demo", 
    message,
    actionLabel,
    onAction
}: AdminNotificationProps) {
    const config = {
        demo: {
            bg: "bg-rw-ink",
            text: "text-white/90",
            iconColor: "text-rw-orange",
            label: "Demo Environment",
            defaultMessage: "No real transactions or data processing."
        },
        alert: {
            bg: "bg-rw-crimson",
            text: "text-white",
            iconColor: "text-white",
            label: "Action Required",
            defaultMessage: "System requires your attention."
        },
        info: {
            bg: "bg-blue-600",
            text: "text-white",
            iconColor: "text-white",
            label: "Information",
            defaultMessage: "Maintenance scheduled for tonight."
        },
        success: {
            bg: "bg-green-600",
            text: "text-white",
            iconColor: "text-white",
            label: "Success",
            defaultMessage: "System is running optimally."
        }
    };

    const current = config[type];

    return (
        <div className={`h-10 w-full ${current.bg} ${current.text} px-4 flex items-center justify-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] z-50 border-b border-white/10 shadow-lg relative`}>
            <svg className={`h-3 w-3 ${current.iconColor} animate-pulse`} fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L1 21h22L12 2zm0 3.45l8.27 14.3H3.73L12 5.45zM11 16h2v2h-2v-2zm0-7h2v5h-2V9z" />
            </svg>
            <span className="opacity-90">
                <span className={current.iconColor}>{current.label}:</span> {message || current.defaultMessage}
            </span>
            {actionLabel && onAction && (
                <button 
                    onClick={onAction}
                    className="ml-4 px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 transition-colors text-[9px] border border-white/20"
                >
                    {actionLabel}
                </button>
            )}
        </div>
    );
}
