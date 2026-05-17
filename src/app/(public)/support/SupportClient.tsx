"use client";

import Link from "next/link";
import { useState } from "react";
import {
    TENURE,
    FELLOWSHIP,
    SUPPORT_ACCOUNT,
    PROSPECTUS_URL,
    CONTACTS,
} from "@/lib/config";
import { SPONSORS } from "@/lib/data/info";

// ─── Tier badge colors ────────────────────────────────────────────────────────
const TIER_STYLES: Record<string, { accent: string; glow: string }> = {
    Diamond: { accent: "#5b7fff", glow: "rgba(91,127,255,0.15)" },
    Gold: { accent: "#FF6A00", glow: "rgba(255,106,0,0.15)" },
    Silver: { accent: "#9a8085", glow: "rgba(154,128,133,0.1)" },
    Bronze: { accent: "#cc6633", glow: "rgba(204,102,51,0.12)" },
};

function CopyButton({ text }: { text: string }) {
    const [copied, setCopied] = useState(false);
    const copy = async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (
        <button
            onClick={copy}
            className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg
                       border border-[#e8d0d4] text-rw-text-2 hover:border-[#FF0015] hover:text-[#FF0015]
                       transition-all duration-200"
        >
            {copied ? (
                <>
                    <svg
                        className="h-3.5 w-3.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2.5}
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m4.5 12.75 6 6 9-13.5"
                        />
                    </svg>
                    Copied!
                </>
            ) : (
                <>
                    <svg
                        className="h-3.5 w-3.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184"
                        />
                    </svg>
                    Copy
                </>
            )}
        </button>
    );
}

export function SupportClient() {
    const handleProspectus = () => {
        if (PROSPECTUS_URL) {
            window.open(PROSPECTUS_URL, "_blank");
        } else {
            alert(
                "The 2026 Sponsorship Prospectus is being finalized.\n\nContact our committee leads listed below and they'll send it immediately."
            );
        }
    };

    return (
        <div className="min-h-screen bg-white">
            {/* ── Hero ──────────────────────────────────────────────────────── */}
            <div className="relative overflow-hidden bg-white border-b border-[#e8d0d4]">
                <div className="absolute inset-0 bg-gradient-to-br from-[#FF0015]/4 via-white to-[#FF6A00]/4 pointer-events-none" />
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#FF0015]/5 rounded-full blur-[120px] -translate-y-1/3 translate-x-1/4 pointer-events-none" />
                <div className="section-container py-20 relative z-10">
                    <p className="eyebrow mb-4">Support the Vision</p>
                    <h1 className="section-heading text-4xl sm:text-5xl lg:text-6xl max-w-[18ch]">
                        Be Part of
                        <br />
                        <span
                            style={{
                                background: "linear-gradient(135deg, #FF0015, #FF6A00)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                backgroundClip: "text",
                            }}
                        >
                            Something Greater
                        </span>
                    </h1>
                    <p className="mt-6 text-rw-text-2 text-lg leading-relaxed max-w-[52ch]">
                        Redemption Week {TENURE.shortYear} is the{" "}
                        {TENURE.anniversaryLabel} of {FELLOWSHIP.shortName} — a milestone
                        celebration of faith, community, and legacy. Your support makes it
                        possible.
                    </p>

                    {/* Two paths */}
                    <div className="mt-10 flex flex-wrap gap-4">
                        <a href="#organisations" className="btn-primary shadow-md">
                            For Organisations
                        </a>
                        <a href="#individuals" className="btn-secondary">
                            For Individuals
                        </a>
                    </div>

                    {/* Quick stats */}
                    <div className="mt-12 flex flex-wrap gap-6">
                        {[
                            { value: FELLOWSHIP.stats.alumni, label: "Alumni Network" },
                            { value: FELLOWSHIP.stats.members, label: "Active Members" },
                            { value: "7 Nights", label: "of Programming" },
                            { value: `${TENURE.anniversary} Years`, label: "of Impact" },
                        ].map((s) => (
                            <div key={s.label} className="flex flex-col">
                                <span className="font-display font-extrabold text-2xl text-[#FF0015]">
                                    {s.value}
                                </span>
                                <span className="text-xs text-rw-muted font-medium mt-0.5">
                                    {s.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="section-container py-20 flex flex-col gap-24">
                {/* ── ORGANISATIONS ─────────────────────────────────────────── */}
                <section id="organisations" className="scroll-mt-24">
                    <div className="mb-12">
                        <div
                            className="inline-flex items-center gap-2 rounded-full bg-[#1C0003] text-white
                                        px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] mb-5"
                        >
                            <svg
                                className="h-3.5 w-3.5"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21"
                                />
                            </svg>
                            For Organisations
                        </div>
                        <h2 className="section-heading text-3xl sm:text-4xl">
                            Partner With Us
                        </h2>
                        <p className="mt-4 text-rw-text-2 text-lg leading-relaxed max-w-[52ch]">
                            Connect your brand with over 900 active students and{" "}
                            {FELLOWSHIP.stats.alumni} alumni through our sponsorship
                            tiers. Download our prospectus for full details.
                        </p>
                        <div className="mt-6 flex flex-wrap gap-3">
                            <button
                                onClick={handleProspectus}
                                className="inline-flex items-center gap-2 h-11 px-6 rounded-xl font-bold text-sm
                                           bg-[#1C0003] text-white hover:bg-[#FF0015] transition-all shadow-sm
                                           hover:shadow-[0_4px_16px_rgba(255,0,21,0.3)]"
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
                                        d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                                    />
                                </svg>
                                Download Prospectus
                            </button>
                            <a
                                href={`mailto:${CONTACTS[0].email}?subject=Sponsorship Inquiry — RW${TENURE.shortYear}`}
                                className="inline-flex items-center gap-2 h-11 px-6 rounded-xl font-semibold text-sm
                                           border border-[#e8d0d4] text-rw-text-2 hover:border-[#FF0015] hover:text-[#FF0015] transition-all"
                            >
                                Contact Committee
                            </a>
                        </div>
                    </div>

                    {/* Sponsor tiers */}
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {SPONSORS.map((s) => {
                            const style = TIER_STYLES[s.tier] ?? {
                                accent: "#9a8085",
                                glow: "rgba(0,0,0,0.05)",
                            };
                            return (
                                <div
                                    key={s.tier}
                                    className={`rw-card group p-7 flex flex-col gap-5 transition-all duration-400 hover:-translate-y-1.5 ${
                                        s.highlight
                                            ? "ring-2 ring-[#FF0015] shadow-lg"
                                            : ""
                                    }`}
                                    style={
                                        s.highlight
                                            ? {
                                                  boxShadow: `0 0 0 2px #FF0015, ${`0 12px 40px rgba(255,0,21,0.1)`}`,
                                              }
                                            : undefined
                                    }
                                >
                                    {s.highlight && (
                                        <span
                                            className="self-start text-[10px] font-bold uppercase tracking-widest
                                                         bg-[#FF0015] text-white px-2.5 py-1 rounded-full"
                                        >
                                            Most Impactful
                                        </span>
                                    )}
                                    <div>
                                        <p
                                            className="text-[11px] font-bold uppercase tracking-[0.18em]"
                                            style={{ color: style.accent }}
                                        >
                                            {s.tier} Tier
                                        </p>
                                        <p className="font-display font-bold text-[#1C0003] text-3xl mt-1">
                                            {s.amount}
                                        </p>
                                    </div>
                                    <div className="h-px bg-[#e8d0d4]" />
                                    <ul className="flex flex-col gap-2.5 flex-1">
                                        {s.perks.map((perk) => (
                                            <li
                                                key={perk}
                                                className="flex items-start gap-2.5 text-sm text-rw-text-2"
                                            >
                                                <div
                                                    className="h-4 w-4 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                                                    style={{
                                                        background: `${style.accent}20`,
                                                    }}
                                                >
                                                    <svg
                                                        className="h-2.5 w-2.5"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth={3}
                                                        viewBox="0 0 24 24"
                                                        style={{ color: style.accent }}
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="m4.5 12.75 6 6 9-13.5"
                                                        />
                                                    </svg>
                                                </div>
                                                {perk}
                                            </li>
                                        ))}
                                    </ul>
                                    <a
                                        href={`mailto:${CONTACTS[0].email}?subject=Sponsorship Interest: ${s.tier} Tier — RW${TENURE.shortYear}`}
                                        className="mt-2 flex h-10 items-center justify-center rounded-xl text-sm font-bold
                                                   transition-all border"
                                        style={{
                                            background: s.highlight ? "#FF0015" : "white",
                                            color: s.highlight ? "white" : style.accent,
                                            borderColor: s.highlight
                                                ? "#FF0015"
                                                : `${style.accent}40`,
                                        }}
                                    >
                                        Select {s.tier}
                                    </a>
                                </div>
                            );
                        })}
                    </div>

                    {/* Contact leads */}
                    <div className="mt-10 grid sm:grid-cols-2 gap-5 max-w-2xl">
                        {CONTACTS.map((c) => (
                            <div key={c.name} className="rw-card p-6">
                                <p className="text-[10px] font-bold uppercase tracking-wider text-[#FF0015] mb-2">
                                    {c.title}
                                </p>
                                <p className="font-display font-bold text-[#1C0003] text-lg">
                                    {c.name}
                                </p>
                                <div className="mt-3 flex flex-col gap-1">
                                    <a
                                        href={`tel:${c.phone}`}
                                        className="text-sm text-rw-text-2 hover:text-[#1C0003] transition-colors"
                                    >
                                        {c.phone}
                                    </a>
                                    <a
                                        href={`mailto:${c.email}`}
                                        className="text-sm text-[#FF0015] hover:underline"
                                    >
                                        {c.email}
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-[#e8d0d4] to-transparent" />

                {/* ── INDIVIDUALS ───────────────────────────────────────────── */}
                <section id="individuals" className="scroll-mt-24">
                    <div className="mb-12">
                        <div
                            className="inline-flex items-center gap-2 rounded-full bg-[#FF0015] text-white
                                        px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] mb-5"
                        >
                            <svg
                                className="h-3.5 w-3.5"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                                />
                            </svg>
                            For Individuals
                        </div>
                        <h2 className="section-heading text-3xl sm:text-4xl">
                            Give as an Individual
                        </h2>
                        <p className="mt-4 text-rw-text-2 text-lg leading-relaxed max-w-[52ch]">
                            Every gift — big or small — goes directly toward making
                            Redemption Week {TENURE.shortYear}
                            an experience that transforms lives. No amount is too little.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-[1fr_440px] gap-10 items-start">
                        {/* Left: account card */}
                        <div>
                            {/* Main account card */}
                            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1C0003] to-[#3d0008] p-8 text-white shadow-2xl">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF0015]/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
                                <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#FF6A00]/10 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/2" />

                                <div className="relative z-10">
                                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50 mb-6">
                                        Individual Support Account
                                    </p>

                                    <div className="space-y-5">
                                        <div>
                                            <p className="text-xs text-white/40 mb-1 uppercase tracking-wide font-semibold">
                                                Bank
                                            </p>
                                            <p className="font-bold text-white text-xl">
                                                {SUPPORT_ACCOUNT.bankName}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-white/40 mb-1 uppercase tracking-wide font-semibold">
                                                Account Number
                                            </p>
                                            <div className="flex items-center gap-3">
                                                <p className="font-mono font-bold text-white text-3xl tracking-[0.18em]">
                                                    {SUPPORT_ACCOUNT.accountNumber}
                                                </p>
                                                <CopyButton
                                                    text={SUPPORT_ACCOUNT.accountNumber}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-xs text-white/40 mb-1 uppercase tracking-wide font-semibold">
                                                Account Name
                                            </p>
                                            <p className="font-bold text-white text-lg">
                                                {SUPPORT_ACCOUNT.accountName}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-8 pt-6 border-t border-white/10">
                                        <p className="text-xs text-white/40 leading-relaxed">
                                            ⚠️ This account is for{" "}
                                            <strong className="text-white/70">
                                                individual donations only
                                            </strong>
                                            , not for merchandise payments. For merch
                                            orders, visit{" "}
                                            <Link
                                                href="/fulfil"
                                                className="text-[#FF6A00] hover:underline"
                                            >
                                                /fulfil
                                            </Link>
                                            .
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Suggested amounts */}
                            <div className="mt-6">
                                <p className="text-sm font-bold text-rw-text-2 mb-3">
                                    Suggested gift amounts
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {[
                                        "₦1,000",
                                        "₦2,500",
                                        "₦5,000",
                                        "₦10,000",
                                        "₦25,000",
                                        "₦50,000",
                                    ].map((amt) => (
                                        <span
                                            key={amt}
                                            className="inline-flex items-center px-4 py-2 rounded-xl border border-[#e8d0d4]
                                                                   bg-white text-sm font-semibold text-[#1C0003]
                                                                   hover:border-[#FF0015] hover:text-[#FF0015] transition-all cursor-default"
                                        >
                                            {amt}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right: why give + steps */}
                        <div className="flex flex-col gap-6">
                            <div className="rw-card p-7">
                                <h3 className="font-display font-bold text-[#1C0003] text-xl mb-5">
                                    Why Your Gift Matters
                                </h3>
                                <div className="flex flex-col gap-5">
                                    {[
                                        {
                                            icon: "🎤",
                                            title: "Logistics & Production",
                                            desc: "Sound systems, lighting, staging, and all the tech that makes each night powerful.",
                                        },
                                        {
                                            icon: "🎨",
                                            title: "Creative Arts",
                                            desc: "Drama props, choir costumes, instruments, and materials for the arts units.",
                                        },
                                        {
                                            icon: "🌍",
                                            title: "Outreach & Welfare",
                                            desc: "Transport, feeding, and accommodation for attendees who travel from afar.",
                                        },
                                        {
                                            icon: "📸",
                                            title: "Documentation",
                                            desc: "Photography and videography to preserve memories for generations.",
                                        },
                                    ].map((item) => (
                                        <div key={item.title} className="flex gap-4">
                                            <span className="text-2xl shrink-0">
                                                {item.icon}
                                            </span>
                                            <div>
                                                <p className="font-bold text-[#1C0003] text-sm">
                                                    {item.title}
                                                </p>
                                                <p className="text-xs text-rw-text-2 mt-1 leading-relaxed">
                                                    {item.desc}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="rounded-2xl bg-[#fdf8f8] border border-[#e8d0d4] p-6">
                                <p className="text-[11px] font-bold uppercase tracking-wider text-rw-muted mb-3">
                                    After you give
                                </p>
                                <ol className="flex flex-col gap-3">
                                    {[
                                        "Transfer to the account above",
                                        "Screenshot your receipt",
                                        "Send to our committee on WhatsApp / email",
                                        "We'll acknowledge within 2 hours 🙏",
                                    ].map((step, i) => (
                                        <li
                                            key={i}
                                            className="flex items-start gap-3 text-sm text-rw-text-2"
                                        >
                                            <span
                                                className="shrink-0 h-5 w-5 rounded-full bg-[#FF0015]/10 text-[#FF0015]
                                                             flex items-center justify-center text-[10px] font-bold mt-0.5"
                                            >
                                                {i + 1}
                                            </span>
                                            {step}
                                        </li>
                                    ))}
                                </ol>
                                <div className="mt-5 pt-5 border-t border-[#e8d0d4]">
                                    <a
                                        href={`mailto:${CONTACTS[0].email}?subject=Individual Support — RW${TENURE.shortYear}`}
                                        className="flex items-center justify-center gap-2 h-10 w-full rounded-xl
                                                   bg-[#FF0015] text-white text-sm font-bold hover:bg-[#cc0011] transition-all"
                                    >
                                        Notify the Committee
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
