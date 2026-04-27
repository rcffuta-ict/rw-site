import { env } from "@/lib/env";
import { MemoryStore } from "@/lib/data/memoryStore";
import { ui } from "../shared/ui";
import { OrderClient } from "./OrderClient";

export default function OrderPage() {
    const hasBank = Boolean(env.bank.bankName && env.bank.accountNumber);
    const items = MemoryStore.listMerch();

    return (
        <main className={ui.page}>
            <header className={ui.header}>
                <h1 className={ui.h1}>Pre-order</h1>
                <p className={ui.lead}>
                    For now, we’re using bank transfer + receipt upload. Online payment
                    will be added later.
                </p>
            </header>

            <section className={ui.card}>
                <div className={ui.cardTitle}>Bank transfer</div>
                {hasBank ? (
                    <ul className={ui.list}>
                        <li>
                            <span className={ui.tag}>Bank</span> {env.bank.bankName}
                        </li>
                        <li>
                            <span className={ui.tag}>Name</span> {env.bank.accountName}
                        </li>
                        <li>
                            <span className={ui.tag}>Number</span>{" "}
                            {env.bank.accountNumber}
                        </li>
                    </ul>
                ) : (
                    <p className={ui.muted}>
                        Bank details will appear here once `RW_BANK_*` env vars are set.
                    </p>
                )}
            </section>

            <section className={ui.card}>
                <div className={ui.cardTitle}>Receipt upload</div>
                <p className={ui.muted}>
                    Submit your order below, then upload your receipt.
                </p>
            </section>

            <OrderClient items={items} />

            <section className={ui.card}>
                <div className={ui.cardTitle}>Online payment (Squad)</div>
                <p className={ui.muted}>
                    Coming soon. We’ll keep manual transfer available as a fallback.
                </p>
            </section>
        </main>
    );
}
