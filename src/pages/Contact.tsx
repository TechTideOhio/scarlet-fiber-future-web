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
      <main id="main-content" className="pt-24">
        <header className="container mx-auto px-4 lg:px-8 pt-8 pb-2 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-buckeye-black">
            Contact <em className="italic font-normal text-buckeye-scarlet">Buckeye DataCom</em>
          </h1>
          <p className="mt-3 text-buckeye-gray max-w-2xl mx-auto">
            Tell us about your project. We respond to every inquiry within 24 hours.
          </p>
        </header>
        <SecureContactForm />
        <ContactInfo />
        <ContactMap />
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
