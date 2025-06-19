
import { useRef, useCallback } from 'react';
import { FPSMonitorConfig } from './types';

export const useFPSMonitor = () => {
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const monitoringStartRef = useRef(0);
  const animationIdRef = useRef<number>();

  const calculateFPS = useCallback((now: number): number => {
    frameCountRef.current++;
    
    if (now - lastTimeRef.current >= 1000) {
      const fps = Math.round((frameCountRef.current * 1000) / (now - lastTimeRef.current));
      frameCountRef.current = 0;
      lastTimeRef.current = now;
      return fps;
    }
    
    return -1; // No FPS update this frame
  }, []);

  const shouldStopMonitoring = useCallback((now: number): boolean => {
    return now - monitoringStartRef.current >= 5000; // 5 seconds
  }, []);

  const resetMonitoring = useCallback(() => {
    monitoringStartRef.current = performance.now();
    lastTimeRef.current = performance.now();
    frameCountRef.current = 0;
  }, []);

  const cleanup = useCallback(() => {
    if (animationIdRef.current) {
      cancelAnimationFrame(animationIdRef.current);
    }
  }, []);

  return {
    calculateFPS,
    shouldStopMonitoring,
    resetMonitoring,
    cleanup,
    animationIdRef
  };
};

export const createFPSMonitorConfig = (isMobile: boolean): FPSMonitorConfig => ({
  isMobile,
  minFPS: isMobile ? 25 : 30,
  monitoringDuration: 5000
});
