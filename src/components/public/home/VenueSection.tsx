import Link from "next/link";
import { TENURE } from "@/lib/config";
import { ph } from "@/lib/utils/functions";

const DIRECTIONS = [
    {
        mode: "By Road",
        icon: (
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
        ),
        desc: "Take the Akure–Owo road into FUTA main campus. At the Southgate roundabout, enter via the south entrance. The auditorium is the large hall on your right.",
    },
    {
        mode: "From Akure City",
        icon: (
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
        ),
        desc: "From Akure city center, take a bus or keke napep heading to FUTA. Alight at the Southgate junction. The event signage will guide you from there.",
    },
    {
        mode: "Parking",
        icon: (
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" />
        ),
        desc: "Ample parking is available within the FUTA Southgate premises. Follow the event marshals for parking guidance. Early arrival recommended on busy nights.",
    },
];

export function VenueSection() {
    return (
        <section className="section-py bg-white overflow-hidden">
            <div className="section-container">
                {/* Header */}
                <div className="mb-14 max-w-2xl">
                    <p className="eyebrow mb-4">Find Us</p>
                    <h2 className="section-heading text-3xl sm:text-4xl lg:text-5xl">
                        Getting to the{" "}
                        <span className="text-[#FF0015]">Venue</span>
                    </h2>
                    <p className="mt-5 text-rw-text-2 text-lg leading-relaxed">
                        Joining us from near or far? Here&apos;s everything you need to locate
                        the RCFFUTA Southgate Auditorium for {TENURE.brandLabel}.
                    </p>
                </div>

                <div className="grid lg:grid-cols-[1fr_480px] gap-10 xl:gap-16 items-start">
                    {/* LEFT — directions + address card */}
                    <div className="flex flex-col gap-6">
                        {/* Address card */}
                        <div className="rounded-2xl border border-[#e8d0d4] bg-[#fdf8f8] p-6 flex items-start gap-5">
                            <div className="shrink-0 h-11 w-11 rounded-xl bg-[#FF0015]/10 border border-[#FF0015]/20
                                            flex items-center justify-center text-[#FF0015]">
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                                </svg>
                            </div>
                            <div>
                                <p className="font-display font-bold text-[#1C0003] text-lg">
                                    {TENURE.venue}
                                </p>
                                <p className="text-sm text-rw-text-2 mt-1 leading-relaxed">
                                    {TENURE.venueAddress}
                                </p>
                                <div className="mt-3 flex flex-wrap gap-2">
                                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-[#FF0015] bg-[#FF0015]/8 border border-[#FF0015]/15 px-2.5 py-1 rounded-full">
                                        <span className="h-1.5 w-1.5 rounded-full bg-[#FF0015] animate-pulse-soft" />
                                        {TENURE.dateRange}
                                    </span>
                                    <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-rw-muted border border-[#e8d0d4] px-2.5 py-1 rounded-full">
                                        Free Admission · All Nights
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Direction cards */}
                        <div className="flex flex-col gap-3">
                            {DIRECTIONS.map((d, i) => (
                                <div
                                    key={d.mode}
                                    className="group rounded-2xl border border-[#e8d0d4] bg-white p-5 flex gap-4
                                               hover:border-[#d4a8b0] hover:shadow-sm transition-all duration-200"
                                >
                                    <div className="shrink-0 h-10 w-10 rounded-xl bg-[#fdf8f8] border border-[#e8d0d4]
                                                    flex items-center justify-center text-[#FF0015] group-hover:bg-[#FF0015]/8
                                                    group-hover:border-[#FF0015]/20 transition-colors">
                                        <svg className="h-4.5 w-4.5 h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                                            {d.icon}
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-bold text-[#1C0003] text-sm group-hover:text-[#FF0015] transition-colors">
                                            {d.mode}
                                        </p>
                                        <p className="text-xs text-rw-text-2 mt-1.5 leading-relaxed">{d.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Google Maps CTA */}
                        <Link
                            href={TENURE.googleMapsUrl}
                            target="_blank"
                            rel="noreferrer"
                            id="venue-maps-cta"
                            className="flex items-center justify-center gap-3 h-12 rounded-2xl bg-[#1C0003] text-white
                                       font-bold text-sm hover:bg-[#FF0015] transition-all duration-300 shadow-md
                                       hover:shadow-[0_4px_20px_rgba(255,0,21,0.3)]"
                        >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" />
                            </svg>
                            Open in Google Maps
                            <svg className="h-4 w-4 opacity-60" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                            </svg>
                        </Link>
                    </div>

                    {/* RIGHT — embedded map preview card */}
                    <div className="lg:sticky lg:top-28">
                        {/* Map thumbnail with overlay CTA */}
                        <div className="relative rounded-3xl overflow-hidden shadow-xl border border-[#e8d0d4] group cursor-pointer"
                             style={{ aspectRatio: "4/5" }}>
                            {/* Map placeholder — replace iframe src with real embed when you have the link */}
                            <img
                                src={ph(480, 600, "FUTA Southgate Auditorium\nAkure, Ondo State\n\n📍 Venue Map", "e8f0e0", "1C0003")}
                                alt="Venue map preview"
                                className="w-full h-full object-cover"
                            />

                            {/* Map grid overlay effect */}
                            <div className="absolute inset-0 opacity-20"
                                style={{
                                    backgroundImage: "linear-gradient(rgba(28,0,3,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(28,0,3,0.1) 1px, transparent 1px)",
                                    backgroundSize: "30px 30px",
                                }}
                            />

                            {/* Center pin */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="relative">
                                    <div className="h-14 w-14 rounded-full bg-[#FF0015] shadow-[0_0_0_8px_rgba(255,0,21,0.2),0_0_0_16px_rgba(255,0,21,0.1)] flex items-center justify-center text-white animate-pulse-soft">
                                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                            <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-2.079 3.208-4.196 3.208-6.797a6.5 6.5 0 00-13 0c0 2.601 1.265 4.719 3.208 6.797a19.58 19.58 0 002.684 2.282 16.975 16.975 0 001.144.742zM12 9a2 2 0 100 4 2 2 0 000-4z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Bottom CTA overlay */}
                            <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-white via-white/90 to-transparent">
                                <Link
                                    href={TENURE.googleMapsUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center justify-center gap-2.5 h-11 w-full rounded-xl
                                               bg-[#FF0015] text-white font-bold text-sm shadow-md
                                               hover:bg-[#cc0011] transition-all hover:shadow-[0_4px_16px_rgba(255,0,21,0.35)]"
                                >
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                                    </svg>
                                    Navigate to Venue
                                </Link>
                                <p className="text-center text-xs text-rw-muted mt-2">
                                    Opens Google Maps navigation
                                </p>
                            </div>
                        </div>

                        {/* Info pills below map */}
                        <div className="mt-4 grid grid-cols-2 gap-3">
                            {[
                                { label: "Entry", value: "Free — All Nights" },
                                { label: "Starts", value: "6:00 PM Daily" },
                                { label: "Duration", value: "July 6–12, 2026" },
                                { label: "Venue", value: "FUTA Southgate" },
                            ].map((info) => (
                                <div key={info.label} className="rounded-xl border border-[#e8d0d4] bg-[#fdf8f8] px-4 py-3">
                                    <p className="text-[10px] font-bold uppercase tracking-wide text-rw-muted">{info.label}</p>
                                    <p className="text-sm font-semibold text-[#1C0003] mt-0.5">{info.value}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
