
import React, { useState } from 'react';

const HeroAnimationContent = () => {
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  return (
    <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
      <div className="text-center max-w-6xl mx-auto">
        <div className="mb-12">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-10 tracking-tight animate-fade-in leading-relaxed py-6">
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-buckeye-scarlet to-white animate-text-shimmer bg-[length:200%_100%] pb-2" style={{ 
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Connecting the Future,
            </span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-buckeye-scarlet to-white animate-text-shimmer bg-[length:200%_100%] animation-delay-500 pb-2" style={{ 
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Powering Tomorrow.
            </span>
          </h1>
          
          <div className="h-px w-32 mx-auto bg-gradient-to-r from-transparent via-buckeye-scarlet to-transparent animate-pulse" />
        </div>
        
        <p className="text-xl md:text-2xl text-buckeye-scarlet mb-12 animate-fade-in-delay max-w-3xl mx-auto font-light">
          Experience lightning-fast connectivity with our enterprise-grade fiber network solutions.
        </p>
        
        <button
          className="relative px-12 py-5 font-medium overflow-hidden group animate-fade-in-delay-2"
          onMouseEnter={() => setIsButtonHovered(true)}
          onMouseLeave={() => setIsButtonHovered(false)}
          onClick={() => {
            const element = document.querySelector('#services-section');
            if (element) {
              element.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        >
          {/* Button background with enhanced contrast */}
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm border-2 border-white/20 transition-all duration-300 group-hover:bg-white/15 group-hover:border-buckeye-scarlet/70" />
          
          {/* Button glow effect */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-buckeye-scarlet/30 to-transparent animate-shimmer-slow" />
          </div>
          
          {/* Button content with same animation as main title */}
          <span className="relative z-10 flex items-center gap-3 text-lg tracking-wider uppercase text-transparent bg-clip-text bg-gradient-to-r from-white via-buckeye-scarlet to-white animate-text-shimmer bg-[length:200%_100%]" style={{ 
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Start Your Project
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              className={`transform transition-transform duration-300 ${isButtonHovered ? 'translate-x-1' : ''}`}
            >
              <path
                d="M5 12H19M19 12L12 5M19 12L12 19"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </button>
      </div>
    </div>
  );
};

export default HeroAnimationContent;
