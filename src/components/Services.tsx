
import React from 'react';
import { Cable, Wrench, Network } from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: <Cable size={48} className="text-buckeye-scarlet mb-4" />,
      title: 'Structured Fiber Cabling',
      description: 'Enterprise-grade fiber infrastructure for maximum reliability.',
      link: '/services/fiber-cabling'
    },
    {
      icon: <Wrench size={48} className="text-buckeye-scarlet mb-4" />,
      title: 'Low-Voltage Installations',
      description: 'Expert installation of voice, data, and security systems.',
      link: '/services/low-voltage'
    },
    {
      icon: <Network size={48} className="text-buckeye-scarlet mb-4" />,
      title: 'AI-Driven Network Monitoring',
      description: 'Proactive network surveillance using advanced AI technology.',
      link: '/services/network-monitoring'
    }
  ];

  return (
    <section id="services" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div 
              key={index}
              className="bg-white p-8 rounded-lg shadow-md transition-all duration-300 hover:shadow-xl hover:shadow-buckeye-scarlet/10 hover:-translate-y-1 border border-gray-100"
            >
              <div className="text-center">
                {service.icon}
                <h3 className="text-xl font-bold mb-3 text-buckeye-black">
                  {service.title}
                </h3>
                <p className="text-buckeye-gray mb-4">
                  {service.description}
                </p>
                <a 
                  href={service.link}
                  className="text-buckeye-scarlet hover:text-buckeye-scarlet/80 font-medium transition-colors"
                >
                  Learn More →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
