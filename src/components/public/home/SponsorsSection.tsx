"use client";
import { ph } from "@/lib/utils/functions";
import { Button } from "@/components/ui/forms/Button";

const SPONSORS = [
    {
        tier: "Diamond",
        amount: "₦1,000,000",
        perks: [
            "All-week logo placement",
            "Daily exhibition booth",
            "20s video ad daily",
            "Vocal mentions nightly",
        ],
        highlight: true,
    },
    {
        tier: "Gold",
        amount: "₦750,000",
        perks: ["All-week logo placement", "Booth × 4 days", "Video ads × 4 days"],
        highlight: false,
    },
    {
        tier: "Silver",
        amount: "₦500,000",
        perks: ["All-week logo placement", "Booth × 3 days", "Video × 3 days"],
        highlight: false,
    },
    {
        tier: "Bronze",
        amount: "₦250,000",
        perks: ["Logo × 2 days", "Booth × 2 days", "Image ads daily"],
        highlight: false,
    },
];

const CONTACTS = [
    {
        name: "Aiyejagbara Tobi",
        phone: "09031676421",
        email: "tobi4saviour2@gmail.com",
        title: "Finance Lead",
    },
    {
        name: "Olatona Ayobami",
        phone: "09069948890",
        email: "ayobamioluwaseyi118@gmail.com",
        title: "Committe Chairperson",
    },
];

