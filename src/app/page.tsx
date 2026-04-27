import Link from "next/link";

export default function Home() {
    return (
        <div className="bg-[radial-gradient(900px_500px_at_20%_10%,rgba(37,99,235,0.16),transparent_55%),radial-gradient(700px_420px_at_85%_15%,rgba(249,115,22,0.16),transparent_52%)]">
            <main className="mx-auto flex w-full max-w-6xl flex-col gap-7 px-4 py-10">
                <section className="flex flex-col gap-5 lg:flex-row lg:items-stretch lg:justify-between">
                    <div className="flex-1 min-w-0 pt-3">
                        <div className="inline-flex items-center rounded-full border border-slate-200 bg-white/80 px-3 py-2 text-sm font-semibold text-slate-500">
                            rw.rcffuta.com
                        </div>
                        <h1 className="mt-4 text-balance text-5xl font-black leading-[1.02] tracking-[-1.4px] text-slate-900 md:text-6xl">
                            Redemption Week
                            <span className="text-blue-600">
                                {" "}
                                — a full week of Word,
                            </span>{" "}
                            prayer, worship, and community
                        </h1>
                        <p className="mt-4 max-w-[56ch] text-balance text-lg leading-relaxed text-slate-500">
                            Get the programme, invite your friends, and pre-order merch
                            early for easy pickup during the week.
                        </p>
                        <div className="mt-5 flex flex-wrap items-center gap-3">
                            <Link
                                className="inline-flex h-11 items-center justify-center rounded-xl bg-blue-600 px-4 font-extrabold text-white shadow-md transition hover:-translate-y-0.5"
                                href="/programme"
                            >
                                View programme
                            </Link>
                            <Link
                                className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white/90 px-4 font-extrabold text-slate-900 transition hover:-translate-y-0.5"
                                href="/merch"
                            >
                                Browse merch
                            </Link>
                        </div>
                    </div>

                    <div
                        className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white/90 shadow-lg lg:w-[380px]"
                        aria-hidden="true"
                    >
                        <div className="flex items-center gap-2 border-b border-slate-200 px-4 py-3">
                            <div className="h-2.5 w-2.5 rounded-full bg-linear-to-br from-blue-600 to-orange-500" />
                            <div className="font-extrabold">This week</div>
                        </div>
                        <div className="flex flex-col gap-3 px-4 py-4">
                            {[
                                ["Mon", "Opening Ceremony"],
                                ["Tue", "Word Night"],
                                ["Wed", "Power Night"],
                                ["Thu", "Drama Night"],
                                ["Fri", "Choir Concert"],
                                ["Sat", "Alumni Reunion"],
                                ["Sun", "Handing Over"],
                            ].map(([d, e]) => (
                                <div
                                    key={d}
                                    className="grid grid-cols-[52px_1fr] items-center gap-3"
                                >
                                    <span className="inline-flex h-8 items-center justify-center rounded-xl border border-slate-200 bg-white text-xs font-extrabold text-slate-500">
                                        {d}
                                    </span>
                                    <span className="font-bold">{e}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="grid gap-3 md:grid-cols-3">
                    <Link
                        href="/programme"
                        className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-600/40"
                    >
                        <div className="text-base font-extrabold">Programme</div>
                        <div className="mt-2 leading-relaxed text-slate-500">
                            Night-by-night schedule with speakers and details.
                        </div>
                    </Link>
                    <Link
                        href="/merch"
                        className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-600/40"
                    >
                        <div className="text-base font-extrabold">Merch</div>
                        <div className="mt-2 leading-relaxed text-slate-500">
                            See what’s available, sizes, and prices.
                        </div>
                    </Link>
                    <Link
                        href="/order"
                        className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-600/40"
                    >
                        <div className="text-base font-extrabold">Pre-order</div>
                        <div className="mt-2 leading-relaxed text-slate-500">
                            Reserve items and upload your payment receipt.
                        </div>
                    </Link>
                </section>
            </main>
        </div>
    );
}
