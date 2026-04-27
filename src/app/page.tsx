import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.heroText}>
            <div className={styles.kicker}>rw.rcffuta.com</div>
            <h1 className={styles.h1}>
              Redemption Week
              <span className={styles.h1Accent}> — a full week of Word,</span>{" "}
              prayer, worship, and community.
            </h1>
            <p className={styles.lead}>
              Get the programme, invite your friends, and pre-order merch early
              for easy pickup during the week.
            </p>
            <div className={styles.ctaRow}>
              <Link className={styles.primary} href="/programme">
                View programme
              </Link>
              <Link className={styles.secondary} href="/merch">
                Browse merch
              </Link>
            </div>
          </div>

          <div className={styles.heroCard} aria-hidden="true">
            <div className={styles.cardTop}>
              <div className={styles.spark} />
              <div className={styles.cardTitle}>This week</div>
            </div>
            <div className={styles.cardBody}>
              <div className={styles.row}>
                <span className={styles.day}>Mon</span>
                <span className={styles.event}>Opening Ceremony</span>
              </div>
              <div className={styles.row}>
                <span className={styles.day}>Tue</span>
                <span className={styles.event}>Word Night</span>
              </div>
              <div className={styles.row}>
                <span className={styles.day}>Wed</span>
                <span className={styles.event}>Power Night</span>
              </div>
              <div className={styles.row}>
                <span className={styles.day}>Thu</span>
                <span className={styles.event}>Drama Night</span>
              </div>
              <div className={styles.row}>
                <span className={styles.day}>Fri</span>
                <span className={styles.event}>Choir Concert</span>
              </div>
              <div className={styles.row}>
                <span className={styles.day}>Sat</span>
                <span className={styles.event}>Alumni Reunion</span>
              </div>
              <div className={styles.row}>
                <span className={styles.day}>Sun</span>
                <span className={styles.event}>Handing Over</span>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.grid}>
          <Link href="/programme" className={styles.feature}>
            <div className={styles.featureTitle}>Programme</div>
            <div className={styles.featureText}>
              Night-by-night schedule with speakers and details.
            </div>
          </Link>
          <Link href="/merch" className={styles.feature}>
            <div className={styles.featureTitle}>Merch</div>
            <div className={styles.featureText}>
              See what’s available, sizes, and prices.
            </div>
          </Link>
          <Link href="/order" className={styles.feature}>
            <div className={styles.featureTitle}>Pre-order</div>
            <div className={styles.featureText}>
              Reserve items and upload your payment receipt.
            </div>
          </Link>
        </section>
      </main>
    </div>
  );
}
