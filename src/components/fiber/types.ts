import type { QualityLevel } from '../../hooks/usePerformanceMonitor';

// Re-export snake types for backward compatibility
export type { 
  EnhancedSnakeNode, 
  EnhancedSnakePath, 
  PathGenerationConfig 
} from './types/snakeTypes';

// Keep existing types
export interface CSSFiberAnimationProps {
  opacity: number;
  enableMouseEffects?: boolean;
  isVisible?: boolean;
  quality: import('../../hooks/usePerformanceMonitor').QualityLevel;
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

// Legacy snake interfaces - keeping for backward compatibility
export interface SnakeNode {
  x: number;
  y: number;
  id: string;
  isActive: boolean;
  intensity: number;
}

export interface SnakePath {
  id: string;
  nodes: SnakeNode[];
  direction: 'horizontal' | 'vertical' | 'diagonal';
  speed: number;
  color: string;
  width: number;
  activeSegmentIndex: number;
  segmentLength: number;
}

export interface SnakeConfig {
  pathWidth: number;
  segmentLength: number;
  animationSpeed: number;
  nodeSize: number;
  glowIntensity: number;
}
