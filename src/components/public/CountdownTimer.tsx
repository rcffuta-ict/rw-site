"use client";

import { useEffect, useState, useRef } from "react";

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

function calc(target: string): TimeLeft {
    const diff = new Date(target).getTime() - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
        days:    Math.floor(diff / 86400000),
        hours:   Math.floor((diff / 3600000) % 24),
        minutes: Math.floor((diff / 60000) % 60),
        seconds: Math.floor((diff / 1000) % 60),
    };
}

function DigitBlock({
    value,
    label,
    flipping,
}: {
    value: number;
    label: string;
    flipping: boolean;
}) {
    const display = String(value).padStart(2, "0");

    return (
        <div className="flex flex-col items-center gap-3">
            {/* Card */}
            <div className="relative">
                {/* Background card */}
                <div className="relative flex items-center justify-center rounded-2xl bg-white border border-[var(--rw-border)] shadow-sm overflow-hidden"
                    style={{ width: "clamp(72px, 11vw, 100px)", height: "clamp(80px, 12vw, 108px)" }}
                >
                    {/* Crimson bottom accent line */}
                    <div className="absolute bottom-0 left-4 right-4 h-[2px] rounded-full bg-gradient-to-r from-transparent via-rw-crimson to-transparent" />

                    {/* Top subtle gradient */}
                    <div className="absolute inset-0 bg-gradient-to-b from-rw-bg-alt/60 to-transparent pointer-events-none" />

                    {/* Number */}
                    <span
                        className={`font-mono font-bold tabular-nums text-rw-ink z-10 select-none transition-all duration-150 ${
                            flipping ? "scale-95 opacity-60" : "scale-100 opacity-100"
                        }`}
                        style={{ fontSize: "clamp(2rem, 5vw, 3rem)", letterSpacing: "-0.04em" }}
                    >
                        {display}
                    </span>
                </div>

                {/* Floating label */}
            </div>

            {/* Label */}
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-rw-muted">
                {label}
            </span>
        </div>
    );
}

function Separator() {
    return (
        <div className="flex flex-col items-center gap-1.5 pb-9 self-center">
            <span className="h-1.5 w-1.5 rounded-full bg-rw-crimson/25" />
            <span className="h-1.5 w-1.5 rounded-full bg-rw-crimson/25" />
        </div>
    );
}

export function CountdownTimer({ targetDate }: { targetDate: string }) {
    const [t, setT]           = useState<TimeLeft>(calc(targetDate));
    const [mounted, setMounted] = useState(false);
    const [flipping, setFlipping] = useState(false);
    const prevSec = useRef(t.seconds);

    useEffect(() => {
        setMounted(true);
        const id = setInterval(() => {
            const next = calc(targetDate);
            if (next.seconds !== prevSec.current) {
                setFlipping(true);
                setTimeout(() => setFlipping(false), 160);
                prevSec.current = next.seconds;
            }
            setT(next);
        }, 1000);
        return () => clearInterval(id);
    }, [targetDate]);

    const isOver = !mounted || (t.days === 0 && t.hours === 0 && t.minutes === 0 && t.seconds === 0);

    if (!mounted) {
        return (
            <div className="flex items-center gap-3 sm:gap-4">
                {(["Days", "Hours", "Mins", "Secs"] as const).map((l, i) => (
                    <div key={l} className="flex items-center gap-3 sm:gap-4">
                        <DigitBlock value={0} label={l} flipping={false} />
                        {i < 3 && <Separator />}
                    </div>
                ))}
            </div>
        );
    }

    if (isOver) {
        return (
            <div className="inline-flex items-center gap-3 rounded-2xl border border-rw-crimson/20 bg-rw-crimson/5 px-7 py-4">
                <span className="h-2.5 w-2.5 rounded-full bg-rw-crimson animate-pulse-soft" />
                <span className="font-display font-bold text-rw-crimson text-xl">
                    Redemption Week is live!
                </span>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-3 sm:gap-4">
            <DigitBlock value={t.days}    label="Days"  flipping={false} />
            <Separator />
            <DigitBlock value={t.hours}   label="Hours" flipping={false} />
            <Separator />
            <DigitBlock value={t.minutes} label="Mins"  flipping={false} />
            <Separator />
            <DigitBlock value={t.seconds} label="Secs"  flipping={flipping} />
        </div>
    );
}
