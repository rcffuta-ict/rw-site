import { TENURE } from "@/lib/config";
import EmailTemplatesClient from "./EmailTemplatesClient";

export const metadata = {
    title: `Email Templates — ${TENURE.brandLabel}`,
};

export default function AdminEmailTemplatesPage() {
    return <EmailTemplatesClient />;
}
