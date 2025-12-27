
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AboutHero from '../components/AboutHero';
import CompanyStory from '../components/CompanyStory';
import WhyChooseUsDetailed from '../components/WhyChooseUsDetailed';
import TeamSection from '../components/TeamSection';
import CertificationsSection from '../components/CertificationsSection';
import ServiceAreaMap from '../components/ServiceAreaMap';
import CompanyValues from '../components/CompanyValues';
import SEO from '../components/SEO';
import { BreadcrumbSchema } from '../components/StructuredData';
import { SEO_CONFIG } from '../config/seo';

const About = () => {
  return (
    <div className="min-h-screen bg-white">
      <SEO 
        title={SEO_CONFIG.pages.about.title}
        description={SEO_CONFIG.pages.about.description}
        keywords={SEO_CONFIG.pages.about.keywords}
        canonicalUrl="/about"
      />
      <BreadcrumbSchema items={[
        { name: 'Home', url: '/' },
        { name: 'About', url: '/about' }
      ]} />
      
      <Navbar />
      <AboutHero />
      <CompanyStory />
      <WhyChooseUsDetailed />
      <TeamSection />
      <CertificationsSection />
      <ServiceAreaMap />
      <CompanyValues />
      <Footer />
    </div>
  );
};

export default About;
