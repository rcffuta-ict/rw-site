import styles from "../shared/pageShell.module.css";

export default function GalleryPage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.h1}>Gallery</h1>
        <p className={styles.lead}>
          Photos will be added after each night (post-event update).
        </p>
      </header>

      <section className={styles.card}>
        <div className={styles.cardTitle}>Coming soon</div>
        <p className={styles.muted}>
          We’ll organize photos by day: Monday → Sunday.
        </p>
      </section>
    </main>
  );
}

