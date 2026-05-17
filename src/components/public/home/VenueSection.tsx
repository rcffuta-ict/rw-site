import Link from "next/link";
import { TENURE } from "@/lib/config";
import { ph } from "@/lib/utils/functions";

const HOW_TO_GET_THERE = [
    {
        icon: (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
            </svg>
        ),
        title: "By Road / Private Car",
        desc: "Take the Akure–Owo expressway toward FUTA. Enter via the Southgate junction and follow the event signage. The auditorium is directly beside His Grace Pavilion.",
    },
    {
        icon: (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h.75m-.75 3h.75m-.75 3h.75m-3.75 0H5.25a2.25 2.25 0 0 1-2.25-2.25V6.75A2.25 2.25 0 0 1 5.25 4.5h13.5A2.25 2.25 0 0 1 21 6.75v6.75a2.25 2.25 0 0 1-2.25 2.25H15m-3 0 3 3m0 0-3 3m3-3h-6m-2.25 0a9 9 0 1 1 0-18 9 9 0 0 1 0 18Z" />
            </svg>
        ),
        title: "From Akure City Centre",
        desc: "Board any bus/keke heading to FUTA Southgate. Ask to alight at the Southgate roundabout. Ample keke shuttle service will be running during event nights.",
    },
    {
        icon: (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" />
            </svg>
        ),
        title: "Parking",
        desc: "Free parking within the FUTA Southgate compound. Event marshals will guide you to designated areas. We recommend arriving 30 minutes early on peak nights.",
    },
];

const QUICK_FACTS = [
    { label: "Entry", value: "Free — All 7 Nights" },
    { label: "Time", value: "6:00 PM Daily" },
    { label: "Dates", value: "July 6–12, 2026" },
    { label: "Venue", value: "Southgate Auditorium" },
];

