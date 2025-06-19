
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
      if (fiberCount !== undefined) return fiberCount;
      
      // More generous path counts to ensure visibility
      switch (quality) {
        case 'high': return isMobile ? 12 : 16;
        case 'medium': return isMobile ? 10 : 14;
        case 'low': return isMobile ? 8 : 12;
        case 'static': return 0;
        default: return isMobile ? 10 : 14;
      }
    };

    const pathCount = calculatePathCount();
    console.log('SnakeFiberAnimation path count:', { quality, isMobile, pathCount });
    setActualPathCount(pathCount);
  }, [quality, fiberCount, isMobile]);

  if (actualPathCount === 0 || quality === 'static') {
    console.log('SnakeFiberAnimation: No paths to render');
    return null;
  }

  const containerStyles: React.CSSProperties = {
    opacity: Math.max(opacity, 0.95),
    transform: 'translate3d(0,0,0)',
    contain: 'layout style paint',
    zIndex: 2,
    filter: `contrast(1.3) saturate(1.5) brightness(${1 + heroGlowIntensity * 0.2})`,
    mixBlendMode: 'screen'
  };

  console.log('SnakeFiberAnimation render:', { 
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
        style={{ opacity: 0.05 + heroGlowIntensity * 0.1 }}
      >
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              radial-gradient(circle at 50% 50%, rgba(255, 50, 50, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 50, 50, 0.08) 1px, transparent 1px),
              linear-gradient(0deg, rgba(255, 50, 50, 0.08) 1px, transparent 1px)
            `,
            backgroundSize: `${isMobile ? '60px' : '100px'} ${isMobile ? '60px' : '100px'}, ${isMobile ? '80px' : '120px'} ${isMobile ? '80px' : '120px'}, ${isMobile ? '80px' : '120px'} ${isMobile ? '80px' : '120px'}`,
            animation: 'pulse 8s ease-in-out infinite'
          }}
        />
      </div>
    </div>
  );
};

export default SnakeFiberAnimation;
