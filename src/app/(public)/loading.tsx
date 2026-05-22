"use client";

import { useEffect } from "react";
import Image from "next/image";
import { LOGOS, TENURE } from "@/lib/config";

export default function PublicLoading() {
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-[75vh] w-full px-4 text-center">
            <div className="relative flex flex-col items-center gap-8 animate-fade-in-up">
                <Image
                    src={LOGOS.redemptionWeek}
                    alt="Redemption Week"
                    width={180}
                    height={80}
                    className="object-contain animate-bounce-subtle"
                    priority
                />
                <div className="flex flex-col gap-2 items-center">
                    <h2 className="font-display font-extrabold text-xl sm:text-2xl text-rw-ink">
                        {TENURE.eventName} {TENURE.shortYear}
                    </h2>
                    <p className="text-sm font-medium text-rw-muted max-w-md">
                        {TENURE.theme}
                    </p>
                </div>
            </div>
        </div>
    );
}
