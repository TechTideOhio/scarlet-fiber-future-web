
import React from 'react';
import { Heart, Handshake, Zap, Shield, Users, Target } from 'lucide-react';

const CompanyValues = () => {
  const values = [
    {
      icon: <Heart className="w-12 h-12 text-buckeye-scarlet" />,
      title: 'Integrity',
      description: 'We conduct business with honesty, transparency, and ethical practices in every interaction.',
      commitment: 'Every promise kept, every expectation exceeded.'
    },
    {
      icon: <Zap className="w-12 h-12 text-buckeye-scarlet" />,
      title: 'Innovation',
      description: 'We embrace cutting-edge technologies and creative solutions to solve complex challenges.',
      commitment: 'Always ahead of the curve, never behind the times.'
    },
    {
      icon: <Shield className="w-12 h-12 text-buckeye-scarlet" />,
      title: 'Reliability',
      description: 'Our clients depend on us for critical infrastructure. We deliver consistent, dependable results.',
      commitment: '99.999% uptime isn\'t just a goal – it\'s our standard.'
    },
    {
      icon: <Users className="w-12 h-12 text-buckeye-scarlet" />,
      title: 'Partnership',
      description: 'We build lasting relationships by understanding our clients\' unique needs and goals.',
      commitment: 'Your success is our success, your challenges are ours.'
    },
    {
      icon: <Target className="w-12 h-12 text-buckeye-scarlet" />,
      title: 'Excellence',
      description: 'We strive for perfection in every project, from planning to implementation to support.',
      commitment: 'Good enough is never good enough for our team.'
    },
    {
      icon: <Handshake className="w-12 h-12 text-buckeye-scarlet" />,
      title: 'Community',
      description: 'As Ohio natives, we\'re committed to supporting local businesses and strengthening our communities.',
      commitment: 'Buckeye born, Buckeye proud, Buckeye strong.'
    }
  ];

  return (
    <section className="py-20 bg-buckeye-black">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Our Core Values
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            These principles guide every decision we make and every relationship we build.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <div key={index} className="bg-white p-8 rounded-lg text-center hover:transform hover:-translate-y-2 transition-all duration-300">
              <div className="flex justify-center mb-4">
                {value.icon}
              </div>
              <h3 className="text-xl font-bold text-buckeye-black mb-4">
                {value.title}
              </h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                {value.description}
              </p>
              <div className="border-t border-gray-200 pt-4">
                <p className="text-sm font-medium text-buckeye-scarlet italic">
                  "{value.commitment}"
                </p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-16">
          <div className="bg-buckeye-scarlet p-8 rounded-lg">
            <h3 className="text-2xl font-bold text-white mb-4">
              Ready to Experience the Buckeye DataCom Difference?
            </h3>
            <p className="text-gray-100 mb-6 max-w-2xl mx-auto">
              Let us show you how our values translate into exceptional service and results for your business.
            </p>
            <a 
              href="#contact"
              className="inline-block bg-white text-buckeye-scarlet px-8 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors"
            >
              Start Your Project Today
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompanyValues;
