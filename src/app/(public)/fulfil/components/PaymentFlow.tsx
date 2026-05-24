/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/forms/Button";
import { PriceInput } from "@/components/ui/forms/PriceInput";
import type { Order } from "@/lib/data/types";
import { DEMO_MODE } from "@/lib/config";
import type { GlobalSettings } from "@/lib/services/settings.service";
import { analyzeReceipt, deleteReceiptImage } from "@/app/actions/receipt";
import { attachPayment } from "@/lib/services/orders.service";
import { toast } from "sonner";

interface ExtractionResult {
    senderName: string | null;
    amount: number | null;
    date: string | null;
    time: string | null;
    bank: string | null;
    transactionRef: string | null;
    narration: string | null;
    confidence: "high" | "medium" | "low";
}

const IS_REAL = !DEMO_MODE;

function RadioCard({
    selected,
    onClick,
    title,
    desc,
    disabled = false,
}: {
    selected: boolean;
    onClick: () => void;
    title: string;
    desc: string;
    disabled?: boolean;
}) {
    return (
        <button
            type="button"
            onClick={disabled ? undefined : onClick}
            disabled={disabled}
            className={`radio-card text-left w-full ${selected ? "selected" : ""} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        >
            <span className="radio-dot" />
            <div>
                <p className="font-semibold text-sm text-rw-ink">{title}</p>
                <p className="text-xs text-rw-muted mt-0.5">{desc}</p>
            </div>
        </button>
    );
}

interface PaymentFlowProps {
    order: Order;
    settings: GlobalSettings;
    onResetOrder: () => void;
    onStageChange?: (stage: "idle" | "analysing" | "preview" | "done") => void;
}

export function PaymentFlow({ order, settings, onResetOrder, onStageChange }: PaymentFlowProps) {
    const [paymentType, setPaymentType] = useState<"full" | "partial" | null>("full");
    const [customAmount, setCustomAmount] = useState<number | "">(settings.payment_min_amount);
    const [file, setFile] = useState<File | null>(null);
    const [stage, setStage] = useState<"idle" | "analysing" | "preview" | "done">("idle");
    const [extraction, setExtraction] = useState<ExtractionResult | null>(null);
    const [extractionError, setExtractionError] = useState<string | null>(null);
    const [accurate, setAccurate] = useState<boolean | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [uploadedCloudData, setUploadedCloudData] = useState<{
        public_id: string;
        secure_url: string;
    } | null>(null);
    const [saveRetries, setSaveRetries] = useState(0);

    const remaining = order.totalAmount - order.amountPaid;
    const minPayable = Math.min(settings.payment_min_amount, remaining);

    const payAmount =
        paymentType === "full"
            ? remaining
            : (typeof customAmount === "number" ? Math.max(customAmount, minPayable) : minPayable);

    function updateStage(newStage: typeof stage) {
        setStage(newStage);
        onStageChange?.(newStage);
    }

    async function handleUpload(selectedFile: File) {
        updateStage("analysing");
        setExtractionError(null);

        try {
            let base64String = "";
            let finalType = selectedFile.type;

            if (selectedFile.type.startsWith("image/")) {
                base64String = await new Promise<string>((resolve, reject) => {
                    const img = new Image();
                    const url = URL.createObjectURL(selectedFile);
                    img.onload = () => {
                        URL.revokeObjectURL(url);
                        const canvas = document.createElement("canvas");
                        let { width, height } = img;

                        const maxDim = 1200;
                        if (width > maxDim || height > maxDim) {
                            if (width > height) {
                                height = Math.round((height * maxDim) / width);
                                width = maxDim;
                            } else {
                                width = Math.round((width * maxDim) / height);
                                height = maxDim;
                            }
                        }

                        canvas.width = width;
                        canvas.height = height;
                        const ctx = canvas.getContext("2d");
                        if (!ctx)
                            return reject(new Error("Failed to get canvas context"));

                        ctx.drawImage(img, 0, 0, width, height);
                        const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
                        finalType = "image/jpeg";
                        resolve(dataUrl.split(",")[1]);
                    };
                    img.onerror = () =>
                        reject(new Error("Failed to load image for compression"));
                    img.src = url;
                });
            } else {
                base64String = await new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(selectedFile);
                    reader.onload = () =>
                        resolve((reader.result as string).split(",")[1]);
                    reader.onerror = (error) => reject(error);
                });
            }

            const res = await analyzeReceipt(base64String, finalType);

            if (res.success && res.transaction) {
                const tx = res.transaction;

                let formattedDate = "—";
                let formattedTime = "—";
                if (tx.transaction_date) {
                    const d = new Date(tx.transaction_date);
                    if (!isNaN(d.getTime())) {
                        formattedDate = d.toLocaleDateString("en-US", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                        });
                        formattedTime = d.toLocaleTimeString("en-US", {
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                        });
                    } else {
                        formattedDate = tx.transaction_date.split("T")[0] || "—";
                        formattedTime =
                            tx.transaction_date.split("T")[1]?.slice(0, 5) || "—";
                    }
                }

                setExtraction({
                    senderName: tx.sender || "Unknown",
                    amount: tx.amount || null,
                    date: formattedDate,
                    time: formattedTime,
                    bank: tx.bank || "Unknown",
                    transactionRef: tx.reference || "—",
                    narration: (tx as any).narration || (tx as any).description || null,
                    confidence: "high" as const,
                });
                updateStage("preview");
            } else {
                console.error("Extraction failed:", res.error);
                setExtractionError(
                    res.error || "Failed to extract details from the receipt."
                );
                updateStage("preview");
            }
        } catch (err: any) {
            console.error("Error analyzing:", err);
            setExtractionError(
                err.message || "An unexpected error occurred while analyzing the receipt."
            );
            updateStage("preview");
        }
    }

    async function handleConfirm() {
        if (submitting) return; // Prevent double clicks
        if (submitting) return; // Prevent double clicks
        if (accurate === null || !extraction) return;
        setSubmitting(true);

        try {
            if (!file) throw new Error("Receipt file is missing.");

            let cloudData = uploadedCloudData;

            if (!cloudData) {
                const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
                const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

                if (!cloudName || !uploadPreset) {
                    throw new Error(
                        "Cloudinary configuration is missing. Contact support."
                    );
                }

                const formData = new FormData();
                formData.append("file", file);
                formData.append("upload_preset", uploadPreset);

                const uploadRes = await fetch(
                    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
                    {
                        method: "POST",
                        body: formData,
                    }
                );

                if (!uploadRes.ok) {
                    const errorData = await uploadRes.json();
                    throw new Error(
                        errorData.error?.message || "Failed to upload receipt image."
                    );
                }

                const parsedData = await uploadRes.json();
                cloudData = {
                    public_id: parsedData.public_id,
                    secure_url: parsedData.secure_url,
                };
                setUploadedCloudData(cloudData);
            }

            if (!cloudData) throw new Error("Failed to resolve cloud upload data.");

            const res = await attachPayment({
                orderId: order.id,
                extractedAmount: extraction.amount ?? payAmount,
                extractedSenderName: extraction.senderName,
                extractedBank: extraction.bank,
                extractedDate: extraction.date,
                extractedTime: extraction.time,
                extractedTransactionRef:
                    extraction.transactionRef !== "—" ? extraction.transactionRef : null,
                cloudinaryReceiptPublicId: cloudData.public_id,
                receiptUrl: cloudData.secure_url,
                userConfirmedAccuracy: accurate,
            });

            if (!res.success) {
                throw new Error(res.error || "Failed to save payment record.");
            }

            toast.success("Payment submitted successfully!");
            setUploadedCloudData(null);
            setSaveRetries(0);
            updateStage("done");
        } catch (error: any) {
            console.error("Payment confirmation error:", error);

            let displayError =
                error.message || "An unexpected error occurred. Please try again.";
            if (displayError.includes('relation "orders" does not exist')) {
                displayError =
                    'Database Trigger Error: The database trigger is referencing the old "orders" table instead of "rw_orders". Please apply the SQL trigger fix from docs/schema.sql.';
            }

            if (uploadedCloudData) {
                const nextRetries = saveRetries + 1;
                setSaveRetries(nextRetries);

                if (nextRetries >= 3) {
                    toast.error(
                        "Maximum retries reached. Payment submission is being reset."
                    );
                    if (uploadedCloudData.public_id) {
                        await deleteReceiptImage(uploadedCloudData.public_id);
                    }
                    resetUpload();
                } else {
                    toast.error(`${displayError} (Retrying ${nextRetries}/3)`);
                }
            } else {
                toast.error(displayError);
            }
        } finally {
            setSubmitting(false);
        }
    }

    function resetUpload() {
        if (uploadedCloudData?.public_id) {
            deleteReceiptImage(uploadedCloudData.public_id).catch(console.error);
        }
        setFile(null);
        updateStage("idle");
        setExtraction(null);
        setExtractionError(null);
        setAccurate(null);
        setUploadedCloudData(null);
        setSaveRetries(0);
    }

    // Done state
    if (stage === "done") {
        return (
            <div className="rw-card p-12 text-center flex flex-col items-center gap-6 animate-scale-in border-green-200 bg-gradient-to-b from-green-50 to-white">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-100 border-4 border-white shadow-lg">
                    <svg
                        className="h-12 w-12 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={3}
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m4.5 12.75 6 6 9-13.5"
                        />
                    </svg>
                </div>
                <div>
                    <h2 className="font-display font-bold text-3xl text-rw-ink">
                        Payment Submitted!
                    </h2>
                    <p className="mt-3 text-rw-text-2 text-lg max-w-[36ch] mx-auto leading-relaxed">
                        Thank you. Your receipt is under review. An email confirmation
                        will be sent to{" "}
                        <span className="font-semibold text-rw-ink">
                            {order.customerEmail}
                        </span>{" "}
                        once approved.
                    </p>
                </div>
                <Button variant="outlined" className="mt-4" onClick={onResetOrder}>
                    Pay another order
                </Button>
            </div>
        );
    }

    // Preview state
    if (stage === "preview") {
        const isMissingInfo =
            !extraction?.senderName ||
            extraction.senderName === "Unknown" ||
            !extraction?.amount ||
            extraction.date === "—";

        const prescribedNarration = `RW26-${order.orderRef}`;
        const isNarrationMismatch =
            extraction &&
            (!extraction.narration ||
                !extraction.narration
                    .toLowerCase()
                    .includes(prescribedNarration.toLowerCase()));

        // Validate bank and recipient name match defaults
        const isBankMismatch =
            extraction &&
            extraction.bank &&
            extraction.bank.toLowerCase() !== settings.bank_name.toLowerCase();
        const isRecipientMismatch =
            extraction &&
            extraction.senderName &&
            extraction.senderName.toLowerCase() !==
                settings.bank_account_name.toLowerCase();
        const hasAccountMismatch = Boolean(isBankMismatch || isRecipientMismatch);

        return (
            <div className="rw-card p-8 flex flex-col gap-8 animate-fade-in-up shadow-rw-shadow-md border-t-[3px] border-t-rw-crimson">
                <div className="flex items-center justify-between pb-5 border-b border-[var(--rw-border)]">
                    <div>
                        <h2 className="font-display font-bold text-2xl text-rw-ink">
                            Extraction Result
                        </h2>
                        <p className="text-sm text-rw-muted mt-1">
                            {extractionError
                                ? "Failed to extract details"
                                : "Please verify the details below"}
                        </p>
                    </div>
                    {extraction && (
                        <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold border ${
                                extraction.confidence === "high"
                                    ? "bg-green-50 text-green-700 border-green-200"
                                    : extraction.confidence === "medium"
                                      ? "bg-amber-50 text-amber-700 border-amber-200"
                                      : "bg-red-50 text-red-700 border-red-200"
                            }`}
                        >
                            <span className="h-2 w-2 rounded-full bg-current animate-pulse" />
                            {extraction.confidence.toUpperCase()} CONFIDENCE
                        </span>
                    )}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Image Preview */}
                    {file && (
                        <div className="rounded-2xl overflow-hidden border border-[var(--rw-border)] bg-rw-bg-alt flex items-center justify-center max-h-[300px]">
                            {file.type.includes("image") ? (
                                <img
                                    src={URL.createObjectURL(file)}
                                    alt="Receipt Preview"
                                    className="object-contain w-full h-full"
                                />
                            ) : (
                                <div className="p-8 text-center text-rw-muted">
                                    <svg
                                        className="w-12 h-12 mx-auto mb-2"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1.5}
                                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                        />
                                    </svg>
                                    <p className="text-sm font-medium">
                                        Document Preview Not Available
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {extractionError ? (
                        <div className="flex flex-col justify-center h-full">
                            <div className="p-6 rounded-2xl bg-red-50 border border-red-200 text-red-800">
                                <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                    Analysis Failed
                                </h3>
                                <p className="text-sm">{extractionError}</p>
                            </div>
                        </div>
                    ) : extraction ? (
                        <div className="flex flex-col gap-4">
                            {/* Row 1 */}
                            <div className="p-4 rounded-2xl bg-rw-bg-alt border border-[var(--rw-border)]">
                                <p className="text-xs text-rw-muted font-medium uppercase tracking-wider mb-1">
                                    Sender Name
                                </p>
                                <p
                                    className="font-bold text-base text-rw-ink truncate"
                                    title={extraction.senderName || "—"}
                                >
                                    {extraction.senderName || "—"}
                                </p>
                            </div>

                            {/* Row 2 */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-2xl bg-rw-bg-alt border border-[var(--rw-border)]">
                                    <p className="text-xs text-rw-muted font-medium uppercase tracking-wider mb-1">
                                        Amount Found
                                    </p>
                                    <p className="font-bold text-base text-rw-ink truncate">
                                        {extraction.amount
                                            ? `₦${extraction.amount.toLocaleString()}`
                                            : "—"}
                                    </p>
                                </div>
                                <div className="p-4 rounded-2xl bg-rw-bg-alt border border-[var(--rw-border)]">
                                    <p className="text-xs text-rw-muted font-medium uppercase tracking-wider mb-1">
                                        Date & Time
                                    </p>
                                    <p className="font-bold text-base text-rw-ink truncate">
                                        {extraction.date !== "—"
                                            ? `${extraction.date} • ${extraction.time}`
                                            : "—"}
                                    </p>
                                </div>
                            </div>

                            {/* Row 3 */}
                            <div className="p-4 rounded-2xl bg-rw-bg-alt border border-[var(--rw-border)]">
                                <p className="text-xs text-rw-muted font-medium uppercase tracking-wider mb-1">
                                    Bank & Reference
                                </p>
                                <div className="flex flex-col">
                                    <p
                                        className="font-bold text-base text-rw-ink truncate"
                                        title={extraction.bank || "—"}
                                    >
                                        {extraction.bank || "—"}
                                    </p>
                                    {extraction.transactionRef &&
                                        extraction.transactionRef !== "—" && (
                                            <p
                                                className="text-sm text-rw-text-2 truncate font-mono mt-0.5"
                                                title={extraction.transactionRef || ""}
                                            >
                                                Ref: {extraction.transactionRef}
                                            </p>
                                        )}
                                </div>
                            </div>

                            {/* Row 4: Account Mismatch Warning */}
                            {hasAccountMismatch && (
                                <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex gap-3 items-start animate-fade-in">
                                    <svg
                                        className="w-5 h-5 text-red-600 shrink-0 mt-0.5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                        />
                                    </svg>
                                    <div>
                                        <p className="text-sm font-bold text-red-800">
                                            Account Mismatch
                                        </p>
                                        <p className="text-xs text-red-700 mt-1">
                                            This payment does not match our expected
                                            account details. You cannot proceed with this
                                            receipt.
                                        </p>
                                        {isBankMismatch && (
                                            <p
                                                className="text-xs text-red-600 font-mono mt-2 truncate max-w-xs"
                                                title={extraction.bank || ""}
                                            >
                                                Expected Bank:{" "}
                                                <b>{settings.bank_name}</b> | Found:{" "}
                                                <b>{extraction.bank}</b>
                                            </p>
                                        )}
                                        {isRecipientMismatch && (
                                            <p
                                                className="text-xs text-red-600 font-mono mt-1 truncate max-w-xs"
                                                title={extraction.senderName || ""}
                                            >
                                                Expected Recipient:{" "}
                                                <b>{settings.bank_account_name}</b> |
                                                Found: <b>{extraction.senderName}</b>
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Row 5: Narration Warning */}
                            {isNarrationMismatch && (
                                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex gap-3 items-start animate-fade-in">
                                    <svg
                                        className="w-5 h-5 text-amber-600 shrink-0 mt-0.5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                        />
                                    </svg>
                                    <div>
                                        <p className="text-sm font-bold text-amber-800">
                                            Narration Mismatch
                                        </p>
                                        <p className="text-xs text-amber-700 mt-1">
                                            The receipt does not match the prescribed
                                            narration{" "}
                                            <b className="font-mono">
                                                {prescribedNarration}
                                            </b>
                                            . This is a minor warning, but admins will
                                            trace the payment manually.
                                        </p>
                                        <p
                                            className="text-xs text-amber-600/80 font-mono mt-2 truncate max-w-[30ch]"
                                            title={
                                                extraction.narration || "None detected"
                                            }
                                        >
                                            Found:{" "}
                                            {extraction.narration || "None detected"}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : null}
                </div>

                {/* Accuracy check */}
                {!extractionError && (
                    <div className="bg-rw-surface-2 p-6 rounded-2xl border border-[var(--rw-border-mid)]">
                        <p className="text-base font-bold text-rw-ink mb-4">
                            Is this information accurate?
                        </p>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <RadioCard
                                selected={accurate === true}
                                onClick={() => setAccurate(true)}
                                title="Yes, looks good"
                                desc={
                                    isMissingInfo
                                        ? "Warning: Missing data"
                                        : "Matches my payment"
                                }
                            />
                            <RadioCard
                                selected={accurate === false}
                                onClick={() => setAccurate(false)}
                                title="No, it's incorrect"
                                desc="I want to re-upload"
                            />
                        </div>

                        {accurate === false && (
                            <div className="mt-5 p-4 rounded-xl bg-amber-50 border border-amber-200 animate-fade-in-down">
                                <p className="text-sm text-amber-800 font-medium mb-3">
                                    We&rsquo;ll discard this extraction. Please upload a
                                    clearer image.
                                </p>
                                <Button
                                    variant="outlined"
                                    size="sm"
                                    onClick={resetUpload}
                                    className="bg-white border-amber-200 text-amber-900 hover:bg-amber-100"
                                >
                                    Re-upload Receipt
                                </Button>
                            </div>
                        )}

                        {accurate === true && isMissingInfo && (
                            <div className="mt-5 p-4 rounded-xl bg-red-50 border border-red-200 animate-fade-in-down">
                                <p className="text-sm text-red-800 font-medium mb-3">
                                    <strong>Cannot Proceed:</strong> Important information
                                    (Sender, Amount, or Date) is missing from the
                                    extraction. We cannot accept this payment record
                                    as-is. Please upload a clearer image.
                                </p>
                                <Button
                                    variant="outlined"
                                    size="sm"
                                    onClick={resetUpload}
                                    className="bg-white border-red-200 text-red-900 hover:bg-red-100"
                                >
                                    Re-upload Receipt
                                </Button>
                            </div>
                        )}
                    </div>
                )}

                {extractionError ? (
                    <Button
                        variant="outlined"
                        size="lg"
                        onClick={resetUpload}
                        className="w-full !h-16 text-lg rounded-2xl border-red-200 text-red-700 hover:bg-red-50"
                    >
                        Re-upload Receipt
                    </Button>
                ) : (
                    <Button
                        variant="primary"
                        size="lg"
                        onClick={handleConfirm}
                        disabled={
                            accurate !== true ||
                            submitting ||
                            isMissingInfo ||
                            (hasAccountMismatch && IS_REAL)
                        }
                        loading={submitting}
                        id="confirm-receipt-btn"
                        className="w-full !h-16 text-lg rounded-2xl"
                    >
                        Confirm & Complete
                    </Button>
                )}
                {submitting && (
                    <div className="flex items-center justify-center gap-2 mt-4 animate-fade-in">
                        <span className="h-1.5 w-1.5 rounded-full bg-rw-crimson animate-ping" />
                        <p className="text-center text-xs text-rw-muted font-medium animate-pulse">
                            Please do not close this window or refresh the page while we
                            process your payment.
                        </p>
                    </div>
                )}
                {submitting && (
                    <div className="flex items-center justify-center gap-2 mt-4 animate-fade-in">
                        <span className="h-1.5 w-1.5 rounded-full bg-rw-crimson animate-ping" />
                        <p className="text-center text-xs text-rw-muted font-medium animate-pulse">
                            Please do not close this window or refresh the page while we
                            process your payment.
                        </p>
                    </div>
                )}
            </div>
        );
    }

    // Analysing state
    if (stage === "analysing") {
        return (
            <div className="rw-card p-8 flex flex-col gap-8 animate-fade-in-up shadow-rw-shadow-md border-t-[3px] border-t-rw-crimson">
                <div className="flex items-center justify-between pb-5 border-b border-[var(--rw-border)]">
                    <div>
                        <h2 className="font-display font-bold text-2xl text-rw-ink">
                            Analysing Document
                        </h2>
                        <p className="text-sm text-rw-muted mt-1">
                            Extracting payment data using AI...
                        </p>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Image Preview with spinner overlay */}
                    {file && (
                        <div className="rounded-2xl overflow-hidden border border-[var(--rw-border)] bg-rw-bg-alt flex items-center justify-center max-h-[300px] relative">
                            {file.type.includes("image") ? (
                                <>
                                    <img
                                        src={URL.createObjectURL(file)}
                                        alt="Receipt Preview"
                                        className="object-contain w-full h-full opacity-40 blur-[2px]"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="h-16 w-16 rounded-full border-4 border-rw-bg-alt border-t-rw-crimson animate-spin shadow-lg" />
                                    </div>
                                </>
                            ) : (
                                <div className="p-8 text-center text-rw-muted flex flex-col items-center">
                                    <span className="h-12 w-12 rounded-full border-4 border-rw-bg-alt border-t-rw-crimson animate-spin mb-4" />
                                    <p className="text-sm font-medium">
                                        Processing Document...
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Skeleton loaders */}
                    <div className="grid grid-cols-2 gap-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div
                                key={i}
                                className="p-4 rounded-2xl bg-rw-bg-alt border border-[var(--rw-border)] animate-pulse"
                            >
                                <div className="h-3 bg-gray-200 rounded w-1/2 mb-3"></div>
                                <div className="h-5 bg-gray-300 rounded w-3/4"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // Idle state
    return (
        <div className="rw-card p-6 sm:p-8 flex flex-col gap-8 shadow-rw-shadow-md border-t-[3px] border-t-rw-crimson">
            <div>
                <h2 className="font-display font-bold text-2xl text-rw-ink mb-2">
                    Submit Receipt
                </h2>
                <p className="text-rw-muted text-sm">
                    Upload your proof of payment once the transfer is successful.
                </p>
            </div>

            {/* Payment type selection */}
            <div>
                <p className="text-sm font-semibold text-rw-ink mb-4 uppercase tracking-wider">
                    1. Select Payment Type
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                    <RadioCard
                        selected={paymentType === "full"}
                        onClick={() => setPaymentType("full")}
                        title="Pay in Full"
                        desc={`₦${remaining.toLocaleString()}`}
                    />
                    <RadioCard
                        selected={paymentType === "partial"}
                        onClick={() => {
                            if (settings.payment_installment_allowed && remaining > minPayable) {
                                setPaymentType("partial");
                            }
                        }}
                        title={settings.payment_installment_allowed && remaining > minPayable ? "Pay Minimum Deposit" : "Pay in Part (Disabled)"}
                        desc={`Min ₦${minPayable.toLocaleString()}`}
                        disabled={!settings.payment_installment_allowed || remaining <= minPayable}
                    />
                </div>
            </div>

            {/* Partial amount picker */}
            {paymentType === "partial" && (
                <div className="p-6 rounded-2xl bg-rw-bg-alt border border-[var(--rw-border)] animate-fade-in-down">
                    <div className="flex flex-col gap-4 mb-4">
                        <p className="text-sm font-semibold text-rw-ink">
                            Enter Deposit Amount
                        </p>
                        <PriceInput
                            value={customAmount}
                            onChange={(val) => setCustomAmount(val)}
                            className="bg-white !pl-10 font-display font-black text-lg"
                        />
                    </div>

                    {typeof customAmount === "number" && customAmount < minPayable && (
                        <p className="text-xs text-rw-crimson font-medium mb-4">
                            Amount must be at least ₦{minPayable.toLocaleString()}
                        </p>
                    )}
                    {typeof customAmount === "number" && customAmount > remaining && (
                        <p className="text-xs text-rw-crimson font-medium mb-4">
                            Amount cannot exceed remaining balance of ₦{remaining.toLocaleString()}
                        </p>
                    )}

                    <div className="mt-6 pt-5 border-t border-[var(--rw-border)] flex items-end justify-between">
                        <span className="text-sm font-medium text-rw-text-2">
                            Amount to pay:
                        </span>
                        <span className="font-bold text-3xl text-rw-crimson">
                            ₦{payAmount.toLocaleString()}
                        </span>
                    </div>
                </div>
            )}

            {/* Upload receipt */}
            {paymentType && (
                <div className="animate-fade-in-down">
                    <p className="text-sm font-semibold text-rw-ink mb-4 uppercase tracking-wider">
                        2. Upload Proof
                    </p>
                    <label
                        htmlFor="receipt-upload"
                        className="flex flex-col items-center justify-center gap-4 rounded-[2rem] border-2 border-dashed border-[var(--rw-border-strong)] bg-rw-bg-warm p-12 cursor-pointer hover:border-rw-crimson hover:bg-rw-crimson/5 transition-all group"
                    >
                        {file ? (
                            <div className="text-center">
                                <div className="h-16 w-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                    <svg
                                        className="h-8 w-8"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth={2.5}
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                        />
                                    </svg>
                                </div>
                                <p className="text-base font-bold text-rw-ink">
                                    {file.name}
                                </p>
                                <p className="text-sm font-medium text-rw-crimson mt-2">
                                    Click to replace file
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="h-16 w-16 bg-white border border-[var(--rw-border)] text-rw-muted rounded-2xl flex items-center justify-center shadow-sm group-hover:text-rw-crimson group-hover:border-rw-crimson/30 group-hover:-translate-y-2 transition-all">
                                    <svg
                                        className="h-8 w-8"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth={1.5}
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
                                        />
                                    </svg>
                                </div>
                                <div className="text-center">
                                    <p className="text-base font-semibold text-rw-ink">
                                        Click to upload receipt
                                    </p>
                                    <p className="text-sm text-rw-muted mt-1">
                                        or drag and drop it here
                                    </p>
                                </div>
                                <p className="text-xs font-medium px-3 py-1 bg-white rounded-md text-rw-muted border border-[var(--rw-border)]">
                                    JPG, PNG, etc (Max 6MB)
                                </p>
                            </>
                        )}
                        <input
                            id="receipt-upload"
                            type="file"
                            accept="image/*"
                            className="sr-only"
                            onChange={(e) => {
                                const selected = e.target.files?.[0];
                                if (selected) {
                                    setFile(selected);
                                    handleUpload(selected);
                                }
                                e.target.value = "";
                            }}
                        />
                    </label>
                </div>
            )}
        </div>
    );
}
