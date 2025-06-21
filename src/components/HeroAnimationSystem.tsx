
import React, { useEffect, useRef, useState } from 'react';

interface HeroAnimationSystemProps {
  isVisible?: boolean;
  intensity?: number;
  className?: string;
}

const HeroAnimationSystem: React.FC<HeroAnimationSystemProps> = ({
  isVisible = true,
  intensity = 0.5,
  className = ''
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  if (!isVisible) return null;

  return (
    <div ref={containerRef} className={`relative min-h-screen bg-black overflow-hidden ${className}`}>
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-red-950/20 hero-gradient-shift" />
      
      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-20 hero-grid-pattern"
      />
      
      {/* Animated fiber optic lines */}
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          <linearGradient id="fiber-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#dc2626" stopOpacity="0">
              <animate attributeName="stop-opacity" values="0;1;0" dur="3s" repeatCount="indefinite" />
            </stop>
            <stop offset="50%" stopColor="#ef4444" stopOpacity="1">
              <animate attributeName="stop-opacity" values="1;0.5;1" dur="3s" repeatCount="indefinite" />
            </stop>
            <stop offset="100%" stopColor="#dc2626" stopOpacity="0">
              <animate attributeName="stop-opacity" values="0;1;0" dur="3s" repeatCount="indefinite" />
            </stop>
          </linearGradient>
          
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Animated fiber paths */}
        {[...Array(6)].map((_, i) => (
          <g key={i}>
            <path
              d={`M ${-100 + i * 100} ${window.innerHeight} Q ${window.innerWidth / 2} ${window.innerHeight / 2} ${window.innerWidth + 100 - i * 50} ${-100}`}
              fill="none"
              stroke="url(#fiber-gradient)"
              strokeWidth="2"
              filter="url(#glow)"
              opacity={0.8 * intensity}
            >
              <animate
                attributeName="d"
                values={`M ${-100 + i * 100} ${window.innerHeight} Q ${window.innerWidth / 2} ${window.innerHeight / 2} ${window.innerWidth + 100 - i * 50} ${-100};
                        M ${-100 + i * 100} ${window.innerHeight} Q ${window.innerWidth / 3} ${window.innerHeight / 3} ${window.innerWidth + 100 - i * 50} ${-100};
                        M ${-100 + i * 100} ${window.innerHeight} Q ${window.innerWidth * 0.7} ${window.innerHeight * 0.7} ${window.innerWidth + 100 - i * 50} ${-100};
                        M ${-100 + i * 100} ${window.innerHeight} Q ${window.innerWidth / 2} ${window.innerHeight / 2} ${window.innerWidth + 100 - i * 50} ${-100}`}
                dur={`${8 + i * 2}s`}
                repeatCount="indefinite"
              />
            </path>
            
            {/* Light particles */}
            <circle r="4" fill="#ef4444" filter="url(#glow)">
              <animateMotion
                dur={`${4 + i}s`}
                repeatCount="indefinite"
                path={`M ${-100 + i * 100} ${window.innerHeight} Q ${window.innerWidth / 2} ${window.innerHeight / 2} ${window.innerWidth + 100 - i * 50} ${-100}`}
              />
              <animate attributeName="opacity" values="0;1;1;0" dur={`${4 + i}s`} repeatCount="indefinite" />
              <animate attributeName="r" values="2;6;2" dur={`${4 + i}s`} repeatCount="indefinite" />
            </circle>
          </g>
        ))}
        
        {/* Mouse-following glow */}
        <circle
          cx={mousePosition.x}
          cy={mousePosition.y}
          r="100"
          fill="none"
          stroke="rgba(239, 68, 68, 0.3)"
          strokeWidth="2"
          filter="url(#glow)"
          className="pointer-events-none hero-mouse-glow"
        />
      </svg>
      
      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-red-500 rounded-full hero-particle-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${15 + Math.random() * 10}s`,
              opacity: intensity
            }}
          />
        ))}
      </div>
      
      {/* Hero content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 hero-fade-in">
            <span className="inline-block bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent hero-gradient-x">
              Fiber Optic
            </span>
            {' '}
            <span className="text-white">Future</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 hero-fade-in-delay">
            Experience the speed of light with our cutting-edge technology
          </p>
          
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
    </div>
  );
};

export default HeroAnimationSystem;
