"use client";

import React, { createContext, useContext } from "react";
import { DEMO_MODE, TENURE } from "@/lib/config";

interface AppStatusContextValue {
    isDemo: boolean;
    tenureYear: string;
    tenureLabel: string;
    theme: string;
}

const AppStatusContext = createContext<AppStatusContextValue>({
    isDemo: DEMO_MODE,
    tenureYear: TENURE.year,
    tenureLabel: TENURE.brandLabel,
    theme: TENURE.theme,
});

export function AppStatusProvider({ children }: { children: React.ReactNode }) {
    return (
        <AppStatusContext.Provider
            value={{
                isDemo: DEMO_MODE,
                tenureYear: TENURE.year,
                tenureLabel: TENURE.brandLabel,
                theme: TENURE.theme,
            }}
        >
            {/* Demo mode banner */}
            {DEMO_MODE && (
                <div
                    className="fixed bottom-4 right-4 z-[9999] flex items-center gap-2 rounded-full
                               bg-[#1C0003] text-white text-[11px] font-bold px-4 py-2 shadow-lg
                               border border-white/10 opacity-80 hover:opacity-100 transition-opacity"
                    title="Running in demo mode — no real data"
                >
                    <span className="h-1.5 w-1.5 rounded-full bg-[#FF6A00] animate-pulse-soft" />
                    Demo Mode
                </div>
            )}
            {children}
        </AppStatusContext.Provider>
    );
}

export function useAppStatus() {
    return useContext(AppStatusContext);
}
