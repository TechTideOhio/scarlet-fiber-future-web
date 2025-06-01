
import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import StatsStrip from '../components/StatsStrip';
import Services from '../components/Services';
import WhyChooseUs from '../components/WhyChooseUs';
import SimpleCTA from '../components/SimpleCTA';
import Footer from '../components/Footer';
import ScrollIndicator from '../components/ScrollIndicator';

const Index = () => {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar />
      <ScrollIndicator />
      
      {/* First Viewport: Hero + Navigation */}
      <section id="hero-section" className="h-screen relative">
        <Hero />
      </section>
      
      {/* Second Viewport: Stats + Services */}
      <section id="services-section" className="h-screen relative bg-gradient-to-b from-gray-50 to-white">
        <div className="h-1/3">
          <StatsStrip />
        </div>
        <div className="h-2/3 flex items-center">
          <Services />
        </div>
      </section>
      
      {/* Third Viewport: Why Choose Us + CTA + Footer */}
      <section id="final-section" className="h-screen relative bg-gradient-to-b from-white to-gray-50">
        <div className="h-1/2 flex items-center">
          <WhyChooseUs />
        </div>
        <div className="h-1/4 flex items-center">
          <SimpleCTA />
        </div>
        <div className="h-1/4">
          <Footer />
        </div>
      </section>
    </div>
  );
};

export default Index;
