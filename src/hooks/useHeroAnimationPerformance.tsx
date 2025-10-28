
import { useState, useEffect, useRef } from 'react';
import { PERFORMANCE_TOKENS, logPerformanceToken } from '../constants';

interface PerformanceMetrics {
  fps: number;
  isLowPerformance: boolean;
  shouldReduceEffects: boolean;
}

export const useHeroAnimationPerformance = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: PERFORMANCE_TOKENS.fps.ideal,
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
      if (currentTime - lastTimeRef.current >= PERFORMANCE_TOKENS.monitoring.measureInterval) {
        const fps = Math.round((frameCountRef.current * 1000) / (currentTime - lastTimeRef.current));
        
        setMetrics(prev => ({
          fps,
          isLowPerformance: fps < PERFORMANCE_TOKENS.fps.lowPerformanceThreshold,
          shouldReduceEffects: fps < PERFORMANCE_TOKENS.fps.degradeThreshold || prev.shouldReduceEffects
        }));

        if (fps < PERFORMANCE_TOKENS.fps.degradeThreshold) {
          logPerformanceToken('hero-performance-degraded', `${fps}fps`);
        }

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
