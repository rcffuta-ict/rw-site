"use client";

import React, { useEffect, useState } from "react";

interface AdminModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    description?: string;
    children: React.ReactNode;
    showClose?: boolean;
    maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "full";
    fullScreen?: boolean;
    noPadding?: boolean;
}

export function AdminModal({ 
    isOpen, 
    onClose, 
    title, 
    description,
    children, 
    showClose = true,
    maxWidth = "md",
    fullScreen = false,
    noPadding = false
}: AdminModalProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!mounted || !isOpen) return null;

    const maxWidthClasses = {
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-lg",
        xl: "max-w-xl",
        "2xl": "max-w-2xl",
        "3xl": "max-w-3xl",
        "4xl": "max-w-4xl",
        "5xl": "max-w-5xl",
        full: "max-w-[95vw]",
    };

    return (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center animate-fade-in ${fullScreen ? "p-0" : "p-4 sm:p-6"}`}>
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-rw-ink/60 backdrop-blur-md transition-opacity" 
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className={`relative bg-white shadow-2xl overflow-hidden ring-1 ring-black/5 animate-scale-in flex flex-col ${
                fullScreen 
                    ? "w-full h-full rounded-none" 
                    : `w-full ${maxWidthClasses[maxWidth]} rounded-[32px]`
            }`}>
                {/* Header */}
                <div className={`flex items-center justify-between ${noPadding ? "p-8" : "px-8 pt-8 pb-4"} shrink-0`}>
                    <div>
                        {title && (
                            <h3 className="font-display font-extrabold text-2xl text-rw-ink uppercase tracking-tight">
                                {title}
                            </h3>
                        )}
                        {description && (
                            <p className="text-sm text-rw-muted font-medium mt-1">{description}</p>
                        )}
                    </div>
                    {showClose && (
                        <button 
                            onClick={onClose}
                            className="h-12 w-12 flex items-center justify-center rounded-2xl bg-rw-bg-alt text-rw-muted hover:text-rw-crimson hover:bg-rw-crimson/5 transition-all"
                        >
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
                        </button>
                    )}
                </div>

                <div className={`flex-1 overflow-y-auto scrollbar-hide ${noPadding ? "" : "px-8 pb-8"}`}>
                    {children}
                </div>
            </div>
        </div>
    );
}
