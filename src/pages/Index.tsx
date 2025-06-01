
import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import StatsStrip from '../components/StatsStrip';
import Services from '../components/Services';
import WhyChooseUs from '../components/WhyChooseUs';
import SimpleCTA from '../components/SimpleCTA';
import Footer from '../components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <StatsStrip />
      <Services />
      <WhyChooseUs />
      <SimpleCTA />
      <Footer />
    </div>
  );
};

export default Index;
