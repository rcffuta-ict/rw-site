"use client";

import React, { useState, useEffect } from "react";
import { AdminModal } from "./AdminModal";

export function MobileAdviceModal() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Check if on mobile and hasn't seen the advice this session
        const isMobile = window.innerWidth < 768;
        const hasSeenAdvice = sessionStorage.getItem("rw-admin-mobile-advice");

        if (isMobile && !hasSeenAdvice) {
            setIsOpen(true);
        }
    }, []);

    const handleClose = () => {
        setIsOpen(false);
        sessionStorage.setItem("rw-admin-mobile-advice", "true");
    };

    return (
        <AdminModal
            isOpen={isOpen}
            onClose={handleClose}
            title="Desktop Recommended"
        >
            <div className="flex flex-col items-center text-center gap-6">
                <div className="h-20 w-20 rounded-[28px] bg-rw-crimson/5 border border-rw-crimson/10 flex items-center justify-center">
                    <svg className="h-10 w-10 text-rw-crimson" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25" />
                    </svg>
                </div>

                <div className="flex flex-col gap-2">
                    <p className="text-rw-text font-medium leading-relaxed">
                        For the best experience managing orders and products, we recommend using the admin panel on a <b>Laptop or Desktop</b>.
                    </p>
                    <p className="text-xs text-rw-muted font-bold uppercase tracking-wider mt-2">
                        RCF FUTA · Redemption Week &apos;26
                    </p>
                </div>

                <button
                    onClick={handleClose}
                    className="btn-primary w-full !h-12 text-xs font-bold uppercase tracking-widest mt-2 shadow-lg shadow-rw-crimson/20"
                >
                    Continue anyway
                </button>
            </div>
        </AdminModal>
    );
}
