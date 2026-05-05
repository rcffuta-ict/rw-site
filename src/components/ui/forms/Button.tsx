import React from "react";

type Variant = "primary" | "outlined" | "ghost" | "danger" | "fire";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: Variant;
    size?: Size;
    loading?: boolean;
}

const base = "inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rw-crimson";

const variants: Record<Variant, string> = {
    primary:  "bg-rw-crimson text-white hover:bg-rw-crimson-dk active:scale-[.98] shadow-sm",
    outlined: "border border-[var(--rw-border-mid)] text-rw-ink hover:border-rw-crimson/50 hover:bg-rw-bg-alt active:scale-[.98]",
    ghost:    "text-rw-text-2 hover:text-rw-ink hover:bg-rw-bg-alt",
    danger:   "bg-red-600 text-white hover:bg-red-700 active:scale-[.98] shadow-sm",
    fire:     "bg-fire-gradient text-white shadow-sm hover:opacity-90 active:scale-[.98]",
};

const sizes: Record<Size, string> = {
    sm: "h-8  px-3 text-xs",
    md: "h-10 px-4 text-sm",
    lg: "h-11 px-6 text-sm",
};

export function Button({ variant = "primary", size = "md", loading = false, className = "", children, disabled, ...props }: ButtonProps) {
    return (
        <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} disabled={disabled || loading} {...props}>
            {loading && <span className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />}
            {children}
        </button>
    );
}
