
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
      const pulseEffect = Math.sin(time * 0.002 + node.pulsePhase) * 0.3 + 0.7;
      intensity = baseIntensity * pulseEffect * node.connectionStrength;
      
      // Hero synchronization effect
      intensity += heroGlowIntensity * 0.3;
    }
    
    return {
      ...node,
      isActive: isInSegment,
      intensity: Math.min(Math.max(intensity, 0), 1)
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
  // Fix: Ensure proper progression with minimum speed
  const baseSpeed = Math.max(speed, 0.5);
  const speedMultiplier = pathType === 'main' ? 1 : 1.2;
  
  // Use time-based progression for smooth animation
  const progressionRate = baseSpeed * speedMultiplier * deltaTime * 0.001;
  let nextIndex = currentIndex + progressionRate;
  
  // Reset when reaching the end
  if (nextIndex >= nodeCount) {
    nextIndex = 0;
    console.log(`Path ${pathType} completed cycle, resetting to 0`);
  }
  
  return nextIndex;
};

export const updatePathProperties = (
  path: EnhancedSnakePath,
  heroGlowIntensity: number
): { opacity: number; glowIntensity: number } => {
  return {
    opacity: Math.min(path.opacity + heroGlowIntensity * 0.2, 1),
    glowIntensity: Math.min(path.glowIntensity + heroGlowIntensity * 0.4, 2)
  };
};
