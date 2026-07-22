import React from 'react';
import HeroAnimationContent from './HeroAnimationContent';
import { COLOR_TOKENS } from '../constants';

const HeroAnimationSystem = () => {
  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* Static gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-950 to-black" />

      {/* Subtle scarlet radial */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle at center, transparent 0%, ${COLOR_TOKENS.buckeye.scarlet} 100%)`,
          backgroundSize: '100% 100%',
        }}
      />

      {/* Hero content */}
      <HeroAnimationContent />

      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none bg-radial-gradient from-transparent via-transparent to-black/50" />
    </div>
  );
};

export default HeroAnimationSystem;
