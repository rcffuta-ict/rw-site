import type { Metadata } from "next";
import { TENURE, FELLOWSHIP } from "@/lib/config";
import { HeaderBanner } from "@/components/common/HeaderBanner";
import { CtaBannerSection } from "@/components/public/home/CtaBannerSection";
import { BrandAssetsClient } from "@/components/public/brand/BrandAssetsClient";

export const metadata: Metadata = {
    title: `Brand & Media Kit — ${TENURE.eventName} ${TENURE.year}`,
    description: `Official logos, colours, and usage guidelines for ${FELLOWSHIP.shortName}'s ${TENURE.eventName} ${TENURE.year}.`,
};

export default function BrandAssetsPage() {
    return (
        <div className="min-h-screen bg-white">
            <HeaderBanner
                header="Brand & Media Kit"
                title="Official Brand Assets"
                bannerDescription="Redemption Week event branding banner"
                description={`Logos, colours, and usage guidelines for ${FELLOWSHIP.shortName}'s ${TENURE.eventName} ${TENURE.year}. Please use these official files when featuring the event.`}
            />
            <BrandAssetsClient />
            <CtaBannerSection />
        </div>
    );
}
