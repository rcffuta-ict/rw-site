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
import { getSettings } from "@/lib/services/settings.service";

export default async function LandingPage() {
    const settings = await getSettings();
    // When pre-orders are closed, products are hidden across the site.
    const products = settings.preorders_enabled ? await getProducts() : [];

    return (
        <div className="bg-white overflow-x-hidden">
            <HeroSection />
            <StatsSection />
            <MarqueeSection />

            <SevenNightsSection nights={NIGHTS} />

            <div className="section-container">
                <div className="section-divider" />
            </div>

            <AboutSection />
            {settings.preorders_enabled && (
                <MerchPreviewSection products={products} />
            )}

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
        </div>
    );
}
