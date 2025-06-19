
export interface EnhancedSnakeNode {
  x: number;
  y: number;
  id: string;
  isActive: boolean;
  intensity: number;
  pulsePhase: number;
  connectionStrength: number;
}

export interface EnhancedSnakePath {
  id: string;
  nodes: EnhancedSnakeNode[];
  direction: 'horizontal' | 'vertical' | 'diagonal' | 'curved';
  speed: number;
  color: string;
  width: number;
  activeSegmentIndex: number;
  segmentLength: number;
  pathType: 'main' | 'branch' | 'connection';
  layer: number;
  opacity: number;
  glowIntensity: number;
}

export interface PathGenerationConfig {
  containerWidth: number;
  containerHeight: number;
  isMobile: boolean;
  pathCount: number;
  colors: string[];
}
