
import { EnhancedSnakePath, EnhancedSnakeNode } from '../types/snakeTypes';

export const updatePathNodes = (
  path: EnhancedSnakePath,
  activeSegmentIndex: number,
  time: number,
  heroGlowIntensity: number
): EnhancedSnakeNode[] => {
  // CRITICAL FIX: Ensure proper node activation with guaranteed active nodes
  const safeActiveIndex = Math.max(0, Math.min(activeSegmentIndex, path.nodes.length - 1));
  
  return path.nodes.map((node, index) => {
    const distanceFromActive = Math.abs(index - safeActiveIndex);
    const isInSegment = distanceFromActive < path.segmentLength;
    
    // CRITICAL FIX: Calculate intensity with guaranteed minimum visibility
    let intensity = 0;
    if (isInSegment) {
      const baseIntensity = Math.max(0.2, 1 - (distanceFromActive / path.segmentLength));
      // Reduced pulse effect speed by 50% - was 0.003, now 0.0015
      const pulseEffect = Math.sin(time * 0.0015 + node.pulsePhase) * 0.3 + 0.7;
      intensity = baseIntensity * pulseEffect * node.connectionStrength;
      
      // Hero synchronization effect
      intensity += heroGlowIntensity * 0.4;
      
      // CRITICAL FIX: Ensure minimum visibility for active nodes
      intensity = Math.max(intensity, 0.4);
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
  // CRITICAL FIX: Ensure smooth, predictable progression with minimum speed
  const baseSpeed = Math.max(speed, 0.25); // Reduced from 0.5 to 0.25 (50% slower)
  const speedMultiplier = pathType === 'main' ? 0.3 : 0.4; // Reduced multipliers by 50%
  
  // CRITICAL FIX: Use consistent time-based progression that's more visible
  const progressionRate = baseSpeed * speedMultiplier * deltaTime * 0.001; // Reduced from 0.002 to 0.001
  let nextIndex = currentIndex + progressionRate;
  
  // CRITICAL FIX: Proper wraparound ensuring continuous animation
  if (nextIndex >= nodeCount - 1) {
    nextIndex = 0;
    console.log(`Path ${pathType} completed cycle, resetting from ${currentIndex} to 0`);
  }
  
  return nextIndex;
};

export const updatePathProperties = (
  path: EnhancedSnakePath,
  heroGlowIntensity: number
): { opacity: number; glowIntensity: number } => {
  return {
    opacity: Math.min(Math.max(path.opacity + heroGlowIntensity * 0.3, 0.7), 1),
    glowIntensity: Math.min(Math.max(path.glowIntensity + heroGlowIntensity * 0.5, 0.8), 2.5)
  };
};
