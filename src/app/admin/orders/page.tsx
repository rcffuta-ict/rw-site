import { ui } from "../../shared/ui";
import { AdminOrdersClient } from "./AdminOrdersClient";

export default function AdminOrdersPage() {
    return (
        <main className={ui.page}>
            <header className={ui.header}>
                <h1 className={ui.h1}>Orders</h1>
                <p className={ui.lead}>
                    Manage orders and confirm receipts. If you aren’t logged in, go to{" "}
                    <a className={ui.inlineLink} href="/admin/login">
                        /admin/login
                    </a>
                    .
                </p>
            </header>

            <AdminOrdersClient />
        </main>
    );
}
