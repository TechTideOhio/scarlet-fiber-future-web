
import { useState, useEffect, useRef } from 'react';

interface PerformanceMetrics {
  fps: number;
  isLowPerformance: boolean;
  shouldReduceEffects: boolean;
}

export const useHeroAnimationPerformance = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    isLowPerformance: false,
    shouldReduceEffects: false
  });

  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const animationRef = useRef<number>();

  useEffect(() => {
    const measurePerformance = () => {
      const currentTime = performance.now();
      frameCountRef.current++;

      // Calculate FPS every second
      if (currentTime - lastTimeRef.current >= 1000) {
        const fps = Math.round((frameCountRef.current * 1000) / (currentTime - lastTimeRef.current));
        
        setMetrics(prev => ({
          fps,
          isLowPerformance: fps < 30,
          shouldReduceEffects: fps < 25 || prev.shouldReduceEffects
        }));

        frameCountRef.current = 0;
        lastTimeRef.current = currentTime;
      }

      animationRef.current = requestAnimationFrame(measurePerformance);
    };

    animationRef.current = requestAnimationFrame(measurePerformance);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const handleChange = () => {
      if (mediaQuery.matches) {
        setMetrics(prev => ({ ...prev, shouldReduceEffects: true }));
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    handleChange(); // Check initial state

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return metrics;
};
