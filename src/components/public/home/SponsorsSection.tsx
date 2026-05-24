"use client";

import { useState } from "react";
import { TENURE, FELLOWSHIP, SUPPORT_ACCOUNT, PROSPECTUS_URL, LOGOS } from "@/lib/config";
import { SPONSORS, CONTACTS } from "@/lib/data/info";

const TIER_STYLES: Record<string, { accent: string }> = {
    Diamond: { accent: "#5b7fff" },
    Gold: { accent: "#FF6A00" },
    Silver: { accent: "#9a8085" },
    Bronze: { accent: "#cc6633" },
};

const WHY_SUPPORT = [
    {
        icon: "🎤",
        title: "7 Nights of Events",
        desc: "Sound systems, lighting, staging — all powered by partner support.",
    },
    {
        icon: "🎨",
        title: "Creative Arts",
        desc: "Drama, choir, and instruments for over 900 active members performing live.",
    },
    {
        icon: "🌍",
        title: "Outreach & Welfare",
        desc: "Transport and welfare for attendees travelling from across the country.",
    },
    {
        icon: "📸",
        title: "Documentation",
        desc: `Photography and film to preserve ${TENURE.anniversaryLabel} for generations.`,
    },
];

function CopyButton({ text }: { text: string }) {
    const [copied, setCopied] = useState(false);
    return (
        <button
            onClick={async () => {
                await navigator.clipboard.writeText(text);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            }}
            className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border border-white/20 text-white/70 hover:border-white/50 hover:text-white transition-all"
        >
            {copied ? "✓ Copied!" : "Copy"}
        </button>
    );
}

