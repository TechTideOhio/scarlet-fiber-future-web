
import React, { useEffect, useState } from 'react';
import EnhancedSnakeRenderer from './fiber/EnhancedSnakeRenderer';
import type { QualityLevel } from '../hooks/usePerformanceMonitor';

interface SnakeFiberAnimationProps {
  opacity: number;
  enableMouseEffects?: boolean;
  isVisible?: boolean;
  quality: QualityLevel;
  fiberCount?: number;
  isMobile?: boolean;
  heroGlowIntensity?: number;
  mousePosition?: { x: number; y: number };
}

const SnakeFiberAnimation: React.FC<SnakeFiberAnimationProps> = ({
  opacity,
  enableMouseEffects = false,
  isVisible = true,
  quality,
  fiberCount,
  isMobile = false,
  heroGlowIntensity = 0,
  mousePosition = { x: 0, y: 0 }
}) => {
  const [actualPathCount, setActualPathCount] = useState(0);

  useEffect(() => {
    const calculatePathCount = () => {
      if (fiberCount !== undefined) return Math.max(fiberCount, 4); // Ensure minimum
      
      // CRITICAL FIX: Ensure paths are generated for all quality levels except static
      switch (quality) {
        case 'high': return isMobile ? 14 : 18;
        case 'medium': return isMobile ? 12 : 16;
        case 'low': return isMobile ? 10 : 14;
        case 'static': return 0;
        default: return isMobile ? 12 : 16;
      }
    };

    const pathCount = calculatePathCount();
    console.log('SnakeFiberAnimation path count calculation:', { 
      quality, 
      isMobile, 
      fiberCount, 
      calculatedPathCount: pathCount 
    });
    setActualPathCount(pathCount);
  }, [quality, fiberCount, isMobile]);

  // CRITICAL FIX: Only return null for static quality
  if (quality === 'static') {
    console.log('SnakeFiberAnimation: Static quality - not rendering');
    return null;
  }

  if (actualPathCount === 0) {
    console.warn('SnakeFiberAnimation: No paths calculated for quality:', quality);
    return null;
  }

  const containerStyles: React.CSSProperties = {
    opacity: Math.max(opacity, 0.9), // Higher minimum opacity
    transform: 'translate3d(0,0,0)',
    contain: 'layout style paint',
    zIndex: 2,
    filter: `contrast(1.4) saturate(1.6) brightness(${1 + heroGlowIntensity * 0.3})`,
    mixBlendMode: 'screen'
  };

  console.log('SnakeFiberAnimation rendering with:', { 
    actualPathCount, 
    quality, 
    isVisible, 
    heroGlowIntensity 
  });

  return (
    <div 
      className="absolute inset-0 w-full h-full transition-all duration-1500"
      style={containerStyles}
    >
      <EnhancedSnakeRenderer
        isVisible={isVisible}
        pathCount={actualPathCount}
        isMobile={isMobile}
        enableInteractive={enableMouseEffects}
        heroGlowIntensity={heroGlowIntensity}
        mousePosition={mousePosition}
      />
      
      {/* Enhanced background grid with dynamic opacity */}
      <div 
        className="absolute inset-0 pointer-events-none transition-opacity duration-2000"
        style={{ opacity: 0.08 + heroGlowIntensity * 0.15 }}
      >
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              radial-gradient(circle at 50% 50%, rgba(255, 50, 50, 0.15) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 50, 50, 0.1) 1px, transparent 1px),
              linear-gradient(0deg, rgba(255, 50, 50, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: `${isMobile ? '80px' : '120px'} ${isMobile ? '80px' : '120px'}, ${isMobile ? '100px' : '150px'} ${isMobile ? '100px' : '150px'}, ${isMobile ? '100px' : '150px'} ${isMobile ? '100px' : '150px'}`,
            animation: 'pulse 6s ease-in-out infinite'
          }}
        />
      </div>
    </div>
  );
};

export default SnakeFiberAnimation;
