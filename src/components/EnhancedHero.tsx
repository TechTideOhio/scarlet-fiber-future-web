
import React, { useEffect, useState } from 'react';
import HeroAnimationSystem from './HeroAnimationSystem';

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
        transform: `translateY(${scrollY * 0.3}px)`,
      }}
    >
      <HeroAnimationSystem />
    </div>
  );
};

export default EnhancedHero;