export function SponsorsSection() {
    const handleProspectus = () => {
        if (PROSPECTUS_URL) window.open(PROSPECTUS_URL, "_blank");
        else
            alert(
                "The 2026 Sponsorship Prospectus is being finalized.\n\nContact our committee leads and they'll send it immediately."
            );
    };

    return (
        <section id="support" className="scroll-mt-16 overflow-hidden">
            {/* ── 1. Logo tray ── */}
            <div className="bg-[#fdf8f8] border-y border-[#e8d0d4] py-10">
                <div className="section-container">
                    <p className="text-center text-[10px] font-bold uppercase tracking-[0.22em] text-[#9a8085] mb-8">
                        Presented by
                    </p>
                    <div className="flex items-center gap-6 sm:gap-14 overflow-x-auto scrollbar-hide pb-2 justify-start sm:justify-center flex-nowrap sm:flex-wrap px-2 sm:px-0">
                        {[
                            { src: LOGOS.rcfFuta, alt: "RCF FUTA", h: "h-10" },
                            { src: LOGOS.crm, alt: "Christ the Redeemers'", h: "h-9" },
                            {
                                src: LOGOS.redemptionWeek,
                                alt: "Redemption Week '26",
                                h: "h-12",
                            },
                            {
                                src: LOGOS.anniversary,
                                alt: "38th Anniversary",
                                h: "h-12",
                            },
                            {
                                src: LOGOS.tenureIcon,
                                alt: "The Lord's Witnesses",
                                h: "h-10",
                            },
                        ].map((l) => (
                            <img
                                key={l.alt}
                                src={l.src}
                                alt={l.alt}
                                className={`${l.h} w-auto object-contain opacity-60 hover:opacity-100 transition-opacity grayscale hover:grayscale-0`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* ── 2. Header ── */}
            <div className="bg-white section-py">
                <div className="section-container">
                    <div className="max-w-3xl mx-auto text-center mb-16">
                        <p className="eyebrow mb-4 !text-[#FF0015]">Support the Vision</p>
                        <h2 className="section-heading text-4xl sm:text-5xl lg:text-6xl text-[#1C0003] mb-6">
                            Partner With Us
                        </h2>
                        <p className="text-[#5c4048] text-lg leading-relaxed">
                            {TENURE.eventName} {TENURE.shortYear} is the{" "}
                            {TENURE.anniversaryLabel} of {FELLOWSHIP.shortName} — a
                            milestone of faith and legacy. Your support — big or small —
                            makes it possible.
                        </p>
                    </div>

                    {/* Stats row */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-20">
                        {[
                            { value: FELLOWSHIP.stats.alumni, label: "Alumni Network" },
                            { value: FELLOWSHIP.stats.members, label: "Active Members" },
                            { value: "7 Nights", label: "of Live Events" },
                            { value: `${TENURE.anniversary} Years`, label: "of Impact" },
                        ].map((s) => (
                            <div
                                key={s.label}
                                className="rounded-2xl border border-[#e8d0d4] bg-[#fdf8f8] px-5 py-6 text-center"
                            >
                                <p className="font-display font-extrabold text-3xl text-[#FF0015] mb-1">
                                    {s.value}
                                </p>
                                <p className="text-xs text-[#9a8085] font-semibold uppercase tracking-wide">
                                    {s.label}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Why Support */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-20">
                        {WHY_SUPPORT.map((w) => (
                            <div
                                key={w.title}
                                className="rounded-2xl border border-[#e8d0d4] bg-white p-6 hover:shadow-md hover:border-[#FF0015]/20 transition-all"
                            >
                                <span className="text-3xl block mb-4">{w.icon}</span>
                                <p className="font-bold text-[#1C0003] text-sm mb-2">
                                    {w.title}
                                </p>
                                <p className="text-xs text-[#5c4048] leading-relaxed">
                                    {w.desc}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* ── 3. Individual giving — full width ── */}
                    <div className="relative overflow-hidden rounded-3xl bg-[#1C0003] mb-6">
                        {/* Glows */}
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FF0015]/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#FF6A00]/8 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/4 pointer-events-none" />

                        <div className="relative z-10 px-8 py-16 md:px-16 md:py-24 lg:px-20 lg:py-28">
                            {/* Label */}
                            <div className="inline-flex items-center gap-2 rounded-full bg-[#FF0015]/20 border border-[#FF0015]/30 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-white mb-8">
                                For Individuals
                            </div>

                            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                                {/* Left copy */}
                                <div>
                                    <h3
                                        className="font-display font-extrabold text-white leading-[0.92] tracking-tight mb-6"
                                        style={{ fontSize: "clamp(2.2rem, 5vw, 4rem)" }}
                                    >
                                        Give directly.
                                        <br />
                                        <span
                                            style={{
                                                background:
                                                    "linear-gradient(135deg,#FF6A00,#FF0015)",
                                                WebkitBackgroundClip: "text",
                                                WebkitTextFillColor: "transparent",
                                                backgroundClip: "text",
                                            }}
                                        >
                                            Every gift counts.
                                        </span>
                                    </h3>
                                    <p className="text-white/80 text-lg leading-relaxed mb-8 max-w-[40ch]">
                                        Transfer your gift to the account below, then
                                        reach out to our committee — via WhatsApp or email
                                        — so we can acknowledge you properly. No receipts
                                        needed, just a quick message.
                                    </p>
                                    {/* Suggested amounts */}
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-3">
                                            Suggested amounts
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {[
                                                "₦1,000",
                                                "₦2,500",
                                                "₦5,000",
                                                "₦10,000",
                                                "₦25,000",
                                                "₦50,000+",
                                            ].map((a) => (
                                                <span
                                                    key={a}
                                                    className="px-4 py-2 rounded-xl border border-white/15 text-sm font-semibold text-white/70 hover:border-white/40 hover:text-white transition-all cursor-default"
                                                >
                                                    {a}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Right — account card */}
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
                                    <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#FF9A44] mb-6">
                                        Support Account
                                    </p>
                                    <div className="space-y-6 mb-8">
                                        <div>
                                            <p className="text-[10px] text-white/60 mb-1 uppercase tracking-wide font-bold">
                                                Bank
                                            </p>
                                            <p className="font-bold text-white text-xl">
                                                {SUPPORT_ACCOUNT.bankName}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-white/60 mb-2 uppercase tracking-wide font-bold">
                                                Account Number
                                            </p>
                                            <div className="flex items-center gap-3">
                                                <p className="font-mono font-bold text-white text-xl sm:text-3xl tracking-[0.15em]">
                                                    {SUPPORT_ACCOUNT.accountNumber}
                                                </p>
                                                <CopyButton
                                                    text={SUPPORT_ACCOUNT.accountNumber}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-white/60 mb-1 uppercase tracking-wide font-bold">
                                                Account Name
                                            </p>
                                            <p className="font-bold text-white text-lg">
                                                {SUPPORT_ACCOUNT.accountName}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="pt-6 border-t border-white/15">
                                        <p className="text-xs text-white/60 leading-relaxed">
                                            ⚠️ This account is for{" "}
                                            <strong className="text-white/80">
                                                individual support only
                                            </strong>{" "}
                                            — not merch payments. After transferring,
                                            simply message one of our contacts below.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── 4. Divider ── */}
                    <div className="flex items-center gap-4 my-16">
                        <div className="flex-1 h-px bg-[#e8d0d4]" />
                        <p className="text-[11px] font-bold uppercase tracking-widest text-[#9a8085] shrink-0">
                            Or become an organisational sponsor
                        </p>
                        <div className="flex-1 h-px bg-[#e8d0d4]" />
                    </div>

                    {/* ── 5. Corporate tiers ── */}
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
                        <div>
                            <h3 className="font-display font-bold text-2xl sm:text-3xl text-[#1C0003] mb-2">
                                Corporate Sponsorship
                            </h3>
                            <p className="text-[#5c4048] text-base max-w-[50ch]">
                                Connect your brand with {FELLOWSHIP.stats.members} active
                                students and {FELLOWSHIP.stats.alumni} alumni across a
                                full week.
                            </p>
                        </div>
                        <button
                            onClick={handleProspectus}
                            className="shrink-0 inline-flex items-center gap-2 h-11 px-7 rounded-xl font-bold text-sm bg-[#FF0015] text-white hover:bg-[#cc0011] transition-all shadow-[0_4px_16px_rgba(255,0,21,0.3)] hover:shadow-[0_6px_24px_rgba(255,0,21,0.4)]"
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
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-20">
                        {SPONSORS.map((s) => {
                            const style = TIER_STYLES[s.tier] ?? { accent: "#9a8085" };
                            return (
                                <div
                                    key={s.tier}
                                    className={`flex flex-col gap-5 bg-white rounded-2xl border p-7 transition-all duration-300 hover:-translate-y-1 ${
                                        s.highlight
                                            ? "ring-2 ring-[#FF0015] border-transparent shadow-[0_12px_40px_rgba(255,0,21,0.1)]"
                                            : "border-[#e8d0d4] hover:shadow-md"
                                    }`}
                                >
                                    {s.highlight && (
                                        <span className="self-start text-[10px] font-bold uppercase tracking-widest bg-[#FF0015] text-white px-3 py-1 rounded-full">
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
                                    <div className="h-px bg-[#f4eced]" />
                                    <ul className="flex flex-col gap-2.5 flex-1">
                                        {s.perks.map((perk) => (
                                            <li
                                                key={perk}
                                                className="flex items-start gap-2.5 text-sm text-[#5c4048]"
                                            >
                                                <div
                                                    className="h-4 w-4 rounded-full shrink-0 mt-0.5 flex items-center justify-center"
                                                    style={{
                                                        background: `${style.accent}18`,
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
                                        href={`mailto:${CONTACTS[0].email}?subject=Sponsorship: ${s.tier} Tier — RW${TENURE.shortYear}`}
                                        className="flex h-11 items-center justify-center rounded-xl text-sm font-bold border transition-all"
                                        style={{
                                            background: s.highlight
                                                ? "#FF0015"
                                                : "transparent",
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

                    {/* ── 6. Contacts ── */}
                    <div className="rounded-3xl bg-[#1C0003] overflow-hidden">
                        <div className="px-5 py-10 md:px-14 md:py-16 lg:px-16 lg:py-20">
                            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#FF9A44] mb-3">
                                Reach out directly
                            </p>
                            <h3 className="font-display font-bold text-white text-2xl sm:text-3xl mb-10">
                                Contact our committee
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                {CONTACTS.map((c) => (
                                    <div
                                        key={c.name}
                                        className="rounded-2xl bg-white/8 border border-white/15 p-6 md:p-8 flex flex-col gap-5 hover:bg-white/10 transition-colors"
                                    >
                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-[#FF6A00] mb-1">
                                                {c.title}
                                            </p>
                                            <p className="font-display font-bold text-white text-xl">
                                                {c.name}
                                            </p>
                                        </div>
                                        <div className="flex flex-col gap-3">
                                            <a
                                                href={`https://wa.me/${c.phone.replace(/\D/g, "")}?text=Hi, I'd like to support RW${TENURE.shortYear}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="flex items-center gap-3 rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-sm font-semibold text-rw-bg-alt hover:bg-[#25D366]/20 hover:border-[#25D366]/40 transition-all overflow-hidden"
                                            >
                                                <svg
                                                    className="h-4 w-4 text-[#25D366] shrink-0"
                                                    fill="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                                                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.852L0 24l6.335-1.508A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 0 1-5.006-1.368l-.36-.214-3.72.885.938-3.615-.235-.374A9.79 9.79 0 0 1 2.182 12C2.182 6.57 6.57 2.182 12 2.182 17.43 2.182 21.818 6.57 21.818 12c0 5.43-4.388 9.818-9.818 9.818z" />
                                                </svg>
                                                <span className="truncate">WhatsApp — {c.phone}</span>
                                            </a>
                                            <a
                                                href={`mailto:${c.email}?subject=Support Inquiry — RW${TENURE.shortYear}`}
                                                className="flex items-center gap-3 rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-sm font-semibold text-white hover:bg-[#FF0015]/20 hover:border-[#FF0015]/40 transition-all overflow-hidden"
                                            >
                                                <svg
                                                    className="h-4 w-4 text-[#FF6A00] shrink-0"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth={1.8}
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                                                    />
                                                </svg>
                                                <span className="truncate">{c.email}</span>
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
