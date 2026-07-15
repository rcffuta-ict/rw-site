"use client";

import React, { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/forms/Button";
import { Input } from "@/components/ui/forms/Input";
import { Select } from "@/components/ui/forms/Select";
import { SponsorLogo } from "@/components/common/SponsorLogo";
import { FELLOWSHIP, TENURE } from "@/lib/config";
import type { Sponsor } from "@/lib/services/sponsors.service";
import {
    submitSponsorRegistration,
    submitSponsorOptOut,
} from "@/app/actions/sponsors";

interface Props {
    sponsor: Sponsor;
}

interface FormState {
    fullName: string;
    email: string;
    whatsapp: string;
    skill: string;
}

const EMPTY: FormState = { fullName: "", email: "", whatsapp: "", skill: "" };

export function SponsorClient({ sponsor }: Props) {
    const blue = sponsor.brandColor;

    const [form, setForm] = useState<FormState>(EMPTY);
    const [consent, setConsent] = useState(false);
    const [errors, setErrors] = useState<Partial<Record<keyof FormState | "consent", string>>>({});
    const [submitting, setSubmitting] = useState(false);
    const [done, setDone] = useState(false);

    const set = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm((f) => ({ ...f, [k]: e.target.value }));
        setErrors((prev) => ({ ...prev, [k]: undefined }));
    };

    function validate(): boolean {
        const next: Partial<Record<keyof FormState | "consent", string>> = {};
        if (form.fullName.trim().length < 2) next.fullName = "Please enter your full name.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
            next.email = "Enter a valid email address.";
        if (form.whatsapp.trim().replace(/\D/g, "").length < 7)
            next.whatsapp = "Enter a valid WhatsApp number.";
        if (!consent) next.consent = "Please accept the consent statement to continue.";
        setErrors(next);
        return Object.keys(next).length === 0;
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!validate()) return;
        setSubmitting(true);
        try {
            const result = await submitSponsorRegistration(sponsor.slug, {
                fullName: form.fullName.trim(),
                email: form.email.trim(),
                whatsapp: form.whatsapp.trim(),
                skill: form.skill || null,
                consent,
            });
            if (result.success) {
                setDone(true);
                toast.success(`You're in! ${sponsor.name} will be in touch.`);
            } else {
                toast.error(result.error || "Something went wrong. Please try again.");
            }
        } catch {
            toast.error("Network error. Please try again.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="min-h-screen">
            {/* ── Hero ─────────────────────────────────────────────────────── */}
            <section className="relative overflow-hidden" style={{ backgroundColor: blue }}>
                <div className="section-container !py-16 sm:!py-20 text-center text-white relative z-10">
                    <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-bold uppercase tracking-widest mb-8 backdrop-blur">
                        <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                        {TENURE.brandLabel} · Official Sponsor
                    </div>

                    <div className="flex items-center justify-center mb-8">
                        <div className="rounded-3xl bg-white p-4 shadow-2xl">
                            <SponsorLogo
                                src={sponsor.logoUrl}
                                alt={`${sponsor.name} logo`}
                                size={96}
                                className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl object-contain"
                            />
                        </div>
                    </div>

                    <h1 className="font-display font-black text-3xl sm:text-5xl leading-tight max-w-3xl mx-auto">
                        {sponsor.collectsData ? (
                            <>
                                Learn a new skill —{" "}
                                <span className="opacity-90">on {sponsor.name}.</span>
                            </>
                        ) : (
                            <>
                                Proudly sponsored by{" "}
                                <span className="opacity-90">{sponsor.name}.</span>
                            </>
                        )}
                    </h1>
                    {sponsor.description && (
                        <p className="mt-5 text-base sm:text-lg text-white/85 max-w-2xl mx-auto leading-relaxed">
                            {sponsor.description}
                        </p>
                    )}
                    {sponsor.tagline && (
                        <p className="mt-6 text-sm font-semibold uppercase tracking-widest text-white/70">
                            {sponsor.tagline}
                        </p>
                    )}

                    <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                        {sponsor.collectsData && (
                            <a href="#signup">
                                <span
                                    className="inline-flex items-center gap-2 h-12 px-7 rounded-xl text-sm font-bold bg-white shadow-lg transition-transform hover:-translate-y-0.5"
                                    style={{ color: blue }}
                                >
                                    Get free access →
                                </span>
                            </a>
                        )}
                        {sponsor.url && (
                            <a
                                href={sponsor.url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 h-12 px-7 rounded-xl text-sm font-bold border border-white/40 text-white hover:bg-white/10 transition-colors"
                            >
                                Visit {sponsor.name}
                            </a>
                        )}
                    </div>
                </div>
            </section>

            {/* ── What you'll get (courses) ────────────────────────────────── */}
            {sponsor.courses.length > 0 && (
                <section className="section-container !py-14">
                    <h2 className="text-center font-display font-black text-2xl text-rw-ink mb-8">
                        {sponsor.collectsData ? "What you'll get access to" : "What they offer"}
                    </h2>
                    <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
                        {sponsor.courses.map((c) => (
                            <span
                                key={c}
                                className="rounded-full border px-5 py-2.5 text-sm font-semibold text-rw-ink"
                                style={{ borderColor: `${blue}44`, backgroundColor: `${blue}0d` }}
                            >
                                {c}
                            </span>
                        ))}
                    </div>
                </section>
            )}

            {/* ── Data-collecting: sign-up + opt-out ───────────────────────── */}
            {sponsor.collectsData ? (
                <section id="signup" className="section-container !pt-4 !pb-20">
                    <div className="mx-auto max-w-2xl">
                        {done ? (
                            <SuccessCard sponsor={sponsor} />
                        ) : (
                            <div className="rw-card overflow-hidden shadow-xl">
                                <div className="px-7 py-6 text-white" style={{ backgroundColor: blue }}>
                                    <h2 className="font-display font-black text-xl">
                                        Sign up for free access
                                    </h2>
                                    <p className="text-sm text-white/80 mt-1">
                                        Takes less than a minute. No payment required.
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit} className="p-7 flex flex-col gap-5">
                                    <Input
                                        id="sp-name"
                                        label="Full name"
                                        required
                                        value={form.fullName}
                                        onChange={set("fullName")}
                                        error={errors.fullName}
                                        placeholder="e.g. Grace Adeyemi"
                                        autoComplete="name"
                                    />
                                    <Input
                                        id="sp-email"
                                        label="Email address"
                                        required
                                        type="email"
                                        value={form.email}
                                        onChange={set("email")}
                                        error={errors.email}
                                        placeholder="you@example.com"
                                        autoComplete="email"
                                    />
                                    <Input
                                        id="sp-whatsapp"
                                        label="WhatsApp number"
                                        required
                                        type="tel"
                                        value={form.whatsapp}
                                        onChange={set("whatsapp")}
                                        error={errors.whatsapp}
                                        placeholder="e.g. 0803 123 4567"
                                        autoComplete="tel"
                                    />
                                    {sponsor.courses.length > 0 && (
                                        <Select
                                            label="Skill you want to learn"
                                            description="Optional — helps match you to the right course."
                                            placeholder="Select a course (optional)"
                                            value={form.skill}
                                            onChange={set("skill")}
                                            options={sponsor.courses.map((c) => ({ label: c, value: c }))}
                                        />
                                    )}

                                    <div className="flex gap-3.5 items-start p-5 rounded-2xl bg-rw-bg-warm/60 border border-[var(--rw-border-mid)]">
                                        <div className="mt-0.5 shrink-0">
                                            <input
                                                type="checkbox"
                                                id="sponsor-consent"
                                                checked={consent}
                                                onChange={(e) => {
                                                    setConsent(e.target.checked);
                                                    setErrors((p) => ({ ...p, consent: undefined }));
                                                }}
                                                className="h-4 w-4 rounded border-[var(--rw-border-strong)] text-rw-crimson accent-rw-crimson cursor-pointer"
                                            />
                                        </div>
                                        <label htmlFor="sponsor-consent" className="text-sm text-rw-text-2 leading-relaxed cursor-pointer select-none">
                                            I agree that {FELLOWSHIP.shortName} may share my{" "}
                                            <strong className="text-rw-ink">
                                                full name, email address, WhatsApp number
                                            </strong>{" "}
                                            and (if provided) my skill of interest with{" "}
                                            <strong className="text-rw-ink">{sponsor.name}</strong>, an
                                            independent sponsor, so they can enrol me. I understand{" "}
                                            {sponsor.name} may contact me, that this is voluntary, and
                                            that I can{" "}
                                            <strong className="text-rw-ink">opt out at any time</strong>.
                                            See our{" "}
                                            <Link
                                                href="/privacy"
                                                target="_blank"
                                                className="font-bold text-rw-ink hover:text-rw-crimson underline underline-offset-2"
                                            >
                                                Privacy Policy
                                            </Link>
                                            .
                                        </label>
                                    </div>
                                    {errors.consent && (
                                        <p className="text-xs text-rw-crimson font-semibold -mt-2 ml-1">
                                            {errors.consent}
                                        </p>
                                    )}

                                    <Button type="submit" size="lg" loading={submitting} className="mt-2">
                                        Sign me up
                                    </Button>
                                    <p className="text-xs text-rw-muted text-center leading-relaxed">
                                        Please sign up with <strong>your own</strong> details. Want a
                                        friend to join? Share this page instead — see below.
                                    </p>
                                </form>
                            </div>
                        )}

                        {/* Auto-enrol note */}
                        <p className="mt-6 text-center text-sm text-rw-text-2 leading-relaxed">
                            <strong className="text-rw-ink">
                                Already a confirmed {TENURE.brandLabelShort} customer?
                            </strong>{" "}
                            You&rsquo;re automatically enrolled — no need to fill the form.
                        </p>

                        {/* Opt-out — equal weight to the form */}
                        <OptOutPanel sponsor={sponsor} />

                        {/* Share */}
                        <ShareBlock sponsor={sponsor} />
                    </div>
                </section>
            ) : (
                /* ── Showcase-only sponsor ── */
                <section className="section-container !pt-4 !pb-20">
                    <div className="mx-auto max-w-2xl text-center">
                        {sponsor.url && (
                            <a href={sponsor.url} target="_blank" rel="noreferrer">
                                <Button size="lg">Visit {sponsor.name} →</Button>
                            </a>
                        )}
                        <ShareBlock sponsor={sponsor} />
                    </div>
                </section>
            )}
        </div>
    );
}

// ─── Opt-out panel ────────────────────────────────────────────────────────────

function OptOutPanel({ sponsor }: { sponsor: Sponsor }) {
    const [identifier, setIdentifier] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [confirmed, setConfirmed] = useState(false);

    async function handleOptOut(e: React.FormEvent) {
        e.preventDefault();
        const v = identifier.trim();
        if (v.length < 3) {
            toast.error("Enter the email or phone number you use with us.");
            return;
        }
        setSubmitting(true);
        try {
            const result = await submitSponsorOptOut(sponsor.slug, v);
            if (result.success) {
                setConfirmed(true);
                toast.success("Done — your details won't be shared.");
            } else {
                toast.error(result.error || "Something went wrong. Please try again.");
            }
        } catch {
            toast.error("Network error. Please try again.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="mt-10 rw-card overflow-hidden border-2 border-rw-ink/10">
            <div className="bg-rw-ink px-7 py-6 text-white">
                <h2 className="font-display font-black text-xl flex items-center gap-2.5">
                    <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                    </svg>
                    Don&rsquo;t want to share your details?
                </h2>
                <p className="text-sm text-white/75 mt-1.5">
                    Opt out any time — no questions asked.
                </p>
            </div>

            <div className="p-7">
                {confirmed ? (
                    <div className="flex items-start gap-3 rounded-2xl bg-green-50 border border-green-200 p-5">
                        <svg className="h-5 w-5 shrink-0 text-green-600 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <div>
                            <p className="font-bold text-green-800">You&rsquo;ve been opted out.</p>
                            <p className="text-sm text-green-700 mt-1 leading-relaxed">
                                We won&rsquo;t share your details with {sponsor.name}. Changed your
                                mind? Just fill the sign-up form above again.
                            </p>
                        </div>
                    </div>
                ) : (
                    <>
                        <p className="text-sm text-rw-text-2 leading-relaxed mb-5">
                            We identify you by your <strong className="text-rw-ink">email</strong> or{" "}
                            <strong className="text-rw-ink">phone number</strong>. Enter either one
                            below and we&rsquo;ll make sure your details are{" "}
                            <strong className="text-rw-ink">never shared</strong> with {sponsor.name}
                            {" "}— even if you&rsquo;re a confirmed customer who&rsquo;d otherwise be
                            auto-enrolled.
                        </p>
                        <form onSubmit={handleOptOut} className="flex flex-col sm:flex-row items-start gap-3">
                            <Input
                                containerClassName="flex-1"
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)}
                                placeholder="Email address or phone number"
                                aria-label="Email or phone to opt out"
                            />
                            <Button type="submit" variant="danger" size="lg" loading={submitting}>
                                Opt me out
                            </Button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}

// ─── Share ────────────────────────────────────────────────────────────────────

function ShareBlock({ sponsor }: { sponsor: Sponsor }) {
    const [copied, setCopied] = useState(false);

    function shareUrl(): string {
        if (typeof window !== "undefined") return window.location.href.split("#")[0];
        return `https://rw.rcffuta.com/sponsors/${sponsor.slug}`;
    }

    async function copy() {
        try {
            await navigator.clipboard.writeText(shareUrl());
            setCopied(true);
            toast.success("Link copied!");
            setTimeout(() => setCopied(false), 2000);
        } catch {
            toast.error("Couldn't copy the link.");
        }
    }

    const waHref = `https://wa.me/?text=${encodeURIComponent(
        `Check out ${sponsor.name}, an official ${TENURE.brandLabelShort} sponsor: ${shareUrl()}`
    )}`;

    return (
        <div className="mt-10 rounded-2xl border border-[var(--rw-border)] bg-rw-bg-alt/40 p-6 text-center">
            <p className="font-display font-bold text-rw-ink">Know someone who&rsquo;d love this?</p>
            <p className="text-sm text-rw-text-2 mt-1 mb-5 leading-relaxed">
                Everyone signs up with their own details — so share this page and let them join
                themselves.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
                <Button variant="outlined" size="lg" onClick={copy}>
                    {copied ? "✓ Copied" : "Copy link"}
                </Button>
                <a href={waHref} target="_blank" rel="noreferrer">
                    <Button size="lg">Share on WhatsApp</Button>
                </a>
            </div>
        </div>
    );
}

// ─── Success ──────────────────────────────────────────────────────────────────

function SuccessCard({ sponsor }: { sponsor: Sponsor }) {
    return (
        <div className="rw-card p-10 text-center shadow-xl">
            <div
                className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full text-white"
                style={{ backgroundColor: sponsor.brandColor }}
            >
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
            </div>
            <h2 className="font-display font-black text-2xl text-rw-ink">You&rsquo;re all set!</h2>
            <p className="mt-3 text-rw-text-2 leading-relaxed max-w-md mx-auto">
                Thanks for signing up. {sponsor.name} will reach out with details on how to access
                your free courses. Keep an eye on your email and WhatsApp.
            </p>
            {sponsor.url && (
                <div className="mt-8">
                    <a href={sponsor.url} target="_blank" rel="noreferrer">
                        <Button size="lg">Explore {sponsor.name}</Button>
                    </a>
                </div>
            )}
        </div>
    );
}
