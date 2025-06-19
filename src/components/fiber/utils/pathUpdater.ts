
import { EnhancedSnakePath, EnhancedSnakeNode } from '../types/snakeTypes';

export const updatePathNodes = (
  path: EnhancedSnakePath,
  activeSegmentIndex: number,
  time: number,
  heroGlowIntensity: number
): EnhancedSnakeNode[] => {
  return path.nodes.map((node, index) => {
    const distanceFromActive = Math.abs(index - activeSegmentIndex);
    const isInSegment = distanceFromActive < path.segmentLength;
    
    // Calculate intensity with pulse effects
    let intensity = 0;
    if (isInSegment) {
      const baseIntensity = Math.max(0, 1 - (distanceFromActive / path.segmentLength));
      const pulseEffect = Math.sin(time * 2 + node.pulsePhase) * 0.3 + 0.7;
      intensity = baseIntensity * pulseEffect * node.connectionStrength;
      
      // Hero synchronization effect
      intensity += heroGlowIntensity * 0.3;
    }
    
    return {
      ...node,
      isActive: isInSegment,
      intensity: Math.min(intensity, 1)
    };
  });
};

export const calculateNextSegmentIndex = (
  currentIndex: number,
  speed: number,
  pathType: 'main' | 'branch' | 'connection',
  deltaTime: number,
  nodeCount: number
): number => {
  const speedMultiplier = pathType === 'main' ? 1 : 1.5;
  let nextIndex = currentIndex + speed * speedMultiplier * deltaTime * 0.08;
  
  // Reset when reaching the end
  if (nextIndex >= nodeCount) {
    nextIndex = 0;
  }
  
  return nextIndex;
};

export const updatePathProperties = (
  path: EnhancedSnakePath,
  heroGlowIntensity: number
): { opacity: number; glowIntensity: number } => {
  return {
    opacity: path.opacity + heroGlowIntensity * 0.2,
    glowIntensity: path.glowIntensity + heroGlowIntensity * 0.4
  };
};
