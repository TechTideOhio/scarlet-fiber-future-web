
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
  // Force minimum fiber count to ensure animation is visible
  const actualFiberCount = calculateFiberCount(fiberCount, quality, isMobile);
  
  console.log('CSSFiberAnimation render:', { quality, actualFiberCount, opacity, isVisible });

  // Always render fibers unless explicitly set to 0
  if (actualFiberCount === 0) {
    return null;
  }

  // Container styles with performance optimizations
  const containerStyles: React.CSSProperties = {
    opacity: Math.max(opacity, 0.7), // Ensure minimum visibility
    animationPlayState: isVisible ? 'running' : 'paused',
    transform: 'translate3d(0,0,0)', // GPU acceleration
    contain: 'layout style paint', // CSS containment
    zIndex: 1 // Ensure it's behind content but visible
  };

  return (
    <div 
      className="absolute inset-0 transition-opacity duration-2000"
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
