import { seedProgramme } from "@/lib/seed/programme";
import Link from "next/link";
import { ui } from "../shared/ui";

export default function ProgrammePage() {
    return (
        <main className={ui.page}>
            <header className={ui.header}>
                <h1 className={ui.h1}>Programme</h1>
                <p className={ui.lead}>
                    Night-by-night schedule for Redemption Week. This is currently a seed
                    schedule until the programme committee finalizes times and details.
                </p>
            </header>

            <section className={ui.card}>
                <div className={ui.cardTitle}>Draft schedule</div>
                <ul className={ui.list}>
                    {seedProgramme.map((d) => (
                        <li key={d.id}>
                            <span className={ui.tag}>{d.dayLabel}</span>
                            <Link href={`/programme/${d.id}`} className={ui.inlineLink}>
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
