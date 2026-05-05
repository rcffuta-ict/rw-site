import React, { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    description?: string;
    containerClassName?: string;
    icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, description, containerClassName = "", className = "", icon, ...props }, ref) => {
        return (
            <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
                {label && (
                    <label 
                        htmlFor={props.id} 
                        className="text-xs font-semibold text-rw-text-2 uppercase tracking-wider"
                    >
                        {label}
                    </label>
                )}
                <div className="relative">
                    {icon && (
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-rw-muted pointer-events-none">
                            {icon}
                        </div>
                    )}
                    <input
                        ref={ref}
                        className={`w-full rounded-xl border py-2.5 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-rw-crimson/10 
                            ${icon ? "pl-11 pr-4" : "px-4"}
                            ${error 
                                ? "border-rw-crimson bg-rw-crimson/5 text-rw-crimson placeholder:text-rw-crimson/40 focus:border-rw-crimson" 
                                : "border-[var(--rw-border-mid)] bg-rw-bg-alt text-rw-ink placeholder:text-rw-muted focus:border-rw-crimson"
                            } 
                            ${className}`}
                        {...props}
                    />
                </div>
                {description && !error && (
                    <p className="text-[10px] text-rw-muted italic">{description}</p>
                )}
                {error && (
                    <p className="text-[10px] font-bold text-rw-crimson uppercase tracking-tight">{error}</p>
                )}
            </div>
        );
    }
);

Input.displayName = "Input";
