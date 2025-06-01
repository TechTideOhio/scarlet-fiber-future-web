
import React from 'react';
import { Phone, Mail, MapPin, Clock, Users, Linkedin, Instagram } from 'lucide-react';

const ContactInfo = () => {
  const contactMethods = [
    {
      icon: <Phone className="w-6 h-6 text-buckeye-scarlet" />,
      title: 'Call Us',
      content: '(614) 679-2486',
      link: 'tel:+16146792486',
      description: 'Speak directly with our team'
    },
    {
      icon: <Mail className="w-6 h-6 text-buckeye-scarlet" />,
      title: 'Email Us',
      content: 'info@buckeyedatacom.com',
      link: 'mailto:info@buckeyedatacom.com',
      description: 'Send us your questions'
    },
    {
      icon: <MapPin className="w-6 h-6 text-buckeye-scarlet" />,
      title: 'Visit Us',
      content: '6057 Sweetleaf Ct, Galloway, OH 43119',
      link: 'https://maps.google.com/?q=6057+Sweetleaf+Ct+Galloway+OH+43119',
      description: 'Our headquarters location'
    }
  ];

  const socialLinks = [
    {
      icon: <Linkedin className="w-6 h-6" />,
      name: 'LinkedIn',
      url: 'https://linkedin.com/company/buckeye-datacom',
      color: 'hover:text-blue-600'
    },
    {
      icon: <Instagram className="w-6 h-6" />,
      name: 'Instagram',
      url: 'https://instagram.com/buckeyedatacom',
      color: 'hover:text-pink-600'
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-buckeye-black mb-4">
            Get In Touch
          </h2>
          <p className="text-xl text-buckeye-gray max-w-3xl mx-auto">
            Ready to start your project? We're here to help with all your data communications needs.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {contactMethods.map((method, index) => (
            <div key={index} className="bg-white p-8 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
              <div className="flex justify-center mb-4">
                {method.icon}
              </div>
              <h3 className="text-xl font-bold text-buckeye-black mb-2">
                {method.title}
              </h3>
              <p className="text-buckeye-gray mb-2">
                {method.description}
              </p>
              <a
                href={method.link}
                target={method.link.startsWith('http') ? '_blank' : undefined}
                rel={method.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="text-buckeye-scarlet font-medium hover:underline"
              >
                {method.content}
              </a>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Business Hours */}
          <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="flex items-center mb-6">
              <Clock className="w-6 h-6 text-buckeye-scarlet mr-3" />
              <h3 className="text-2xl font-bold text-buckeye-black">
                Business Hours
              </h3>
            </div>
            
            <div className="space-y-3 text-buckeye-gray">
              <div className="flex justify-between">
                <span>Monday - Friday</span>
                <span className="font-medium">8:00 AM - 6:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Saturday</span>
                <span className="font-medium">9:00 AM - 1:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Sunday</span>
                <span className="font-medium">Closed</span>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-buckeye-gray rounded-lg">
              <div className="flex items-start">
                <Users className="w-5 h-5 text-buckeye-scarlet mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-buckeye-black font-medium mb-1">
                    Emergency Support
                  </p>
                  <p className="text-gray-700 text-sm">
                    24/7 emergency support available for existing clients. 
                    Call our main number for after-hours assistance.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Social Media & Additional Info */}
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h3 className="text-2xl font-bold text-buckeye-black mb-6">
              Connect With Us
            </h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-medium text-buckeye-black mb-3">
                  Follow Our Updates
                </h4>
                <div className="flex space-x-4">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-buckeye-gray ${social.color} transition-colors p-2 rounded-lg hover:bg-gray-50`}
                      aria-label={`Follow us on ${social.name}`}
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-buckeye-black mb-3">
                  Quick Response Times
                </h4>
                <ul className="space-y-2 text-buckeye-gray text-sm">
                  <li>• Email responses within 2 hours during business hours</li>
                  <li>• Phone consultations available same day</li>
                  <li>• On-site assessments scheduled within 48 hours</li>
                  <li>• Emergency support response within 1 hour</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-buckeye-black mb-3">
                  Service Coverage
                </h4>
                <p className="text-buckeye-gray text-sm">
                  Serving all of Ohio with headquarters in Galloway. 
                  We provide comprehensive data communications services 
                  across the entire Buckeye State.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactInfo;
