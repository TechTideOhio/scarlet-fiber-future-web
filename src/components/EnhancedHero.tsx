
import React, { useEffect, useState } from 'react';
import HeroAnimationSystem from './HeroAnimationSystem';
import { ANIMATION_TOKENS } from '../constants';

const EnhancedHero = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div 
      className="relative h-full"
      style={{
        transform: `translateY(${scrollY * ANIMATION_TOKENS.parallax.heroSpeed}px)`,
      }}
    >
      <HeroAnimationSystem />
    </div>
  );
};

export default EnhancedHero;
