
import { EnhancedSnakePath, EnhancedSnakeNode } from '../types/snakeTypes';
import { FIBER_ANIMATION_TOKENS, logFiberToken } from '../../../constants';

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
      const baseIntensity = Math.max(
        FIBER_ANIMATION_TOKENS.node.minIntensity, 
        1 - (distanceFromActive / path.segmentLength)
      );
      
      const pulseEffect = Math.sin(
        time * FIBER_ANIMATION_TOKENS.pulse.speed + node.pulsePhase
      ) * FIBER_ANIMATION_TOKENS.pulse.amplitude + FIBER_ANIMATION_TOKENS.pulse.offset;
      
      intensity = baseIntensity * pulseEffect * node.connectionStrength;
      
      // Hero synchronization effect
      intensity += heroGlowIntensity * FIBER_ANIMATION_TOKENS.glow.heroBoost;
      
      // CRITICAL FIX: Ensure minimum visibility for active nodes
      intensity = Math.max(intensity, FIBER_ANIMATION_TOKENS.node.minVisibility);
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
  const baseSpeed = Math.max(speed, FIBER_ANIMATION_TOKENS.speed.base.min);
  const speedMultiplier = pathType === 'main' 
    ? FIBER_ANIMATION_TOKENS.speed.multiplier.main 
    : FIBER_ANIMATION_TOKENS.speed.multiplier.branch;
  
  // CRITICAL FIX: Use consistent time-based progression that's more visible
  const progressionRate = baseSpeed * speedMultiplier * deltaTime * FIBER_ANIMATION_TOKENS.speed.progression;
  let nextIndex = currentIndex + progressionRate;
  
  // CRITICAL FIX: Proper wraparound ensuring continuous animation
  if (nextIndex >= nodeCount - 1) {
    nextIndex = 0;
    logFiberToken('path-cycle-complete', `${pathType} path reset`);
  }
  
  return nextIndex;
};

export const updatePathProperties = (
  path: EnhancedSnakePath,
  heroGlowIntensity: number
): { opacity: number; glowIntensity: number } => {
  return {
    opacity: Math.min(
      Math.max(
        path.opacity + heroGlowIntensity * FIBER_ANIMATION_TOKENS.glow.heroPathBoost, 
        FIBER_ANIMATION_TOKENS.opacity.path.base
      ), 
      FIBER_ANIMATION_TOKENS.opacity.path.max
    ),
    glowIntensity: Math.min(
      Math.max(
        path.glowIntensity + heroGlowIntensity * FIBER_ANIMATION_TOKENS.glow.heroBoost, 
        FIBER_ANIMATION_TOKENS.glow.base
      ), 
      FIBER_ANIMATION_TOKENS.glow.max
    )
  };
};
