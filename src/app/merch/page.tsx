import { MemoryStore } from "@/lib/data/memoryStore";
import Link from "next/link";
import styles from "../shared/pageShell.module.css";

export default function MerchPage() {
  const items = MemoryStore.listMerch();

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.h1}>Merch</h1>
        <p className={styles.lead}>
          Browse available items and sizes, then proceed to pre-order.
        </p>
      </header>

      <section className={styles.grid}>
        {items.map((item) => (
          <div key={item.id} className={styles.card}>
            <div className={styles.cardTitle}>{item.name}</div>
            <div className={styles.muted}>{item.description}</div>
            <ul className={styles.list}>
              <li>
                <span className={styles.tag}>From</span> ₦{item.basePriceNgn.toLocaleString()}
              </li>
              <li>
                <span className={styles.tag}>Sizes</span> {item.sizes.join(", ")}
              </li>
            </ul>
          </div>
        ))}
      </section>

      <Link href="/order" className={styles.inlineLink}>
        Continue to pre-order →
      </Link>
    </main>
  );
}

