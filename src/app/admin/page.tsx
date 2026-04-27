import styles from "../shared/pageShell.module.css";

export default function AdminHomePage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.h1}>Admin</h1>
        <p className={styles.lead}>
          Use the admin token login for now. Supabase Auth will replace this.
        </p>
      </header>

      <section className={styles.grid}>
        <a className={styles.card} href="/admin/orders">
          <div className={styles.cardTitle}>Orders</div>
          <p className={styles.muted}>View, search, and confirm receipts.</p>
        </a>
        <div className={styles.card}>
          <div className={styles.cardTitle}>Merch</div>
          <p className={styles.muted}>Add/edit items and sizes.</p>
        </div>
        <div className={styles.card}>
          <div className={styles.cardTitle}>Programme</div>
          <p className={styles.muted}>Update the schedule and guests.</p>
        </div>
      </section>

      <a className={styles.inlineLink} href="/admin/login">
        Go to login →
      </a>
    </main>
  );
}

