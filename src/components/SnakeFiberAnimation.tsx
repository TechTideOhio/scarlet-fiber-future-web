
import React, { useEffect, useState } from 'react';
import EnhancedSnakeRenderer from './fiber/EnhancedSnakeRenderer';
import type { QualityLevel } from '../hooks/usePerformanceMonitor';
import { FIBER_ANIMATION_TOKENS, COLOR_TOKENS, LAYOUT_TOKENS, logFiberToken } from '../constants';

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
      if (fiberCount !== undefined) return Math.max(fiberCount, 6);
      
      const counts = isMobile 
        ? FIBER_ANIMATION_TOKENS.pathCount.mobile 
        : FIBER_ANIMATION_TOKENS.pathCount.desktop;
      
      switch (quality) {
        case 'high': return counts.high;
        case 'medium': return counts.medium;
        case 'low': return counts.low;
        case 'static': return counts.static;
        default: return counts.medium;
      }
    };

    const pathCount = calculatePathCount();
    logFiberToken('path-count', `${quality}/${isMobile ? 'mobile' : 'desktop'}: ${pathCount}`);
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
    opacity: Math.max(opacity, FIBER_ANIMATION_TOKENS.opacity.container.enhanced),
    transform: 'translate3d(0,0,0)',
    contain: 'layout style paint',
    zIndex: 2,
    filter: `contrast(${FIBER_ANIMATION_TOKENS.colorIntensity.contrast}) saturate(${FIBER_ANIMATION_TOKENS.colorIntensity.saturation}) brightness(${1 + heroGlowIntensity * FIBER_ANIMATION_TOKENS.glow.heroBoost})`,
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
              radial-gradient(circle at 50% 50%, ${COLOR_TOKENS.buckeye.scarletRgba(0.2)} 2px, transparent 2px),
              linear-gradient(90deg, ${COLOR_TOKENS.buckeye.scarletRgba(0.12)} 1px, transparent 1px),
              linear-gradient(0deg, ${COLOR_TOKENS.buckeye.scarletRgba(0.12)} 1px, transparent 1px)
            `,
            backgroundSize: `${isMobile ? LAYOUT_TOKENS.grid.size.mobile : LAYOUT_TOKENS.grid.size.desktop}px ${isMobile ? LAYOUT_TOKENS.grid.size.mobile : LAYOUT_TOKENS.grid.size.desktop}px, ${isMobile ? LAYOUT_TOKENS.grid.spacing.mobile : LAYOUT_TOKENS.grid.spacing.desktop}px ${isMobile ? LAYOUT_TOKENS.grid.spacing.mobile : LAYOUT_TOKENS.grid.spacing.desktop}px, ${isMobile ? LAYOUT_TOKENS.grid.spacing.mobile : LAYOUT_TOKENS.grid.spacing.desktop}px ${isMobile ? LAYOUT_TOKENS.grid.spacing.mobile : LAYOUT_TOKENS.grid.spacing.desktop}px`,
            animation: 'pulse 6s ease-in-out infinite'
          }}
        />
      </div>
    </div>
  );
};

export default SnakeFiberAnimation;
