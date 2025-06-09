
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
          rgba(255, 50, 50, var(--strand-opacity)) 0%,
          rgba(255, 100, 100, calc(var(--strand-opacity) * 0.9)) 15%,
          rgba(220, 30, 30, calc(var(--strand-opacity) * 0.8)) 30%,
          rgba(187, 0, 0, calc(var(--strand-opacity) * 0.7)) 50%,
          rgba(150, 0, 0, calc(var(--strand-opacity) * 0.5)) 70%,
          rgba(100, 0, 0, calc(var(--strand-opacity) * 0.3)) 85%,
          transparent 100%
        );
        transform: 
          perspective(1200px)
          rotateX(var(--strand-rotate-x))
          rotateY(var(--strand-rotate-y))
          translateZ(var(--strand-translate-z));
        animation: 
          fiberFlow var(--strand-duration) ease-in-out infinite,
          fiberPulse calc(var(--strand-duration) * 1.5) ease-in-out infinite,
          fiberGlow calc(var(--strand-duration) * 0.8) ease-in-out infinite;
        animation-delay: var(--strand-delay);
        animation-play-state: ${isVisible ? 'running' : 'paused'};
        contain: layout style paint;
        box-shadow: 
          0 0 15px rgba(255, 50, 50, var(--glow-intensity)),
          0 0 30px rgba(255, 100, 100, calc(var(--glow-intensity) * 0.8)),
          0 0 45px rgba(187, 0, 0, calc(var(--glow-intensity) * 0.6)),
          inset 0 0 10px rgba(255, 255, 255, 0.1);
        filter: brightness(1.2) saturate(1.3);
        z-index: calc(10 + var(--strand-index));
      }

      .fiber-strand.interactive {
        transition: all 0.3s ease-out;
      }

      .fiber-strand.interactive:hover {
        transform: 
          perspective(1200px)
          rotateX(calc(var(--strand-rotate-x) + 5deg))
          rotateY(calc(var(--strand-rotate-y) + 10deg))
          translateZ(calc(var(--strand-translate-z) + 50px))
          scale(1.1);
        box-shadow: 
          0 0 25px rgba(255, 50, 50, calc(var(--glow-intensity) * 1.5)),
          0 0 50px rgba(255, 100, 100, var(--glow-intensity)),
          0 0 75px rgba(187, 0, 0, calc(var(--glow-intensity) * 0.8));
        filter: brightness(1.5) saturate(1.5);
      }

      /* Varied visual effects based on strand position */
      .fiber-strand:nth-child(3n) {
        filter: brightness(1.1) saturate(1.4) blur(0.5px);
        opacity: 0.9;
      }

      .fiber-strand:nth-child(5n) {
        filter: brightness(1.3) saturate(1.2) blur(0.8px);
        opacity: 0.85;
        box-shadow: 
          0 0 20px rgba(255, 80, 80, var(--glow-intensity)),
          0 0 40px rgba(255, 120, 120, calc(var(--glow-intensity) * 0.9));
      }

      .fiber-strand:nth-child(7n) {
        background: linear-gradient(
          to bottom,
          rgba(255, 80, 80, var(--strand-opacity)) 0%,
          rgba(255, 40, 40, calc(var(--strand-opacity) * 0.8)) 25%,
          rgba(200, 20, 20, calc(var(--strand-opacity) * 0.6)) 50%,
          rgba(150, 10, 10, calc(var(--strand-opacity) * 0.4)) 75%,
          transparent 100%
        );
      }

      @keyframes fiberFlow {
        0%, 100% {
          transform: 
            perspective(1200px)
            rotateX(var(--strand-rotate-x))
            rotateY(var(--strand-rotate-y))
            translateZ(var(--strand-translate-z));
        }
        25% {
          transform: 
            perspective(1200px)
            rotateX(calc(var(--strand-rotate-x) + 8deg))
            rotateY(calc(var(--strand-rotate-y) + 12deg))
            translateZ(calc(var(--strand-translate-z) + 30px));
        }
        50% {
          transform: 
            perspective(1200px)
            rotateX(calc(var(--strand-rotate-x) - 5deg))
            rotateY(calc(var(--strand-rotate-y) - 10deg))
            translateZ(calc(var(--strand-translate-z) - 25px));
        }
        75% {
          transform: 
            perspective(1200px)
            rotateX(calc(var(--strand-rotate-x) + 10deg))
            rotateY(calc(var(--strand-rotate-y) + 6deg))
            translateZ(calc(var(--strand-translate-z) + 15px));
        }
      }

      @keyframes fiberPulse {
        0%, 100% {
          opacity: var(--strand-opacity);
          box-shadow: 
            0 0 15px rgba(255, 50, 50, var(--glow-intensity)),
            0 0 30px rgba(255, 100, 100, calc(var(--glow-intensity) * 0.8)),
            0 0 45px rgba(187, 0, 0, calc(var(--glow-intensity) * 0.6));
        }
        33% {
          opacity: calc(var(--strand-opacity) * 1.2);
          box-shadow: 
            0 0 25px rgba(255, 50, 50, calc(var(--glow-intensity) * 1.4)),
            0 0 45px rgba(255, 100, 100, calc(var(--glow-intensity) * 1.2)),
            0 0 65px rgba(187, 0, 0, var(--glow-intensity));
        }
        66% {
          opacity: calc(var(--strand-opacity) * 0.8);
          box-shadow: 
            0 0 12px rgba(255, 50, 50, calc(var(--glow-intensity) * 0.8)),
            0 0 25px rgba(255, 100, 100, calc(var(--glow-intensity) * 0.6)),
            0 0 35px rgba(187, 0, 0, calc(var(--glow-intensity) * 0.4));
        }
      }

      @keyframes fiberGlow {
        0%, 100% {
          filter: brightness(1.2) saturate(1.3);
        }
        50% {
          filter: brightness(1.5) saturate(1.6) drop-shadow(0 0 10px rgba(255, 50, 50, 0.5));
        }
      }

      /* Enhanced mobile optimizations */
      @media (max-width: 768px) {
        .fiber-strand {
          box-shadow: 
            0 0 12px rgba(255, 50, 50, var(--glow-intensity)),
            0 0 25px rgba(255, 100, 100, calc(var(--glow-intensity) * 0.7));
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .fiber-strand {
          animation: none !important;
          transform: perspective(1200px) rotateX(0deg) rotateY(0deg) translateZ(0px) !important;
          filter: brightness(1.1) saturate(1.2) !important;
        }
      }

      @media print {
        .fiber-strand {
          display: none !important;
        }
      }

      /* High contrast mode enhancement */
      @media (prefers-contrast: high) {
        .fiber-strand {
          --strand-opacity: 1 !important;
          filter: brightness(1.4) saturate(1.5) contrast(1.3) !important;
        }
      }
    `}</style>
  );
};

export default FiberStyles;
