
import { useRef, useCallback } from 'react';
import { FPSMonitorConfig } from './types';
import { PERFORMANCE_TOKENS } from '../../constants';

export const useFPSMonitor = () => {
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const monitoringStartRef = useRef(0);
  const animationIdRef = useRef<number>();

  const calculateFPS = useCallback((now: number): number => {
    frameCountRef.current++;
    
    if (now - lastTimeRef.current >= PERFORMANCE_TOKENS.monitoring.measureInterval) {
      const fps = Math.round(
        (frameCountRef.current * 1000) / (now - lastTimeRef.current)
      );
      frameCountRef.current = 0;
      lastTimeRef.current = now;
      return fps;
    }
    
    return -1; // No FPS update this frame
  }, []);

  const shouldStopMonitoring = useCallback((now: number): boolean => {
    return now - monitoringStartRef.current >= PERFORMANCE_TOKENS.monitoring.duration;
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
  minFPS: isMobile 
    ? PERFORMANCE_TOKENS.fps.min.mobile 
    : PERFORMANCE_TOKENS.fps.min.desktop,
  monitoringDuration: PERFORMANCE_TOKENS.monitoring.duration
});
