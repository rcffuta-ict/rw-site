import { seedProgramme } from "@/lib/seed/programme";
import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "../../shared/pageShell.module.css";

export default function ProgrammeDayPage({
  params,
}: {
  params: { day: string };
}) {
  const day = seedProgramme.find((d) => d.id === params.day);
  if (!day) notFound();

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.h1}>
          {day.dayLabel}: {day.title}
        </h1>
        <p className={styles.lead}>
          {day.subtitle ? `${day.subtitle}. ` : ""}
          {day.description ?? "More details will be published soon."}
        </p>
      </header>

      <section className={styles.card}>
        <div className={styles.cardTitle}>Details</div>
        <ul className={styles.list}>
          <li>
            <span className={styles.tag}>Time</span> TBD
          </li>
          <li>
            <span className={styles.tag}>Venue</span> TBD
          </li>
          <li>
            <span className={styles.tag}>Guest</span> TBD
          </li>
        </ul>
      </section>

      <Link href="/programme" className={styles.inlineLink}>
        ← Back to programme
      </Link>
    </main>
  );
}

