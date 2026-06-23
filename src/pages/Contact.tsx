import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SecureContactForm from '../components/SecureContactForm';
import ContactInfo from '../components/ContactInfo';
import ContactMap from '../components/ContactMap';
import SEO from '../components/SEO';
import { ContactPageSchema, BreadcrumbSchema } from '../components/StructuredData';
import { SEO_CONFIG } from '../config/seo';

const Contact = () => {
  return (
    <div className="min-h-screen bg-white">
      <SEO
        title={SEO_CONFIG.pages.contact.title}
        description={SEO_CONFIG.pages.contact.description}
        keywords={SEO_CONFIG.pages.contact.keywords}
        canonicalUrl="/contact"
      />
      <ContactPageSchema />
      <BreadcrumbSchema items={[
        { name: 'Home', url: '/' },
        { name: 'Contact', url: '/contact' },
      ]} />

      <Navbar />
      <div className="pt-24">
        <SecureContactForm />
        <ContactInfo />
        <ContactMap />
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
