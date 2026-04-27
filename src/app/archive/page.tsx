import styles from "../shared/pageShell.module.css";

export default function ArchivePage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.h1}>Archive</h1>
        <p className={styles.lead}>
          Redemption Week pages can stay online after the event for easy reference.
        </p>
      </header>

      <section className={styles.card}>
        <div className={styles.cardTitle}>What stays</div>
        <ul className={styles.list}>
          <li>
            <span className={styles.tag}>Programme</span> Keep the schedule and key highlights.
          </li>
          <li>
            <span className={styles.tag}>Gallery</span> Photos by day.
          </li>
          <li>
            <span className={styles.tag}>Merch</span> Optional: hide ordering after cutoff.
          </li>
        </ul>
      </section>
    </main>
  );
}

