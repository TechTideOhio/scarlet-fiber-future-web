
import React from 'react';
import CTAButton from './CTAButton';
import FiberBackground from './FiberBackground';

const Hero = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <FiberBackground />
      
      {/* Content overlay */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight animate-fade-in">
            Connecting the Future,{' '}
            <span className="block">One Fiber Strand at a Time</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-200 mb-12 animate-fade-in opacity-90 max-w-2xl mx-auto" 
             style={{ animationDelay: '0.2s' }}>
            Experience lightning-fast connectivity with our enterprise-grade fiber network solutions.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 animate-fade-in"
               style={{ animationDelay: '0.4s' }}>
            <CTAButton variant="primary" size="lg">
              Get Instant Quote
            </CTAButton>
            <CTAButton variant="outline" size="lg">
              Learn How
            </CTAButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
