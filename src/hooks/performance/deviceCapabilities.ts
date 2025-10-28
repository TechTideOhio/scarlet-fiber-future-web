
import { QualityLevel } from './types';
import { PERFORMANCE_TOKENS } from '../../constants';

export const prefersReducedMotion = (): boolean => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

export const getDeviceSpecificDefaults = (deviceCapabilities: any): QualityLevel => {
  if (prefersReducedMotion()) return 'static';
  
  const { isMobile, ram, isOldBrowser } = deviceCapabilities;
  if (isOldBrowser) return 'static';
  if (isMobile && ram < PERFORMANCE_TOKENS.memory.low) return 'low';
  if (isMobile) return 'medium';
  if (ram < PERFORMANCE_TOKENS.memory.medium) return 'medium';
  return 'high';
};

export const loadSavedQuality = (deviceCapabilities: any): QualityLevel => {
  if (prefersReducedMotion()) return 'static';
  
  const saved = localStorage.getItem('fiber-animation-quality');
  if (saved && ['high', 'medium', 'low', 'static'].includes(saved)) {
    return saved as QualityLevel;
  }
  
  return getDeviceSpecificDefaults(deviceCapabilities);
};

export const saveQualityPreference = (quality: QualityLevel): void => {
  localStorage.setItem('fiber-animation-quality', quality);
};
