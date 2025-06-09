
import React, { useEffect, useState } from 'react';
import SnakeRenderer from './fiber/SnakeRenderer';
import type { QualityLevel } from '../hooks/usePerformanceMonitor';

interface SnakeFiberAnimationProps {
  opacity: number;
  enableMouseEffects?: boolean;
  isVisible?: boolean;
  quality: QualityLevel;
  fiberCount?: number;
  isMobile?: boolean;
}

const SnakeFiberAnimation: React.FC<SnakeFiberAnimationProps> = ({
  opacity,
  enableMouseEffects = false,
  isVisible = true,
  quality,
  fiberCount,
  isMobile = false
}) => {
  const [actualPathCount, setActualPathCount] = useState(0);

  useEffect(() => {
    // Calculate optimal path count based on quality and device
    const calculatePathCount = () => {
      if (fiberCount !== undefined) return fiberCount;
      
      switch (quality) {
        case 'high': return isMobile ? 6 : 10;
        case 'medium': return isMobile ? 4 : 7;
        case 'low': return isMobile ? 3 : 5;
        case 'static': return 0; // No animation in static mode
        default: return isMobile ? 4 : 7;
      }
    };

    setActualPathCount(calculatePathCount());
  }, [quality, fiberCount, isMobile]);

  if (actualPathCount === 0 || quality === 'static') {
    return null;
  }

  const containerStyles: React.CSSProperties = {
    opacity: Math.max(opacity, 0.85),
    transform: 'translate3d(0,0,0)',
    contain: 'layout style paint',
    zIndex: 1,
    filter: 'contrast(1.1) saturate(1.2)'
  };

  return (
    <div 
      className="absolute inset-0 transition-opacity duration-1500"
      style={containerStyles}
    >
      <SnakeRenderer
        isVisible={isVisible}
        pathCount={actualPathCount}
        isMobile={isMobile}
        enableInteractive={enableMouseEffects}
      />
      
      {/* Background network grid overlay */}
      <div className="absolute inset-0 opacity-20">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(90deg, rgba(187, 0, 0, 0.1) 1px, transparent 1px),
              linear-gradient(0deg, rgba(187, 0, 0, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: `${isMobile ? '40px' : '60px'} ${isMobile ? '40px' : '60px'}`,
            animation: 'pulse 4s ease-in-out infinite'
          }}
        />
      </div>
    </div>
  );
};

export default SnakeFiberAnimation;
