
import React from 'react';
import type { QualityLevel } from '../hooks/usePerformanceMonitor';

interface CSSFiberAnimationProps {
  opacity: number;
  enableMouseEffects?: boolean;
  isVisible?: boolean;
  quality: QualityLevel;
  fiberCount?: number;
  isMobile?: boolean;
}

const CSSFiberAnimation: React.FC<CSSFiberAnimationProps> = ({ 
  opacity, 
  enableMouseEffects = false,
  isVisible = true,
  quality,
  fiberCount,
  isMobile = false
}) => {
  // Force minimum fiber count to ensure animation is visible
  const actualFiberCount = fiberCount ?? (() => {
    switch (quality) {
      case 'high': return isMobile ? 8 : 15;
      case 'medium': return isMobile ? 6 : 10;
      case 'low': return isMobile ? 4 : 8;
      case 'static': return 6; // Show fibers even in static mode
      default: return isMobile ? 8 : 12;
    }
  })();
  
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
      {Array.from({ length: actualFiberCount }, (_, index) => {
        // Simplified fiber properties for better reliability
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
      })}
      
      <style>{`
        .fiber-strand {
          position: absolute;
          width: var(--strand-width);
          height: 100vh;
          left: var(--strand-x);
          top: 0;
          background: linear-gradient(
            to bottom,
            rgba(187, 0, 0, var(--strand-opacity)),
            rgba(187, 0, 0, 0.2),
            rgba(187, 0, 0, 0.05),
            transparent
          );
          transform: 
            perspective(1000px)
            rotateX(var(--strand-rotate-x))
            rotateY(var(--strand-rotate-y))
            translateZ(var(--strand-translate-z));
          animation: 
            fiberFlow var(--strand-duration) ease-in-out infinite,
            fiberPulse calc(var(--strand-duration) * 1.2) ease-in-out infinite;
          animation-delay: var(--strand-delay);
          animation-play-state: ${isVisible ? 'running' : 'paused'};
          contain: layout style paint;
          box-shadow: 
            0 0 10px rgba(187, 0, 0, var(--glow-intensity)),
            0 0 20px rgba(187, 0, 0, calc(var(--glow-intensity) * 0.6));
        }

        .fiber-strand.interactive {
          transition: box-shadow 0.3s ease-out, transform 0.1s ease-out;
        }

        .fiber-strand:nth-child(3n) {
          filter: blur(1px);
          opacity: 0.8;
        }

        .fiber-strand:nth-child(5n) {
          filter: blur(1.5px);
          opacity: 0.6;
        }

        @keyframes fiberFlow {
          0%, 100% {
            transform: 
              perspective(1000px)
              rotateX(var(--strand-rotate-x))
              rotateY(var(--strand-rotate-y))
              translateZ(var(--strand-translate-z));
          }
          25% {
            transform: 
              perspective(1000px)
              rotateX(calc(var(--strand-rotate-x) + 5deg))
              rotateY(calc(var(--strand-rotate-y) + 8deg))
              translateZ(calc(var(--strand-translate-z) + 20px));
          }
          50% {
            transform: 
              perspective(1000px)
              rotateX(calc(var(--strand-rotate-x) - 3deg))
              rotateY(calc(var(--strand-rotate-y) - 6deg))
              translateZ(calc(var(--strand-translate-z) - 15px));
          }
          75% {
            transform: 
              perspective(1000px)
              rotateX(calc(var(--strand-rotate-x) + 7deg))
              rotateY(calc(var(--strand-rotate-y) + 4deg))
              translateZ(calc(var(--strand-translate-z) + 10px));
          }
        }

        @keyframes fiberPulse {
          0%, 100% {
            opacity: var(--strand-opacity);
            box-shadow: 
              0 0 10px rgba(187, 0, 0, var(--glow-intensity)),
              0 0 20px rgba(187, 0, 0, calc(var(--glow-intensity) * 0.6));
          }
          50% {
            opacity: calc(var(--strand-opacity) * 0.7);
            box-shadow: 
              0 0 15px rgba(187, 0, 0, calc(var(--glow-intensity) * 1.2)),
              0 0 25px rgba(187, 0, 0, calc(var(--glow-intensity) * 0.8));
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .fiber-strand {
            animation: none !important;
            transform: perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px) !important;
          }
        }

        @media print {
          .fiber-strand {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default CSSFiberAnimation;
