import Link from "next/link";
import { env } from "@/lib/env";
import { CountdownTimer } from "@/components/public/CountdownTimer";
import { ph } from "@/lib/utils";

export function HeroSection() {
    return (
        <section className="relative min-h-screen overflow-hidden flex items-center">
            {/* Full-bleed background image */}
            <img
                src={ph(1920, 1080, "Hero · 1920×1080")}
                alt="Redemption Week background"
                className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Layered overlays — keeps it immersive but legible */}
            {/* 1. Dark vignette across the whole image */}
            <div className="absolute inset-0 bg-black/30" />
            {/* 2. Strong white fade on the left for text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 lg:via-white/80 to-transparent" />
            {/* 3. Soft bottom fade to match the rest of the page */}
            <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white to-transparent" />
            {/* 4. Crimson fire accent — top-right glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-rw-crimson/10 rounded-full blur-3xl" />

            {/* Content */}
            <div className="relative z-10 section-container py-28 lg:py-32 w-full">
                <div className="max-w-2xl stagger-children">
                    {/* Eyebrow badge */}
                    <div className="animate-fade-in-up">
                        <span className="inline-flex items-center gap-2.5 rounded-full border border-rw-crimson/30 bg-white/80 backdrop-blur-sm px-5 py-2 text-[11px] font-bold text-rw-crimson tracking-[0.14em] uppercase shadow-sm">
                            <span className="h-2 w-2 rounded-full bg-rw-crimson animate-pulse-soft" />
                            38th Anniversary · Redeemed Christian Fellowship, FUTA Chapter
                        </span>
                    </div>

                    {/* Main heading — very large, editorial */}
                    <div className="animate-fade-in-up mt-8">
                        <h1
                            className="section-heading leading-[0.9]"
                            style={{ fontSize: "clamp(3.5rem, 9vw, 7.5rem)" }}
                        >
                            Redemption
                            <br />
                            <span className="text-rw-crimson">Week &apos;26</span>
                        </h1>
                    </div>

                    {/* Theme subtitle */}
                    <div className="animate-fade-in-up mt-6 flex items-center gap-4">
                        <span className="crimson-line shrink-0" />
                        <p className="font-display italic text-xl sm:text-2xl text-rw-text-2 leading-snug">
                            The Lord&apos;s Witnesses: The Purified Army
                        </p>
                    </div>

                    {/* Meta pills */}
                    <div className="animate-fade-in-up mt-8 flex flex-wrap gap-3">
                        {[
                            {
                                label: "July 6–12, 2026",
                                icon: (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
                                    />
                                ),
                            },
                            {
                                label: "RCFFUTA Southgate Auditorium, Akure",
                                icon: (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                                    />
                                ),
                            },
                            {
                                label: "7 Nights of Faith",
                                icon: (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                    />
                                ),
                            },
                        ].map(({ label, icon }) => (
                            <span
                                key={label}
                                className="inline-flex items-center gap-2 rounded-full border border-[var(--rw-border)] bg-white/80 backdrop-blur-sm px-4 py-2 text-sm font-medium text-rw-text-2 shadow-sm"
                            >
                                <svg
                                    className="h-3.5 w-3.5 text-rw-crimson shrink-0"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                    viewBox="0 0 24 24"
                                >
                                    {icon}
                                </svg>
                                {label}
                            </span>
                        ))}
                    </div>

                    {/* CTA buttons */}
                    <div className="animate-fade-in-up mt-10 flex flex-wrap gap-4">
                        <Link
                            href="/shop"
                            id="hero-shop-cta"
                            className="btn-primary shadow-lg"
                        >
                            Pre-order Merch
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
                                    d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                                />
                            </svg>
                        </Link>
                        <Link
                            href="/fulfil"
                            id="hero-pay-cta"
                            className="btn-secondary bg-white/80 backdrop-blur-sm shadow-sm"
                        >
                            Pay an Order
                        </Link>
                    </div>

                    {/* Countdown */}
                    <div className="animate-fade-in-up mt-14">
                        <p className="eyebrow mb-5">Counting down to RW&apos;26</p>
                        <CountdownTimer targetDate={env.eventStartDate} />
                    </div>
                </div>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 animate-bounce-subtle">
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-rw-muted">
                    Scroll
                </span>
                <svg
                    className="h-4 w-4 text-rw-muted"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m19.5 8.25-7.5 7.5-7.5-7.5"
                    />
                </svg>
            </div>
        </section>
    );
}
