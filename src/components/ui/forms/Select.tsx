import React, { forwardRef } from "react";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: React.ReactNode;
    error?: string;
    description?: React.ReactNode;
    containerClassName?: string;
    required?: boolean;
    infoTooltip?: React.ReactNode;
    options: { label: string; value: string | number }[];
    placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
    (
        {
            label,
            error,
            description,
            containerClassName = "",
            className = "",
            required,
            infoTooltip,
            options,
            placeholder = "Select an option",
            disabled,
            ...props
        },
        ref
    ) => {
        return (
            <div
                className={`flex flex-col gap-2 w-full ${containerClassName} ${disabled ? "opacity-60" : ""}`}
            >
                {label && (
                    <div className="flex items-center gap-2 h-4">
                        <label
                            className={`text-[11px] font-bold uppercase tracking-widest leading-none ${disabled ? "text-rw-muted/70" : "text-rw-muted"}`}
                        >
                            {label}{" "}
                            {required && <span className="text-rw-crimson">*</span>}
                        </label>
                        {infoTooltip && (
                            <div className="group relative flex items-center justify-center h-3.5 w-3.5 rounded-full bg-gray-100 text-gray-500 cursor-help transition-colors hover:bg-gray-200">
                                <svg
                                    className="h-2.5 w-2.5"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={2.5}
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-48 p-2.5 bg-gray-900 text-white text-[11px] leading-normal rounded-lg shadow-xl z-20 font-normal normal-case pointer-events-none text-center">
                                    {infoTooltip}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                <div className="relative flex items-center w-full h-[46px]">
                    <select
                        ref={ref}
                        disabled={disabled}
                        // defaultValue={placeholder}
                        className={`w-full h-full rounded-xl border pl-4 pr-11 text-sm font-medium transition-all focus:outline-none shadow-sm appearance-none cursor-pointer
                            ${disabled ? "bg-gray-100/50 border-gray-200 text-rw-muted/70 cursor-not-allowed select-none shadow-none" : ""}
                            ${
                                !disabled && error
                                    ? "border-rw-crimson bg-rw-crimson/5 text-rw-crimson focus:border-rw-crimson focus:ring-4 focus:ring-rw-crimson/12"
                                    : !disabled
                                      ? "border-[var(--rw-border)] bg-rw-bg-alt/20 text-rw-ink hover:bg-white focus:bg-white focus:border-rw-crimson focus:ring-4 focus:ring-rw-crimson/12"
                                      : ""
                            }
                            ${className}`}
                        {...props}
                    >
                        {placeholder && (
                            <option value="" disabled hidden>
                                {placeholder}
                            </option>
                        )}
                        {options.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                    <div
                        className={`absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none z-10 ${disabled ? "text-rw-muted/40" : "text-rw-muted"}`}
                    >
                        <svg
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2.5}
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M19 9l-7 7-7-7"
                            />
                        </svg>
                    </div>
                </div>

                {description && !error && (
                    <p className="text-[11px] text-rw-muted leading-snug pl-0.5">
                        {description}
                    </p>
                )}
                {error && (
                    <p className="text-[11px] font-bold text-rw-crimson uppercase tracking-wide leading-none pl-0.5">
                        {error}
                    </p>
                )}
            </div>
        );
    }
);

Select.displayName = "Select";
