import { ui } from "../shared/ui";

export default function ArchivePage() {
    return (
        <main className={ui.page}>
            <header className={ui.header}>
                <h1 className={ui.h1}>Archive</h1>
                <p className={ui.lead}>
                    Redemption Week pages can stay online after the event for easy
                    reference.
                </p>
            </header>

            <section className={ui.card}>
                <div className={ui.cardTitle}>What stays</div>
                <ul className={ui.list}>
                    <li>
                        <span className={ui.tag}>Programme</span> Keep the schedule and
                        key highlights.
                    </li>
                    <li>
                        <span className={ui.tag}>Gallery</span> Photos by day.
                    </li>
                    <li>
                        <span className={ui.tag}>Merch</span> Optional: hide ordering
                        after cutoff.
                    </li>
                </ul>
            </section>
        </main>
    );
}
