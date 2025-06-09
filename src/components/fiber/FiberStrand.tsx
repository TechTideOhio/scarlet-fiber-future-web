
import React from 'react';
import type { FiberStrandProps } from './types';

const FiberStrand: React.FC<FiberStrandProps> = ({ 
  index, 
  enableMouseEffects, 
  isVisible, 
  isMobile 
}) => {
  // Significantly increased base properties for better visibility
  const baseWidth = isMobile ? 2.5 : 4;
  const baseOpacity = 0.8; // Increased from 0.4
  
  // Enhanced variation for more dynamic appearance
  const widthVariation = Math.random() * 3;
  const opacityVariation = Math.random() * 0.4;
  const rotationVariation = Math.random() * 30 - 15; // Increased range
  
  const customProperties = {
    '--strand-width': `${baseWidth + widthVariation}px`,
    '--strand-opacity': `${Math.min(baseOpacity + opacityVariation, 1)}`,
    '--strand-delay': `${Math.random() * 3}s`,
    '--strand-duration': `${3 + Math.random() * 4}s`, // Varied timing
    '--strand-x': `${5 + Math.random() * 90}%`, // Keep away from edges
    '--strand-rotate-x': `${rotationVariation}deg`,
    '--strand-rotate-y': `${Math.random() * 50 - 25}deg`,
    '--strand-translate-z': `${Math.random() * 200 - 100}px`,
    '--glow-intensity': `${0.6 + Math.random() * 0.4}`, // Much stronger glow
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
