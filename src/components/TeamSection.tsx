
import React from 'react';
import { Users, GraduationCap, Award } from 'lucide-react';
import FiberBackground from './FiberBackground';
import CTAButton from './CTAButton';

const TeamSection = () => {
  return (
    <>
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-buckeye-black mb-4">
              Our Expert Team
            </h2>
            <p className="text-xl text-buckeye-gray max-w-3xl mx-auto">
              Meet the certified professionals who make Buckeye DataCom Ohio's leading data communications provider.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center bg-gray-50 p-8 rounded-lg">
              <div className="flex justify-center mb-4">
                <Users className="w-12 h-12 text-buckeye-scarlet" />
              </div>
              <h3 className="text-2xl font-bold text-buckeye-black mb-2">3+</h3>
              <p className="text-buckeye-gray">Certified Technicians</p>
              <p className="text-sm text-gray-600 mt-2">
                Each with specialized expertise
              </p>
            </div>
            
            <div className="text-center bg-gray-50 p-8 rounded-lg">
              <div className="flex justify-center mb-4">
                <GraduationCap className="w-12 h-12 text-buckeye-scarlet" />
              </div>
              <h3 className="text-2xl font-bold text-buckeye-black mb-2">15+</h3>
              <p className="text-buckeye-gray">Industry Certifications</p>
              <p className="text-sm text-gray-600 mt-2">
                Including BICSI RCDD, DCCA, and structured cabling certifications
              </p>
            </div>
            
            <div className="text-center bg-gray-50 p-8 rounded-lg">
              <div className="flex justify-center mb-4">
                <Award className="w-12 h-12 text-buckeye-scarlet" />
              </div>
              <h3 className="text-2xl font-bold text-buckeye-black mb-2">100%</h3>
              <p className="text-buckeye-gray">Ohio-Based</p>
              <p className="text-sm text-gray-600 mt-2">
                Deep understanding of local codes and regulations
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Hero-style Continuous Learning Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        {/* Fiber Background Animation */}
        <div className="absolute inset-0 z-0">
          <FiberBackground />
        </div>
        
        {/* Semi-transparent overlay */}
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        
        {/* Content */}
        <div className="relative z-20 container mx-auto px-4 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 animate-fade-in">
              Continuous Learning & Development
            </h2>
            <p className="text-xl md:text-2xl text-gray-200 mb-8 leading-relaxed animate-fade-in">
              Our team invests over 200 hours annually in training and certifications to stay current 
              with emerging technologies. From fiber optic splicing to AI network monitoring, 
              we ensure our expertise evolves with the industry.
            </p>
            <div className="animate-fade-in">
              <CTAButton 
                variant="primary" 
                size="lg"
                className="text-lg px-10 py-4"
              >
                Meet Our Team
              </CTAButton>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default TeamSection;
