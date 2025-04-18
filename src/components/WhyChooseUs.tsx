
import React from 'react';
import { Award, Clock, Shield, Zap } from 'lucide-react';
import CTAButton from './CTAButton';

const WhyChooseUs = () => {
  const advantages = [
    {
      icon: <Award className="w-12 h-12 text-buckeye-scarlet" />,
      title: 'Industry Leadership',
      description: 'Over 20 years of experience delivering reliable connectivity solutions across Ohio.'
    },
    {
      icon: <Zap className="w-12 h-12 text-buckeye-scarlet" />,
      title: 'Unmatched Performance',
      description: 'Our fiber network delivers 99.999% uptime with lightning-fast speeds and minimal latency.'
    },
    {
      icon: <Shield className="w-12 h-12 text-buckeye-scarlet" />,
      title: 'Rock-Solid Security',
      description: 'Enterprise-grade security built into every solution we deploy.'
    },
    {
      icon: <Clock className="w-12 h-12 text-buckeye-scarlet" />,
      title: 'Responsive Support',
      description: '24/7 local technical support from our Ohio-based team of experts.'
    }
  ];

  return (
    <section id="why-choose-us" className="section-padding bg-gray-50">
      <div className="container mx-auto">
        <h2 className="section-title text-center">Why Choose Buckeye DataCom</h2>
        <p className="section-subtitle text-center">
          When reliability and performance matter, businesses trust Buckeye DataCom to deliver
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16 mt-16">
          {advantages.map((advantage, index) => (
            <div key={index} className="flex flex-col md:flex-row items-start">
              <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                {advantage.icon}
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-buckeye-black">
                  {advantage.title}
                </h3>
                <p className="text-buckeye-gray">
                  {advantage.description}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 p-8 bg-gradient-to-r from-buckeye-black to-buckeye-gray rounded-lg shadow-lg text-white">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <h3 className="text-2xl md:text-3xl font-bold mb-2">Ready to connect your future?</h3>
              <p className="text-gray-200">
                Let our experts design a custom connectivity solution for your business.
              </p>
            </div>
            <CTAButton variant="primary" size="lg">
              Get Started Today
            </CTAButton>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
