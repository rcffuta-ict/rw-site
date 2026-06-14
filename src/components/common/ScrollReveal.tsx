"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Activates the CSS scroll-reveal system (see globals.css `[data-reveal]`).
 * Any element with a `data-reveal` attribute starts hidden and animates in
 * when it scrolls into view. Group staggering is handled in CSS via
 * `[data-reveal-group]`. Mount once near the root of the app.
 *
 * A MutationObserver keeps it working for content that mounts *after* the
 * initial render (e.g. data that loads in, view switches, modals) — without it
 * those late elements would stay stuck at opacity:0.
 */
export function ScrollReveal() {
    const pathname = usePathname();

    useEffect(() => {
        const reveal = (el: Element) => el.classList.add("revealed");
        const collect = () =>
            document.querySelectorAll<HTMLElement>("[data-reveal]:not(.revealed)");

        // Respect reduced-motion: show everything immediately, no animation —
        // including anything that mounts later.
        const prefersReduced = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;
        if (prefersReduced) {
            const revealAll = () => collect().forEach(reveal);
            revealAll();
            const mo = new MutationObserver(revealAll);
            mo.observe(document.body, { childList: true, subtree: true });
            return () => mo.disconnect();
        }

        const io = new IntersectionObserver(
            (entries, obs) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        reveal(entry.target);
                        obs.unobserve(entry.target);
                    }
                }
            },
            { rootMargin: "0px 0px -40px 0px", threshold: 0 }
        );

        // observe() is idempotent, so re-scanning is safe and cheap.
        const observeAll = () => collect().forEach((el) => io.observe(el));

        let raf = 0;
        const schedule = () => {
            cancelAnimationFrame(raf);
            raf = requestAnimationFrame(observeAll);
        };

        schedule();

        // Pick up elements added after the initial render.
        const mo = new MutationObserver(schedule);
        mo.observe(document.body, { childList: true, subtree: true });

        return () => {
            cancelAnimationFrame(raf);
            mo.disconnect();
            io.disconnect();
        };
    }, [pathname]);

    return null;
}
