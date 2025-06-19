
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
      if (fiberCount !== undefined) return Math.max(fiberCount, 6); // Higher minimum
      
      // CRITICAL FIX: Ensure paths are generated for all non-static quality levels
      switch (quality) {
        case 'high': return isMobile ? 16 : 22;
        case 'medium': return isMobile ? 14 : 20;
        case 'low': return isMobile ? 12 : 18;
        case 'static': return 0;
        default: return isMobile ? 14 : 20;
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
    opacity: Math.max(opacity, 0.95), // Higher minimum opacity for better visibility
    transform: 'translate3d(0,0,0)',
    contain: 'layout style paint',
    zIndex: 2,
    filter: `contrast(1.6) saturate(1.8) brightness(${1 + heroGlowIntensity * 0.4})`,
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
        style={{ opacity: 0.12 + heroGlowIntensity * 0.2 }}
      >
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              radial-gradient(circle at 50% 50%, rgba(255, 50, 50, 0.2) 2px, transparent 2px),
              linear-gradient(90deg, rgba(255, 50, 50, 0.12) 1px, transparent 1px),
              linear-gradient(0deg, rgba(255, 50, 50, 0.12) 1px, transparent 1px)
            `,
            backgroundSize: `${isMobile ? '100px' : '140px'} ${isMobile ? '100px' : '140px'}, ${isMobile ? '120px' : '180px'} ${isMobile ? '120px' : '180px'}, ${isMobile ? '120px' : '180px'} ${isMobile ? '120px' : '180px'}`,
            animation: 'pulse 6s ease-in-out infinite'
          }}
        />
      </div>
    </div>
  );
};

export default SnakeFiberAnimation;
