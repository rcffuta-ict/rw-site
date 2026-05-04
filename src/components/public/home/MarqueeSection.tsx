export function MarqueeSection() {
    return (
        <div className="overflow-hidden border-b border-[var(--rw-border)] bg-rw-bg-alt">
            <div className="animate-marquee gap-3 py-3">
                {Array.from({ length: 16 }, (_, i) => (
                    <img
                        key={i}
                        src={`https://placehold.co/360x220/f0f0f0/c0c0c0?text=Event+${(i % 8) + 1}%0A360×220`}
                        alt={`Event moment ${(i % 8) + 1}`}
                        className="h-48 w-auto object-cover rounded-xl flex-shrink-0"
                    />
                ))}
            </div>
        </div>
    );
}
