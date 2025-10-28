
import { EnhancedSnakePath, EnhancedSnakeNode } from '../types/snakeTypes';
import { FIBER_ANIMATION_TOKENS, ANIMATION_TOKENS, logFiberToken } from '../../../constants';

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
  // Ensure smooth, predictable progression with minimum speed
  const baseSpeed = Math.max(speed, FIBER_ANIMATION_TOKENS.speed.base.min);
  const speedMultiplier = pathType === 'main' 
    ? FIBER_ANIMATION_TOKENS.speed.multiplier.main 
    : FIBER_ANIMATION_TOKENS.speed.multiplier.branch;
  
  // Apply master speed controls: global × fiber.snake × progression
  const masterSpeedMultiplier = ANIMATION_TOKENS.masterSpeed.global * ANIMATION_TOKENS.masterSpeed.fiber.snake;
  const progressionRate = baseSpeed * speedMultiplier * deltaTime * FIBER_ANIMATION_TOKENS.speed.progression * masterSpeedMultiplier;
  let nextIndex = currentIndex + progressionRate;
  
  // Log snake movement periodically (every ~120 frames at 60fps)
  const shouldLog = Math.random() < 0.008; // ~1/120 chance
  if (shouldLog) {
    const estimatedDuration = (nodeCount / (progressionRate / deltaTime)) / 1000;
    console.log(
      `🐍 SNAKE v3.0 [${pathType}]: speed=${(progressionRate/deltaTime).toFixed(8)}/ms, ` +
      `estimated_cycle=${estimatedDuration.toFixed(1)}s, ` +
      `masterSpeed=${masterSpeedMultiplier.toFixed(6)}x (${(1/ANIMATION_TOKENS.masterSpeed.global).toFixed(1)}x slower)`
    );
  }
  
  // Proper wraparound ensuring continuous animation
  if (nextIndex >= nodeCount - 1) {
    nextIndex = 0;
    console.log(`🔁 Snake Wraparound: ${pathType} path cycled`);
  }
  
  return nextIndex;
};

export const updatePathProperties = (
  path: EnhancedSnakePath,
  heroGlowIntensity: number
): { opacity: number; glowIntensity: number } => {
  const opacity = Math.min(
    Math.max(
      path.opacity + heroGlowIntensity * FIBER_ANIMATION_TOKENS.glow.heroPathBoost, 
      FIBER_ANIMATION_TOKENS.opacity.path.base
    ), 
    FIBER_ANIMATION_TOKENS.opacity.path.max
  );
  
  const glowIntensity = Math.min(
    Math.max(
      path.glowIntensity + heroGlowIntensity * FIBER_ANIMATION_TOKENS.glow.heroBoost, 
      FIBER_ANIMATION_TOKENS.glow.base
    ), 
    FIBER_ANIMATION_TOKENS.glow.max
  );
  
  // Log property updates periodically
  const shouldLog = Math.random() < 0.01; // ~1% of frames
  if (shouldLog) {
    console.log(`✨ Path Properties: opacity=${opacity.toFixed(3)}, glow=${glowIntensity.toFixed(3)}, heroBoost=${heroGlowIntensity.toFixed(2)}`);
  }
  
  return { opacity, glowIntensity };
};
