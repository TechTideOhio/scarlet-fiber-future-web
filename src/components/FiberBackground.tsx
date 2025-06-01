
import React, { useEffect, useRef, useState } from 'react';
import { detectWebGLCapabilities } from '../utils/webglDetection';

const WebGLFiberRenderer = React.lazy(() => import('./WebGLFiberRenderer'));

const FiberBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [webglState, setWebglState] = useState<{
    supported: boolean;
    shouldUse: boolean;
    loaded: boolean;
    error: boolean;
  }>({
    supported: false,
    shouldUse: false,
    loaded: false,
    error: false
  });
  const [userInteracted, setUserInteracted] = useState(false);

  useEffect(() => {
    // Detect WebGL capabilities on mount
    const capabilities = detectWebGLCapabilities();
    setWebglState(prev => ({
      ...prev,
      supported: capabilities.webglSupported,
      shouldUse: capabilities.shouldUseWebGL
    }));

    console.log('WebGL Detection:', {
      supported: capabilities.webglSupported,
      score: capabilities.score,
      shouldUseWebGL: capabilities.shouldUseWebGL
    });
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationFrameId: number;
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
          
          const distance = Math.sqrt(
            Math.pow(mousePosition.x - fiberCenterX, 2) + Math.pow(mousePosition.y - fiberCenterY, 2)
          );
          
          const layer = index % 3;
          const parallaxMultiplier = layer === 0 ? 0.02 : layer === 1 ? 0.01 : 0.005;
          
          const offsetX = (mousePosition.x - window.innerWidth / 2) * parallaxMultiplier;
          const offsetY = (mousePosition.y - window.innerHeight / 2) * parallaxMultiplier;
          
          const glowIntensity = distance < 100 ? Math.max(0.3, 1 - distance / 100) : 0.3;
          
          element.style.setProperty('--mouse-offset-x', `${offsetX}px`);
          element.style.setProperty('--mouse-offset-y', `${offsetY}px`);
          element.style.setProperty('--glow-intensity', glowIntensity.toString());
        });
        
        lastUpdate = timestamp;
      }
      
      animationFrameId = requestAnimationFrame(updateFiberPositions);
    };

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      
      // Mark user interaction for WebGL loading
      if (!userInteracted) {
        setUserInteracted(true);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        setMousePosition({ x: e.touches[0].clientX, y: e.touches[0].clientY });
        
        if (!userInteracted) {
          setUserInteracted(true);
        }
      }
    };

    animationFrameId = requestAnimationFrame(updateFiberPositions);
    
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [mousePosition, userInteracted]);

  const handleWebGLLoaded = () => {
    setWebglState(prev => ({ ...prev, loaded: true }));
  };

  const handleWebGLError = (error: Error) => {
    console.error('WebGL enhancement failed:', error);
    setWebglState(prev => ({ ...prev, error: true }));
  };

  const shouldLoadWebGL = webglState.supported && webglState.shouldUse && userInteracted && !webglState.error;

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full bg-black overflow-hidden">
      {/* CSS Fiber Animation - Always shown first */}
      <div className={`absolute inset-0 transition-opacity duration-2000 ${webglState.loaded ? 'opacity-30' : 'opacity-100'}`}>
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
      </div>

      {/* WebGL Enhancement Layer */}
      {shouldLoadWebGL && (
        <React.Suspense fallback={null}>
          <div className={`absolute inset-0 transition-opacity duration-2000 ${webglState.loaded ? 'opacity-100' : 'opacity-0'}`}>
            <WebGLFiberRenderer
              onLoaded={handleWebGLLoaded}
              onError={handleWebGLError}
              mousePosition={mousePosition}
            />
          </div>
        </React.Suspense>
      )}
      
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

export default FiberBackground;
