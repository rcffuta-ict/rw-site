import React, { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    description?: string;
    containerClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, description, containerClassName = "", className = "", ...props }, ref) => {
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
                <input
                    ref={ref}
                    className={`w-full rounded-xl border px-4 py-2.5 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-rw-crimson/10 
                        ${error 
                            ? "border-rw-crimson bg-rw-crimson/5 text-rw-crimson placeholder:text-rw-crimson/40 focus:border-rw-crimson" 
                            : "border-[var(--rw-border-mid)] bg-rw-bg-alt text-rw-ink placeholder:text-rw-muted focus:border-rw-crimson"
                        } 
                        ${className}`}
                    {...props}
                />
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

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    description?: string;
    containerClassName?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ label, error, description, containerClassName = "", className = "", ...props }, ref) => {
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
                <textarea
                    ref={ref}
                    className={`w-full rounded-xl border px-4 py-2.5 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-rw-crimson/10 min-h-[100px] resize-none
                        ${error 
                            ? "border-rw-crimson bg-rw-crimson/5 text-rw-crimson placeholder:text-rw-crimson/40 focus:border-rw-crimson" 
                            : "border-[var(--rw-border-mid)] bg-rw-bg-alt text-rw-ink placeholder:text-rw-muted focus:border-rw-crimson"
                        } 
                        ${className}`}
                    {...props}
                />
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

Textarea.displayName = "Textarea";
