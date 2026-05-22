import React, { forwardRef } from "react";
import { Input, InputProps } from "./Input";

export interface PriceInputProps extends Omit<InputProps, "type" | "onChange" | "value"> {
    value: number | "";
    onChange: (val: number | "") => void;
    currencySymbol?: string;
    currencyName?: string; // e.g., "Naira"
}

// Simple internal helper to convert numbers to words (Naira format)
function numberToWords(num: number): string {
    if (num === 0) return "Zero";

    const ones = [
        "",
        "One",
        "Two",
        "Three",
        "Four",
        "Five",
        "Six",
        "Seven",
        "Eight",
        "Nine",
        "Ten",
        "Eleven",
        "Twelve",
        "Thirteen",
        "Fourteen",
        "Fifteen",
        "Sixteen",
        "Seventeen",
        "Eighteen",
        "Nineteen",
    ];
    const tens = [
        "",
        "",
        "Twenty",
        "Thirty",
        "Forty",
        "Fifty",
        "Sixty",
        "Seventy",
        "Eighty",
        "Ninety",
    ];
    const scales = ["", "Thousand", "Million", "Billion", "Trillion"];

    function convertLessThanOneThousand(n: number): string {
        let str = "";
        if (n >= 100) {
            str += ones[Math.floor(n / 100)] + " Hundred ";
            n %= 100;
            if (n > 0) str += "and ";
        }
        if (n >= 20) {
            str += tens[Math.floor(n / 10)] + " ";
            n %= 10;
        }
        if (n > 0) {
            str += ones[n] + " ";
        }
        return str.trim();
    }

    let wordStr = "";
    let scaleIndex = 0;

    // Split into integer parts for conversion
    let integerPart = Math.floor(num);

    while (integerPart > 0) {
        const chunk = integerPart % 1000;
        if (chunk > 0) {
            const chunkStr = convertLessThanOneThousand(chunk);
            wordStr =
                chunkStr +
                (scales[scaleIndex] ? " " + scales[scaleIndex] : "") +
                " " +
                wordStr;
        }
        integerPart = Math.floor(integerPart / 1000);
        scaleIndex++;
    }

    return wordStr.trim();
}

export const PriceInput = forwardRef<HTMLInputElement, PriceInputProps>(
    (
        {
            value,
            onChange,
            currencySymbol = "₦",
            currencyName = "Naira",
            className = "",
            disabled,
            description,
            ...props
        },
        ref
    ) => {
        // Formats numbers to display strings with commas: e.g., 50000 -> "50,000"
        const formatDisplayValue = (val: number | ""): string => {
            if (val === "" || isNaN(val)) return "";

            const parts = val.toString().split(".");
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            return parts.join(".");
        };

        // Handles user input changes, strips non-numeric characters, and returns raw numbers
        const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const rawValue = e.target.value.replace(/,/g, ""); // strip all commas

            // Allow empty state
            if (rawValue === "") {
                onChange("");
                return;
            }

            // Regex allows integers and floats while typing
            if (/^\d*\.?\d*$/.test(rawValue)) {
                // If it ends with a dot, keep it as string state until numbers follow
                if (rawValue.endsWith(".")) {
                    return; // Let the input element hold the temporary string
                }
                onChange(Number(rawValue));
            }
        };

        // Create the textual representation (e.g., "Fifty Thousand Naira Only")
        const textFormRepresentation = React.useMemo(() => {
            if (value === "" || isNaN(value) || value === 0) return "";

            const words = numberToWords(value);
            return `(${words} ${currencyName} Only)`;
        }, [value, currencyName]);

        const currencyIcon = (
            <span
                className={`font-bold text-sm select-none tracking-normal ${disabled ? "text-rw-muted/40" : "text-rw-muted"}`}
            >
                {currencySymbol}
            </span>
        );

        return (
            <Input
                ref={ref}
                type="text" // Must be text type to support comma characters seamlessly
                inputMode="decimal" // Forces a handy numeric virtual keyboard on mobile devices
                value={formatDisplayValue(value)}
                disabled={disabled}
                onChange={handleInputChange}
                icon={currencyIcon}
                className={`pl-[42px] font-mono tracking-wide ${className}`}
                description={
                    <span className="flex flex-col gap-1 mt-0.5">
                        {textFormRepresentation && (
                            <span className="text-rw-crimson font-semibold tracking-wide block animate-fadeIn transition-all text-[11px]">
                                {textFormRepresentation}
                            </span>
                        )}
                        {description && (
                            <span className="text-rw-muted">{description}</span>
                        )}
                    </span>
                }
                {...props}
            />
        );
    }
);

PriceInput.displayName = "PriceInput";
