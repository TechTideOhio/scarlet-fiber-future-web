
import React from 'react';
import { Cable, Wrench, Network } from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: <Cable size={40} className="text-buckeye-scarlet mb-3" />,
      title: 'Structured Fiber Cabling',
      description: 'Enterprise-grade fiber infrastructure for maximum reliability.',
      link: '/services/fiber-cabling'
    },
    {
      icon: <Wrench size={40} className="text-buckeye-scarlet mb-3" />,
      title: 'Low-Voltage Installations',
      description: 'Expert installation of voice, data, and security systems.',
      link: '/services/low-voltage'
    },
    {
      icon: <Network size={40} className="text-buckeye-scarlet mb-3" />,
      title: 'AI-Driven Network Monitoring',
      description: 'Proactive network surveillance using advanced AI technology.',
      link: '/services/network-monitoring'
    }
  ];

  return (
    <section className="w-full py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-buckeye-black">
          Our Services
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div 
              key={index}
              className="bg-white p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-xl hover:shadow-buckeye-scarlet/10 hover:-translate-y-1 border border-gray-100"
            >
              <div className="text-center">
                {service.icon}
                <h3 className="text-lg font-bold mb-2 text-buckeye-black">
                  {service.title}
                </h3>
                <p className="text-buckeye-gray mb-3 text-sm">
                  {service.description}
                </p>
                <a 
                  href={service.link}
                  className="text-buckeye-scarlet hover:text-buckeye-scarlet/80 font-medium transition-colors text-sm"
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
