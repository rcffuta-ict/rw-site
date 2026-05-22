import React, { forwardRef } from "react";

export interface ImageUploadProps {
    label?: string;
    description?: React.ReactNode;
    required?: boolean;
    previewUrl?: string;
    fileSizeKB?: number;
    error?: string;
    disabled?: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    containerClassName?: string;
}

export const ImageUpload = forwardRef<HTMLInputElement, ImageUploadProps>(
    (
        {
            label,
            description,
            required,
            previewUrl,
            fileSizeKB,
            error,
            disabled,
            onChange,
            containerClassName = "",
        },
        ref
    ) => {
        return (
            <div
                className={`flex flex-col gap-2 w-full ${containerClassName} ${disabled ? "opacity-60" : ""}`}
            >
                {label && (
                    <label
                        className={`text-[11px] font-bold uppercase tracking-widest leading-none h-4 ${disabled ? "text-rw-muted/70" : "text-rw-muted"}`}
                    >
                        {label} {required && <span className="text-rw-crimson">*</span>}
                    </label>
                )}

                <div className="flex items-center gap-4 flex-wrap mt-0.5">
                    {previewUrl && (
                        <div className="flex items-center gap-3">
                            <div
                                className={`h-14 w-14 rounded-xl border overflow-hidden shrink-0 shadow-sm bg-white flex items-center justify-center transition-colors ${error ? "border-rw-crimson" : "border-[var(--rw-border)]"}`}
                            >
                                <img
                                    src={previewUrl}
                                    alt="Preview"
                                    className="h-full w-full object-cover"
                                />
                            </div>
                            {fileSizeKB !== undefined && (
                                <div className="text-[11px] font-bold text-rw-ink bg-gray-100 px-2.5 py-1.5 rounded-lg border border-gray-200/40 shadow-sm">
                                    {fileSizeKB.toFixed(1)} KB
                                </div>
                            )}
                        </div>
                    )}
                    <input
                        type="file"
                        accept="image/*"
                        ref={ref}
                        disabled={disabled}
                        onChange={onChange}
                        className={`text-xs text-rw-muted file:mr-4 file:h-[40px] file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:transition-all
                        ${
                            disabled
                                ? "file:bg-gray-100 file:text-rw-muted/40 cursor-not-allowed"
                                : "file:bg-rw-bg-alt file:text-rw-ink hover:file:bg-[var(--rw-border)] cursor-pointer"
                        }
                        ${error ? "file:bg-rw-crimson/10 file:text-rw-crimson hover:file:bg-rw-crimson/20" : ""}`}
                    />
                </div>

                {description && !error && (
                    <p className="text-[11px] text-rw-muted max-w-sm leading-snug pl-0.5">
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

ImageUpload.displayName = "ImageUpload";
