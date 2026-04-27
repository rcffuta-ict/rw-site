import { env } from "@/lib/env";
import { MemoryStore } from "@/lib/data/memoryStore";
import styles from "../shared/pageShell.module.css";
import { OrderClient } from "./OrderClient";

export default function OrderPage() {
  const hasBank = Boolean(env.bank.bankName && env.bank.accountNumber);
  const items = MemoryStore.listMerch();

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.h1}>Pre-order</h1>
        <p className={styles.lead}>
          For now, we’re using bank transfer + receipt upload. Online payment
          will be added later.
        </p>
      </header>

      <section className={styles.card}>
        <div className={styles.cardTitle}>Bank transfer</div>
        {hasBank ? (
          <ul className={styles.list}>
            <li>
              <span className={styles.tag}>Bank</span> {env.bank.bankName}
            </li>
            <li>
              <span className={styles.tag}>Name</span> {env.bank.accountName}
            </li>
            <li>
              <span className={styles.tag}>Number</span> {env.bank.accountNumber}
            </li>
          </ul>
        ) : (
          <p className={styles.muted}>
            Bank details will appear here once `RW_BANK_*` env vars are set.
          </p>
        )}
      </section>

      <section className={styles.card}>
        <div className={styles.cardTitle}>Receipt upload</div>
        <p className={styles.muted}>
          Submit your order below, then upload your receipt.
        </p>
      </section>

      <OrderClient items={items} />

      <section className={styles.card}>
        <div className={styles.cardTitle}>Online payment (Squad)</div>
        <p className={styles.muted}>
          Coming soon. We’ll keep manual transfer available as a fallback.
        </p>
      </section>
    </main>
  );
}

