
import React, { useEffect, useState } from 'react';
import FiberBackground from './FiberBackground';

const Hero = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative h-full flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0"
        style={{
          transform: `translateY(${scrollY * 0.5}px)`,
        }}
      >
        <FiberBackground />
      </div>
      
      {/* Content overlay */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div 
          className="max-w-4xl mx-auto"
          style={{
            transform: `translateY(${scrollY * 0.2}px)`,
          }}
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight animate-fade-in">
            Connecting the Future,{' '}
            <span className="block">Powering Tomorrow.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-200 mb-12 animate-fade-in opacity-90 max-w-2xl mx-auto" 
             style={{ animationDelay: '0.2s' }}>
            Experience lightning-fast connectivity with our enterprise-grade fiber network solutions.
          </p>
          
          <div className="flex justify-center animate-fade-in"
               style={{ animationDelay: '0.4s' }}>
            <button className="bg-[#BB0000] hover:bg-[#990000] text-white font-bold px-12 py-5 rounded-md transition-all duration-300 hover:translate-y-[-2px] shadow-lg hover:shadow-xl">
              Start Your Project
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
