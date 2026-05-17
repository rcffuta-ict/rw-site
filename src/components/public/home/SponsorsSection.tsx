"use client";

import { useState } from "react";
import { ph } from "@/lib/utils/functions";
import { TENURE, FELLOWSHIP, SUPPORT_ACCOUNT, PROSPECTUS_URL } from "@/lib/config";
import { SPONSORS, CONTACTS } from "@/lib/data/info";
import { Button } from "@/components/ui/forms/Button";

const TIER_STYLES: Record<string, { accent: string }> = {
    Diamond: { accent: "#5b7fff" },
    Gold:    { accent: "#FF6A00" },
    Silver:  { accent: "#9a8085" },
    Bronze:  { accent: "#cc6633" },
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
                       transition-all duration-200 bg-white"
        >
            {copied ? (
                <>
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    Copied!
                </>
            ) : (
                <>
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
                    </svg>
                    Copy
                </>
            )}
        </button>
    );
}

export function SponsorsSection() {
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
        <section id="support" className="bg-[#fdf8f8] section-py-lg overflow-hidden border-t border-[#e8d0d4] scroll-mt-16">
            <div className="section-container relative">
                {/* Header */}
                <div className="mb-16 text-center max-w-3xl mx-auto">
                    <p className="eyebrow mb-4 !text-[#FF0015]">
                        Support the Vision
                    </p>
                    <h2 className="section-heading text-4xl sm:text-5xl lg:text-6xl mb-6 text-[#1C0003]">
                        Partner With Us
                    </h2>
                    <p className="text-[#5c4048] text-lg lg:text-xl leading-relaxed">
                        Redemption Week {TENURE.shortYear} is a milestone celebration of faith, community, and legacy. 
                        Whether you&apos;re an organization or an individual, your support makes it all possible.
                    </p>
                </div>

                {/* Individual Support Box */}
                <div className="max-w-4xl mx-auto mb-20">
                    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1C0003] to-[#3d0008] p-8 md:p-10 text-white shadow-xl">
                        {/* Glows */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF0015]/15 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#FF6A00]/15 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

                        <div className="relative z-10 flex flex-col md:flex-row gap-10 items-center justify-between">
                            <div className="flex-1">
                                <div className="inline-flex items-center gap-2 rounded-full bg-[#FF0015]/20 border border-[#FF0015]/30 text-white
                                                px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] mb-5">
                                    For Individuals
                                </div>
                                <h3 className="font-display font-bold text-3xl mb-3">
                                    Give directly
                                </h3>
                                <p className="text-white/70 text-sm leading-relaxed mb-6 max-w-[40ch]">
                                    Every gift goes directly toward logistics, outreach, and making this week transformative. 
                                    (For merch orders, use the shop instead).
                                </p>
                                
                                {/* Steps */}
                                <div className="flex flex-col gap-3">
                                    <div className="flex items-center gap-3">
                                        <div className="h-6 w-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-[#FF6A00]">1</div>
                                        <p className="text-sm font-medium text-white/90">Transfer your gift</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="h-6 w-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-[#FF6A00]">2</div>
                                        <p className="text-sm font-medium text-white/90">Send receipt to our leads</p>
                                    </div>
                                </div>
                            </div>

                            {/* Account Details */}
                            <div className="shrink-0 w-full md:w-[340px] bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#FF6A00] mb-5">
                                    Support Account
                                </p>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-[10px] text-white/50 mb-1 uppercase tracking-wider font-bold">Bank</p>
                                        <p className="font-bold text-white text-lg">{SUPPORT_ACCOUNT.bankName}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-white/50 mb-1 uppercase tracking-wider font-bold">Account Number</p>
                                        <div className="flex items-center justify-between gap-3">
                                            <p className="font-mono font-bold text-white text-2xl tracking-widest">
                                                {SUPPORT_ACCOUNT.accountNumber}
                                            </p>
                                            <CopyButton text={SUPPORT_ACCOUNT.accountNumber} />
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-white/50 mb-1 uppercase tracking-wider font-bold">Account Name</p>
                                        <p className="font-bold text-white text-base">{SUPPORT_ACCOUNT.accountName}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="flex items-center justify-center mb-16 opacity-50">
                    <span className="h-px w-24 bg-gradient-to-r from-transparent to-[#d4a8b0]" />
                    <span className="mx-4 text-xs font-bold uppercase tracking-widest text-[#9a8085]">Or Sponsor</span>
                    <span className="h-px w-24 bg-gradient-to-l from-transparent to-[#d4a8b0]" />
                </div>

                {/* Organizations Header */}
                <div className="mb-10 text-center lg:text-left flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                    <div className="max-w-[600px]">
                        <h3 className="font-display font-bold text-2xl sm:text-3xl mb-4 text-[#1C0003]">
                            Corporate Sponsorship
                        </h3>
                        <p className="text-[#5c4048] text-base leading-relaxed">
                            Connect your brand with {FELLOWSHIP.stats.members} active students and {FELLOWSHIP.stats.alumni} alumni. 
                            Choose a tier that matches your impact goals.
                        </p>
                    </div>
                    <div className="shrink-0 flex justify-center lg:justify-end">
                        <Button
                            variant="primary"
                            className="!h-11 !px-7 shadow-[0_4px_16px_rgba(255,0,21,0.3)]"
                            onClick={handleProspectus}
                        >
                            Download Prospectus
                        </Button>
                    </div>
                </div>

                {/* Tier cards */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-20">
                    {SPONSORS.map((s) => {
                        const style = TIER_STYLES[s.tier] ?? { accent: "#9a8085" };
                        return (
                            <div
                                key={s.tier}
                                className={`group p-8 flex flex-col gap-6 transition-all duration-400 bg-white rounded-2xl border ${
                                    s.highlight 
                                        ? "ring-2 ring-[#FF0015] border-transparent shadow-[0_12px_40px_rgba(255,0,21,0.1)] -translate-y-1" 
                                        : "border-[#e8d0d4] hover:border-[#d4a8b0] hover:shadow-md hover:-translate-y-1"
                                }`}
                            >
                                {s.highlight && (
                                    <span className="self-start text-[10px] font-bold uppercase tracking-widest
                                                     bg-[#FF0015] text-white px-3 py-1 rounded-full">
                                        Most Impactful
                                    </span>
                                )}
                                <div>
                                    <p className="text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: style.accent }}>
                                        {s.tier} Tier
                                    </p>
                                    <p className="font-display font-bold text-[#1C0003] text-3xl mt-1.5">
                                        {s.amount}
                                    </p>
                                </div>
                                <div className="h-px bg-[#fdf8f8]" />
                                <ul className="flex flex-col gap-3 flex-1">
                                    {s.perks.map((perk) => (
                                        <li key={perk} className="flex items-start gap-2.5 text-sm text-[#5c4048]">
                                            <div className="h-4 w-4 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                                                 style={{ background: `${style.accent}15` }}>
                                                <svg className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24" style={{ color: style.accent }}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                                </svg>
                                            </div>
                                            {perk}
                                        </li>
                                    ))}
                                </ul>
                                <a
                                    href={`mailto:${CONTACTS[0].email}?subject=Sponsorship Interest: ${s.tier} Tier — RW${TENURE.shortYear}`}
                                    className="mt-2 flex h-11 items-center justify-center rounded-xl text-sm font-bold transition-all border"
                                    style={{
                                        background: s.highlight ? "#FF0015" : "transparent",
                                        color: s.highlight ? "white" : style.accent,
                                        borderColor: s.highlight ? "#FF0015" : `${style.accent}40`,
                                    }}
                                >
                                    Select {s.tier}
                                </a>
                            </div>
                        );
                    })}
                </div>

                {/* Contact Section */}
                <div className="max-w-3xl mx-auto text-center">
                    <p className="text-sm font-bold text-[#9a8085] uppercase tracking-widest mb-6">Reach out directly</p>
                    <div className="flex flex-wrap justify-center gap-4 sm:gap-8">
                        {CONTACTS.map((c) => (
                            <div key={c.name} className="bg-white border border-[#e8d0d4] rounded-2xl px-6 py-4 flex flex-col items-center shadow-sm">
                                <p className="text-[10px] font-bold uppercase tracking-wider text-[#FF0015] mb-1">{c.title}</p>
                                <p className="font-display font-bold text-[#1C0003] text-base">{c.name}</p>
                                <a href={`tel:${c.phone}`} className="text-sm text-[#5c4048] hover:text-[#1C0003] mt-2 transition-colors">{c.phone}</a>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
}
