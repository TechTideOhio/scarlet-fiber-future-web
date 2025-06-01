
import { useEffect, useState, useRef, useCallback } from 'react';

export type QualityLevel = 'high' | 'medium' | 'low' | 'static';

interface PerformanceState {
  currentQuality: QualityLevel;
  fps: number;
  isMonitoring: boolean;
  shouldAutoDegrade: boolean;
}

export const usePerformanceMonitor = () => {
  const [performanceState, setPerformanceState] = useState<PerformanceState>({
    currentQuality: 'high',
    fps: 60,
    isMonitoring: false,
    shouldAutoDegrade: false
  });

  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const monitoringStartRef = useRef(0);
  const animationIdRef = useRef<number>();

  // Check for reduced motion preference
  const prefersReducedMotion = useCallback(() => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  // Load saved preference from localStorage
  const loadSavedQuality = useCallback((): QualityLevel => {
    if (prefersReducedMotion()) return 'static';
    
    const saved = localStorage.getItem('fiber-animation-quality');
    if (saved && ['high', 'medium', 'low', 'static'].includes(saved)) {
      return saved as QualityLevel;
    }
    return 'high';
  }, [prefersReducedMotion]);

  // Save quality preference to localStorage
  const saveQualityPreference = useCallback((quality: QualityLevel) => {
    localStorage.setItem('fiber-animation-quality', quality);
  }, []);

  // FPS monitoring loop
  const monitorFPS = useCallback(() => {
    const now = performance.now();
    frameCountRef.current++;

    // Calculate FPS every second
    if (now - lastTimeRef.current >= 1000) {
      const fps = Math.round((frameCountRef.current * 1000) / (now - lastTimeRef.current));
      
      setPerformanceState(prev => ({ ...prev, fps }));
      
      frameCountRef.current = 0;
      lastTimeRef.current = now;

      // Check if we need to downgrade (during monitoring period)
      if (now - monitoringStartRef.current < 3000) {
        if (fps < 30 && !performanceState.shouldAutoDegrade) {
          console.log('Low FPS detected, enabling auto-degradation');
          setPerformanceState(prev => ({ ...prev, shouldAutoDegrade: true }));
        }
      } else {
        // Stop monitoring after 3 seconds
        setPerformanceState(prev => ({ ...prev, isMonitoring: false }));
        if (animationIdRef.current) {
          cancelAnimationFrame(animationIdRef.current);
        }
        return;
      }
    }

    animationIdRef.current = requestAnimationFrame(monitorFPS);
  }, [performanceState.shouldAutoDegrade]);

  // Start FPS monitoring
  const startMonitoring = useCallback(() => {
    if (performanceState.isMonitoring) return;

    console.log('Starting FPS monitoring...');
    monitoringStartRef.current = performance.now();
    lastTimeRef.current = performance.now();
    frameCountRef.current = 0;
    
    setPerformanceState(prev => ({ 
      ...prev, 
      isMonitoring: true, 
      shouldAutoDegrade: false 
    }));
    
    monitorFPS();
  }, [performanceState.isMonitoring, monitorFPS]);

  // Auto-downgrade quality based on performance
  const autoAdjustQuality = useCallback(() => {
    if (!performanceState.shouldAutoDegrade) return;

    let newQuality: QualityLevel = performanceState.currentQuality;

    if (performanceState.fps < 30) {
      switch (performanceState.currentQuality) {
        case 'high':
          newQuality = 'medium';
          break;
        case 'medium':
          newQuality = 'low';
          break;
        case 'low':
          newQuality = 'static';
          break;
      }
    }

    if (newQuality !== performanceState.currentQuality) {
      console.log(`Auto-downgrading quality from ${performanceState.currentQuality} to ${newQuality}`);
      setPerformanceState(prev => ({ ...prev, currentQuality: newQuality }));
      saveQualityPreference(newQuality);
    }
  }, [performanceState, saveQualityPreference]);

  // Manual quality override
  const setQuality = useCallback((quality: QualityLevel) => {
    setPerformanceState(prev => ({ ...prev, currentQuality: quality }));
    saveQualityPreference(quality);
  }, [saveQualityPreference]);

  // Initialize quality from saved preference
  useEffect(() => {
    const savedQuality = loadSavedQuality();
    setPerformanceState(prev => ({ ...prev, currentQuality: savedQuality }));
  }, [loadSavedQuality]);

  // Auto-adjust quality based on performance metrics
  useEffect(() => {
    autoAdjustQuality();
  }, [performanceState.fps, performanceState.shouldAutoDegrade, autoAdjustQuality]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, []);

  return {
    currentQuality: performanceState.currentQuality,
    fps: performanceState.fps,
    isMonitoring: performanceState.isMonitoring,
    startMonitoring,
    setQuality
  };
};
