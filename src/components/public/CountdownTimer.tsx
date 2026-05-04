"use client";

import { useEffect, useState, useRef } from "react";

interface TimeLeft { days: number; hours: number; minutes: number; seconds: number; }

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

function Digit({ value, label, animate }: { value: number; label: string; animate: boolean }) {
    return (
        <div className="flex flex-col items-center gap-2">
            <div className={`
                flex h-[72px] w-[72px] sm:h-[88px] sm:w-[88px] items-center justify-center
                rounded-2xl bg-white border border-[var(--rw-border)]
                shadow-sm relative overflow-hidden
                ${animate ? "animate-count-tick" : ""}
            `}>
                <span className="font-mono font-bold text-2xl sm:text-3xl text-rw-ink tabular-nums relative z-10">
                    {String(value).padStart(2, "0")}
                </span>
                {/* Subtle gradient accent at bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-crimson-gradient opacity-60" />
            </div>
            <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.15em] text-rw-muted">{label}</span>
        </div>
    );
}

function Separator() {
    return (
        <div className="flex flex-col items-center gap-2 pb-6">
            <span className="flex flex-col gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-rw-crimson/40" />
                <span className="h-1.5 w-1.5 rounded-full bg-rw-crimson/40" />
            </span>
        </div>
    );
}

export function CountdownTimer({ targetDate }: { targetDate: string }) {
    const [t, setT] = useState<TimeLeft>(calc(targetDate));
    const [mounted, setMounted] = useState(false);
    const [tick, setTick] = useState(false);
    const prevSeconds = useRef(t.seconds);

    useEffect(() => {
        setMounted(true);
        const id = setInterval(() => {
            const newT = calc(targetDate);
            if (newT.seconds !== prevSeconds.current) {
                setTick(true);
                setTimeout(() => setTick(false), 300);
                prevSeconds.current = newT.seconds;
            }
            setT(newT);
        }, 1000);
        return () => clearInterval(id);
    }, [targetDate]);

    if (!mounted) return (
        <div className="flex items-start gap-3 sm:gap-4">
            {["Days","Hours","Mins","Secs"].map((l, i) => (
                <div key={l} className="flex items-start gap-3 sm:gap-4">
                    <Digit value={0} label={l} animate={false} />
                    {i < 3 && <Separator />}
                </div>
            ))}
        </div>
    );

    const over = t.days === 0 && t.hours === 0 && t.minutes === 0 && t.seconds === 0;
    if (over) return (
        <div className="inline-flex items-center gap-2 rounded-2xl bg-rw-crimson/10 border border-rw-crimson/20 px-6 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-rw-crimson animate-pulse-soft" />
            <span className="font-display font-bold text-rw-crimson text-lg">Redemption Week is here!</span>
        </div>
    );

    return (
        <div className="flex items-start gap-3 sm:gap-4">
            <Digit value={t.days}    label="Days"  animate={false} />
            <Separator />
            <Digit value={t.hours}   label="Hours" animate={false} />
            <Separator />
            <Digit value={t.minutes} label="Mins"  animate={false} />
            <Separator />
            <Digit value={t.seconds} label="Secs"  animate={tick} />
        </div>
    );
}
