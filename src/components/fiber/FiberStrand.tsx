
import React from 'react';
import type { FiberStrandProps } from './types';

const FiberStrand: React.FC<FiberStrandProps> = ({ 
  index, 
  enableMouseEffects, 
  isVisible, 
  isMobile 
}) => {
  const baseWidth = isMobile ? 1.5 : 2;
  const baseOpacity = 0.4;
  
  const customProperties = {
    '--strand-width': `${baseWidth + Math.random() * 2}px`,
    '--strand-opacity': `${baseOpacity + Math.random() * 0.3}`,
    '--strand-delay': `${Math.random() * 2}s`,
    '--strand-duration': `${4 + Math.random() * 3}s`,
    '--strand-x': `${Math.random() * 100}%`,
    '--strand-rotate-x': `${Math.random() * 20 - 10}deg`,
    '--strand-rotate-y': `${Math.random() * 40 - 20}deg`,
    '--strand-translate-z': `${Math.random() * 150 - 75}px`,
    '--glow-intensity': '0.4',
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
