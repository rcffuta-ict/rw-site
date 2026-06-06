import { TENURE } from "@/lib/config";
import { getEmailTemplates } from "@/lib/services/email-templates.service";
import { getRecentEmailQueue } from "@/lib/services/email-queue.service";
import { listOrders } from "@/lib/services/orders.service";
import CommunicationClient from "./CommunicationClient";

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

    return (
        <CommunicationClient
            initialTemplates={templatesResult.success ? (templatesResult.data ?? []) : []}
            loadError={templatesResult.success ? null : (templatesResult.error ?? "Unknown error")}
            recipients={recipients}
            deliveries={queueResult.success ? (queueResult.data ?? []) : []}
        />
    );
}
