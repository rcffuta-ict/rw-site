"use client";

import { Button } from "@/components/ui/forms/Button";
import { useState } from "react";
import { PriceInput } from "@/components/ui/forms/PriceInput";
import { formatNaira } from "@/lib/utils/functions";

export function ExportCsvButton() {
    const handleClick = () => {
        alert("Export CSV — stub in demo build");
    };
    return (
        <button
            className="flex items-center gap-2 rounded-xl border border-[var(--rw-border-mid)] px-4 py-2.5 text-sm font-semibold text-rw-text-2 hover:bg-rw-bg-alt transition-colors"
            onClick={handleClick}
        >
            <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
            </svg>
            Export CSV
        </button>
    );
}

type ModerationStatus = "idle" | "loading" | "success" | "error";

const StatusView = ({ status, error }: { status: ModerationStatus; error?: string }) => {
    if (status === "idle") return null;

    return (
        <div className="absolute inset-0 bg-white/95 backdrop-blur-md z-20 flex flex-col items-center justify-center p-8 text-center animate-fade-in">
            {status === "loading" && (
                <div className="flex flex-col items-center gap-5">
                    <div className="relative">
                        <div className="h-16 w-16 border-[5px] border-rw-crimson/10 border-t-rw-crimson rounded-full animate-spin" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="h-2 w-2 bg-rw-crimson rounded-full animate-pulse" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm font-bold text-rw-ink uppercase tracking-[0.2em] animate-pulse">
                            Syncing system
                        </p>
                        <p className="text-[10px] text-rw-muted font-bold uppercase tracking-widest opacity-60">
                            Updating financial records...
                        </p>
                    </div>
                </div>
            )}

            {status === "success" && (
                <div className="flex flex-col items-center gap-5 animate-scale-in">
                    <div className="h-24 w-24 bg-green-500 text-white rounded-full flex items-center justify-center shadow-2xl shadow-green-500/20">
                        <svg
                            className="h-12 w-12"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={4}
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M4.5 12.75l6 6 9-13.5"
                            />
                        </svg>
                    </div>
                    <div className="space-y-1">
                        <h4 className="font-display font-black text-2xl text-rw-ink uppercase tracking-tight">
                            Success
                        </h4>
                        <p className="text-[10px] text-rw-muted font-bold uppercase tracking-[0.2em]">
                            The transaction has been registered
                        </p>
                    </div>
                </div>
            )}

            {status === "error" && (
                <div className="flex flex-col items-center gap-5 animate-shake">
                    <div className="h-24 w-24 bg-rw-crimson text-white rounded-full flex items-center justify-center shadow-2xl shadow-rw-crimson/20">
                        <svg
                            className="h-12 w-12"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={3}
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                            />
                        </svg>
                    </div>
                    <div className="space-y-1">
                        <h4 className="font-display font-black text-2xl text-rw-crimson uppercase tracking-tight">
                            System Error
                        </h4>
                        <p className="text-[10px] text-rw-muted font-bold uppercase tracking-[0.2em]">
                            {error || "Connection timed out"}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export const ApprovalForm = ({
    initialAmount,
    onConfirm,
    onCancel,
}: {
    initialAmount: string;
    onConfirm: (amt: string) => void;
    onCancel: () => void;
}) => {
    const [amount, setAmount] = useState<number | "">(
        initialAmount ? Number(initialAmount) : ""
    );
    const [status, setStatus] = useState<ModerationStatus>("idle");

    const handleConfirm = async () => {
        setStatus("loading");

        // Realistic simulation delay
        setTimeout(() => {
            // 90% success rate for demo
            if (Math.random() > 0.1) {
                setStatus("success");
                setTimeout(() => onConfirm(amount.toString()), 1800);
            } else {
                setStatus("error");
                setTimeout(() => setStatus("idle"), 2500);
            }
        }, 2200);
    };

    return (
        <div className="flex flex-col gap-6 p-2 relative overflow-hidden min-h-[300px] justify-center">
            <StatusView status={status} />

            <style
                dangerouslySetInnerHTML={{
                    __html: `
                .scale-up-input div.relative.flex {
                    height: 72px !important;
                }
                .scale-up-input input {
                    font-size: 28px !important;
                    padding-left: 54px !important;
                    border-radius: 16px !important;
                }
                .scale-up-input div.absolute {
                    left: 20px !important;
                }
                .scale-up-input div.absolute span {
                    font-size: 24px !important;
                }
                .scale-up-input p {
                    font-size: 13px !important;
                    margin-top: 6px !important;
                }
                .scale-up-input p span {
                    font-size: 13px !important;
                }
            `,
                }}
            />

            <div className="flex flex-col gap-4">
                <label className="text-[10px] font-bold text-rw-muted uppercase tracking-[0.2em] block text-center opacity-70">
                    Amount to Register
                </label>

                <div className="relative group text-left scale-up-input">
                    <PriceInput
                        value={amount}
                        onChange={(val) => setAmount(val)}
                        autoFocus
                        placeholder="0"
                        className="text-left font-display font-bold text-rw-ink outline-none"
                    />
                </div>

                {Number(amount || 0) > Number(initialAmount) && (
                    <div className="flex items-start gap-2 bg-amber-50 p-3 rounded-xl border border-amber-200 animate-fade-in text-left">
                        <svg
                            className="h-5 w-5 text-amber-500 shrink-0 mt-0.5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                        </svg>
                        <p className="text-xs text-amber-800 font-medium">
                            Warning: The confirmed amount is higher than what was
                            extracted/claimed ({formatNaira(Number(initialAmount))}). This
                            is allowed but please double-check.
                        </p>
                    </div>
                )}
            </div>

            <div className="flex flex-col gap-2">
                <Button
                    size="lg"
                    className="h-14 text-sm font-bold uppercase tracking-widest bg-green-600 hover:bg-green-700 !rounded-xl"
                    onClick={handleConfirm}
                    disabled={status !== "idle" || amount === ""}
                >
                    Confirm & Approve {formatNaira(Number(amount || 0))}
                </Button>
                <Button
                    variant="ghost"
                    onClick={onCancel}
                    disabled={status !== "idle"}
                    className="uppercase tracking-[0.1em] text-[10px] font-bold opacity-50"
                >
                    Cancel Action
                </Button>
            </div>
        </div>
    );
};

export const FlagForm = ({
    orderRef,
    onConfirm,
    onCancel,
}: {
    orderRef: string;
    onConfirm: (reason: string) => void;
    onCancel: () => void;
}) => {
    const [reason, setReason] = useState("");
    const [status, setStatus] = useState<ModerationStatus>("idle");

    const handleConfirm = async () => {
        setStatus("loading");

        try {
            onConfirm(reason);
            setStatus("success");
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            setStatus("error");

            setTimeout(() => setStatus("idle"), 2500);
        }

        // setTimeout(() => {

        //     if (Math.random() > 0.1) {
        //         setTimeout(() => onConfirm(reason), 1800);
        //     } else {
        //         setStatus("error");
        //         setTimeout(() => setStatus("idle"), 2500);
        //     }
        // }, 2200);
    };

    return (
        <div className="flex flex-col gap-6 p-2 relative overflow-hidden min-h-[300px] justify-center">
            <StatusView status={status} />

            <div className="flex flex-col gap-3">
                <label className="text-[10px] font-bold text-rw-muted uppercase tracking-[0.2em] opacity-70">
                    Reason for flagging
                </label>
                <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    autoFocus
                    placeholder="e.g., Receipt is blurry, or amount doesn't match bank statement..."
                    className="w-full h-32 p-4 rounded-xl bg-rw-bg-alt/30 border-2 border-transparent focus:border-amber-500/50 focus:bg-white transition-all outline-none text-sm text-rw-ink resize-none shadow-inner"
                />
            </div>

            <div className="flex flex-col gap-2">
                <Button
                    size="lg"
                    disabled={!reason.trim() || status !== "idle"}
                    className="h-14 text-sm font-bold uppercase tracking-widest bg-amber-600 hover:bg-amber-700 disabled:opacity-50 !rounded-xl shadow-lg shadow-amber-600/20"
                    onClick={handleConfirm}
                >
                    Confirm Flag
                </Button>
                <Button
                    variant="ghost"
                    onClick={onCancel}
                    disabled={status !== "idle"}
                    className="uppercase tracking-[0.1em] text-[10px] font-bold opacity-50"
                >
                    Cancel Action
                </Button>
            </div>
        </div>
    );
};

export const RevertConfirmationForm = ({
    orderRef,
    onConfirm,
    onCancel,
}: {
    orderRef: string;
    onConfirm: () => void;
    onCancel: () => void;
}) => {
    const [status, setStatus] = useState<ModerationStatus>("idle");

    const handleConfirm = async () => {
        setStatus("loading");

        setTimeout(() => {
            if (Math.random() > 0.05) {
                // Higher success rate for reverting
                setStatus("success");
                setTimeout(() => onConfirm(), 1800);
            } else {
                setStatus("error");
                setTimeout(() => setStatus("idle"), 2500);
            }
        }, 2200);
    };

    return (
        <div className="flex flex-col gap-6 p-2 relative overflow-hidden min-h-[300px] justify-center text-center">
            <StatusView status={status} />

            <div className="flex flex-col items-center gap-4">
                <div className="h-16 w-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center">
                    <svg
                        className="h-8 w-8"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                        />
                    </svg>
                </div>
                <div>
                    <h3 className="font-display font-black text-xl text-rw-ink uppercase tracking-tight">
                        Revert to Pending?
                    </h3>
                    <p className="text-sm text-rw-muted font-medium mt-2 max-w-[280px] mx-auto">
                        This will remove the current validation status and place the
                        submission back into the active review queue.
                    </p>
                </div>
            </div>

            <div className="flex flex-col gap-2 mt-4">
                <Button
                    size="lg"
                    className="h-14 text-sm font-bold uppercase tracking-widest bg-rw-ink hover:bg-black !rounded-xl text-white"
                    onClick={handleConfirm}
                    disabled={status !== "idle"}
                >
                    Confirm Reversion
                </Button>
                <Button
                    variant="ghost"
                    onClick={onCancel}
                    disabled={status !== "idle"}
                    className="uppercase tracking-[0.1em] text-[10px] font-bold opacity-50"
                >
                    Keep Current Status
                </Button>
            </div>
        </div>
    );
};
