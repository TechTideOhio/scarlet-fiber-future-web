
import React from 'react';
import { MapPin, Navigation, Clock } from 'lucide-react';

const ContactMap = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-buckeye-black mb-4">
            Find Our Location
          </h2>
          <p className="text-xl text-buckeye-gray max-w-3xl mx-auto">
            Visit our headquarters in Galloway, Ohio for in-person consultations and project planning.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="bg-gray-50 p-8 rounded-lg">
              <div className="flex items-center mb-6">
                <MapPin className="w-6 h-6 text-buckeye-scarlet mr-3" />
                <h3 className="text-2xl font-bold text-buckeye-black">
                  Our Headquarters
                </h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-buckeye-black mb-2">Address</h4>
                  <p className="text-buckeye-gray">
                    6057 Sweetleaf Ct<br />
                    Galloway, OH 43119<br />
                    United States
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium text-buckeye-black mb-2">Directions</h4>
                  <p className="text-buckeye-gray text-sm mb-3">
                    Located in the heart of Galloway, easily accessible from Columbus 
                    and surrounding areas. Free parking available on-site.
                  </p>
                  <a
                    href="https://maps.google.com/?q=6057+Sweetleaf+Ct+Galloway+OH+43119"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-buckeye-scarlet hover:text-buckeye-scarlet/80 font-medium"
                  >
                    <Navigation className="w-4 h-4 mr-2" />
                    Get Directions
                  </a>
                </div>
                
                <div>
                  <h4 className="font-medium text-buckeye-black mb-2">Office Hours</h4>
                  <div className="flex items-start">
                    <Clock className="w-4 h-4 text-buckeye-scarlet mt-1 mr-2" />
                    <div className="text-buckeye-gray text-sm">
                      <p>Monday - Friday: 8:00 AM - 6:00 PM</p>
                      <p>Saturday: 9:00 AM - 1:00 PM</p>
                      <p>Sunday: Closed</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="bg-gray-200 rounded-lg overflow-hidden shadow-lg" style={{ height: '400px' }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3050.8234567890123!2d-83.2089!3d39.8647!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88388e123456789a%3A0x123456789abcdef0!2s6057%20Sweetleaf%20Ct%2C%20Galloway%2C%20OH%2043119!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Buckeye DataCom Location"
              />
            </div>
            
            <div className="absolute bottom-4 left-4 bg-white/95 p-3 rounded-lg shadow-md">
              <div className="flex items-center text-buckeye-black text-sm">
                <MapPin className="w-4 h-4 text-buckeye-scarlet mr-2" />
                <span className="font-medium">Buckeye DataCom HQ</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactMap;
