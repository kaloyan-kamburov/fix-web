import React from "react";
import { CallToActionSection } from "./sections/CallToActionSection";
import { FeaturedServicesSection } from "./sections/FeaturedServicesSection";
import { HeroBannerSection } from "./sections/HeroBannerSection";
import { MainContentSection } from "./sections/MainContentSection";
import { ServiceCategoriesSection } from "./sections/ServiceCategoriesSection";
import { SiteFooterSection } from "./sections/SiteFooterSection";

export const Landing = () => {
  return (
    <div className="flex flex-col w-full items-center justify-center relative bg-white">
      <HeroBannerSection />
      <FeaturedServicesSection />
      <CallToActionSection />
      <ServiceCategoriesSection />
      <MainContentSection />
    </div>
  );
};
