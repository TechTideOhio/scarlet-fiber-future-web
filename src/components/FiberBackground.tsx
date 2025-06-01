
import React, { useEffect, useRef } from 'react';

const FiberBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let mouseX = 0;
    let mouseY = 0;
    let animationFrameId: number;

    // Throttle mouse updates to 60fps
    let lastUpdate = 0;
    const throttleDelay = 1000 / 60;

    const updateFiberPositions = (timestamp: number) => {
      if (timestamp - lastUpdate >= throttleDelay) {
        const fibers = container.querySelectorAll('.fiber-strand');
        
        fibers.forEach((fiber, index) => {
          const element = fiber as HTMLElement;
          const rect = element.getBoundingClientRect();
          const fiberCenterX = rect.left + rect.width / 2;
          const fiberCenterY = rect.top + rect.height / 2;
          
          // Calculate distance from mouse to fiber
          const distance = Math.sqrt(
            Math.pow(mouseX - fiberCenterX, 2) + Math.pow(mouseY - fiberCenterY, 2)
          );
          
          // Determine depth layer based on index
          const layer = index % 3; // 0: near, 1: middle, 2: far
          const parallaxMultiplier = layer === 0 ? 0.02 : layer === 1 ? 0.01 : 0.005;
          
          // Calculate parallax offset
          const offsetX = (mouseX - window.innerWidth / 2) * parallaxMultiplier;
          const offsetY = (mouseY - window.innerHeight / 2) * parallaxMultiplier;
          
          // Calculate glow intensity based on distance
          const glowIntensity = distance < 100 ? Math.max(0.3, 1 - distance / 100) : 0.3;
          
          // Update CSS custom properties
          element.style.setProperty('--mouse-offset-x', `${offsetX}px`);
          element.style.setProperty('--mouse-offset-y', `${offsetY}px`);
          element.style.setProperty('--glow-intensity', glowIntensity.toString());
        });
        
        lastUpdate = timestamp;
      }
      
      animationFrameId = requestAnimationFrame(updateFiberPositions);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseX = e.touches[0].clientX;
        mouseY = e.touches[0].clientY;
      }
    };

    // Start animation loop
    animationFrameId = requestAnimationFrame(updateFiberPositions);
    
    // Add event listeners
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full bg-black overflow-hidden">
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

export default FiberBackground;
