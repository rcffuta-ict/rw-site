import { SevenNightsSection } from "@/components/public/SevenNightsSection";
import { NIGHTS } from "@/lib/data/home";

import { HeroSection } from "@/components/public/home/HeroSection";
import { StatsSection } from "@/components/public/home/StatsSection";
import { MarqueeSection } from "@/components/public/home/MarqueeSection";
import { AboutSection } from "@/components/public/home/AboutSection";
import { MerchPreviewSection } from "@/components/public/home/MerchPreviewSection";
import { GallerySection } from "@/components/public/home/GallerySection";
import { SponsorsSection } from "@/components/public/home/SponsorsSection";
import { CtaBannerSection } from "@/components/public/home/CtaBannerSection";
import { VenueSection } from "@/components/public/home/VenueSection";
import { getProducts } from "@/lib/services/products.service";

export default async function LandingPage() {
    const products = await getProducts();

    return (
        // -mt-16 pulls the hero up under the sticky header so the transparent
        // header overlays the hero (header height = h-16). The header restores
        // its solid background once you scroll past the hero.
        <>
            <HeroSection />
            <StatsSection />
            <MarqueeSection />

            <SevenNightsSection nights={NIGHTS} />

            <div className="section-container">
                <div className="section-divider" />
            </div>

            <AboutSection />
            <MerchPreviewSection products={products} />

            {/* <div className="section-container">
                <div className="section-divider" />
            </div> */}

            <GallerySection />

            {/* <div className="section-container">
                <div className="section-divider" />
            </div> */}

            <VenueSection />
            <SponsorsSection />
            <CtaBannerSection />
        </>
    );
}
