
import React from 'react';
import FiberStrand from './fiber/FiberStrand';
import FiberStyles from './fiber/FiberStyles';
import { calculateFiberCount } from './fiber/fiberConfig';
import type { CSSFiberAnimationProps } from './fiber/types';

const CSSFiberAnimation: React.FC<CSSFiberAnimationProps> = ({ 
  opacity, 
  enableMouseEffects = false,
  isVisible = true,
  quality,
  fiberCount,
  isMobile = false
}) => {
  // Ensure minimum fiber count for visibility
  const actualFiberCount = Math.max(calculateFiberCount(fiberCount, quality, isMobile), 8);
  
  console.log('CSSFiberAnimation render:', { quality, actualFiberCount, opacity, isVisible });

  // Always render fibers unless explicitly set to 0
  if (actualFiberCount === 0) {
    return null;
  }

  // Enhanced container styles with better visibility
  const containerStyles: React.CSSProperties = {
    opacity: Math.max(opacity, 0.85), // Increased minimum opacity
    animationPlayState: isVisible ? 'running' : 'paused',
    transform: 'translate3d(0,0,0)', // GPU acceleration
    contain: 'layout style paint', // CSS containment
    zIndex: 1, // Ensure proper layering
    mixBlendMode: 'screen', // Enhanced blending for more vibrant colors
    filter: 'contrast(1.1) saturate(1.2)' // Boost overall visual impact
  };

  return (
    <div 
      className="absolute inset-0 transition-opacity duration-1500"
      style={containerStyles}
    >
      {Array.from({ length: actualFiberCount }, (_, index) => (
        <FiberStrand
          key={index}
          index={index}
          enableMouseEffects={enableMouseEffects}
          isVisible={isVisible}
          isMobile={isMobile}
        />
      ))}
      
      <FiberStyles isVisible={isVisible} />
    </div>
  );
};

export default CSSFiberAnimation;
