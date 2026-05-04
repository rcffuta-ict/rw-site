import Link from "next/link";

export function PublicFooter() {
    return (
        <footer className="bg-rw-ink text-white">
            {/* Top band with org logos */}
            <div className="border-b border-white/10">
                <div className="section-container py-8 flex flex-wrap items-center justify-center gap-8 sm:gap-12">
                    <img src="https://placehold.co/120x60?text=RCFFUTA+Logo" alt="RCF FUTA" className="h-12 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity" />
                    <img src="https://placehold.co/120x60?text=TLW+Logo" alt="The Lord's Witnesses" className="h-12 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity" />
                    <img src="https://placehold.co/120x60?text=CRM+Logo" alt="CRM" className="h-12 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity" />
                </div>
            </div>

            {/* Main footer content */}
            <div className="section-container py-16">
                <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="lg:col-span-2">
                        <div className="flex items-center gap-3 mb-4">
                            <img src="https://placehold.co/36x36?text=RCF" alt="RCF FUTA" className="h-9 w-9 rounded-lg" />
                            <div>
                                <p className="font-display font-bold text-lg">
                                    Redemption Week <span className="text-rw-crimson">&apos;26</span>
                                </p>
                                <p className="text-xs text-white/50 italic">The Lord&apos;s Witnesses: The Purified Army</p>
                            </div>
                        </div>
                        <p className="text-sm text-white/50 leading-relaxed max-w-[40ch]">
                            Redeemed Christian Fellowship, Federal University of Technology Akure. Standing in faith, values, and purpose since 1983.
                        </p>
                        <p className="mt-3 text-xs text-white/30 italic">&ldquo;A place where good things never cease.&rdquo;</p>
                    </div>

                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.15em] text-white/40 mb-5">Navigate</p>
                        <ul className="flex flex-col gap-3 text-sm text-white/60">
                            {[
                                { href: "/",         label: "Home" },
                                { href: "/shop",     label: "Shop Merch" },
                                { href: "/checkout", label: "Checkout" },
                                { href: "/fulfil",   label: "Pay an Order" },
                            ].map((l) => (
                                <li key={l.href}>
                                    <Link href={l.href} className="hover:text-white transition-colors">{l.label}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.15em] text-white/40 mb-5">Sponsorship</p>
                        <p className="text-sm text-white/50 leading-relaxed mb-4">
                            Partner with 38 years of impact. Reach 900+ students and alumni.
                        </p>
                        <a href="mailto:tobi4saviour2@gmail.com" className="inline-flex items-center gap-2 text-sm font-medium text-rw-crimson hover:text-white transition-colors">
                            Get in touch
                            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
                        </a>
                        <div className="mt-8">
                            <p className="text-xs font-bold uppercase tracking-[0.15em] text-white/40 mb-3">Admin</p>
                            <Link href="/admin" className="text-sm text-white/50 hover:text-white transition-colors">Admin Dashboard</Link>
                        </div>
                    </div>
                </div>

                <div className="mt-16 border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between gap-3 text-xs text-white/30">
                    <span>&copy; 2026 RCF FUTA · All rights reserved · CRM Family</span>
                    <span>Built with ❤ by RCF FUTA ICT Unit</span>
                </div>
            </div>
        </footer>
    );
}
