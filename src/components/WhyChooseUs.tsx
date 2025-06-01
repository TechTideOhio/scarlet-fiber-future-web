
import React from 'react';
import { Award, Clock, Shield, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const WhyChooseUs = () => {
  const advantages = [
    {
      icon: <Award className="w-10 h-10 text-buckeye-scarlet" />,
      title: 'Industry Leadership'
    },
    {
      icon: <Zap className="w-10 h-10 text-buckeye-scarlet" />,
      title: 'Unmatched Performance'
    },
    {
      icon: <Shield className="w-10 h-10 text-buckeye-scarlet" />,
      title: 'Rock-Solid Security'
    },
    {
      icon: <Clock className="w-10 h-10 text-buckeye-scarlet" />,
      title: 'Local Support'
    }
  ];

  return (
    <section className="w-full py-8">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-buckeye-black">
          Why Choose Buckeye DataCom
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {advantages.map((advantage, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-3">
                {advantage.icon}
              </div>
              <h3 className="text-sm font-bold text-buckeye-black">
                {advantage.title}
              </h3>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-8">
          <Link 
            to="/about"
            className="text-buckeye-scarlet hover:text-buckeye-scarlet/80 font-medium transition-colors"
          >
            Learn more about us →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
