'use client';

import { useState } from 'react';
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import TrustBadges from "@/components/TrustBadges";
import Carousel from "@/components/Carousel";
import CampaignBanners from "@/components/CampaignBanners";
import BestSellers from "@/components/BestSellers";
import TodaysOffers from "@/components/TodaysOffers";
import NewArrivals from "@/components/NewArrivals";
import GrowthRegulators from "@/components/GrowthRegulators";
import HarDinSastaSection from "@/components/HarDinSastaSection";
import SeedsSection from "@/components/SeedsSection";
import EquipmentsSection from "@/components/EquipmentsSection";
import FertilizersSection from "@/components/FertilizersSection";
import CropProtectionSection from "@/components/CropProtectionSection";
import IrrigationSection from "@/components/IrrigationSection";
import GardeningSection from "@/components/GardeningSection";
import BulkSection from "@/components/BulkSection";
import OrganicFarmingSection from "@/components/OrganicFarmingSection";
import CattleBirdCareSection from "@/components/CattleBirdCareSection";
import FarmProductsSection from "@/components/FarmProductsSection";
import MediaSection from "@/components/MediaSection";
import HealthWellnessSection from "@/components/HealthWellnessSection";
import FeaturedProducts from "@/components/FeaturedProducts";
import TrendingProducts from "@/components/TrendingProducts";
import WhatsAppButton from "@/components/WhatsAppButton";
import Footer from "@/components/Footer";

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen w-screen overflow-x-hidden">
      <TopBar />
      <Header onMenuToggle={toggleMobileMenu} isMenuOpen={isMobileMenuOpen} />
      <Navigation isMobileMenuOpen={isMobileMenuOpen} onCloseMobileMenu={closeMobileMenu} />
      <TrustBadges />
      <Carousel />
      <CampaignBanners />
      <BestSellers />
      <GrowthRegulators />
      <FeaturedProducts />
      <TodaysOffers />
      <NewArrivals />
      <HarDinSastaSection />
      <SeedsSection />
      <EquipmentsSection />
      <FertilizersSection />
      <CropProtectionSection />
      <IrrigationSection />
      <GardeningSection />
      <BulkSection />
      <OrganicFarmingSection />
      <CattleBirdCareSection />
      <FarmProductsSection />
      <MediaSection />
      <HealthWellnessSection />
      <TrendingProducts />
      <WhatsAppButton />
      <Footer />
    </div>
  );
}
