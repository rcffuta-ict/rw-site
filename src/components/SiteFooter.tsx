import styles from "./siteFooter.module.css";

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.left}>
          <div className={styles.brand}>Redemption Week</div>
          <div className={styles.muted}>Built by RCF FUTA ICT.</div>
        </div>

        <div className={styles.right}>
          <span className={styles.pill}>Light mode</span>
          <span className={styles.pill}>rw.rcffuta.com</span>
        </div>
      </div>
    </footer>
  );
}

