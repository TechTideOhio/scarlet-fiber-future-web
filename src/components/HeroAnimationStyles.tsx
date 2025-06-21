
import React from 'react';

const HeroAnimationStyles = () => {
  return (
    <style>
      {`
      @keyframes text-shimmer {
        0% { background-position: 0% 50%; }
        100% { background-position: 200% 50%; }
      }
      
      .animation-delay-500 {
        animation-delay: 0.5s;
      }
      
      @keyframes fade-in {
        from { 
          opacity: 0; 
          transform: translateY(20px); 
        }
        to { 
          opacity: 1; 
          transform: translateY(0); 
        }
      }
      
      @keyframes shimmer-slow {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
      }
      
      .animate-text-shimmer {
        animation: text-shimmer 3s linear infinite;
      }
      
      .animate-fade-in {
        animation: fade-in 0.8s ease-out;
      }
      
      .animate-fade-in-delay {
        opacity: 0;
        animation: fade-in 0.8s ease-out 0.2s forwards;
      }
      
      .animate-fade-in-delay-2 {
        opacity: 0;
        animation: fade-in 0.8s ease-out 0.4s forwards;
      }
      
      .animate-shimmer-slow {
        animation: shimmer-slow 3s ease-out infinite;
      }
      
      .bg-radial-gradient {
        background: radial-gradient(circle at center, transparent 0%, transparent 50%, rgba(0,0,0,0.4) 100%);
      }
      `}
    </style>
  );
};

export default HeroAnimationStyles;
