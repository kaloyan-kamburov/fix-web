import React from "react";
import { CallToActionSection } from "./sections/CallToActionSection";
import { FeaturedServicesSection } from "./sections/FeaturedServicesSection";
import { HeroBannerSection } from "./sections/HeroBannerSection";
import { MainContentSection } from "./sections/MainContentSection";
import { ServiceCategoriesSection } from "./sections/ServiceCategoriesSection";
import { SiteFooterSection } from "./sections/SiteFooterSection";
import Header from "./Header/Header.component";

export const Landing = () => {
  return (
    <>
      <Header />
      <HeroBannerSection />
      <FeaturedServicesSection />
      <CallToActionSection />
      <ServiceCategoriesSection />
      <MainContentSection />
      <SiteFooterSection />
    </>
  );
};
