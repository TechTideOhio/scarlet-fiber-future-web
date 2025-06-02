
import type { QualityLevel } from '../../hooks/usePerformanceMonitor';

export const calculateFiberCount = (
  fiberCount: number | undefined,
  quality: QualityLevel,
  isMobile: boolean = false
): number => {
  return fiberCount ?? (() => {
    switch (quality) {
      case 'high': return isMobile ? 8 : 15;
      case 'medium': return isMobile ? 6 : 10;
      case 'low': return isMobile ? 4 : 8;
      case 'static': return 6; // Show fibers even in static mode
      default: return isMobile ? 8 : 12;
    }
  })();
};

export const getFiberConfig = (isMobile: boolean) => ({
  baseWidth: isMobile ? 1.5 : 2,
  baseOpacity: 0.4
});
