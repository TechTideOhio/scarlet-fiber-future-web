
import { EnhancedSnakePath, EnhancedSnakeNode } from '../types/snakeTypes';

export const updatePathNodes = (
  path: EnhancedSnakePath,
  activeSegmentIndex: number,
  time: number,
  heroGlowIntensity: number
): EnhancedSnakeNode[] => {
  // CRITICAL FIX: Ensure proper node activation
  const safeActiveIndex = Math.max(0, Math.min(activeSegmentIndex, path.nodes.length - 1));
  
  return path.nodes.map((node, index) => {
    const distanceFromActive = Math.abs(index - safeActiveIndex);
    const isInSegment = distanceFromActive < path.segmentLength;
    
    // Calculate intensity with enhanced visibility
    let intensity = 0;
    if (isInSegment) {
      const baseIntensity = Math.max(0.1, 1 - (distanceFromActive / path.segmentLength));
      const pulseEffect = Math.sin(time * 0.003 + node.pulsePhase) * 0.2 + 0.8;
      intensity = baseIntensity * pulseEffect * node.connectionStrength;
      
      // Hero synchronization effect
      intensity += heroGlowIntensity * 0.3;
      
      // CRITICAL FIX: Ensure minimum visibility
      intensity = Math.max(intensity, 0.3);
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
  // CRITICAL FIX: Ensure smooth, predictable progression
  const baseSpeed = Math.max(speed, 0.3); // Minimum speed
  const speedMultiplier = pathType === 'main' ? 0.8 : 1.0; // Slower main paths
  
  // Use consistent time-based progression
  const progressionRate = baseSpeed * speedMultiplier * deltaTime * 0.0015; // Slower overall
  let nextIndex = currentIndex + progressionRate;
  
  // CRITICAL FIX: Proper wraparound with segment consideration
  const maxIndex = nodeCount - 1;
  if (nextIndex >= maxIndex) {
    nextIndex = 0; // Reset to beginning
    console.log(`Path ${pathType} completed cycle, resetting to 0`);
  }
  
  return nextIndex;
};

export const updatePathProperties = (
  path: EnhancedSnakePath,
  heroGlowIntensity: number
): { opacity: number; glowIntensity: number } => {
  return {
    opacity: Math.min(Math.max(path.opacity + heroGlowIntensity * 0.2, 0.6), 1),
    glowIntensity: Math.min(Math.max(path.glowIntensity + heroGlowIntensity * 0.4, 0.5), 2)
  };
};
