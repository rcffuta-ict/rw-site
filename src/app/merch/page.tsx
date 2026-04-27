import { MemoryStore } from "@/lib/data/memoryStore";
import Link from "next/link";
import { ui } from "../shared/ui";

export default function MerchPage() {
    const items = MemoryStore.listMerch();

    return (
        <main className={ui.page}>
            <header className={ui.header}>
                <h1 className={ui.h1}>Merch</h1>
                <p className={ui.lead}>
                    Browse available items and sizes, then proceed to pre-order.
                </p>
            </header>

            <section className={ui.grid3}>
                {items.map((item) => (
                    <div key={item.id} className={ui.card}>
                        <div className={ui.cardTitle}>{item.name}</div>
                        <div className={ui.muted}>{item.description}</div>
                        <ul className={ui.list}>
                            <li>
                                <span className={ui.tag}>From</span> ₦
                                {item.basePriceNgn.toLocaleString()}
                            </li>
                            <li>
                                <span className={ui.tag}>Sizes</span>{" "}
                                {item.sizes.join(", ")}
                            </li>
                        </ul>
                    </div>
                ))}
            </section>

            <Link href="/order" className={ui.inlineLink}>
                Continue to pre-order →
            </Link>
        </main>
    );
}
