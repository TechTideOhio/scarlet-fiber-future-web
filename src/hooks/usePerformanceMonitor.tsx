
import { useEffect, useState, useCallback } from 'react';
import { detectDeviceCapabilities, getOptimalFiberCount } from '../utils/deviceDetection';
import { PerformanceState, QualityLevel } from './performance/types';
import { loadSavedQuality, prefersReducedMotion } from './performance/deviceCapabilities';
import { useFPSMonitor, createFPSMonitorConfig } from './performance/fpsMonitor';
import { useBatteryMonitor } from './performance/batteryMonitor';
import { useQualityManager } from './performance/qualityManager';

export type { QualityLevel } from './performance/types';

export const usePerformanceMonitor = () => {
  const [performanceState, setPerformanceState] = useState<PerformanceState>(() => {
    const capabilities = detectDeviceCapabilities();
    return {
      currentQuality: capabilities.prefersCSSOnly ? 'static' : 'high',
      fps: 60,
      isMonitoring: false,
      shouldAutoDegrade: false,
      deviceCapabilities: capabilities,
      isPaused: false
    };
  });

  const { calculateFPS, shouldStopMonitoring, resetMonitoring, cleanup, animationIdRef } = useFPSMonitor();
  useBatteryMonitor(setPerformanceState);
  const { autoAdjustQuality, setQuality, togglePause } = useQualityManager(performanceState, setPerformanceState);

  // Enhanced FPS monitoring with mobile considerations
  const monitorFPS = useCallback(() => {
    const now = performance.now();
    const fps = calculateFPS(now);

    if (fps > 0) {
      setPerformanceState(prev => ({ ...prev, fps }));
      
      const config = createFPSMonitorConfig(performanceState.deviceCapabilities.isMobile);
      
      // Check if we need to downgrade during monitoring period
      if (!shouldStopMonitoring(now)) {
        if (fps < config.minFPS && !performanceState.shouldAutoDegrade) {
          console.log(`Low FPS detected (${fps}fps), enabling auto-degradation`);
          setPerformanceState(prev => ({ ...prev, shouldAutoDegrade: true }));
        }
      } else {
        // Stop monitoring after duration
        setPerformanceState(prev => ({ ...prev, isMonitoring: false }));
        if (animationIdRef.current) {
          cancelAnimationFrame(animationIdRef.current);
        }
        return;
      }
    }

    animationIdRef.current = requestAnimationFrame(monitorFPS);
  }, [calculateFPS, shouldStopMonitoring, performanceState.shouldAutoDegrade, performanceState.deviceCapabilities]);

  // Start FPS monitoring with device-specific considerations
  const startMonitoring = useCallback(() => {
    if (performanceState.isMonitoring || performanceState.isPaused) return;

    console.log('Starting FPS monitoring for', performanceState.deviceCapabilities.isMobile ? 'mobile' : 'desktop', 'device...');
    resetMonitoring();
    
    setPerformanceState(prev => ({ 
      ...prev, 
      isMonitoring: true, 
      shouldAutoDegrade: false 
    }));
    
    monitorFPS();
  }, [performanceState.isMonitoring, performanceState.isPaused, monitorFPS, resetMonitoring, performanceState.deviceCapabilities]);

  // Initialize quality from saved preference
  useEffect(() => {
    const savedQuality = loadSavedQuality(performanceState.deviceCapabilities);
    setPerformanceState(prev => ({ ...prev, currentQuality: savedQuality }));
  }, [performanceState.deviceCapabilities]);

  // Auto-adjust quality based on performance metrics
  useEffect(() => {
    autoAdjustQuality();
  }, [performanceState.fps, performanceState.shouldAutoDegrade, autoAdjustQuality]);

  // Listen for reduced motion preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        setPerformanceState(prev => ({ ...prev, currentQuality: 'static' }));
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Cleanup
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return {
    currentQuality: performanceState.currentQuality,
    fps: performanceState.fps,
    isMonitoring: performanceState.isMonitoring,
    deviceCapabilities: performanceState.deviceCapabilities,
    isPaused: performanceState.isPaused,
    optimalFiberCount: getOptimalFiberCount(performanceState.deviceCapabilities),
    startMonitoring,
    setQuality,
    togglePause
  };
};
