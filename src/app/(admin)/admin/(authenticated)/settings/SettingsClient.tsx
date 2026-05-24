"use client";

import React, { useState, useTransition } from "react";
import { useAdminModal } from "@/context/AdminModalContext";
import type { GlobalSettings, AdminModerator } from "@/lib/services/settings.service";
import {
    saveSettingsAction,
    addModeratorAction,
    removeModeratorAction,
} from "@/app/actions/settings";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { PriceInput } from "@/components/ui/forms/PriceInput";

type Tab = "account" | "moderators";

export default function SettingsClient({
    initialSettings,
    initialModerators,
}: {
    initialSettings: GlobalSettings;
    initialModerators: AdminModerator[];
}) {
    const [activeTab, setActiveTab] = useState<Tab>("account");
    const { openModal, closeModal } = useAdminModal();
    const router = useRouter();

    const handleInviteModerator = () => {
        openModal(
            <AddModeratorForm
                onSuccess={() => {
                    closeModal();
                    router.refresh();
                }}
            />,
            {
                title: "Add New Moderator",
                description: "Appoint an existing user as a moderator",
            }
        );
    };

    return (
        <div className="flex flex-col gap-10 animate-fade-in max-w-5xl">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <h1 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-rw-ink tracking-tight uppercase">
                    Settings
                </h1>
                <p className="text-sm text-rw-muted font-medium italic">
                    Manage your profile, system configuration, and team permissions
                </p>
            </div>

            {/* Tab Navigation */}
            <div className="flex items-center gap-8 border-b border-[var(--rw-border)] pb-0">
                <button
                    onClick={() => setActiveTab("account")}
                    className={`pb-4 text-xs font-black uppercase tracking-[0.2em] transition-all relative ${activeTab === "account" ? "text-rw-crimson" : "text-rw-muted hover:text-rw-ink"}`}
                >
                    Account & Config
                    {activeTab === "account" && (
                        <div className="absolute bottom-0 left-0 w-full h-1 bg-rw-crimson rounded-t-full animate-in slide-in-from-bottom-1" />
                    )}
                </button>
                <button
                    onClick={() => setActiveTab("moderators")}
                    className={`pb-4 text-xs font-black uppercase tracking-[0.2em] transition-all relative ${activeTab === "moderators" ? "text-rw-crimson" : "text-rw-muted hover:text-rw-ink"}`}
                >
                    Manage Moderators
                    {activeTab === "moderators" && (
                        <div className="absolute bottom-0 left-0 w-full h-1 bg-rw-crimson rounded-t-full animate-in slide-in-from-bottom-1" />
                    )}
                </button>
            </div>

            {activeTab === "account" ? (
                <AccountSection settings={initialSettings} />
            ) : (
                <ModeratorsSection
                    moderators={initialModerators}
                    onInvite={handleInviteModerator}
                />
            )}
        </div>
    );
}

