
import { useCallback } from 'react';
import { QualityLevel, PerformanceState } from './types';
import { saveQualityPreference } from './deviceCapabilities';

export const useQualityManager = (
  performanceState: PerformanceState,
  setPerformanceState: React.Dispatch<React.SetStateAction<PerformanceState>>
) => {
  const autoAdjustQuality = useCallback(() => {
    if (!performanceState.shouldAutoDegrade || performanceState.isPaused) return;

    const { isMobile } = performanceState.deviceCapabilities;
    const minFPS = isMobile ? 25 : 30;
    
    let newQuality: QualityLevel = performanceState.currentQuality;

    if (performanceState.fps < minFPS) {
      switch (performanceState.currentQuality) {
        case 'high':
          newQuality = isMobile ? 'low' : 'medium';
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
  }, [performanceState, setPerformanceState]);

  const setQuality = useCallback((quality: QualityLevel) => {
    setPerformanceState(prev => ({ ...prev, currentQuality: quality }));
    saveQualityPreference(quality);
  }, [setPerformanceState]);

  const togglePause = useCallback(() => {
    setPerformanceState(prev => ({ ...prev, isPaused: !prev.isPaused }));
  }, [setPerformanceState]);

  return {
    autoAdjustQuality,
    setQuality,
    togglePause
  };
};
