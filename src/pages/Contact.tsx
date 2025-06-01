
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ContactForm from '../components/ContactForm';
import ContactInfo from '../components/ContactInfo';
import ContactMap from '../components/ContactMap';

const Contact = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-24">
        <ContactForm />
        <ContactInfo />
        <ContactMap />
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
