
import React from 'react';
import FiberStrand from './fiber/FiberStrand';
import FiberStyles from './fiber/FiberStyles';
import { calculateFiberCount } from './fiber/fiberConfig';
import type { CSSFiberAnimationProps } from './fiber/types';
import { FIBER_ANIMATION_TOKENS, ANIMATION_TOKENS, logFiberToken } from '../constants';

const CSSFiberAnimation: React.FC<CSSFiberAnimationProps> = ({ 
  opacity, 
  enableMouseEffects = false,
  isVisible = true,
  quality,
  fiberCount,
  isMobile = false
}) => {
  // Ensure minimum fiber count for visibility
  const minFibers = FIBER_ANIMATION_TOKENS.count.min;
  const actualFiberCount = Math.max(calculateFiberCount(fiberCount, quality, isMobile), minFibers);
  
  logFiberToken('css-fiber-render', `quality: ${quality}, count: ${actualFiberCount}, visible: ${isVisible}`);

  // Always render fibers unless explicitly set to 0
  if (actualFiberCount === 0) {
    return null;
  }

  // Enhanced container styles with better visibility
  const containerStyles: React.CSSProperties = {
    opacity: Math.max(opacity, FIBER_ANIMATION_TOKENS.opacity.container.min),
    animationPlayState: isVisible ? 'running' : 'paused',
    transform: 'translate3d(0,0,0)', // GPU acceleration
    contain: 'layout style paint', // CSS containment
    zIndex: 1, // Ensure proper layering
    mixBlendMode: 'screen', // Enhanced blending for more vibrant colors
    filter: `contrast(${FIBER_ANIMATION_TOKENS.effects.contrast}) saturate(${FIBER_ANIMATION_TOKENS.effects.saturation})`
  };

  return (
    <div 
      className="absolute inset-0 transition-opacity"
      style={{
        ...containerStyles,
        transitionDuration: `${ANIMATION_TOKENS.duration.glacial}ms`
      }}
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
