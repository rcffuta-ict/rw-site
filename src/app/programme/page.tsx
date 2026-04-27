import { seedProgramme } from "@/lib/seed/programme";
import Link from "next/link";
import styles from "../shared/pageShell.module.css";

export default function ProgrammePage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.h1}>Programme</h1>
        <p className={styles.lead}>
          Night-by-night schedule for Redemption Week. This is currently a seed
          schedule until the programme committee finalizes times and details.
        </p>
      </header>

      <section className={styles.card}>
        <div className={styles.cardTitle}>Draft schedule</div>
        <ul className={styles.list}>
          {seedProgramme.map((d) => (
            <li key={d.id}>
              <span className={styles.tag}>{d.dayLabel}</span>{" "}
              <Link href={`/programme/${d.id}`} className={styles.inlineLink}>
                {d.title}
                {d.subtitle ? ` — ${d.subtitle}` : ""}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

