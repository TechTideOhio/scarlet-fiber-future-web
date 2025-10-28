
import React from 'react';
import type { FiberStrandProps } from './types';
import { FIBER_ANIMATION_TOKENS, ANIMATION_TOKENS } from '../../constants';

const FiberStrand: React.FC<FiberStrandProps> = ({ 
  index, 
  enableMouseEffects, 
  isVisible, 
  isMobile 
}) => {
  // Significantly increased base properties for better visibility
  const baseWidth = isMobile 
    ? FIBER_ANIMATION_TOKENS.lineWidth.mobile.main 
    : FIBER_ANIMATION_TOKENS.lineWidth.desktop.main;
  const baseOpacity = FIBER_ANIMATION_TOKENS.opacity.path.base;
  
  // Enhanced variation for more dynamic appearance
  const widthVariation = Math.random() * FIBER_ANIMATION_TOKENS.lineWidth.mobile.branch;
  const opacityVariation = Math.random() * (FIBER_ANIMATION_TOKENS.opacity.path.max - FIBER_ANIMATION_TOKENS.opacity.path.min);
  const rotationVariation = Math.random() * 30 - 15;
  
  const customProperties = {
    '--strand-width': `${baseWidth + widthVariation}px`,
    '--strand-opacity': `${Math.min(baseOpacity + opacityVariation, FIBER_ANIMATION_TOKENS.opacity.path.max)}`,
    '--strand-delay': `${Math.random() * ANIMATION_TOKENS.duration.backgroundPulse / 1000}s`,
    '--strand-duration': `${(ANIMATION_TOKENS.duration.backgroundPulse + Math.random() * ANIMATION_TOKENS.duration.backgroundPulse) / 1000}s`,
    '--strand-x': `${5 + Math.random() * 90}%`,
    '--strand-rotate-x': `${rotationVariation}deg`,
    '--strand-rotate-y': `${Math.random() * 50 - 25}deg`,
    '--strand-translate-z': `${Math.random() * 200 - 100}px`,
    '--glow-intensity': `${FIBER_ANIMATION_TOKENS.glow.min + Math.random() * (FIBER_ANIMATION_TOKENS.glow.base - FIBER_ANIMATION_TOKENS.glow.min)}`,
    '--strand-index': index,
  } as React.CSSProperties;
  
  return (
    <div
      key={index}
      className={`fiber-strand fiber-strand-${index + 1} ${enableMouseEffects ? 'interactive' : ''}`}
      style={customProperties}
    />
  );
};

export default FiberStrand;
