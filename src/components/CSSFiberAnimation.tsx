
import React from 'react';
import type { QualityLevel } from '../hooks/usePerformanceMonitor';

interface CSSFiberAnimationProps {
  opacity: number;
  enableMouseEffects?: boolean;
  isVisible?: boolean;
  quality: QualityLevel;
}

const CSSFiberAnimation: React.FC<CSSFiberAnimationProps> = ({ 
  opacity, 
  enableMouseEffects = false,
  isVisible = true,
  quality 
}) => {
  // Determine number of fibers based on quality
  const getFiberCount = () => {
    switch (quality) {
      case 'high': return 15;
      case 'medium': return 10;
      case 'low': return 5;
      case 'static': return 0;
      default: return 15;
    }
  };

  const fiberCount = getFiberCount();
  
  // Don't render anything for static quality
  if (quality === 'static' || fiberCount === 0) {
    return null;
  }

  // Container styles with performance optimizations
  const containerStyles = {
    opacity,
    animationPlayState: isVisible ? 'running' : 'paused',
    transform: 'translate3d(0,0,0)', // GPU acceleration
    contain: 'layout style paint' // CSS containment
  };

  return (
    <div 
      className="absolute inset-0 transition-opacity duration-2000"
      style={containerStyles}
    >
      {Array.from({ length: fiberCount }, (_, index) => {
        // Reduce complexity for lower quality levels
        const isComplexFiber = quality === 'high' || (quality === 'medium' && index < 7);
        
        return (
          <div
            key={index}
            className={`fiber-strand fiber-strand-${index + 1} ${enableMouseEffects ? 'interactive' : ''}`}
            style={{
              '--strand-width': `${2 + Math.random() * (quality === 'high' ? 2 : 1)}px`,
              '--strand-opacity': `${0.3 + Math.random() * (quality === 'high' ? 0.4 : 0.2)}`,
              '--strand-delay': `${Math.random() * 2}s`,
              '--strand-duration': `${3 + Math.random() * (quality === 'high' ? 4 : 2)}s`,
              '--strand-x': `${Math.random() * 100}%`,
              '--strand-rotate-x': `${Math.random() * (isComplexFiber ? 30 : 15) - (isComplexFiber ? 15 : 7.5)}deg`,
              '--strand-rotate-y': `${Math.random() * (isComplexFiber ? 60 : 30) - (isComplexFiber ? 30 : 15)}deg`,
              '--strand-translate-z': `${Math.random() * (isComplexFiber ? 200 : 100) - (isComplexFiber ? 100 : 50)}px`,
              '--mouse-offset-x': '0px',
              '--mouse-offset-y': '0px',
              '--glow-intensity': '0.3',
              willChange: enableMouseEffects && isVisible ? 'transform, box-shadow' : 'auto'
            } as React.CSSProperties}
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
            rgba(187, 0, 0, 0.1),
            transparent
          );
          transform: 
            perspective(1000px)
            rotateX(var(--strand-rotate-x))
            rotateY(var(--strand-rotate-y))
            translateZ(var(--strand-translate-z))
            translate3d(var(--mouse-offset-x), var(--mouse-offset-y), 0);
          animation: 
            fiberFlow var(--strand-duration) ease-in-out infinite,
            fiberPulse calc(var(--strand-duration) * 1.5) ease-in-out infinite;
          animation-delay: var(--strand-delay);
          animation-play-state: ${isVisible ? 'running' : 'paused'};
          contain: layout style paint;
        }

        .fiber-strand.interactive {
          box-shadow: 
            0 0 calc(10px * var(--glow-intensity)) rgba(187, 0, 0, calc(0.5 * var(--glow-intensity))),
            0 0 calc(20px * var(--glow-intensity)) rgba(187, 0, 0, calc(0.3 * var(--glow-intensity)));
          transition: box-shadow 0.3s ease-out, transform 0.1s ease-out;
        }

        .fiber-strand:nth-child(3n) {
          filter: blur(${quality === 'low' ? '0.5px' : '1px'});
          opacity: ${quality === 'low' ? '0.8' : '0.6'};
        }

        .fiber-strand:nth-child(5n) {
          filter: blur(${quality === 'low' ? '1px' : '2px'});
          opacity: ${quality === 'low' ? '0.6' : '0.4'};
        }

        @keyframes fiberFlow {
          0%, 100% {
            transform: 
              perspective(1000px)
              rotateX(var(--strand-rotate-x))
              rotateY(var(--strand-rotate-y))
              translateZ(var(--strand-translate-z))
              translate3d(var(--mouse-offset-x), var(--mouse-offset-y), 0);
          }
          25% {
            transform: 
              perspective(1000px)
              rotateX(calc(var(--strand-rotate-x) + ${quality === 'low' ? '2deg' : '5deg'}))
              rotateY(calc(var(--strand-rotate-y) + ${quality === 'low' ? '5deg' : '10deg'}))
              translateZ(calc(var(--strand-translate-z) + ${quality === 'low' ? '10px' : '20px'}))
              translate3d(var(--mouse-offset-x), calc(var(--mouse-offset-y) + ${quality === 'low' ? '-10px' : '-20px'}), 0);
          }
          50% {
            transform: 
              perspective(1000px)
              rotateX(calc(var(--strand-rotate-x) - ${quality === 'low' ? '1deg' : '3deg'}))
              rotateY(calc(var(--strand-rotate-y) - ${quality === 'low' ? '4deg' : '8deg'}))
              translateZ(calc(var(--strand-translate-z) - ${quality === 'low' ? '8px' : '15px'}))
              translate3d(var(--mouse-offset-x), calc(var(--mouse-offset-y) + ${quality === 'low' ? '5px' : '10px'}), 0);
          }
          75% {
            transform: 
              perspective(1000px)
              rotateX(calc(var(--strand-rotate-x) + ${quality === 'low' ? '4deg' : '8deg'}))
              rotateY(calc(var(--strand-rotate-y) + ${quality === 'low' ? '2deg' : '5deg'}))
              translateZ(calc(var(--strand-translate-z) + ${quality === 'low' ? '5px' : '10px'}))
              translate3d(var(--mouse-offset-x), calc(var(--mouse-offset-y) + ${quality === 'low' ? '-8px' : '-15px'}), 0);
          }
        }

        @keyframes fiberPulse {
          0%, 100% {
            opacity: var(--strand-opacity);
          }
          50% {
            opacity: calc(var(--strand-opacity) * ${quality === 'low' ? '0.8' : '0.6'});
          }
        }

        /* Pause animations when not visible for performance */
        @media (prefers-reduced-motion: reduce) {
          .fiber-strand {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default CSSFiberAnimation;
