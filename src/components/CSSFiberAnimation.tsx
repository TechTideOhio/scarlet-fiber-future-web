
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
  // Use provided fiber count or calculate based on quality
  const actualFiberCount = fiberCount ?? (() => {
    switch (quality) {
      case 'high': return isMobile ? 8 : 15;
      case 'medium': return isMobile ? 6 : 10;
      case 'low': return isMobile ? 4 : 5;
      case 'static': return 0;
      default: return isMobile ? 8 : 15;
    }
  })();
  
  // Don't render anything for static quality
  if (quality === 'static' || actualFiberCount === 0) {
    return null;
  }

  // Container styles with performance optimizations
  const containerStyles = {
    opacity,
    animationPlayState: isVisible ? 'running' : 'paused',
    transform: 'translate3d(0,0,0)', // GPU acceleration
    contain: 'layout style paint' // CSS containment
  };

  // Mobile-specific optimizations
  const getMobileOptimizations = () => {
    if (!isMobile) return {};
    
    return {
      '--mobile-blur-reduction': '0.5px',
      '--mobile-animation-scale': '0.7',
      '--mobile-glow-reduction': '0.5'
    };
  };

  return (
    <div 
      className="absolute inset-0 transition-opacity duration-2000"
      style={containerStyles}
    >
      {Array.from({ length: actualFiberCount }, (_, index) => {
        // Reduce complexity for lower quality levels and mobile
        const isComplexFiber = (quality === 'high' && !isMobile) || 
                               (quality === 'medium' && !isMobile && index < 7);
        
        // Mobile-specific adjustments
        const baseWidth = isMobile ? 1.5 : 2;
        const baseOpacity = isMobile ? 0.25 : 0.3;
        const complexityMultiplier = isMobile ? 0.5 : 1;
        
        return (
          <div
            key={index}
            className={`fiber-strand fiber-strand-${index + 1} ${enableMouseEffects ? 'interactive' : ''} ${isMobile ? 'mobile' : ''}`}
            style={{
              '--strand-width': `${baseWidth + Math.random() * (quality === 'high' ? 2 : 1) * complexityMultiplier}px`,
              '--strand-opacity': `${baseOpacity + Math.random() * (quality === 'high' ? 0.4 : 0.2) * complexityMultiplier}`,
              '--strand-delay': `${Math.random() * 2}s`,
              '--strand-duration': `${3 + Math.random() * (quality === 'high' ? 4 : 2) * complexityMultiplier}s`,
              '--strand-x': `${Math.random() * 100}%`,
              '--strand-rotate-x': `${Math.random() * (isComplexFiber ? 30 : 15) - (isComplexFiber ? 15 : 7.5)}deg`,
              '--strand-rotate-y': `${Math.random() * (isComplexFiber ? 60 : 30) - (isComplexFiber ? 30 : 15)}deg`,
              '--strand-translate-z': `${Math.random() * (isComplexFiber ? 200 : 100) - (isComplexFiber ? 100 : 50)}px`,
              '--mouse-offset-x': '0px',
              '--mouse-offset-y': '0px',
              '--glow-intensity': isMobile ? '0.2' : '0.3',
              willChange: enableMouseEffects && isVisible ? 'transform, box-shadow' : 'auto',
              ...getMobileOptimizations()
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

        .fiber-strand.mobile {
          transform: 
            perspective(500px)
            rotateX(calc(var(--strand-rotate-x) * var(--mobile-animation-scale, 1)))
            rotateY(calc(var(--strand-rotate-y) * var(--mobile-animation-scale, 1)))
            translateZ(calc(var(--strand-translate-z) * var(--mobile-animation-scale, 1)))
            translate3d(var(--mouse-offset-x), var(--mouse-offset-y), 0);
        }

        .fiber-strand.interactive {
          box-shadow: 
            0 0 calc(10px * var(--glow-intensity) * var(--mobile-glow-reduction, 1)) rgba(187, 0, 0, calc(0.5 * var(--glow-intensity))),
            0 0 calc(20px * var(--glow-intensity) * var(--mobile-glow-reduction, 1)) rgba(187, 0, 0, calc(0.3 * var(--glow-intensity)));
          transition: box-shadow 0.3s ease-out, transform 0.1s ease-out;
        }

        .fiber-strand:nth-child(3n) {
          filter: blur(${quality === 'low' || isMobile ? 'var(--mobile-blur-reduction, 0.5px)' : '1px'});
          opacity: ${quality === 'low' || isMobile ? '0.7' : '0.6'};
        }

        .fiber-strand:nth-child(5n) {
          filter: blur(${quality === 'low' || isMobile ? 'calc(var(--mobile-blur-reduction, 0.5px) * 2)' : '2px'});
          opacity: ${quality === 'low' || isMobile ? '0.5' : '0.4'};
        }

        @keyframes fiberFlow {
          0%, 100% {
            transform: 
              perspective(${isMobile ? '500px' : '1000px'})
              rotateX(calc(var(--strand-rotate-x) * var(--mobile-animation-scale, 1)))
              rotateY(calc(var(--strand-rotate-y) * var(--mobile-animation-scale, 1)))
              translateZ(calc(var(--strand-translate-z) * var(--mobile-animation-scale, 1)))
              translate3d(var(--mouse-offset-x), var(--mouse-offset-y), 0);
          }
          25% {
            transform: 
              perspective(${isMobile ? '500px' : '1000px'})
              rotateX(calc((var(--strand-rotate-x) + ${quality === 'low' || isMobile ? '2deg' : '5deg'}) * var(--mobile-animation-scale, 1)))
              rotateY(calc((var(--strand-rotate-y) + ${quality === 'low' || isMobile ? '5deg' : '10deg'}) * var(--mobile-animation-scale, 1)))
              translateZ(calc((var(--strand-translate-z) + ${quality === 'low' || isMobile ? '10px' : '20px'}) * var(--mobile-animation-scale, 1)))
              translate3d(var(--mouse-offset-x), calc(var(--mouse-offset-y) + ${quality === 'low' || isMobile ? '-10px' : '-20px'}), 0);
          }
          50% {
            transform: 
              perspective(${isMobile ? '500px' : '1000px'})
              rotateX(calc((var(--strand-rotate-x) - ${quality === 'low' || isMobile ? '1deg' : '3deg'}) * var(--mobile-animation-scale, 1)))
              rotateY(calc((var(--strand-rotate-y) - ${quality === 'low' || isMobile ? '4deg' : '8deg'}) * var(--mobile-animation-scale, 1)))
              translateZ(calc((var(--strand-translate-z) - ${quality === 'low' || isMobile ? '8px' : '15px'}) * var(--mobile-animation-scale, 1)))
              translate3d(var(--mouse-offset-x), calc(var(--mouse-offset-y) + ${quality === 'low' || isMobile ? '5px' : '10px'}), 0);
          }
          75% {
            transform: 
              perspective(${isMobile ? '500px' : '1000px'})
              rotateX(calc((var(--strand-rotate-x) + ${quality === 'low' || isMobile ? '4deg' : '8deg'}) * var(--mobile-animation-scale, 1)))
              rotateY(calc((var(--strand-rotate-y) + ${quality === 'low' || isMobile ? '2deg' : '5deg'}) * var(--mobile-animation-scale, 1)))
              translateZ(calc((var(--strand-translate-z) + ${quality === 'low' || isMobile ? '5px' : '10px'}) * var(--mobile-animation-scale, 1)))
              translate3d(var(--mouse-offset-x), calc(var(--mouse-offset-y) + ${quality === 'low' || isMobile ? '-8px' : '-15px'}), 0);
          }
        }

        @keyframes fiberPulse {
          0%, 100% {
            opacity: var(--strand-opacity);
          }
          50% {
            opacity: calc(var(--strand-opacity) * ${quality === 'low' || isMobile ? '0.7' : '0.6'});
          }
        }

        /* Pause animations when not visible or reduced motion is preferred */
        @media (prefers-reduced-motion: reduce) {
          .fiber-strand {
            animation: none !important;
            transform: perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px) !important;
          }
        }

        /* Mobile-specific touch optimizations */
        @media (max-width: 768px) {
          .fiber-strand {
            will-change: auto; /* Reduce will-change usage on mobile */
          }
          
          .fiber-strand.interactive {
            transition-duration: 0.2s; /* Faster transitions on mobile */
          }
        }

        /* Print styles */
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
