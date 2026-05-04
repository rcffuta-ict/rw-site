"use client";

import { useEffect, useState } from "react";

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

function Digit({ value, label }: { value: number; label: string }) {
    return (
        <div className="flex flex-col items-center gap-1">
            <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-xl border border-[var(--rw-border-mid)] bg-rw-surface shadow-sm">
                <span className="font-mono font-bold text-xl sm:text-2xl text-rw-ink tabular-nums">
                    {String(value).padStart(2, "0")}
                </span>
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-rw-muted">{label}</span>
        </div>
    );
}

export function CountdownTimer({ targetDate }: { targetDate: string }) {
    const [t, setT] = useState<TimeLeft>(calc(targetDate));
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const id = setInterval(() => setT(calc(targetDate)), 1000);
        return () => clearInterval(id);
    }, [targetDate]);

    if (!mounted) return (
        <div className="flex items-end gap-2">
            {["Days","Hours","Mins","Secs"].map(l => <Digit key={l} value={0} label={l} />)}
        </div>
    );

    const over = t.days === 0 && t.hours === 0 && t.minutes === 0 && t.seconds === 0;
    if (over) return <p className="font-semibold text-rw-crimson">Redemption Week is here!</p>;

    return (
        <div className="flex items-end gap-2">
            <Digit value={t.days}    label="Days" />
            <span className="mb-5 text-rw-muted font-light">:</span>
            <Digit value={t.hours}   label="Hours" />
            <span className="mb-5 text-rw-muted font-light">:</span>
            <Digit value={t.minutes} label="Mins" />
            <span className="mb-5 text-rw-muted font-light">:</span>
            <Digit value={t.seconds} label="Secs" />
        </div>
    );
}
