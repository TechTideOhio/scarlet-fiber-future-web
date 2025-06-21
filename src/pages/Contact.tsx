
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SecureContactForm from '../components/SecureContactForm';
import ContactInfo from '../components/ContactInfo';
import ContactMap from '../components/ContactMap';
import SecurityHeaders from '../components/SecurityHeaders';

const Contact = () => {
  return (
    <div className="min-h-screen bg-white">
      <SecurityHeaders />
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
