"use client";

import React, { useEffect, useState } from "react";

interface AdminModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    showClose?: boolean;
}

export function AdminModal({ 
    isOpen, 
    onClose, 
    title, 
    children, 
    showClose = true 
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

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-fade-in">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-rw-ink/60 backdrop-blur-md transition-opacity" 
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-md bg-white rounded-[32px] shadow-2xl overflow-hidden ring-1 ring-black/5 animate-scale-in">
                {/* Header */}
                <div className="flex items-center justify-between px-8 pt-8 pb-4">
                    {title && (
                        <h3 className="font-display font-extrabold text-xl text-rw-ink uppercase tracking-tight">
                            {title}
                        </h3>
                    )}
                    {showClose && (
                        <button 
                            onClick={onClose}
                            className="h-10 w-10 flex items-center justify-center rounded-xl bg-rw-bg-alt text-rw-muted hover:text-rw-crimson hover:bg-rw-crimson/5 transition-all"
                        >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
                        </button>
                    )}
                </div>

                <div className="px-8 pb-8">
                    {children}
                </div>
            </div>
        </div>
    );
}
