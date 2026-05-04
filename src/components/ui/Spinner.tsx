import React from "react";

interface SpinnerProps {
    size?: "sm" | "md" | "lg";
    className?: string;
    variant?: "crimson" | "white" | "muted";
}

export function Spinner({ size = "md", className = "", variant = "crimson" }: SpinnerProps) {
    const sizeMap = {
        sm: "h-4 w-4 border-2",
        md: "h-8 w-8 border-3",
        lg: "h-12 w-12 border-4",
    };

    const variantMap = {
        crimson: "border-rw-crimson/20 border-t-rw-crimson",
        white: "border-white/20 border-t-white",
        muted: "border-rw-muted/20 border-t-rw-muted",
    };

    return (
        <div 
            className={`inline-block animate-spin rounded-full ${sizeMap[size]} ${variantMap[variant]} ${className}`}
            role="status"
            aria-label="loading"
        >
            <span className="sr-only">Loading...</span>
        </div>
    );
}

export function FullScreenLoader() {
    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-rw-bg/80 backdrop-blur-md">
            <Spinner size="lg" />
            <p className="mt-4 font-display font-bold text-rw-crimson animate-pulse uppercase tracking-widest text-sm">
                Redemption Week &apos;26
            </p>
        </div>
    );
}
