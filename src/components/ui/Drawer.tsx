"use client";

import React, { useEffect } from "react";

interface DrawerProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    side?: "right" | "bottom";
}

export function Drawer({ isOpen, onClose, title, children, side = "right" }: DrawerProps) {
    // Prevent scrolling when drawer is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    const isRight = side === "right";

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-[60] transition-opacity duration-300 ${
                    isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                }`}
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Drawer Panel */}
            <div
                className={`fixed z-[70] bg-rw-surface shadow-2xl transition-transform duration-300 ease-out flex flex-col
                    ${isRight 
                        ? "top-0 right-0 h-full w-full max-w-md border-l border-[var(--rw-border-mid)]" 
                        : "bottom-0 left-0 right-0 w-full h-auto max-h-[90vh] rounded-t-3xl border-t border-[var(--rw-border-mid)]"
                    }
                    ${isOpen ? "translate-x-0 translate-y-0" : isRight ? "translate-x-full" : "translate-y-full"}
                `}
            >
                {/* Drag Handle for Bottom Drawer */}
                {!isRight && (
                    <div className="flex justify-center pt-3 pb-1">
                        <div className="h-1.5 w-12 rounded-full bg-rw-muted/20" />
                    </div>
                )}

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--rw-border)]">
                    {title && <h2 className="font-display font-bold text-xl text-rw-ink uppercase tracking-tight">{title}</h2>}
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full text-rw-muted hover:text-rw-ink hover:bg-rw-bg-alt transition-colors ml-auto"
                        aria-label="Close drawer"
                    >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar">
                    {children}
                </div>
            </div>
        </>
    );
}
