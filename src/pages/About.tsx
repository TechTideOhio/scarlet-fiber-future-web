
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

const About = () => {
  return (
    <div className="min-h-screen bg-white">
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
