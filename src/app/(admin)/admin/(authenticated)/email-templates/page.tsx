import { TENURE } from "@/lib/config";
import { getEmailTemplates } from "@/lib/services/email-templates.service";
import { getRecentEmailQueue } from "@/lib/services/email-queue.service";
import { listOrders } from "@/lib/services/orders.service";
import CommunicationClient from "./CommunicationClient";
import type { StaleOrder } from "./types";

export const metadata = {
    title: `Communication — ${TENURE.brandLabel}`,
};

export default async function CommunicationPage() {
    const [templatesResult, queueResult, orders] = await Promise.all([
        getEmailTemplates(),
        getRecentEmailQueue(50),
        listOrders(),
    ]);

    const recipients = orders.map((o) => ({
        id: o.id,
        orderRef: o.orderRef,
        customerName: o.customerName,
        customerEmail: o.customerEmail,
        status: o.status,
    }));

    // Candidate stale orders for the Follow-up tab: those still awaiting the
    // customer (pending / partially paid). The day threshold is applied
    // client-side so admins can adjust it without a refetch.
    const staleOrders: StaleOrder[] = orders
        .filter((o) => o.status === "pending" || o.status === "partially_paid")
        .map((o) => {
            const lastPaymentAt = o.payments.reduce<string>(
                (latest, p) => (p.createdAt > latest ? p.createdAt : latest),
                ""
            );
            const lastActivityAt =
                [o.updatedAt, lastPaymentAt].filter(Boolean).sort().pop() ??
                o.createdAt;
            return {
                id: o.id,
                orderRef: o.orderRef,
                customerName: o.customerName,
                customerEmail: o.customerEmail,
                status: o.status,
                totalAmount: o.totalAmount,
                amountPaid: o.amountPaid,
                balance: o.totalAmount - o.amountPaid,
                lastActivityAt,
            };
        });

    return (
        <CommunicationClient
            initialTemplates={templatesResult.success ? (templatesResult.data ?? []) : []}
            loadError={templatesResult.success ? null : (templatesResult.error ?? "Unknown error")}
            recipients={recipients}
            staleOrders={staleOrders}
            deliveries={queueResult.success ? (queueResult.data ?? []) : []}
        />
    );
}