export function SponsorsSection() {
    const handleDownload = () => {
        // In a real scenario, this would link to a PDF file in the public folder
        // e.g. window.open('/docs/sponsorship-prospectus.pdf', '_blank');
        alert(
            "The 2026 Sponsorship Prospectus is currently being finalized with the latest event schedule. \n\nIn the meantime, our committee leads (listed below) can send you the draft version immediately upon request."
        );
    };

    return (
        <section className="bg-white section-py-lg overflow-hidden">
            <div className="section-container relative">
                {/* Decorative background element */}
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-rw-crimson/5 rounded-full blur-3xl -z-10" />
                <div className="absolute top-1/2 -left-24 w-64 h-64 bg-rw-gold/5 rounded-full blur-3xl -z-10" />

                <div className="mb-16 text-center lg:text-left flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                    <div className="max-w-[600px]">
                        <p className="eyebrow mb-4 !text-rw-crimson !font-bold">
                            Partnership Opportunity
                        </p>
                        <h2 className="section-heading text-4xl sm:text-5xl lg:text-6xl mb-6">
                            Support Us
                        </h2>
                        <p className="text-rw-text-2 text-lg lg:text-xl leading-relaxed">
                            Partner with{" "}
                            <span className="font-bold text-rw-ink">
                                38 years of impact
                            </span>
                            . Connect your brand with 900+ active students and 9,000+
                            alumni during our flagship week of events.
                        </p>
                    </div>
                    <div className="shrink-0 pb-2">
                        <Button
                            variant="primary"
                            size="lg"
                            className="shadow-rw-shadow-crimson !px-10"
                            onClick={handleDownload}
                        >
                            Download Prospectus
                        </Button>
                    </div>
                </div>

                {/* Tier cards */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-24">
                    {SPONSORS.map((s) => (
                        <div
                            key={s.tier}
                            className={`rw-card group p-8 flex flex-col gap-6 transition-all duration-500 hover:-translate-y-2 ${
                                s.highlight
                                    ? "ring-2 ring-rw-crimson border-transparent bg-gradient-to-b from-rw-crimson/[0.03] to-white shadow-xl"
                                    : "hover:border-rw-crimson/30 hover:shadow-lg"
                            }`}
                        >
                            <div className="relative">
                                {s.highlight && (
                                    <span className="absolute -top-12 -right-4 bg-rw-crimson text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-md">
                                        Most Impactful
                                    </span>
                                )}
                                <p
                                    className={`eyebrow mb-2 ${s.highlight ? "!text-rw-crimson" : "text-rw-muted"}`}
                                >
                                    {s.tier} Tier
                                </p>
                                <p className="font-display font-bold text-rw-ink text-3xl group-hover:text-rw-crimson transition-colors">
                                    {s.amount}
                                </p>
                            </div>

                            <div className="h-px w-full bg-rw-border" />

                            <ul className="flex flex-col gap-3 flex-1">
                                {s.perks.map((perk) => (
                                    <li
                                        key={perk}
                                        className="flex items-start gap-3 text-[13px] text-rw-text-2 leading-tight"
                                    >
                                        <div className="h-5 w-5 rounded-full bg-rw-crimson/10 flex items-center justify-center shrink-0 mt-0.5">
                                            <svg
                                                className="h-3 w-3 text-rw-crimson"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth={3}
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="m4.5 12.75 6 6 9-13.5"
                                                />
                                            </svg>
                                        </div>
                                        {perk}
                                    </li>
                                ))}
                            </ul>

                            <Button
                                variant={s.highlight ? "primary" : "outlined"}
                                size="sm"
                                className="w-full mt-4"
                                onClick={() =>
                                    (window.location.href = `mailto:tobi4saviour2@gmail.com?subject=Sponsorship Interest: ${s.tier} Tier`)
                                }
                            >
                                Select Tier
                            </Button>
                        </div>
                    ))}
                </div>

                {/* Community Partners Grid with "Your Logo Here" */}
                <div className="bg-rw-bg-alt rounded-[3rem] p-10 lg:p-16 border border-[var(--rw-border)]">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-10 mb-12">
                        <div className="text-center lg:text-left">
                            <h3 className="font-display font-bold text-2xl lg:text-3xl text-rw-ink">
                                Confirmed Partners
                            </h3>
                            <p className="text-rw-muted text-sm mt-2">
                                Join these forward-thinking brands supporting the next
                                generation.
                            </p>
                        </div>
                        <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-rw-crimson">
                            <span className="h-2 w-2 rounded-full bg-current animate-pulse" />
                            4 Spots remaining for 2026
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                        {/* Current Partners (Simulated) */}
                        {[1, 2].map((i) => (
                            <div
                                key={`partner-${i}`}
                                className="h-24 bg-white rounded-2xl border border-[var(--rw-border)] flex items-center justify-center p-6 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all cursor-default shadow-sm hover:shadow-md"
                            >
                                <img
                                    src={ph(120, 40, `Brand ${i}`, "ffffff", "111827")}
                                    alt={`Partner ${i}`}
                                    className="max-h-full max-w-full object-contain"
                                />
                            </div>
                        ))}

                        {/* Empty Slots */}
                        {[1, 2, 3, 4].map((i) => (
                            <div
                                key={`slot-${i}`}
                                className="h-24 rounded-2xl border-2 border-dashed border-rw-muted/20 bg-white/50 flex flex-col items-center justify-center gap-2 group cursor-pointer hover:border-rw-crimson/30 hover:bg-white transition-all"
                            >
                                <div className="h-8 w-8 rounded-full bg-rw-bg-alt border border-[var(--rw-border)] flex items-center justify-center text-rw-muted group-hover:bg-rw-crimson/10 group-hover:text-rw-crimson transition-colors">
                                    <svg
                                        className="h-4 w-4"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2.5}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M12 4.5v15m7.5-7.5h-15"
                                        />
                                    </svg>
                                </div>
                                <span className="text-[10px] font-bold text-rw-muted uppercase tracking-wider group-hover:text-rw-crimson transition-colors">
                                    Your Logo Here
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Strategic Outreach Invitation */}
                <div className="mt-16 lg:mt-24 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    <div className="order-2 lg:order-1">
                        <div className="rw-card p-8 lg:p-10 border-l-4 border-l-rw-crimson shadow-rw-shadow-md">
                            <h3 className="font-display font-bold text-2xl text-rw-ink mb-6">
                                Why Partner With Us?
                            </h3>
                            <div className="space-y-6">
                                {[
                                    {
                                        title: "Direct Audience Access",
                                        desc: "Interact directly with 900+ high-achieving undergraduates through exhibition booths and workshops.",
                                    },
                                    {
                                        title: "Digital Brand Immersion",
                                        desc: "Get attributed across our website, social media, and event live streams reaching thousands of alumni.",
                                    },
                                    {
                                        title: "Corporate Social Responsibility",
                                        desc: "Support the holistic development of youth through spiritual and values-based leadership training.",
                                    },
                                ].map((item) => (
                                    <div key={item.title} className="flex gap-4">
                                        <div className="shrink-0 h-2 w-2 rounded-full bg-rw-crimson mt-2" />
                                        <div>
                                            <p className="font-bold text-rw-ink text-base">
                                                {item.title}
                                            </p>
                                            <p className="text-sm text-rw-text-2 mt-1 leading-relaxed">
                                                {item.desc}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="order-1 lg:order-2 space-y-8 text-center lg:text-left">
                        <div>
                            <h3 className="font-display font-bold text-3xl lg:text-4xl text-rw-ink mb-4">
                                Let&apos;s Discuss Your Impact
                            </h3>
                            <p className="text-rw-text-2 text-lg leading-relaxed">
                                Our sponsorship packages are flexible. Reach out to our
                                planning committee leads to discuss how we can tailor our
                                platforms to suit your brand objectives.
                            </p>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-6">
                            {CONTACTS.map((c) => (
                                <div
                                    key={c.name}
                                    className="p-6 rounded-[2rem] bg-rw-bg-warm border border-rw-crimson/10 hover:border-rw-crimson/30 transition-colors"
                                >
                                    <p className="text-[11px] font-bold uppercase tracking-widest text-rw-crimson mb-2">
                                        {c.title}
                                    </p>
                                    <p className="font-display font-bold text-rw-ink text-lg">
                                        {c.name}
                                    </p>
                                    <div className="mt-3 space-y-1">
                                        <a
                                            href={`tel:${c.phone}`}
                                            className="block text-sm text-rw-text-2 hover:text-rw-white transition-colors"
                                        >
                                            {c.phone}
                                        </a>
                                        <a
                                            href={`mailto:${c.email}`}
                                            className="block text-sm text-rw-crimson hover:text-rw-white hover:bg-rw-crimson px-2 py-0.5 rounded-md -ml-2 inline-block transition-all"
                                        >
                                            {c.email}
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="pt-4 flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                            <Button
                                variant="primary"
                                size="lg"
                                className="w-full sm:w-auto shadow-rw-shadow-crimson"
                            >
                                Send a Message
                            </Button>
                            <p className="text-xs text-rw-muted font-medium">
                                Average response time: &lt; 2 hours
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
