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
        <div className="flex flex-col gap-6 max-w-lg">
            <div>
                <h1 className="section-heading text-2xl text-rw-ink">Settings</h1>
                <p className="mt-1 text-sm text-rw-muted">Payment configuration and admin preferences.</p>
            </div>

            <div className="rw-card p-6 flex flex-col gap-5">
                <h2 className="font-display font-bold text-rw-ink">Bank Transfer Details</h2>
                <p className="text-xs text-rw-muted -mt-3">These details are shown to customers on the payment page.</p>

                {[
                    { id: "bank-name",    label: "Bank Name",       value: PAYMENT_CONFIG.bank },
                    { id: "account-name", label: "Account Name",    value: PAYMENT_CONFIG.accountName },
                    { id: "account-num",  label: "Account Number",  value: PAYMENT_CONFIG.accountNumber },
                ].map(f => (
                    <div key={f.id}>
                        <label htmlFor={f.id} className="block text-sm font-medium text-rw-ink mb-1.5">{f.label}</label>
                        <input
                            id={f.id}
                            defaultValue={f.value}
                            className="w-full h-11 rounded-xl border border-[var(--rw-border-mid)] px-4 text-sm bg-rw-surface text-rw-ink focus:outline-none focus:ring-2 focus:ring-rw-crimson/30 focus:border-rw-crimson"
                        />
                    </div>
                ))}

                <div>
                    <label htmlFor="min-percent" className="block text-sm font-medium text-rw-ink mb-1.5">
                        Minimum payment % <span className="font-normal text-rw-muted">(1–100)</span>
                    </label>
                    <input
                        id="min-percent"
                        type="number"
                        min={1} max={100}
                        defaultValue={PAYMENT_CONFIG.minPercent}
                        className="w-32 h-11 rounded-xl border border-[var(--rw-border-mid)] px-4 text-sm bg-rw-surface text-rw-ink focus:outline-none focus:ring-2 focus:ring-rw-crimson/30 focus:border-rw-crimson"
                    />
                </div>

                <div className="flex items-center gap-3">
                    <input id="installment" type="checkbox" defaultChecked={PAYMENT_CONFIG.installmentAllowed} className="accent-rw-crimson h-4 w-4" />
                    <label htmlFor="installment" className="text-sm text-rw-ink">Allow installment payments</label>
                </div>

                <button className="self-start h-10 rounded-xl bg-rw-crimson px-5 text-sm font-semibold text-white hover:bg-rw-crimson-dk transition-colors">
                    Save Changes
                </button>
            </div>

            <div className="rw-card p-5 text-sm text-rw-muted">
                <p className="font-semibold text-rw-ink mb-1">Note</p>
                <p>In production, these values will be persisted to Supabase. For now this is a demo — changes are not saved.</p>
            </div>
        </div>
    );
}