export function VenueSection() {
    return (
        <section id="venue" className="scroll-mt-20 bg-white overflow-hidden">

            {/* ── Full-width dark intro strip ──────────────────────────────── */}
            <div className="relative bg-[#1C0003] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-[#1C0003] via-[#1C0003]/95 to-[#3d0008]/80" />
                <div className="absolute inset-0 bg-gradient-to-br from-[#FF0015]/8 via-transparent to-[#FF6A00]/6" />
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FF0015]/8 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3 pointer-events-none" />
                <div className="absolute bottom-0 left-1/3 w-[300px] h-[300px] bg-[#FF6A00]/8 rounded-full blur-[80px] translate-y-1/3 pointer-events-none" />

                <div className="section-container relative z-10 py-20 lg:py-28">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10">
                        <div className="max-w-2xl">
                            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#FF6A00] mb-4">
                                Find the Venue
                            </p>
                            <h2
                                className="font-display font-extrabold text-white leading-[0.9] tracking-tight"
                                style={{ fontSize: "clamp(2.8rem, 6vw, 5.5rem)" }}
                            >
                                Come to{" "}
                                <span style={{
                                    background: "linear-gradient(135deg, #FF6A00, #FF0015)",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                    backgroundClip: "text",
                                }}>
                                    Akure
                                </span>
                                <br />
                                for the week
                            </h2>
                            <p className="mt-6 text-white/60 text-lg leading-relaxed max-w-[46ch]">
                                {TENURE.venue} is your destination for seven nights of
                                worship, drama, music, and community. Everyone is welcome — free admission, every night.
                            </p>

                            {/* Address pill */}
                            <div className="mt-7 inline-flex items-center gap-3 bg-white/8 border border-white/15
                                            rounded-2xl px-5 py-3.5 backdrop-blur-sm">
                                <div className="shrink-0 h-8 w-8 rounded-xl bg-[#FF0015]/25 border border-[#FF0015]/30
                                                flex items-center justify-center text-[#FF6A00]">
                                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-2.079 3.208-4.196 3.208-6.797a6.5 6.5 0 00-13 0c0 2.601 1.265 4.719 3.208 6.797a19.58 19.58 0 002.684 2.282 16.975 16.975 0 001.144.742zM12 9a2 2 0 100 4 2 2 0 000-4z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-white font-semibold text-sm leading-tight">
                                        {TENURE.venueAddress}
                                    </p>
                                    <p className="text-white/40 text-[11px] mt-0.5">FUTA Southgate, Akure, Ondo State</p>
                                </div>
                            </div>
                        </div>

                        {/* Quick facts grid */}
                        <div className="grid grid-cols-2 gap-3 shrink-0 lg:w-72">
                            {QUICK_FACTS.map((f) => (
                                <div key={f.label}
                                     className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4
                                                hover:bg-white/8 transition-colors">
                                    <p className="text-[10px] font-bold uppercase tracking-wide text-white/35 mb-1">
                                        {f.label}
                                    </p>
                                    <p className="text-sm font-bold text-white leading-snug">{f.value}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Navigate CTA */}
                    <div className="mt-10 flex flex-wrap gap-3">
                        <Link
                            href={TENURE.googleMapsUrl}
                            target="_blank"
                            rel="noreferrer"
                            id="venue-maps-cta"
                            className="inline-flex items-center gap-2.5 h-12 px-7 rounded-xl font-bold text-[15px]
                                       bg-white text-[#1C0003] hover:bg-[#FF0015] hover:text-white
                                       transition-all duration-300 shadow-lg hover:shadow-[0_6px_24px_rgba(255,255,255,0.2)]
                                       hover:-translate-y-0.5"
                        >
                            <svg className="h-4.5 w-4.5 h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                            </svg>
                            Navigate via Google Maps
                        </Link>
                        <Link
                            href="/support"
                            className="inline-flex items-center gap-2 h-12 px-7 rounded-xl font-semibold text-[15px]
                                       border border-white/20 text-white/80 hover:text-white hover:border-white/40
                                       hover:bg-white/8 transition-all backdrop-blur-sm"
                        >
                            Support the Event
                        </Link>
                    </div>
                </div>
            </div>

            {/* ── Map visual + directions ──────────────────────────────────── */}
            <div className="section-container section-py">
                <div className="grid lg:grid-cols-[1fr_420px] gap-10 xl:gap-16 items-start">

                    {/* Left — directions */}
                    <div>
                        <p className="eyebrow mb-5">How to Get Here</p>
                        <div className="flex flex-col gap-3">
                            {HOW_TO_GET_THERE.map((d, i) => (
                                <div
                                    key={d.title}
                                    className="group flex gap-4 rounded-2xl border border-[#e8d0d4] bg-white p-5
                                               hover:border-[#FF0015]/30 hover:shadow-md transition-all duration-300"
                                >
                                    <div
                                        className="shrink-0 h-11 w-11 rounded-xl flex items-center justify-center
                                                   text-[#FF0015] border border-[#e8d0d4] bg-[#fdf8f8]
                                                   group-hover:bg-[#FF0015] group-hover:text-white
                                                   group-hover:border-[#FF0015] transition-all duration-300"
                                    >
                                        {d.icon}
                                    </div>
                                    <div>
                                        <p className="font-bold text-[#1C0003] text-sm group-hover:text-[#FF0015] transition-colors">
                                            {d.title}
                                        </p>
                                        <p className="text-xs text-[#5c4048] mt-1.5 leading-relaxed">{d.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Landmark callout */}
                        <div className="mt-5 rounded-2xl bg-gradient-to-r from-[#FF0015]/5 to-[#FF6A00]/5
                                        border border-[#FF0015]/15 p-5 flex items-start gap-4">
                            <span className="text-2xl shrink-0">📍</span>
                            <div>
                                <p className="font-bold text-[#1C0003] text-sm">Key Landmark</p>
                                <p className="text-xs text-[#5c4048] mt-1 leading-relaxed">
                                    The auditorium is located <strong>beside His Grace Pavilion</strong> at the
                                    FUTA Southgate entrance. Look for event banners and marshals from the junction.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right — map card */}
                    <div className="lg:sticky lg:top-24">
                        {/* Map visual */}
                        <div className="relative rounded-3xl overflow-hidden border border-[#e8d0d4] shadow-xl"
                             style={{ aspectRatio: "4/5" }}>

                            {/* Map background — grid pattern resembling a map */}
                            <div className="absolute inset-0 bg-[#e8f0e8]">
                                {/* Road lines */}
                                <div className="absolute inset-0 opacity-40"
                                     style={{
                                         backgroundImage: [
                                             "linear-gradient(0deg, rgba(255,255,255,0.7) 2px, transparent 2px)",
                                             "linear-gradient(90deg, rgba(255,255,255,0.7) 2px, transparent 2px)",
                                             "linear-gradient(0deg, rgba(200,230,200,0.4) 1px, transparent 1px)",
                                             "linear-gradient(90deg, rgba(200,230,200,0.4) 1px, transparent 1px)",
                                         ].join(", "),
                                         backgroundSize: "80px 80px, 80px 80px, 20px 20px, 20px 20px",
                                     }}
                                />
                                {/* Simulated block fills */}
                                <div className="absolute" style={{ top: "10%", left: "5%", width: "35%", height: "25%", background: "rgba(200,220,200,0.5)", borderRadius: "4px" }} />
                                <div className="absolute" style={{ top: "40%", left: "55%", width: "40%", height: "20%", background: "rgba(210,225,210,0.5)", borderRadius: "4px" }} />
                                <div className="absolute" style={{ top: "60%", left: "8%", width: "28%", height: "18%", background: "rgba(205,222,205,0.5)", borderRadius: "4px" }} />
                                <div className="absolute" style={{ top: "15%", right: "5%", width: "22%", height: "30%", background: "rgba(215,228,215,0.5)", borderRadius: "4px" }} />
                                {/* Simulated road — horizontal */}
                                <div className="absolute" style={{ top: "50%", left: 0, right: 0, height: "8px", background: "rgba(255,255,255,0.9)", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }} />
                                {/* Simulated road — vertical */}
                                <div className="absolute" style={{ left: "42%", top: 0, bottom: 0, width: "8px", background: "rgba(255,255,255,0.9)", boxShadow: "1px 0 3px rgba(0,0,0,0.1)" }} />
                            </div>

                            {/* Pin + pulse */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="relative">
                                    <div className="absolute inset-0 rounded-full bg-[#FF0015]/20 animate-ping scale-150" />
                                    <div className="absolute inset-0 rounded-full bg-[#FF0015]/10 scale-[2.5]" />
                                    <div className="relative h-14 w-14 rounded-full bg-[#FF0015] flex items-center
                                                    justify-center shadow-[0_4px_24px_rgba(255,0,21,0.45)] text-white z-10">
                                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                            <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-2.079 3.208-4.196 3.208-6.797a6.5 6.5 0 00-13 0c0 2.601 1.265 4.719 3.208 6.797a19.58 19.58 0 002.684 2.282 16.975 16.975 0 001.144.742zM12 9a2 2 0 100 4 2 2 0 000-4z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    {/* Label bubble */}
                                    <div className="absolute -top-14 left-1/2 -translate-x-1/2 whitespace-nowrap
                                                    bg-white rounded-xl px-3 py-2 shadow-lg border border-[#e8d0d4]">
                                        <p className="text-[11px] font-bold text-[#1C0003]">RCFFUTA Southgate Auditorium</p>
                                        <p className="text-[10px] text-[#9a8085]">Beside His Grace Pavilion</p>
                                        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 h-3 w-3
                                                        bg-white border-r border-b border-[#e8d0d4] rotate-45" />
                                    </div>
                                </div>
                            </div>

                            {/* Compass */}
                            <div className="absolute top-4 right-4 h-9 w-9 rounded-full bg-white/90 border border-[#e8d0d4]
                                            shadow flex items-center justify-center text-[#1C0003] font-bold text-xs">
                                N↑
                            </div>

                            {/* Bottom overlay CTA */}
                            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white via-white/95 to-transparent">
                                <Link
                                    href={TENURE.googleMapsUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center justify-center gap-2.5 h-12 w-full rounded-2xl
                                               bg-[#1C0003] text-white font-bold text-sm shadow-md
                                               hover:bg-[#FF0015] transition-all duration-300
                                               hover:shadow-[0_4px_20px_rgba(255,0,21,0.35)]"
                                >
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" />
                                    </svg>
                                    Open Navigation in Google Maps
                                    <svg className="h-3.5 w-3.5 opacity-60" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                                    </svg>
                                </Link>
                                <p className="text-center text-[11px] text-[#9a8085] mt-2">
                                    Real navigation · Coordinates: 7.3257°N, 5.1888°E
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
