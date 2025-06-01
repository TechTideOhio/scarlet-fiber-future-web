
import { useEffect, useState, useRef, useCallback } from 'react';
import { detectDeviceCapabilities, getOptimalFiberCount } from '../utils/deviceDetection';

export type QualityLevel = 'high' | 'medium' | 'low' | 'static';

interface PerformanceState {
  currentQuality: QualityLevel;
  fps: number;
  isMonitoring: boolean;
  shouldAutoDegrade: boolean;
  deviceCapabilities: ReturnType<typeof detectDeviceCapabilities>;
  isPaused: boolean;
}

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

  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const monitoringStartRef = useRef(0);
  const animationIdRef = useRef<number>();
  const batteryApiRef = useRef<any>(null);

  // Check for reduced motion preference and update accordingly
  const prefersReducedMotion = useCallback(() => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  // Load saved preference from localStorage with device-specific defaults
  const loadSavedQuality = useCallback((): QualityLevel => {
    if (prefersReducedMotion()) return 'static';
    
    const saved = localStorage.getItem('fiber-animation-quality');
    if (saved && ['high', 'medium', 'low', 'static'].includes(saved)) {
      return saved as QualityLevel;
    }
    
    // Device-specific defaults
    const { isMobile, ram, isOldBrowser } = performanceState.deviceCapabilities;
    if (isOldBrowser) return 'static';
    if (isMobile && ram < 3) return 'low';
    if (isMobile) return 'medium';
    if (ram < 4) return 'medium';
    return 'high';
  }, [prefersReducedMotion, performanceState.deviceCapabilities]);

  // Save quality preference to localStorage
  const saveQualityPreference = useCallback((quality: QualityLevel) => {
    localStorage.setItem('fiber-animation-quality', quality);
  }, []);

  // Enhanced FPS monitoring with mobile considerations
  const monitorFPS = useCallback(() => {
    const now = performance.now();
    frameCountRef.current++;

    // Calculate FPS every second
    if (now - lastTimeRef.current >= 1000) {
      const fps = Math.round((frameCountRef.current * 1000) / (now - lastTimeRef.current));
      
      setPerformanceState(prev => ({ ...prev, fps }));
      
      frameCountRef.current = 0;
      lastTimeRef.current = now;

      // Device-specific performance thresholds
      const { isMobile } = performanceState.deviceCapabilities;
      const minFPS = isMobile ? 25 : 30; // Lower threshold for mobile
      
      // Check if we need to downgrade during monitoring period
      if (now - monitoringStartRef.current < 5000) { // Extended monitoring for mobile
        if (fps < minFPS && !performanceState.shouldAutoDegrade) {
          console.log(`Low FPS detected (${fps}fps), enabling auto-degradation`);
          setPerformanceState(prev => ({ ...prev, shouldAutoDegrade: true }));
        }
      } else {
        // Stop monitoring after 5 seconds
        setPerformanceState(prev => ({ ...prev, isMonitoring: false }));
        if (animationIdRef.current) {
          cancelAnimationFrame(animationIdRef.current);
        }
        return;
      }
    }

    animationIdRef.current = requestAnimationFrame(monitorFPS);
  }, [performanceState.shouldAutoDegrade, performanceState.deviceCapabilities]);

  // Battery API monitoring for mobile devices
  useEffect(() => {
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        batteryApiRef.current = battery;
        
        // Downgrade quality if battery is low
        const checkBattery = () => {
          if (battery.level < 0.2 && !battery.charging) {
            console.log('Low battery detected, reducing animation quality');
            setPerformanceState(prev => ({ 
              ...prev, 
              currentQuality: prev.currentQuality === 'high' ? 'medium' : 'low'
            }));
          }
        };
        
        battery.addEventListener('levelchange', checkBattery);
        battery.addEventListener('chargingchange', checkBattery);
        checkBattery();
      });
    }
  }, []);

  // Start FPS monitoring with device-specific considerations
  const startMonitoring = useCallback(() => {
    if (performanceState.isMonitoring || performanceState.isPaused) return;

    console.log('Starting FPS monitoring for', performanceState.deviceCapabilities.isMobile ? 'mobile' : 'desktop', 'device...');
    monitoringStartRef.current = performance.now();
    lastTimeRef.current = performance.now();
    frameCountRef.current = 0;
    
    setPerformanceState(prev => ({ 
      ...prev, 
      isMonitoring: true, 
      shouldAutoDegrade: false 
    }));
    
    monitorFPS();
  }, [performanceState.isMonitoring, performanceState.isPaused, monitorFPS, performanceState.deviceCapabilities]);

  // Auto-downgrade quality based on performance with device-specific logic
  const autoAdjustQuality = useCallback(() => {
    if (!performanceState.shouldAutoDegrade || performanceState.isPaused) return;

    const { isMobile } = performanceState.deviceCapabilities;
    const minFPS = isMobile ? 25 : 30;
    
    let newQuality: QualityLevel = performanceState.currentQuality;

    if (performanceState.fps < minFPS) {
      switch (performanceState.currentQuality) {
        case 'high':
          newQuality = isMobile ? 'low' : 'medium'; // Skip medium on mobile for faster recovery
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
      console.log(`Auto-downgrading quality from ${performanceState.currentQuality} to ${newQuality} (${performanceState.fps}fps)`);
      setPerformanceState(prev => ({ ...prev, currentQuality: newQuality }));
      saveQualityPreference(newQuality);
    }
  }, [performanceState, saveQualityPreference]);

  // Manual quality override
  const setQuality = useCallback((quality: QualityLevel) => {
    setPerformanceState(prev => ({ ...prev, currentQuality: quality }));
    saveQualityPreference(quality);
  }, [saveQualityPreference]);

  // Pause/resume functionality
  const togglePause = useCallback(() => {
    setPerformanceState(prev => ({ ...prev, isPaused: !prev.isPaused }));
  }, []);

  // Initialize quality from saved preference
  useEffect(() => {
    const savedQuality = loadSavedQuality();
    setPerformanceState(prev => ({ ...prev, currentQuality: savedQuality }));
  }, [loadSavedQuality]);

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
    deviceCapabilities: performanceState.deviceCapabilities,
    isPaused: performanceState.isPaused,
    optimalFiberCount: getOptimalFiberCount(performanceState.deviceCapabilities),
    startMonitoring,
    setQuality,
    togglePause
  };
};
