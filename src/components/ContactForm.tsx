
import React from 'react';
import ContactFormMain from './contact/ContactFormMain';
import ContactInfoDisplay from './contact/ContactInfoDisplay';

const ContactForm = () => {
  return (
    <section id="contact" className="section-padding bg-gray-50">
      <div className="container mx-auto">
        <h2 className="section-title text-center">Contact Us</h2>
        <p className="section-subtitle text-center">
          Ready to discuss your connectivity needs? Our team is here to help.
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-12">
          <div className="lg:col-span-2">
            <ContactFormMain />
          </div>
          
          <div>
            <ContactInfoDisplay />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
