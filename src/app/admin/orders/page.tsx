import styles from "../../shared/pageShell.module.css";
import { AdminOrdersClient } from "./AdminOrdersClient";

export default function AdminOrdersPage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.h1}>Orders</h1>
        <p className={styles.lead}>
          Manage orders and confirm receipts. If you aren’t logged in, go to{" "}
          <a className={styles.inlineLink} href="/admin/login">
            /admin/login
          </a>
          .
        </p>
      </header>

      <AdminOrdersClient />
    </main>
  );
}

