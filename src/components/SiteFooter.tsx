export function SiteFooter() {
    return (
        <footer className="mt-auto border-t border-slate-200 bg-white">
            <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4">
                <div>
                    <div className="font-extrabold">Redemption Week</div>
                    <div className="mt-1 text-sm font-medium text-slate-500">
                        Built by RCF FUTA ICT.
                    </div>
                </div>

                <div className="flex flex-wrap items-center justify-end gap-2">
                    <span className="inline-flex items-center rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-500">
                        Light mode
                    </span>
                    <span className="inline-flex items-center rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-500">
                        rw.rcffuta.com
                    </span>
                </div>
            </div>
        </footer>
    );
}
