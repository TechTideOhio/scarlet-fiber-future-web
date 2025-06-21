
import React, { useEffect, useRef, useState } from 'react';
import AnimatedSVGBackground from './AnimatedSVGBackground';
import FloatingParticles from './FloatingParticles';
import HeroContent from './HeroContent';

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
      <div className="absolute inset-0 opacity-20 hero-grid-pattern" />
      
      {/* Animated fiber optic lines */}
      <AnimatedSVGBackground mousePosition={mousePosition} intensity={intensity} />
      
      {/* Floating particles */}
      <FloatingParticles intensity={intensity} />
      
      {/* Hero content */}
      <HeroContent />
    </div>
  );
};

export default HeroAnimationSystem;
