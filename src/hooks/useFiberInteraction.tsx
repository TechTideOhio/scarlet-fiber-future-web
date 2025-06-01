
import { useEffect, useRef, useState } from 'react';

export const useFiberInteraction = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [userInteracted, setUserInteracted] = useState(false);

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
      
      if (!userInteracted) {
        setUserInteracted(true);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      // Prevent default to avoid scrolling issues
      e.preventDefault();
      
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        setMousePosition({ x: touch.clientX, y: touch.clientY });
        
        if (!userInteracted) {
          setUserInteracted(true);
        }
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        setMousePosition({ x: touch.clientX, y: touch.clientY });
        
        if (!userInteracted) {
          setUserInteracted(true);
        }
      }
    };

    // Start the animation loop
    animationFrameId = requestAnimationFrame(updateFiberPositions);
    
    // Mouse events for desktop
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    
    // Touch events for mobile
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [mousePosition, userInteracted]);

  return {
    containerRef,
    mousePosition,
    userInteracted
  };
};
