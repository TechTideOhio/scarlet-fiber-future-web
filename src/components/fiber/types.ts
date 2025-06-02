
import type { QualityLevel } from '../../hooks/usePerformanceMonitor';

export interface CSSFiberAnimationProps {
  opacity: number;
  enableMouseEffects?: boolean;
  isVisible?: boolean;
  quality: QualityLevel;
  fiberCount?: number;
  isMobile?: boolean;
}

export interface FiberStrandProps {
  index: number;
  enableMouseEffects: boolean;
  isVisible: boolean;
  isMobile: boolean;
}

export interface FiberConfig {
  actualFiberCount: number;
  baseWidth: number;
  baseOpacity: number;
}
