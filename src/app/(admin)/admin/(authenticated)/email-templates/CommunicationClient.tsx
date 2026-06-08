"use client";

import { useState } from "react";
import { AdminTabs, type TabItem } from "@/components/admin/AdminTabs";
import { TemplatesPanel } from "./TemplatesPanel";
import { ComposePanel } from "./ComposePanel";
import { FollowUpPanel } from "./FollowUpPanel";
import { DeliveryPanel } from "./DeliveryPanel";
import type { EmailTemplate } from "@/lib/services/email-templates.service";
import type { EmailQueueRow } from "@/lib/services/email-queue.service";
import type { Recipient, StaleOrder } from "./types";

interface CommunicationClientProps {
    initialTemplates: EmailTemplate[];
    loadError: string | null;
    recipients: Recipient[];
    staleOrders: StaleOrder[];
    deliveries: EmailQueueRow[];
}

type CommTab = "templates" | "compose" | "followup" | "delivery";

const tabs: TabItem[] = [
    {
        key: "templates",
        label: "Auto Emails",
        icon: (
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
        ),
    },
    {
        key: "compose",
        label: "Send Message",
        icon: (
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.27 3.27a.5.5 0 0 1 .68-.62l17.5 8.23a.5.5 0 0 1 0 .9L4 19.35a.5.5 0 0 1-.68-.62L6 12Zm0 0h6" />
            </svg>
        ),
    },
    {
        key: "followup",
        label: "Follow-up",
        icon: (
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
        ),
    },
    {
        key: "delivery",
        label: "Delivery",
        icon: (
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
        ),
    },
];

export default function CommunicationClient({
    initialTemplates,
    loadError,
    recipients,
    staleOrders,
    deliveries,
}: CommunicationClientProps) {
    const [activeTab, setActiveTab] = useState<CommTab>("templates");

    return (
        <div className="flex flex-col gap-8 animate-fade-in">
            {/* Page header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-[var(--rw-border)] pb-8">
                <div>
                    <p className="eyebrow mb-1">Redemption Week &apos;26</p>
                    <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-rw-ink tracking-tight">
                        Communication
                    </h1>
                    <p className="text-sm text-rw-muted font-medium mt-1">
                        Customer emails for orders &amp; payments · one-off messages
                    </p>
                </div>
                <AdminTabs
                    tabs={tabs}
                    activeTab={activeTab}
                    onChange={(key) => setActiveTab(key as CommTab)}
                />
            </div>

            {activeTab === "templates" && (
                <TemplatesPanel initialTemplates={initialTemplates} loadError={loadError} />
            )}
            {activeTab === "compose" && <ComposePanel recipients={recipients} />}
            {activeTab === "followup" && <FollowUpPanel staleOrders={staleOrders} />}
            {activeTab === "delivery" && <DeliveryPanel deliveries={deliveries} />}
        </div>
    );
}
