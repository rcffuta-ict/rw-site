import Link from "next/link";

const links: Array<{ href: string; label: string }> = [
    { href: "/programme", label: "Programme" },
    { href: "/merch", label: "Merch" },
    { href: "/order", label: "Pre-order" },
    { href: "/gallery", label: "Gallery" },
    { href: "/archive", label: "Archive" },
];

export function SiteHeader() {
    return (
        <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/80 backdrop-blur">
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
                <Link href="/" className="inline-flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-linear-to-br from-blue-600 to-orange-500 font-extrabold tracking-wide text-white shadow-md">
                        RW
                    </span>
                    <span className="flex flex-col leading-tight">
                        <span className="font-extrabold text-slate-900">
                            Redemption Week
                        </span>
                        <span className="mt-0.5 text-xs font-semibold text-slate-500">
                            RCF FUTA
                        </span>
                    </span>
                </Link>

                <nav className="flex items-center gap-2" aria-label="Primary">
                    {links.map((l) => (
                        <Link
                            key={l.href}
                            href={l.href}
                            className="rounded-xl px-3 py-2 text-sm font-bold text-slate-900 hover:bg-blue-600/10"
                        >
                            {l.label}
                        </Link>
                    ))}
                </nav>
            </div>
        </header>
    );
}
