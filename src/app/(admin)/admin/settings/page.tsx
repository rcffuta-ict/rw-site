export const metadata = { title: "Settings — RW'26 Admin" };

const PAYMENT_CONFIG = {
    bank: "First Bank",
    accountName: "RCF FUTA",
    accountNumber: "3012345678",
    minPercent: 50,
    installmentAllowed: true,
};

export default function AdminSettingsPage() {
    return (
        <div className="flex flex-col gap-8 max-w-2xl">
            <div>
                <h1 className="section-heading text-2xl lg:text-3xl">Settings</h1>
                <p className="mt-1 text-sm text-rw-muted">Payment configuration and admin preferences.</p>
            </div>

            <div className="rw-card overflow-hidden">
                <div className="px-6 py-5 border-b border-[var(--rw-border)]">
                    <h2 className="font-display font-bold text-rw-ink">Bank Transfer Details</h2>
                    <p className="text-xs text-rw-muted mt-1">These details are shown to customers on the payment page.</p>
                </div>

                <div className="p-6 flex flex-col gap-5">
                    {[
                        { id: "bank-name",    label: "Bank Name",       value: PAYMENT_CONFIG.bank },
                        { id: "account-name", label: "Account Name",    value: PAYMENT_CONFIG.accountName },
                        { id: "account-num",  label: "Account Number",  value: PAYMENT_CONFIG.accountNumber },
                    ].map(f => (
                        <div key={f.id}>
                            <label htmlFor={f.id} className="block text-sm font-medium text-rw-ink mb-2">{f.label}</label>
                            <input id={f.id} defaultValue={f.value} className="rw-input" />
                        </div>
                    ))}

                    <div>
                        <label htmlFor="min-percent" className="block text-sm font-medium text-rw-ink mb-2">
                            Minimum payment % <span className="font-normal text-rw-muted">(1–100)</span>
                        </label>
                        <input
                            id="min-percent" type="number" min={1} max={100}
                            defaultValue={PAYMENT_CONFIG.minPercent}
                            className="rw-input !w-32"
                        />
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                        <input id="installment" type="checkbox" defaultChecked={PAYMENT_CONFIG.installmentAllowed} className="accent-rw-crimson h-4 w-4" />
                        <label htmlFor="installment" className="text-sm text-rw-ink">Allow installment payments</label>
                    </div>
                </div>

                <div className="px-6 py-4 border-t border-[var(--rw-border)] bg-rw-bg-alt/50">
                    <button className="btn-primary !h-10 !px-6 text-sm">Save Changes</button>
                </div>
            </div>

            <div className="rw-card p-6 flex gap-3 items-start">
                <svg className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" /></svg>
                <div>
                    <p className="font-semibold text-rw-ink text-sm">Note</p>
                    <p className="text-sm text-rw-muted mt-0.5">In production, these values will be persisted to Supabase. For now this is a demo — changes are not saved.</p>
                </div>
            </div>
        </div>
    );
}
