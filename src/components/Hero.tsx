
import React from 'react';
import CTAButton from './CTAButton';

const Hero = () => {
  return (
    <div className="relative bg-gradient-to-br from-black to-buckeye-black min-h-screen flex items-center">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Grid lines overlay */}
        <div className="absolute inset-0" 
             style={{
               backgroundImage: `radial-gradient(circle at 25px 25px, rgba(255, 255, 255, 0.1) 2%, transparent 0%)`,
               backgroundSize: '50px 50px'
             }}
        />
        
        {/* Accent line */}
        <div className="absolute h-[3px] w-full top-1/2 bg-buckeye-scarlet opacity-70 transform -translate-y-1/2 -rotate-6" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl md:ml-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 animate-fade-in">
            Connecting The Future <span className="text-buckeye-scarlet">Today</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Buckeye DataCom provides rock-solid fiber connectivity solutions that 
            power businesses with unmatched reliability and performance.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <CTAButton variant="primary" size="lg">
              Get a Quote
            </CTAButton>
            <CTAButton variant="outline" size="lg">
              See Our Work
            </CTAButton>
          </div>
        </div>
      </div>
      
      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
};

export default Hero;
