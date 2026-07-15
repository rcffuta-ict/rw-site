"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/forms/Button";
import { Input } from "@/components/ui/forms/Input";
import { Select } from "@/components/ui/forms/Select";
import { FELLOWSHIP, TENURE, type SponsorProfile } from "@/lib/config";
import {
    submitSponsorRegistration,
    submitSponsorOptOut,
} from "@/app/actions/sponsors";

interface Props {
    sponsor: SponsorProfile;
}

interface FormState {
    fullName: string;
    email: string;
    whatsapp: string;
    skill: string;
}

const EMPTY: FormState = { fullName: "", email: "", whatsapp: "", skill: "" };

export function SponsorClient({ sponsor }: Props) {
    const blue = sponsor.blue;

    // ── Sign-up form state ──
    const [form, setForm] = useState<FormState>(EMPTY);
    const [consent, setConsent] = useState(false);
    const [errors, setErrors] = useState<Partial<Record<keyof FormState | "consent", string>>>({});
    const [submitting, setSubmitting] = useState(false);
    const [done, setDone] = useState(false);

    // ── Opt-out state ──
    const [showOptOut, setShowOptOut] = useState(false);
    const [optOutEmail, setOptOutEmail] = useState("");
    const [optingOut, setOptingOut] = useState(false);

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

    async function handleOptOut(e: React.FormEvent) {
        e.preventDefault();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(optOutEmail.trim())) {
            toast.error("Enter a valid email address.");
            return;
        }
        setOptingOut(true);
        try {
            const result = await submitSponsorOptOut(sponsor.slug, optOutEmail.trim());
            if (result.success) {
                toast.success("You've been opted out. Your details won't be shared.");
                setOptOutEmail("");
                setShowOptOut(false);
            } else {
                toast.error(result.error || "Something went wrong. Please try again.");
            }
        } catch {
            toast.error("Network error. Please try again.");
        } finally {
            setOptingOut(false);
        }
    }

    return (
        <div className="min-h-screen">
            {/* ── Hero ─────────────────────────────────────────────────────── */}
            <section
                className="relative overflow-hidden"
                style={{ backgroundColor: blue }}
            >
                <div className="section-container !py-16 sm:!py-20 text-center text-white relative z-10">
                    <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-bold uppercase tracking-widest mb-8 backdrop-blur">
                        <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                        {TENURE.brandLabel} · Official Sponsor
                    </div>

                    <div className="flex items-center justify-center mb-8">
                        <div className="rounded-3xl bg-white p-4 shadow-2xl">
                            <Image
                                src={sponsor.logo}
                                alt={`${sponsor.name} logo`}
                                width={120}
                                height={120}
                                className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl object-contain"
                                priority
                            />
                        </div>
                    </div>

                    <h1 className="font-display font-black text-3xl sm:text-5xl leading-tight max-w-3xl mx-auto">
                        Learn a tech or finance skill —{" "}
                        <span className="opacity-90">on {sponsor.name}.</span>
                    </h1>
                    <p className="mt-5 text-base sm:text-lg text-white/85 max-w-2xl mx-auto leading-relaxed">
                        {sponsor.description}
                    </p>
                    <p className="mt-6 text-sm font-semibold uppercase tracking-widest text-white/70">
                        {sponsor.tagline}
                    </p>

                    <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                        <a href="#signup">
                            <span
                                className="inline-flex items-center gap-2 h-12 px-7 rounded-xl text-sm font-bold bg-white shadow-lg transition-transform hover:-translate-y-0.5"
                                style={{ color: blue }}
                            >
                                Get free access →
                            </span>
                        </a>
                        <a
                            href={sponsor.url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 h-12 px-7 rounded-xl text-sm font-bold border border-white/40 text-white hover:bg-white/10 transition-colors"
                        >
                            Visit {sponsor.name}
                        </a>
                    </div>
                </div>
            </section>

            {/* ── Benefits ─────────────────────────────────────────────────── */}
            <section className="section-container !py-14 sm:!py-16">
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {sponsor.benefits.map((b) => (
                        <div
                            key={b.title}
                            className="rw-card p-6 h-full border-t-4"
                            style={{ borderTopColor: blue }}
                        >
                            <h3 className="font-display font-bold text-rw-ink text-base mb-2">
                                {b.title}
                            </h3>
                            <p className="text-sm text-rw-text-2 leading-relaxed">{b.body}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Sign-up form ─────────────────────────────────────────────── */}
            <section id="signup" className="section-container !pt-4 !pb-20">
                <div className="mx-auto max-w-2xl">
                    {done ? (
                        <SuccessCard sponsor={sponsor} onReset={() => { setForm(EMPTY); setConsent(false); setDone(false); }} />
                    ) : (
                        <div className="rw-card overflow-hidden shadow-xl">
                            <div
                                className="px-7 py-6 text-white"
                                style={{ backgroundColor: blue }}
                            >
                                <h2 className="font-display font-black text-xl">
                                    Sign up for free courses
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
                                <Select
                                    label="Skill you want to learn"
                                    description="Optional — helps us match you to the right course."
                                    placeholder="Select a course (optional)"
                                    value={form.skill}
                                    onChange={set("skill")}
                                    options={sponsor.courses.map((c) => ({ label: c, value: c }))}
                                />

                                {/* ── Consent ── */}
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
                                    <label
                                        htmlFor="sponsor-consent"
                                        className="text-sm text-rw-text-2 leading-relaxed cursor-pointer select-none"
                                    >
                                        I agree that {FELLOWSHIP.shortName} may share my{" "}
                                        <strong className="text-rw-ink">
                                            full name, email address, WhatsApp number
                                        </strong>{" "}
                                        and (if provided) my skill of interest with{" "}
                                        <strong className="text-rw-ink">{sponsor.name}</strong>, an
                                        independent education sponsor, so they can enrol me in their
                                        free courses. I understand {sponsor.name} may contact me,
                                        that this is voluntary, and that I can{" "}
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

                                <Button
                                    type="submit"
                                    size="lg"
                                    loading={submitting}
                                    className="mt-2"
                                >
                                    Sign me up
                                </Button>
                            </form>
                        </div>
                    )}

                    {/* ── Auto-enlist notice + opt-out ── */}
                    <div className="mt-8 rounded-2xl border border-[var(--rw-border)] bg-rw-bg-alt/40 p-6 text-center">
                        <p className="text-sm text-rw-text-2 leading-relaxed">
                            <strong className="text-rw-ink">
                                Already a confirmed {TENURE.brandLabelShort} customer?
                            </strong>{" "}
                            You&rsquo;re automatically enrolled — no need to fill the form.
                            Prefer to keep your details private?
                        </p>
                        {!showOptOut ? (
                            <button
                                onClick={() => setShowOptOut(true)}
                                className="mt-3 text-sm font-bold text-rw-crimson hover:underline underline-offset-2"
                            >
                                Opt out here
                            </button>
                        ) : (
                            <form
                                onSubmit={handleOptOut}
                                className="mt-4 flex flex-col sm:flex-row items-start gap-3 max-w-md mx-auto"
                            >
                                <Input
                                    containerClassName="flex-1"
                                    type="email"
                                    value={optOutEmail}
                                    onChange={(e) => setOptOutEmail(e.target.value)}
                                    placeholder="Your email address"
                                    aria-label="Email to opt out"
                                />
                                <Button
                                    type="submit"
                                    variant="outlined"
                                    size="lg"
                                    loading={optingOut}
                                >
                                    Opt out
                                </Button>
                            </form>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}

function SuccessCard({ sponsor, onReset }: { sponsor: SponsorProfile; onReset: () => void }) {
    return (
        <div className="rw-card p-10 text-center shadow-xl">
            <div
                className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full text-white"
                style={{ backgroundColor: sponsor.blue }}
            >
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
            </div>
            <h2 className="font-display font-black text-2xl text-rw-ink">You&rsquo;re all set!</h2>
            <p className="mt-3 text-rw-text-2 leading-relaxed max-w-md mx-auto">
                Thanks for signing up. {sponsor.name} will reach out with details on how to
                access your free courses. Keep an eye on your email and WhatsApp.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <a href={sponsor.url} target="_blank" rel="noreferrer">
                    <Button size="lg">Explore {sponsor.name}</Button>
                </a>
                <Button variant="ghost" size="lg" onClick={onReset}>
                    Sign up someone else
                </Button>
            </div>
        </div>
    );
}
