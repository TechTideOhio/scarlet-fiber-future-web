
import React, { useEffect, useState } from 'react';
import FiberBackground from './FiberBackground';
import { useFiberSync } from '../hooks/useFiberSync';
import { useTextAnimation } from '../hooks/useTextAnimation';
import { useSoundEffects } from '../hooks/useSoundEffects';

const EnhancedHero = () => {
  const [scrollY, setScrollY] = useState(0);
  const { fiberGlowIntensity, buttonPulse } = useFiberSync();
  const { titleVisible, subtitleVisible, buttonVisible } = useTextAnimation();
  const { playHoverSound, soundEnabled, toggleSound } = useSoundEffects();

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative h-full flex items-center justify-center overflow-hidden">
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black bg-opacity-30 z-5" />
      
      {/* Fiber Background with parallax */}
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
          {/* Title with staggered animation */}
          <h1 
            className={`text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight transition-all duration-1000 ${
              titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            Connecting the Future,{' '}
            <span 
              className={`block transition-all duration-1000 delay-300 ${
                titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              Powering Tomorrow.
            </span>
          </h1>
          
          {/* Subtitle with animation */}
          <p 
            className={`text-lg md:text-xl text-gray-200 mb-12 max-w-2xl mx-auto transition-all duration-1000 delay-600 ${
              subtitleVisible ? 'opacity-90 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            Experience lightning-fast connectivity with our enterprise-grade fiber network solutions.
          </p>
          
          {/* Enhanced CTA Button with synchronized effects */}
          <div 
            className={`flex justify-center transition-all duration-1000 delay-900 ${
              buttonVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <button 
              className={`relative bg-[#BB0000] hover:bg-[#990000] text-white font-bold px-12 py-5 rounded-md transition-all duration-300 hover:translate-y-[-2px] shadow-lg hover:shadow-xl ${
                buttonPulse ? 'animate-pulse' : ''
              }`}
              style={{
                boxShadow: `0 4px 20px rgba(187, 0, 0, ${0.3 + fiberGlowIntensity * 0.4})`
              }}
              onMouseEnter={() => playHoverSound()}
              onClick={() => {
                // Handle CTA action
                console.log('CTA clicked');
              }}
            >
              Start Your Project
              
              {/* Pulsing glow effect synchronized with fibers */}
              <div 
                className="absolute inset-0 rounded-md bg-[#BB0000] opacity-20 animate-ping"
                style={{
                  animationDuration: '2s',
                  opacity: fiberGlowIntensity * 0.3
                }}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Sound toggle control */}
      <button
        onClick={toggleSound}
        className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black bg-opacity-30 text-white hover:bg-opacity-50 transition-all duration-200"
        title={`Sound ${soundEnabled ? 'on' : 'off'}`}
      >
        {soundEnabled ? '🔊' : '🔇'}
      </button>

      {/* Scroll indicator with animation */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedHero;
