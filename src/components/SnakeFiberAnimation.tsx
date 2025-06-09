
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
    opacity: Math.max(opacity, 0.9),
    transform: 'translate3d(0,0,0)',
    contain: 'layout style paint',
    zIndex: 2,
    filter: 'contrast(1.2) saturate(1.4)',
    mixBlendMode: 'screen'
  };

  return (
    <div 
      className="absolute inset-0 w-full h-full transition-opacity duration-1500"
      style={containerStyles}
    >
      <SnakeRenderer
        isVisible={isVisible}
        pathCount={actualPathCount}
        isMobile={isMobile}
        enableInteractive={enableMouseEffects}
      />
      
      {/* Background network grid overlay */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(90deg, rgba(255, 50, 50, 0.15) 1px, transparent 1px),
              linear-gradient(0deg, rgba(255, 50, 50, 0.15) 1px, transparent 1px)
            `,
            backgroundSize: `${isMobile ? '50px' : '80px'} ${isMobile ? '50px' : '80px'}`,
            animation: 'pulse 6s ease-in-out infinite'
          }}
        />
      </div>
    </div>
  );
};

export default SnakeFiberAnimation;
