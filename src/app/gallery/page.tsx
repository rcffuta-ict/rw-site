import { ui } from "../shared/ui";

export default function GalleryPage() {
    return (
        <main className={ui.page}>
            <header className={ui.header}>
                <h1 className={ui.h1}>Gallery</h1>
                <p className={ui.lead}>
                    Photos will be added after each night (post-event update).
                </p>
            </header>

            <section className={ui.card}>
                <div className={ui.cardTitle}>Coming soon</div>
                <p className={ui.muted}>We’ll organize photos by day: Monday → Sunday.</p>
            </section>
        </main>
    );
}
