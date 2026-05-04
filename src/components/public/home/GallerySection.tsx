import { ph } from "@/lib/utils";

export function GallerySection() {
    return (
        <section className="section-py">
            <div className="section-container">
                <div className="mb-12 flex items-end justify-between gap-6">
                    <div>
                        <p className="eyebrow mb-4">The Archives</p>
                        <h2 className="section-heading text-3xl sm:text-4xl">Moments from Previous Redemption week</h2>
                    </div>
                    <p className="text-sm text-rw-muted hidden sm:block max-w-[280px] text-right">
                        A visual journey through past editions, capturing the glory, power, and beauty of our gathering.
                    </p>
                </div>

                <div className="grid grid-flow-dense grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 auto-rows-[200px]">
                    {[
                        { w: 600, h: 600, span: "col-span-2 row-span-2" },
                        { w: 600, h: 300, span: "col-span-2 row-span-1" },
                        { w: 300, h: 600, span: "col-span-1 row-span-2" },
                        { w: 300, h: 300, span: "col-span-1 row-span-1" },
                        { w: 300, h: 300, span: "col-span-1 row-span-1" },
                        { w: 300, h: 300, span: "col-span-1 row-span-1" },
                        { w: 300, h: 300, span: "col-span-1 row-span-1" },
                        { w: 300, h: 600, span: "col-span-1 row-span-2" },
                        { w: 600, h: 600, span: "col-span-2 row-span-2" },
                        { w: 600, h: 300, span: "col-span-2 row-span-1" },
                        { w: 300, h: 300, span: "col-span-1 row-span-1" },
                        { w: 300, h: 300, span: "col-span-1 row-span-1" },
                        { w: 300, h: 300, span: "col-span-1 row-span-1" },
                        { w: 300, h: 300, span: "col-span-1 row-span-1" },
                    ].map(({ w, h, span }, i) => (
                        <div key={i} className={`${span} overflow-hidden rounded-2xl bg-rw-bg-alt hover-lift`}>
                            <img
                                src={ph(w, h, `RW Archive ${i + 1}`, "ebebeb", "aaaaaa")}
                                alt={`Archive photo ${i + 1}`}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
