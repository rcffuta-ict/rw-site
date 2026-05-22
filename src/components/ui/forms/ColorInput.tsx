import React, { forwardRef } from "react";
import { Input, InputProps } from "./Input";

export interface ColorInputProps extends Omit<InputProps, "value" | "onChange"> {
    value: string;
    onChange: (val: string) => void;
}

export const ColorInput = forwardRef<HTMLInputElement, ColorInputProps>(
    ({ value, onChange, className = "", disabled, ...props }, ref) => {
        const colorPickerNode = (
            <input
                type="color"
                value={value || "#000000"}
                disabled={disabled}
                onChange={(e) => onChange(e.target.value)}
                className={`h-5 w-5 shrink-0 rounded-md border p-0 shadow-sm transition-transform border-[var(--rw-border)] bg-white
                    ${disabled ? "cursor-not-allowed opacity-40" : "cursor-pointer hover:scale-105"}`}
            />
        );

        return (
            <Input
                ref={ref}
                type="text"
                value={value}
                disabled={disabled}
                onChange={(e) => onChange(e.target.value)}
                icon={colorPickerNode}
                placeholder="#000000"
                className={`pl-12 tracking-wider uppercase font-mono ${className}`}
                {...props}
            />
        );
    }
);

ColorInput.displayName = "ColorInput";
