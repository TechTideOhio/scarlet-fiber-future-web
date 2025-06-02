
import React from 'react';

interface FiberStylesProps {
  isVisible: boolean;
}

const FiberStyles: React.FC<FiberStylesProps> = ({ isVisible }) => {
  return (
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
  );
};

export default FiberStyles;
