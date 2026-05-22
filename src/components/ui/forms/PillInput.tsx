"use client";

import React, { useState } from "react";

interface PillInputProps {
    label?: React.ReactNode;
    required?: boolean;
    description?: React.ReactNode;
    value: string[];
    onChange: (value: string[]) => void;
    placeholder?: string;
    containerClassName?: string;
    className?: string;
    error?: string;
    disabled?: boolean;
    upperCase?: boolean;
}

export function PillInput({
    label,
    required,
    description,
    value,
    onChange,
    placeholder = "",
    containerClassName = "",
    className = "",
    error,
    disabled,
    upperCase = false,
}: PillInputProps) {
    const [inputValue, setInputValue] = useState("");

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (disabled) return;
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            const val = inputValue.trim().replace(/,/g, "");
            if (val && !value.includes(val)) {
                onChange([...value, val]);
            }
            setInputValue("");
        } else if (e.key === "Backspace" && inputValue === "" && value.length > 0) {
            onChange(value.slice(0, -1));
        }
    }

    function removePill(pillToRemove: string) {
        if (disabled) return;
        onChange(value.filter((p) => p !== pillToRemove));
    }

    return (
        <div
            className={`flex flex-col gap-2 w-full ${containerClassName} ${disabled ? "opacity-60" : ""}`}
        >
            {label && (
                <div className="flex items-center gap-2 h-4">
                    <label
                        className={`text-[11px] font-bold uppercase tracking-widest leading-none ${disabled ? "text-rw-muted/70" : "text-rw-muted"}`}
                    >
                        {label} {required && <span className="text-rw-crimson">*</span>}
                    </label>
                </div>
            )}

            <div
                className={`flex flex-wrap gap-2 items-center min-h-[46px] px-3 py-1.5 rounded-xl border transition-all shadow-sm
                ${disabled ? "bg-gray-100/50 border-gray-200 cursor-not-allowed select-none shadow-none" : ""}
                ${
                    !disabled && error
                        ? "border-rw-crimson bg-rw-crimson/5 focus-within:ring-4 focus-within:ring-rw-crimson/12 focus-within:border-rw-crimson"
                        : !disabled
                          ? "border-[var(--rw-border)] bg-rw-bg-alt/20 hover:bg-white focus-within:bg-white focus-within:ring-4 focus-within:ring-rw-crimson/12 focus-within:border-rw-crimson"
                          : ""
                } ${className}`}
            >
                {value.map((pill) => (
                    <span
                        key={pill}
                        className={`flex items-center gap-1.5 rounded-lg text-[11px] font-bold tracking-wide px-2.5 h-7 shadow-sm transition-all shrink-0
                        ${disabled ? "bg-gray-300 text-gray-600" : "bg-rw-ink text-white"}`}
                        onClick={() => {
                            if (!disabled) {
                                removePill(pill);
                            }
                        }}
                    >
                        {upperCase ? pill.toUpperCase() : pill}
                        {/* {!disabled && (
                            <button
                                type="button"
                                onClick={() => removePill(pill)}
                                className="text-white/60 hover:text-white hidden hover:block! rounded-full transition-colors focus:outline-none"
                            >
                                <svg
                                    className="h-3 w-3"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={3}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        )} */}
                    </span>
                ))}

                <input
                    value={inputValue}
                    disabled={disabled}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={value.length === 0 ? placeholder : ""}
                    className={`flex-1 min-w-[140px] bg-transparent border-none text-sm font-medium h-7 px-1 outline-none !outline-none  placeholder:text-rw-muted/50
                        ${disabled ? "cursor-not-allowed" : ""} ${upperCase ? "uppercase" : ""}`}
                />
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
