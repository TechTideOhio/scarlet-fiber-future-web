
import React from 'react';

const FiberBackground = () => {
  return (
    <div className="absolute inset-0 w-full h-full bg-black overflow-hidden">
      {/* Generate 15 animated fiber strands */}
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
          } as React.CSSProperties}
        />
      ))}
      
      <style jsx>{`
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
            translateZ(var(--strand-translate-z));
          animation: 
            fiberFlow var(--strand-duration) ease-in-out infinite,
            fiberPulse calc(var(--strand-duration) * 1.5) ease-in-out infinite;
          animation-delay: var(--strand-delay);
          box-shadow: 
            0 0 10px rgba(187, 0, 0, 0.5),
            0 0 20px rgba(187, 0, 0, 0.3);
          will-change: transform, opacity;
        }

        /* Add blur to background strands for depth */
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
              translateY(0px);
          }
          25% {
            transform: 
              perspective(1000px)
              rotateX(calc(var(--strand-rotate-x) + 5deg))
              rotateY(calc(var(--strand-rotate-y) + 10deg))
              translateZ(calc(var(--strand-translate-z) + 20px))
              translateY(-20px);
          }
          50% {
            transform: 
              perspective(1000px)
              rotateX(calc(var(--strand-rotate-x) - 3deg))
              rotateY(calc(var(--strand-rotate-y) - 8deg))
              translateZ(calc(var(--strand-translate-z) - 15px))
              translateY(10px);
          }
          75% {
            transform: 
              perspective(1000px)
              rotateX(calc(var(--strand-rotate-x) + 8deg))
              rotateY(calc(var(--strand-rotate-y) + 5deg))
              translateZ(calc(var(--strand-translate-z) + 10px))
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

export default FiberBackground;
