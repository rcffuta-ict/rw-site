"use client";

import { useState, useRef, useCallback } from "react";

export interface ExtractedReceipt {
    senderName: string | null;
    amount: number | null;
    date: string | null;
    time: string | null;
    bank: string | null;
    confidence: "high" | "medium" | "low";
}

interface ReceiptUploadZoneProps {
    onExtracted: (data: ExtractedReceipt, file: File) => void;
}

// Mock extraction result — simulates AI reading the receipt
const MOCK_EXTRACTION: ExtractedReceipt = {
    senderName: "John Doe",
    amount: 4500,
    date: new Date().toISOString().slice(0, 10),
    time: new Date().toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit", hour12: false }),
    bank: "GTBank",
    confidence: "high",
};

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
const MAX_SIZE_MB = 6;

export function ReceiptUploadZone({ onExtracted }: ReceiptUploadZoneProps) {
    const [dragOver, setDragOver] = useState(false);
    const [file, setFile]         = useState<File | null>(null);
    const [status, setStatus]     = useState<"idle" | "reading" | "done" | "error">("idle");
    const [errorMsg, setErrorMsg] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    const validate = (f: File): string | null => {
        if (!ACCEPTED_TYPES.includes(f.type)) return "Please upload a JPEG, PNG, WebP or PDF file.";
        if (f.size > MAX_SIZE_MB * 1024 * 1024) return `File too large — max ${MAX_SIZE_MB} MB.`;
        return null;
    };

    const processFile = useCallback((f: File) => {
        const err = validate(f);
        if (err) { setErrorMsg(err); setStatus("error"); return; }
        setFile(f);
        setStatus("reading");
        setErrorMsg("");

        // Simulate 1.5s AI extraction
        setTimeout(() => {
            setStatus("done");
            onExtracted(MOCK_EXTRACTION, f);
        }, 1500);
    }, [onExtracted]);

    const onDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        const f = e.dataTransfer.files[0];
        if (f) processFile(f);
    }, [processFile]);

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (f) processFile(f);
    };

    const reset = () => {
        setFile(null);
        setStatus("idle");
        setErrorMsg("");
        if (inputRef.current) inputRef.current.value = "";
    };

    return (
        <div className="flex flex-col gap-3">
            {/* Drop zone */}
            <div
                onClick={() => status === "idle" || status === "error" ? inputRef.current?.click() : undefined}
                onDrop={onDrop}
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                className={`relative rounded-2xl border-2 border-dashed transition-all cursor-pointer p-8 flex flex-col items-center gap-3 text-center
                    ${dragOver ? "border-rw-crimson bg-rw-crimson/5" : ""}
                    ${status === "idle"    ? "border-[var(--rw-border-strong)] hover:border-rw-crimson hover:bg-rw-crimson/3" : ""}
                    ${status === "reading" ? "border-rw-orange/50 bg-amber-50/50 cursor-default" : ""}
                    ${status === "done"    ? "border-green-300 bg-green-50/50 cursor-default" : ""}
                    ${status === "error"   ? "border-rw-crimson/50 bg-rw-crimson/5" : ""}
                `}
            >
                <input
                    ref={inputRef}
                    type="file"
                    accept={ACCEPTED_TYPES.join(",")}
                    className="sr-only"
                    onChange={onFileChange}
                />

                {status === "idle" && (
                    <>
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rw-bg-alt border border-[var(--rw-border)]">
                            <svg className="h-6 w-6 text-rw-crimson" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                        </div>
                        <div>
                            <p className="font-semibold text-rw-ink text-sm">Drop your receipt here</p>
                            <p className="text-xs text-rw-muted mt-0.5">or <span className="text-rw-crimson font-semibold">click to browse</span></p>
                        </div>
                        <p className="text-xs text-rw-muted">JPEG, PNG, WebP or PDF · max {MAX_SIZE_MB} MB</p>
                    </>
                )}

                {status === "reading" && (
                    <>
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 border border-amber-200">
                            <svg className="h-6 w-6 text-amber-600 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                            </svg>
                        </div>
                        <div>
                            <p className="font-semibold text-amber-700 text-sm">Analysing receipt…</p>
                            <p className="text-xs text-amber-600 mt-0.5">{file?.name}</p>
                        </div>
                    </>
                )}

                {status === "done" && (
                    <>
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 border border-green-200">
                            <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <div>
                            <p className="font-semibold text-green-700 text-sm">Receipt analysed</p>
                            <p className="text-xs text-green-600 mt-0.5">{file?.name}</p>
                        </div>
                        <button
                            onClick={e => { e.stopPropagation(); reset(); }}
                            className="text-xs font-semibold text-rw-muted hover:text-rw-ink transition-colors"
                        >
                            Upload a different receipt
                        </button>
                    </>
                )}

                {status === "error" && (
                    <>
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rw-crimson/10 border border-rw-crimson/20">
                            <svg className="h-6 w-6 text-rw-crimson" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <div>
                            <p className="font-semibold text-rw-crimson text-sm">Upload failed</p>
                            <p className="text-xs text-rw-muted mt-0.5">{errorMsg}</p>
                        </div>
                        <button
                            onClick={e => { e.stopPropagation(); reset(); }}
                            className="text-xs font-semibold text-rw-crimson hover:underline"
                        >
                            Try again
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
