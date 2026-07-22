import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import StatsStrip from '../components/StatsStrip';
import Services from '../components/Services';
import IndustriesStrip from '../components/IndustriesStrip';
import WhyChooseUs from '../components/WhyChooseUs';
import TestimonialsHome from '../components/TestimonialsHome';
import PortfolioTeaser from '../components/PortfolioTeaser';
import SimpleCTA from '../components/SimpleCTA';
import Footer from '../components/Footer';

import SEO from '../components/SEO';
import { LocalBusinessSchema, BreadcrumbSchema } from '../components/StructuredData';
import { SEO_CONFIG } from '../config/seo';

const Index = () => {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <SEO
        title={SEO_CONFIG.pages.home.title}
        description={SEO_CONFIG.pages.home.description}
        keywords={SEO_CONFIG.pages.home.keywords}
        canonicalUrl="/"
      />
      <LocalBusinessSchema />
      <BreadcrumbSchema items={[{ name: 'Home', url: '/' }]} />

      <Navbar />
      

      <main id="main-content">
        <section id="hero-section" className="relative min-h-dvh">
          <Hero />
        </section>

        <div id="services-section">
          <StatsStrip />
          <Services />
        </div>
        <IndustriesStrip />
        <WhyChooseUs />
        <TestimonialsHome />
        <PortfolioTeaser />
        <SimpleCTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
