
import React from 'react';
import { Network, Wifi, Building, Server, ShieldCheck, Clock } from 'lucide-react';
import CTAButton from './CTAButton';

const Services = () => {
  const services = [
    {
      icon: <Network size={48} className="text-buckeye-scarlet mb-4" />,
      title: 'Enterprise Fiber',
      description: 'High-capacity, dedicated fiber connectivity for mission-critical business operations.'
    },
    {
      icon: <Wifi size={48} className="text-buckeye-scarlet mb-4" />,
      title: 'Wireless Solutions',
      description: 'Advanced wireless networking for flexible, scalable connectivity across your organization.'
    },
    {
      icon: <Building size={48} className="text-buckeye-scarlet mb-4" />,
      title: 'Building Infrastructure',
      description: 'Complete structured cabling and infrastructure solutions for new and existing facilities.'
    },
    {
      icon: <Server size={48} className="text-buckeye-scarlet mb-4" />,
      title: 'Data Center Services',
      description: 'Secure, redundant data center solutions with guaranteed uptime and performance.'
    },
    {
      icon: <ShieldCheck size={48} className="text-buckeye-scarlet mb-4" />,
      title: 'Network Security',
      description: 'Enterprise-grade security services to protect your critical network infrastructure.'
    },
    {
      icon: <Clock size={48} className="text-buckeye-scarlet mb-4" />,
      title: '24/7 Support',
      description: 'Around-the-clock monitoring and support to ensure continuous operations.'
    }
  ];

  return (
    <section id="services" className="section-padding bg-white">
      <div className="container mx-auto">
        <h2 className="section-title text-center">Our Services</h2>
        <p className="section-subtitle text-center">
          Comprehensive connectivity solutions to power your business growth and digital transformation
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {services.map((service, index) => (
            <div 
              key={index}
              className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
            >
              <div className="text-center mb-4">
                {service.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-buckeye-black text-center">
                {service.title}
              </h3>
              <p className="text-buckeye-gray text-center">
                {service.description}
              </p>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <CTAButton variant="primary" size="lg">
            Explore All Services
          </CTAButton>
        </div>
      </div>
    </section>
  );
};

export default Services;
