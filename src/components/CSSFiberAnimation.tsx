
import React from 'react';

interface CSSFiberAnimationProps {
  opacity: number;
}

const CSSFiberAnimation: React.FC<CSSFiberAnimationProps> = ({ opacity }) => {
  return (
    <div className={`absolute inset-0 transition-opacity duration-2000`} style={{ opacity }}>
      {Array.from({ length: 15 }, (_, index) => (
        <div
          key={index}
          className={`fiber-strand fiber-strand-${index + 1}`}
          style={{
            '--strand-width': `${2 + Math.random() * 2}px`,
            '--strand-opacity': `${0.3 + Math.random() * 0.4}`,
            '--strand-delay': `${Math.random() * 2}s`,
            '--strand-duration': `${3 + Math.random() * 4}s`,
            '--strand-x': `${Math.random() * 100}%`,
            '--strand-rotate-x': `${Math.random() * 30 - 15}deg`,
            '--strand-rotate-y': `${Math.random() * 60 - 30}deg`,
            '--strand-translate-z': `${Math.random() * 200 - 100}px`,
            '--mouse-offset-x': '0px',
            '--mouse-offset-y': '0px',
            '--glow-intensity': '0.3',
          } as React.CSSProperties}
        />
      ))}
      
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
            translateX(var(--mouse-offset-x))
            translateY(var(--mouse-offset-y));
          animation: 
            fiberFlow var(--strand-duration) ease-in-out infinite,
            fiberPulse calc(var(--strand-duration) * 1.5) ease-in-out infinite;
          animation-delay: var(--strand-delay);
          box-shadow: 
            0 0 calc(10px * var(--glow-intensity)) rgba(187, 0, 0, calc(0.5 * var(--glow-intensity))),
            0 0 calc(20px * var(--glow-intensity)) rgba(187, 0, 0, calc(0.3 * var(--glow-intensity)));
          will-change: transform, opacity, box-shadow;
          transition: box-shadow 0.3s ease-out, transform 0.1s ease-out;
        }

        .fiber-strand:nth-child(3n) {
          filter: blur(1px);
          opacity: 0.6;
        }

        .fiber-strand:nth-child(5n) {
          filter: blur(2px);
          opacity: 0.4;
        }

        @keyframes fiberFlow {
          0%, 100% {
            transform: 
              perspective(1000px)
              rotateX(var(--strand-rotate-x))
              rotateY(var(--strand-rotate-y))
              translateZ(var(--strand-translate-z))
              translateX(var(--mouse-offset-x))
              translateY(var(--mouse-offset-y))
              translateY(0px);
          }
          25% {
            transform: 
              perspective(1000px)
              rotateX(calc(var(--strand-rotate-x) + 5deg))
              rotateY(calc(var(--strand-rotate-y) + 10deg))
              translateZ(calc(var(--strand-translate-z) + 20px))
              translateX(var(--mouse-offset-x))
              translateY(var(--mouse-offset-y))
              translateY(-20px);
          }
          50% {
            transform: 
              perspective(1000px)
              rotateX(calc(var(--strand-rotate-x) - 3deg))
              rotateY(calc(var(--strand-rotate-y) - 8deg))
              translateZ(calc(var(--strand-translate-z) - 15px))
              translateX(var(--mouse-offset-x))
              translateY(var(--mouse-offset-y))
              translateY(10px);
          }
          75% {
            transform: 
              perspective(1000px)
              rotateX(calc(var(--strand-rotate-x) + 8deg))
              rotateY(calc(var(--strand-rotate-y) + 5deg))
              translateZ(calc(var(--strand-translate-z) + 10px))
              translateX(var(--mouse-offset-x))
              translateY(var(--mouse-offset-y))
              translateY(-15px);
          }
        }

        @keyframes fiberPulse {
          0%, 100% {
            opacity: var(--strand-opacity);
          }
          50% {
            opacity: calc(var(--strand-opacity) * 0.6);
          }
        }
      `}</style>
    </div>
  );
};

export default CSSFiberAnimation;
