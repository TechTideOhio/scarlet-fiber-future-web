
import type { QualityLevel } from '../../hooks/usePerformanceMonitor';

export const calculateFiberCount = (
  fiberCount: number | undefined,
  quality: QualityLevel,
  isMobile: boolean = false
): number => {
  return fiberCount ?? (() => {
    switch (quality) {
      case 'high': return isMobile ? 6 : 10; // Reduced for Snake paths
      case 'medium': return isMobile ? 4 : 7; // Reduced for Snake paths
      case 'low': return isMobile ? 3 : 5; // Reduced for Snake paths
      case 'static': return 0; // No animation in static mode
      default: return isMobile ? 4 : 7;
    }
  })();
};

export const getSnakeConfig = (isMobile: boolean) => ({
  pathWidth: isMobile ? 3 : 5,
  segmentLength: isMobile ? 8 : 12,
  animationSpeed: isMobile ? 0.8 : 1.2,
  nodeSize: isMobile ? 2 : 3,
  glowIntensity: isMobile ? 0.7 : 1.0
});

// Legacy fiber config for backward compatibility
export const getFiberConfig = (isMobile: boolean) => ({
  baseWidth: isMobile ? 2.5 : 4,
  baseOpacity: 0.8
});
