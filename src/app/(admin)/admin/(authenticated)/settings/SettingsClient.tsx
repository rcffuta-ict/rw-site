"use client";

import React, { useState } from "react";
import { AdminStats, AdminStatItem } from "@/components/admin/AdminStats";
import { useAdminModal } from "@/context/AdminModalContext";

type Tab = "account" | "moderators";

const MOCK_MODERATORS = [
    {
        id: 1,
        name: "Admin Sarah",
        email: "sarah@rcffuta.org",
        role: "Moderator",
        status: "active",
        joined: "2026-01-12",
    },
    {
        id: 2,
        name: "Logistics Lead",
        email: "logistics@rcffuta.org",
        role: "Moderator",
        status: "active",
        joined: "2026-02-05",
    },
    {
        id: 3,
        name: "Finance Officer",
        email: "finance@rcffuta.org",
        role: "Moderator",
        status: "inactive",
        joined: "2026-03-10",
    },
];

export default function SettingsClient() {
    const [activeTab, setActiveTab] = useState<Tab>("account");
    const { openModal } = useAdminModal();

    const handleInviteModerator = () => {
        openModal(
            <div className="space-y-8 pb-6">
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-rw-muted uppercase tracking-widest">
                            Moderator Name
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. John Doe"
                            className="rw-input"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-rw-muted uppercase tracking-widest">
                            Email Address
                        </label>
                        <input
                            type="email"
                            placeholder="john@rcffuta.org"
                            className="rw-input"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-rw-muted uppercase tracking-widest">
                            Access Password
                        </label>
                        <input
                            type="password"
                            placeholder="••••••••"
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
                        The new moderator will be able to log in immediately with these
                        credentials.
                    </p>
                </div>
                <button className="btn-primary w-full !h-14 font-display font-black uppercase tracking-widest text-xs shadow-xl shadow-rw-crimson/20">
                    Add Moderator
                </button>
            </div>,
            {
                title: "Add New Moderator",
                description: "Register a new administrative account for the dashboard",
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
                <AccountSection />
            ) : (
                <ModeratorsSection onInvite={handleInviteModerator} />
            )}
        </div>
    );
}

function AccountSection() {
    return (
        <>
            {/* Content: Financial Config Only */}
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
                                    defaultValue="First Bank"
                                    className="rw-input"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-rw-muted uppercase tracking-widest">
                                    Account Number
                                </label>
                                <input
                                    type="text"
                                    defaultValue="3012345678"
                                    className="rw-input"
                                />
                            </div>
                            <div className="space-y-2 sm:col-span-2">
                                <label className="text-[10px] font-black text-rw-muted uppercase tracking-widest">
                                    Account Name
                                </label>
                                <input
                                    type="text"
                                    defaultValue="RCF FUTA"
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
                                        Enable partial payments with a minimum deposit
                                    </p>
                                </div>
                                <div className="h-8 w-14 bg-rw-crimson/10 rounded-full border border-rw-crimson/20 p-1 flex items-center cursor-pointer">
                                    <div className="h-6 w-6 bg-rw-crimson rounded-full shadow-md ml-auto" />
                                </div>
                            </div>
                            <div className="space-y-2 max-w-[200px]">
                                <label className="text-[10px] font-black text-rw-muted uppercase tracking-widest">
                                    Min Deposit Amount (₦)
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-display font-black text-rw-muted">
                                        ₦
                                    </span>
                                    <input
                                        type="number"
                                        defaultValue="5000"
                                        className="rw-input pl-10 font-display font-black text-lg"
                                    />
                                </div>
                            </div>
                        </div>

                        <button className="btn-primary !h-12 !px-8 text-xs font-black uppercase tracking-widest shadow-lg shadow-rw-crimson/20">
                            Save Configuration
                        </button>
                    </div>
                </section>
            </div>
        </>
    );
}

function ModeratorsSection({ onInvite }: { onInvite: () => void }) {
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
                                    Status
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
                            {MOCK_MODERATORS.map((mod) => (
                                <tr
                                    key={mod.id}
                                    className="hover:bg-rw-bg-alt/10 transition-colors group"
                                >
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-xl bg-rw-bg-alt flex items-center justify-center font-display font-black text-rw-ink text-sm border border-[var(--rw-border)] shadow-inner">
                                                {mod.name
                                                    .split(" ")
                                                    .map((n) => n[0])
                                                    .join("")}
                                            </div>
                                            <div>
                                                <p className="font-display font-black text-rw-ink uppercase tracking-tight text-sm leading-none mb-1.5">
                                                    {mod.name}
                                                </p>
                                                <p className="text-[10px] text-rw-muted font-bold uppercase tracking-widest">
                                                    {mod.email}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span
                                            className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${mod.role === "Super Admin" ? "bg-rw-crimson/10 text-rw-crimson" : "bg-rw-ink/10 text-rw-ink"}`}
                                        >
                                            {mod.role}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            <div
                                                className={`h-1.5 w-1.5 rounded-full ${mod.status === "active" ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" : "bg-rw-muted"}`}
                                            />
                                            <span className="text-[10px] font-black text-rw-ink uppercase tracking-widest">
                                                {mod.status}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className="font-mono text-[11px] font-black text-rw-muted">
                                            {mod.joined}
                                        </p>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                className="p-2 text-rw-muted hover:text-rw-crimson transition-colors"
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
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
