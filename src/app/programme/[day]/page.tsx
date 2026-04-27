import { seedProgramme } from "@/lib/seed/programme";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ui } from "../../shared/ui";

export default function ProgrammeDayPage({ params }: { params: { day: string } }) {
    const day = seedProgramme.find((d) => d.id === params.day);
    if (!day) notFound();

    return (
        <main className={ui.page}>
            <header className={ui.header}>
                <h1 className={ui.h1}>
                    {day.dayLabel}: {day.title}
                </h1>
                <p className={ui.lead}>
                    {day.subtitle ? `${day.subtitle}. ` : ""}
                    {day.description ?? "More details will be published soon."}
                </p>
            </header>

            <section className={ui.card}>
                <div className={ui.cardTitle}>Details</div>
                <ul className={ui.list}>
                    <li>
                        <span className={ui.tag}>Time</span> TBD
                    </li>
                    <li>
                        <span className={ui.tag}>Venue</span> TBD
                    </li>
                    <li>
                        <span className={ui.tag}>Guest</span> TBD
                    </li>
                </ul>
            </section>

            <Link href="/programme" className={ui.inlineLink}>
                ← Back to programme
            </Link>
        </main>
    );
}