function AddModeratorForm({ onSuccess }: { onSuccess: () => void }) {
    const [email, setEmail] = useState("");
    const [isPending, startTransition] = useTransition();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        startTransition(async () => {
            const toastId = toast.loading("Appointing moderator...");
            const res = await addModeratorAction(email);
            if (res.success) {
                toast.success("Moderator appointed successfully.", { id: toastId });
                onSuccess();
            } else {
                toast.error(res.error || "Failed to appoint moderator.", { id: toastId });
            }
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 pb-6">
            <div className="space-y-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-rw-muted uppercase tracking-widest">
                        User Email Address
                    </label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="john@rcffuta.org"
                        className="rw-input"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-rw-muted uppercase tracking-widest">
                        Designated Role
                    </label>
                    <div className="rw-input bg-rw-bg-alt/50 flex items-center px-4 font-bold text-rw-ink uppercase tracking-widest text-[11px]">
                        Moderator
                    </div>
                </div>
            </div>
            <div className="p-6 bg-rw-bg-alt/50 rounded-2xl border border-[var(--rw-border)] border-dashed">
                <p className="text-[10px] text-rw-muted font-medium italic leading-relaxed text-center">
                    The user must already have logged into the platform at least once to
                    be appointed.
                </p>
            </div>
            <button
                type="submit"
                disabled={isPending}
                className="btn-primary w-full !h-14 font-display font-black uppercase tracking-widest text-xs shadow-xl shadow-rw-crimson/20 disabled:opacity-50"
            >
                {isPending ? "Appointing..." : "Add Moderator"}
            </button>
        </form>
    );
}

function AccountSection({ settings }: { settings: GlobalSettings }) {
    const [formState, setFormState] = useState(settings);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleSave = () => {
        startTransition(async () => {
            const toastId = toast.loading("Saving settings...");
            const res = await saveSettingsAction(formState);
            if (res.success) {
                toast.success("Settings saved successfully.", { id: toastId });
                router.refresh();
            } else {
                toast.error(res.error || "Failed to save settings.", { id: toastId });
            }
        });
    };

    return (
        <div className="max-w-3xl space-y-10">
            {/* Bank Config Card */}
            <section className="rw-card overflow-hidden border-none shadow-xl ring-1 ring-rw-ink/5">
                <div className="p-8 border-b border-[var(--rw-border)]">
                    <h3 className="font-display font-black text-xl text-rw-ink uppercase tracking-tight">
                        Financial Configuration
                    </h3>
                    <p className="text-xs text-rw-muted font-medium mt-1 italic">
                        These details are shown to customers on the checkout page.
                    </p>
                </div>
                <div className="p-8 space-y-8">
                    <div className="grid sm:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-rw-muted uppercase tracking-widest">
                                Receiving Bank
                            </label>
                            <input
                                type="text"
                                value={formState.bank_name}
                                onChange={(e) =>
                                    setFormState((s) => ({
                                        ...s,
                                        bank_name: e.target.value,
                                    }))
                                }
                                className="rw-input"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-rw-muted uppercase tracking-widest">
                                Account Number
                            </label>
                            <input
                                type="text"
                                value={formState.bank_account_number}
                                onChange={(e) =>
                                    setFormState((s) => ({
                                        ...s,
                                        bank_account_number: e.target.value,
                                    }))
                                }
                                className="rw-input"
                            />
                        </div>
                        <div className="space-y-2 sm:col-span-2">
                            <label className="text-[10px] font-black text-rw-muted uppercase tracking-widest">
                                Account Name
                            </label>
                            <input
                                type="text"
                                value={formState.bank_account_name}
                                onChange={(e) =>
                                    setFormState((s) => ({
                                        ...s,
                                        bank_account_name: e.target.value,
                                    }))
                                }
                                className="rw-input"
                            />
                        </div>
                    </div>

                    <div className="pt-4 space-y-6 border-t border-[var(--rw-border)] border-dashed">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-sm font-black text-rw-ink uppercase tracking-tight">
                                    Allow Installments
                                </p>
                                <p className="text-[10px] text-rw-muted font-bold uppercase tracking-widest">
                                    Enable partial payments with a minimum deposit amount
                                </p>
                            </div>
                            <div
                                onClick={() =>
                                    setFormState((s) => ({
                                        ...s,
                                        payment_installment_allowed:
                                            !s.payment_installment_allowed,
                                    }))
                                }
                                className={`h-8 w-14 rounded-full border p-1 flex items-center cursor-pointer transition-colors ${formState.payment_installment_allowed ? "bg-rw-crimson/10 border-rw-crimson/20" : "bg-gray-100 border-gray-300"}`}
                            >
                                <div
                                    className={`h-6 w-6 rounded-full shadow-md transition-transform ${formState.payment_installment_allowed ? "bg-rw-crimson translate-x-6" : "bg-gray-400 translate-x-0"}`}
                                />
                            </div>
                        </div>
                        <div
                            className={`space-y-2 max-w-[200px] transition-opacity ${formState.payment_installment_allowed ? "opacity-100" : "opacity-50 pointer-events-none"}`}
                        >
                            <label className="text-[10px] font-black text-rw-muted uppercase tracking-widest">
                                Min Deposit Amount
                            </label>
                            <div className="relative">
                                <PriceInput
                                    value={formState.payment_min_amount}
                                    onChange={(val) =>
                                        setFormState((s) => ({
                                            ...s,
                                            payment_min_amount:
                                                val === "" ? 0 : Number(val),
                                        }))
                                    }
                                    className="rw-input !pl-10 font-display font-black text-lg"
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={isPending}
                        className="btn-primary !h-12 !px-8 text-xs font-black uppercase tracking-widest shadow-lg shadow-rw-crimson/20 disabled:opacity-50"
                    >
                        {isPending ? "Saving..." : "Save Configuration"}
                    </button>
                </div>
            </section>
        </div>
    );
}

function ModeratorsSection({
    moderators,
    onInvite,
}: {
    moderators: AdminModerator[];
    onInvite: () => void;
}) {
    const router = useRouter();
    const [removingId, setRemovingId] = useState<string | null>(null);

    const handleRemove = async (id: string) => {
        if (!confirm("Are you sure you want to remove this moderator?")) return;
        setRemovingId(id);
        const toastId = toast.loading("Removing moderator...");
        const res = await removeModeratorAction(id);
        if (res.success) {
            toast.success("Moderator removed.", { id: toastId });
            router.refresh();
        } else {
            toast.error(res.error || "Failed to remove moderator.", { id: toastId });
        }
        setRemovingId(null);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                    <h3 className="font-display font-black text-2xl text-rw-ink uppercase tracking-tight">
                        Administrative Team
                    </h3>
                    <p className="text-xs text-rw-muted font-medium mt-1 italic">
                        Manage permissions and access levels for the dashboard
                    </p>
                </div>
                <button
                    onClick={onInvite}
                    className="h-12 px-8 rounded-2xl bg-rw-ink text-white font-display font-black uppercase tracking-widest text-xs hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-3 shadow-xl shadow-rw-ink/20"
                >
                    <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={3}
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 4v16m8-8H4"
                        />
                    </svg>
                    Add Moderator
                </button>
            </div>

            <div className="rw-card overflow-hidden border-none shadow-xl ring-1 ring-rw-ink/5 bg-white">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-rw-bg-alt/30 border-b border-[var(--rw-border)]">
                                <th className="px-8 py-5 text-left text-[10px] font-black text-rw-muted uppercase tracking-[0.2em]">
                                    Moderator
                                </th>
                                <th className="px-8 py-5 text-left text-[10px] font-black text-rw-muted uppercase tracking-[0.2em]">
                                    Role
                                </th>
                                <th className="px-8 py-5 text-left text-[10px] font-black text-rw-muted uppercase tracking-[0.2em]">
                                    Joined
                                </th>
                                <th className="px-8 py-5 text-right text-[10px] font-black text-rw-muted uppercase tracking-[0.2em]">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--rw-border)]">
                            {moderators.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="px-8 py-10 text-center text-sm text-rw-muted"
                                    >
                                        No moderators found.
                                    </td>
                                </tr>
                            ) : (
                                moderators.map((mod) => (
                                    <tr
                                        key={mod.id}
                                        className="hover:bg-rw-bg-alt/10 transition-colors group"
                                    >
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                {/* <div className="h-10 w-10 rounded-xl bg-rw-bg-alt flex items-center justify-center font-display font-black text-rw-ink text-sm border border-[var(--rw-border)] shadow-inner uppercase">
                                                {mod.profiles?.first_name?.[0] || mod.profiles?.email?.[0] || '?'}
                                            </div> */}
                                                <div>
                                                    <p className="font-display font-black text-rw-ink uppercase tracking-tight text-sm leading-none mb-1.5">
                                                        {mod.profiles?.first_name}{" "}
                                                        {mod.profiles?.last_name}
                                                    </p>
                                                    <p className="text-[10px] text-rw-muted font-bold uppercase tracking-widest">
                                                        {mod.profiles?.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span
                                                className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${mod.role === "ADMIN" ? "bg-rw-crimson/10 text-rw-crimson" : "bg-rw-ink/10 text-rw-ink"}`}
                                            >
                                                {mod.role}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="font-mono text-[11px] font-black text-rw-muted">
                                                {new Date(
                                                    mod.created_at
                                                ).toLocaleDateString()}
                                            </p>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            {mod.role !== "ADMIN" && (
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() =>
                                                            handleRemove(mod.id)
                                                        }
                                                        disabled={removingId === mod.id}
                                                        className="p-2 text-rw-muted hover:text-rw-crimson transition-colors disabled:opacity-50"
                                                        title="Remove Moderator"
                                                    >
                                                        <svg
                                                            className="h-4 w-4"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth={2}
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                            />
                                                        </svg>
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
