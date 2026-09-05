/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { CartProvider } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { StoreDataProvider } from './context/StoreDataContext';
import { Navbar } from './components/Navbar';
import { PreLaunchBanner } from './components/PreLaunchBanner';
import { Hero } from './components/Hero';
import { ProblemSection } from './components/ProblemSection';
import { BigIdeaSection } from './components/BigIdeaSection';
import { ProductMenu } from './components/ProductMenu';
import { BrandStorySection } from './components/BrandStorySection';
import { BuildYourOwnPop } from './components/BuildYourOwnPop';
import { CityStorySection } from './components/CityStorySection';
import { CollectibleShowcase } from './components/CollectibleShowcase';
import { WhyMithaiPop } from './components/WhyMithaiPop';
import { ExperienceJourney } from './components/ExperienceJourney';
import { SocialProofSection } from './components/SocialProofSection';
import { FAQSection } from './components/FAQSection';
import { Footer } from './components/Footer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { SearchModal } from './components/SearchModal';
import { AddToCartNotification } from './components/AddToCartNotification';
import { WaitlistModal } from './components/WaitlistModal';
import { SparkleCursor } from './components/SparkleCursor';
import { ClickPopEffect } from './components/ClickPopEffect';
import { ScrollProgress } from './components/ScrollProgress';
import { LoginPage } from './components/auth/LoginPage';
import { CustomerAccount } from './components/account/CustomerAccount';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { tapestryRedBg } from './data/products';
import { captureUrlAttribution } from './utils/attribution';

const AppContent: React.FC = () => {
  const { currentView } = useAuth();

  // Capture ad attribution parameters on mount (Meta Ads fbclid, UTMs)
  useEffect(() => {
    captureUrlAttribution();
  }, []);

  // If user is navigating to Login view
  if (currentView === 'login') {
    return <LoginPage />;
  }

  // If user is on Customer Account view
  if (currentView === 'account') {
    return <CustomerAccount />;
  }

  // If user is on Admin Control Dashboard view
  if (currentView === 'admin') {
    return <AdminDashboard />;
  }

  // Otherwise, render full standard Mithai Pop storefront
  return (
    <div className="min-h-screen text-[#FFF7E8] selection:bg-[#F4BD38] selection:text-[#52091B] font-sans antialiased relative bg-[#1A0308]">
      {/* Top Scroll Progress Indicator */}
      <ScrollProgress />

      {/* Global Interactive Sparkle Micro-Effects */}
      <SparkleCursor />
      <ClickPopEffect />

      {/* Subdued Cinematic Background Wallpaper Layer */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Subtle blurred, desaturated, subdued tapestry image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-25 filter saturate-[0.75] contrast-[0.88] blur-[1px] scale-105"
          style={{
            backgroundImage: `url(${tapestryRedBg})`,
          }}
        />
        {/* Luxury velvet dark overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1C0308]/92 via-[#2A050D]/80 to-[#150206]/95" />
        {/* Radial soft vignette for edge depth */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_35%,rgba(15,2,6,0.65)_100%)]" />
      </div>

      {/* Content Container (Sharp, high-contrast, luminous foreground) */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Pre-launch Announcement Banner */}
        <PreLaunchBanner />

        {/* Sticky Header Navigation with Auth link */}
        <Navbar />

        <main className="flex-1">
          {/* Minimal Luxury Hero Section with floating best-sellers */}
          <Hero />

          {/* Best Sellers & Full Collection: The Pops Everyone's Talking About */}
          <ProductMenu />

          {/* Why Mithai Pop: Classic flavours. Completely new experience. */}
          <WhyMithaiPop />

          {/* The Big Idea & Flavor Collision Engine */}
          <BigIdeaSection />

          {/* Interactive Pop Lab: Build Your Own Pop */}
          <BuildYourOwnPop />

          {/* Every Pop Has a Story: City-inspired dessert collections */}
          <CityStorySection />

          {/* Limited Edition Collectible Cans Showcase */}
          <CollectibleShowcase />

          {/* Brand Story & Manifesto */}
          <BrandStorySection />

          {/* The Experience: 5-step ritual */}
          <ExperienceJourney />

          {/* Social Proof & Customer Love */}
          <SocialProofSection />

          {/* Frequently Asked Questions */}
          <FAQSection />
        </main>

        {/* Final CTA & Footer */}
        <Footer />
      </div>

      {/* Global Modals & Drawers */}
      <ProductDetailModal />
      <CartDrawer />
      <SearchModal />
      <AddToCartNotification />
      <WaitlistModal />
    </div>
  );
};

export default function App() {
  return (
    <CartProvider>
      <StoreDataProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </StoreDataProvider>
    </CartProvider>
  );
}
