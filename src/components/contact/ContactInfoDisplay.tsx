
import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';
import { ContactInfoItem } from './types';

const ContactInfoDisplay = () => {
  const contactInfo: ContactInfoItem[] = [
    {
      icon: <Phone size={24} className="text-buckeye-scarlet" />,
      title: 'Call Us',
      details: '(614) 555-0123'
    },
    {
      icon: <Mail size={24} className="text-buckeye-scarlet" />,
      title: 'Email Us',
      details: 'info@buckeyedatacom.com'
    },
    {
      icon: <MapPin size={24} className="text-buckeye-scarlet" />,
      title: 'Visit Us',
      details: 'Columbus, Ohio'
    }
  ];

  return (
    <div className="bg-white p-6 md:p-8 rounded-lg shadow-md h-full">
      <h3 className="text-2xl font-bold mb-6 text-buckeye-black">Contact Information</h3>
      
      <div className="space-y-8">
        {contactInfo.map((item, index) => (
          <div key={index} className="flex items-start">
            <div className="flex-shrink-0 mr-4" aria-hidden="true">
              {item.icon}
            </div>
            <div>
              <h4 className="font-medium text-buckeye-black mb-1">{item.title}</h4>
              <p className="text-buckeye-gray">{item.details}</p>
            </div>
          </div>
        ))}
      </div>
      
      <hr className="my-8 border-gray-200" />
      
      <div>
        <h4 className="font-medium text-buckeye-black mb-4">Business Hours</h4>
        <div className="space-y-2 text-buckeye-gray">
          <p>Monday - Friday: 8am - 6pm</p>
          <p>Saturday: 9am - 1pm</p>
          <p>Sunday: Closed</p>
        </div>
        <p className="mt-4 text-buckeye-gray">
          24/7 emergency support available for existing clients
        </p>
      </div>
    </div>
  );
};

export default ContactInfoDisplay;
