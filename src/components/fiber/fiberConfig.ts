
import type { QualityLevel } from '../../hooks/usePerformanceMonitor';
import { FIBER_ANIMATION_TOKENS } from '../../constants';

export const calculateFiberCount = (
  fiberCount: number | undefined,
  quality: QualityLevel,
  isMobile: boolean = false
): number => {
  return fiberCount ?? (() => {
    const counts = isMobile 
      ? FIBER_ANIMATION_TOKENS.pathCount.mobile 
      : FIBER_ANIMATION_TOKENS.pathCount.desktop;
    
    switch (quality) {
      case 'high': return counts.high;
      case 'medium': return counts.medium;
      case 'low': return counts.low;
      case 'static': return counts.static;
      default: return counts.medium;
    }
  })();
};

export const getSnakeConfig = (isMobile: boolean) => ({
  pathWidth: isMobile 
    ? FIBER_ANIMATION_TOKENS.lineWidth.mobile.main 
    : FIBER_ANIMATION_TOKENS.lineWidth.desktop.main,
  segmentLength: isMobile 
    ? FIBER_ANIMATION_TOKENS.segmentLength.mobile.main 
    : FIBER_ANIMATION_TOKENS.segmentLength.desktop.main,
  animationSpeed: isMobile ? 0.8 : 1.2,
  nodeSize: isMobile 
    ? FIBER_ANIMATION_TOKENS.lineWidth.mobile.node 
    : FIBER_ANIMATION_TOKENS.lineWidth.desktop.node,
  glowIntensity: isMobile ? 0.7 : 1.0
});

// Legacy fiber config for backward compatibility
export const getFiberConfig = (isMobile: boolean) => ({
  baseWidth: isMobile ? 2.5 : 4,
  baseOpacity: FIBER_ANIMATION_TOKENS.opacity.path.base
});
