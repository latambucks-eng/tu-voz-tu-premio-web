import React from 'react';
import HomeTopBar from '../components/home/HomeTopBar';
import HeroSection from '../components/home/HeroSection';
import AccessRolesSection from '../components/home/AccessRolesSection';
import HowItWorks from '../components/home/HowItWorks';
import GenresShowcase from '../components/home/GenresShowcase';
import FeaturedArtistIncentive from '../components/home/FeaturedArtistIncentive';
import AppFooter from '../components/layout/AppFooter';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <HomeTopBar />
      <main className="flex-1">
        <HeroSection />
        <AccessRolesSection />
        <HowItWorks />
        <FeaturedArtistIncentive />
        <GenresShowcase />
      </main>
      <AppFooter />
    </div>
  );
}