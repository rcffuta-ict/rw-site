import { ui } from "../shared/ui";

export default function AdminHomePage() {
    return (
        <main className={ui.page}>
            <header className={ui.header}>
                <h1 className={ui.h1}>Admin</h1>
                <p className={ui.lead}>
                    Use the admin token login for now. Supabase Auth will replace this.
                </p>
            </header>

            <section className={ui.grid3}>
                <a className={ui.card} href="/admin/orders">
                    <div className={ui.cardTitle}>Orders</div>
                    <p className={ui.muted}>View, search, and confirm receipts.</p>
                </a>
                <div className={ui.card}>
                    <div className={ui.cardTitle}>Merch</div>
                    <p className={ui.muted}>Add/edit items and sizes.</p>
                </div>
                <div className={ui.card}>
                    <div className={ui.cardTitle}>Programme</div>
                    <p className={ui.muted}>Update the schedule and guests.</p>
                </div>
            </section>

            <a className={ui.inlineLink} href="/admin/login">
                Go to login →
            </a>
        </main>
    );
}
