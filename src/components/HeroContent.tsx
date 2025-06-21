
import React, { useState } from 'react';

const HeroContent: React.FC = () => {
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  return (
    <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
      <div className="text-center max-w-4xl mx-auto">
        <button
          className="relative px-8 py-4 bg-red-600 text-white font-semibold rounded-lg overflow-hidden transform transition-all duration-300 hover:scale-105 active:scale-95 shadow-2xl hover:shadow-red-500/25 hero-fade-in-delay-2"
          onMouseEnter={() => setIsButtonHovered(true)}
          onMouseLeave={() => setIsButtonHovered(false)}
        >
          {/* Button gradient animation */}
          <div className={`absolute inset-0 bg-gradient-to-r from-red-600 to-red-500 transition-opacity duration-300 ${isButtonHovered ? 'opacity-100' : 'opacity-0'}`} />
          
          {/* Button border animation */}
          <div className="absolute inset-0 rounded-lg">
            <div className={`absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-red-400 to-transparent opacity-0 ${isButtonHovered ? 'hero-shimmer' : ''}`} />
          </div>
          
          {/* Button content */}
          <span className="relative z-10 flex items-center gap-2">
            Get Started
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              className={`transform transition-transform duration-300 ${isButtonHovered ? 'translate-x-1' : ''}`}
            >
              <path
                d="M7 10L13 10M13 10L10 7M13 10L10 13"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          
          {/* Ripple effect container */}
          <div className="absolute inset-0 rounded-lg overflow-hidden">
            {isButtonHovered && (
              <div className="absolute inset-0 hero-ripple bg-white/20 rounded-full transform scale-0" />
            )}
          </div>
        </button>
      </div>
    </div>
  );
};

export default HeroContent;
