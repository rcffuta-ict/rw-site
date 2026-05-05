"use client";

import { AdminModal } from "@/components/admin/AdminModal";
import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface ModalOptions {
    title?: string;
    description?: string;
    maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "full";
    fullScreen?: boolean;
    noPadding?: boolean;
    showClose?: boolean;
}

interface AdminModalContextType {
    openModal: (content: ReactNode, options?: ModalOptions) => void;
    closeModal: () => void;
    isOpen: boolean;
}

const AdminModalContext = createContext<AdminModalContextType | undefined>(undefined);

export function AdminModalProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [content, setContent] = useState<ReactNode>(null);
    const [options, setOptions] = useState<ModalOptions>({});

    const openModal = useCallback((newContent: ReactNode, newOptions: ModalOptions = {}) => {
        setContent(newContent);
        setOptions(newOptions);
        setIsOpen(true);
    }, []);

    const closeModal = useCallback(() => {
        setIsOpen(false);
    }, []);

    return (
        <AdminModalContext.Provider value={{ openModal, closeModal, isOpen }}>
            {children}
            <AdminModal
                isOpen={isOpen}
                onClose={closeModal}
                title={options.title}
                description={options.description}
                maxWidth={options.maxWidth}
                fullScreen={options.fullScreen}
                noPadding={options.noPadding}
                showClose={options.showClose}
            >
                {content}
            </AdminModal>
        </AdminModalContext.Provider>
    );
}

export function useAdminModal() {
    const context = useContext(AdminModalContext);
    if (context === undefined) {
        throw new Error("useAdminModal must be used within an AdminModalProvider");
    }
    return context;
}
