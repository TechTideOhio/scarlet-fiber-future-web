
import type { QualityLevel } from '../../hooks/usePerformanceMonitor';

export const calculateFiberCount = (
  fiberCount: number | undefined,
  quality: QualityLevel,
  isMobile: boolean = false
): number => {
  return fiberCount ?? (() => {
    switch (quality) {
      case 'high': return isMobile ? 12 : 20; // Increased for better visibility
      case 'medium': return isMobile ? 10 : 16; // Increased
      case 'low': return isMobile ? 8 : 12; // Increased
      case 'static': return 8; // Show more fibers even in static mode
      default: return isMobile ? 10 : 16;
    }
  })();
};

export const getFiberConfig = (isMobile: boolean) => ({
  baseWidth: isMobile ? 2.5 : 4, // Increased from previous values
  baseOpacity: 0.8 // Increased from 0.4
});
