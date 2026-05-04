import Link from "next/link";

export function PublicFooter() {
    return (
        <footer className="border-t border-[var(--rw-border)] bg-rw-bg-alt mt-20">
            <div className="section-container py-14">
                <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="lg:col-span-2">
                        <p className="font-display font-bold text-xl text-rw-ink">Redemption Week <span className="text-rw-crimson">&apos;26</span></p>
                        <p className="mt-1 text-sm italic text-rw-text-2">The Lord&apos;s Witnesses: The Purified Army</p>
                        <p className="mt-4 text-sm text-rw-muted leading-relaxed max-w-[36ch]">
                            Redeemed Christian Fellowship, Federal University of Technology Akure. Standing in faith, values, and purpose since 1983.
                        </p>
                        <p className="mt-2 text-xs text-rw-muted/70 italic">&ldquo;A place where good things never cease.&rdquo;</p>
                    </div>

                    <div>
                        <p className="eyebrow mb-4">Navigate</p>
                        <ul className="flex flex-col gap-2 text-sm text-rw-text-2">
                            {[
                                { href: "/",         label: "Home" },
                                { href: "/shop",     label: "Shop Merch" },
                                { href: "/checkout", label: "Checkout" },
                                { href: "/fulfil",   label: "Pay an Order" },
                            ].map((l) => (
                                <li key={l.href}>
                                    <Link href={l.href} className="hover:text-rw-crimson transition-colors">{l.label}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <p className="eyebrow mb-4">Sponsorship</p>
                        <p className="text-sm text-rw-muted leading-relaxed mb-3">
                            Partner with 38 years of impact. Reach 900+ students and alumni.
                        </p>
                        <a href="mailto:tobi4saviour2@gmail.com" className="text-sm font-medium text-rw-crimson hover:underline">
                            Get in touch
                        </a>
                        <p className="mt-4 eyebrow mb-2">Admin</p>
                        <Link href="/admin" className="text-sm text-rw-text-2 hover:text-rw-crimson transition-colors">Admin Dashboard</Link>
                    </div>
                </div>

                <div className="mt-10 border-t border-[var(--rw-border)] pt-6 flex flex-col sm:flex-row justify-between gap-2 text-xs text-rw-muted">
                    <span>&copy; 2026 RCF FUTA · All rights reserved · CRM Family</span>
                    <span>Built by RCF FUTA ICT Unit</span>
                </div>
            </div>
        </footer>
    );
}
