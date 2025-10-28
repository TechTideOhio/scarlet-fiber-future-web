
import { EnhancedSnakePath, EnhancedSnakeNode, PathGenerationConfig } from '../types/snakeTypes';
import { FIBER_ANIMATION_TOKENS, COLOR_TOKENS, ANIMATION_TOKENS, logFiberToken } from '../../../constants';

export const createMainNetworkPath = (
  index: number, 
  color: string, 
  config: PathGenerationConfig
): EnhancedSnakePath => {
  const { containerWidth, containerHeight, isMobile } = config;
  const nodes: EnhancedSnakeNode[] = [];
  const segmentLength = isMobile 
    ? FIBER_ANIMATION_TOKENS.segmentLength.mobile.main 
    : FIBER_ANIMATION_TOKENS.segmentLength.desktop.main;
  
  // CRITICAL FIX: Deterministic positioning to avoid overlapping paths
  const pathType = index % FIBER_ANIMATION_TOKENS.layers.default === 0 ? 'horizontal' 
    : index % FIBER_ANIMATION_TOKENS.layers.default === 1 ? 'diagonal' 
    : 'curved';
  
  if (pathType === 'horizontal') {
    // Create horizontal paths with fixed spacing
    const yPosition = (containerHeight / (FIBER_ANIMATION_TOKENS.layers.default + 4)) * (1 + (index % 5));
    const nodeCount = Math.floor(containerWidth / segmentLength);
    
    for (let i = 0; i < nodeCount; i++) {
      const progress = i / (nodeCount - 1);
      const x = progress * containerWidth;
      
      // Predictable wave motion
      const waveAmplitude = isMobile ? segmentLength * 0.7 : segmentLength * 1.0;
      const waveOffset = Math.sin(progress * Math.PI * 2 + index * 0.8) * waveAmplitude;
      const edgePadding = segmentLength;
      const finalY = Math.max(edgePadding, Math.min(containerHeight - edgePadding, yPosition + waveOffset));
      
      nodes.push({
        id: `main-horizontal-${index}-${i}`,
        x: Math.max(0, Math.min(containerWidth, x)),
        y: finalY,
        isActive: false,
        intensity: 0,
        pulsePhase: (i * 0.3) % (Math.PI * 2), // Predictable phase
        connectionStrength: 0.8 + (i % 3) * 0.1
      });
    }
  } else if (pathType === 'diagonal') {
    // Create diagonal paths
    const gridDivisions = FIBER_ANIMATION_TOKENS.layers.default + 1;
    const startX = (index % gridDivisions) * (containerWidth / gridDivisions);
    const endX = containerWidth - startX;
    const startY = containerHeight * ANIMATION_TOKENS.opacity.faint;
    const endY = containerHeight * ANIMATION_TOKENS.opacity.bright;
    const nodeCount = Math.floor(Math.abs(endX - startX) / (segmentLength * 1.2));
    
    for (let i = 0; i < nodeCount; i++) {
      const progress = i / (nodeCount - 1);
      const x = startX + (endX - startX) * progress;
      const y = startY + (endY - startY) * progress;
      
      nodes.push({
        id: `main-diagonal-${index}-${i}`,
        x: Math.max(0, Math.min(containerWidth, x)),
        y: Math.max(0, Math.min(containerHeight, y)),
        isActive: false,
        intensity: 0,
        pulsePhase: (i * 0.4) % (Math.PI * 2),
        connectionStrength: 0.7 + (i % 2) * 0.2
      });
    }
  } else {
    // Create curved paths
    const centerX = containerWidth / 2;
    const centerY = containerHeight / 2;
    const radius = Math.min(containerWidth, containerHeight) * ANIMATION_TOKENS.opacity.dim;
    const nodeCount = Math.floor((Math.PI * radius) / (segmentLength * 0.9));
    
    for (let i = 0; i < nodeCount; i++) {
      const angle = (i / nodeCount) * Math.PI * 2 + index * 0.5;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      
      nodes.push({
        id: `main-curved-${index}-${i}`,
        x: Math.max(0, Math.min(containerWidth, x)),
        y: Math.max(0, Math.min(containerHeight, y)),
        isActive: false,
        intensity: 0,
        pulsePhase: (angle + index) % (Math.PI * 2),
        connectionStrength: 0.6 + Math.abs(Math.sin(angle)) * 0.3
      });
    }
  }

  logFiberToken('path-generated', `main-${index} (${pathType}): ${nodes.length} nodes`);

  const lineWidth = isMobile 
    ? FIBER_ANIMATION_TOKENS.lineWidth.mobile.main 
    : FIBER_ANIMATION_TOKENS.lineWidth.desktop.main;

  return {
    id: `enhanced-main-${index}`,
    nodes,
    direction: pathType === 'horizontal' ? 'horizontal' : pathType === 'diagonal' ? 'diagonal' : 'curved',
    speed: FIBER_ANIMATION_TOKENS.speed.base.min + (index % FIBER_ANIMATION_TOKENS.layers.default) * ANIMATION_TOKENS.opacity.dim,
    color,
    width: lineWidth,
    activeSegmentIndex: (index * 5) % Math.max(nodes.length - segmentLength, 1),
    segmentLength,
    pathType: 'main',
    layer: index % FIBER_ANIMATION_TOKENS.layers.default,
    opacity: FIBER_ANIMATION_TOKENS.opacity.path.base + (index % 2) * ANIMATION_TOKENS.opacity.subtle,
    glowIntensity: FIBER_ANIMATION_TOKENS.glow.base + (index % FIBER_ANIMATION_TOKENS.layers.default) * ANIMATION_TOKENS.opacity.faint
  };
};

export const createBranchPath = (
  index: number, 
  color: string, 
  config: PathGenerationConfig
): EnhancedSnakePath => {
  const { containerWidth, containerHeight, isMobile } = config;
  const nodes: EnhancedSnakeNode[] = [];
  const nodeCount = isMobile 
    ? FIBER_ANIMATION_TOKENS.count.min 
    : FIBER_ANIMATION_TOKENS.count.default.hero;
  const segmentLength = isMobile 
    ? FIBER_ANIMATION_TOKENS.segmentLength.mobile.branch 
    : FIBER_ANIMATION_TOKENS.segmentLength.desktop.branch;
  
  // CRITICAL FIX: Create predictable connecting paths
  const gridDivisions = FIBER_ANIMATION_TOKENS.layers.default * 2;
  const startX = (index % gridDivisions) * (containerWidth / gridDivisions);
  const startY = (index % FIBER_ANIMATION_TOKENS.layers.default + 1) * (containerHeight / (FIBER_ANIMATION_TOKENS.layers.default + 1));
  const angle = (index * Math.PI) / FIBER_ANIMATION_TOKENS.layers.default;
  const length = isMobile ? containerWidth * ANIMATION_TOKENS.opacity.faint : containerWidth * ANIMATION_TOKENS.opacity.dim;
  
  for (let i = 0; i < nodeCount; i++) {
    const progress = i / (nodeCount - 1);
    const x = startX + Math.cos(angle) * length * progress;
    const y = startY + Math.sin(angle) * length * progress;
    
    nodes.push({
      id: `branch-${index}-${i}`,
      x: Math.max(0, Math.min(containerWidth, x)),
      y: Math.max(0, Math.min(containerHeight, y)),
      isActive: false,
      intensity: 0,
      pulsePhase: (i * 0.5 + index) % (Math.PI * 2),
      connectionStrength: 0.5 + (i % 2) * 0.3
    });
  }

  logFiberToken('branch-generated', `branch-${index}: ${nodes.length} nodes`);

  const lineWidth = isMobile 
    ? FIBER_ANIMATION_TOKENS.lineWidth.mobile.branch 
    : FIBER_ANIMATION_TOKENS.lineWidth.desktop.branch;

  return {
    id: `enhanced-branch-${index}`,
    nodes,
    direction: 'diagonal',
    speed: FIBER_ANIMATION_TOKENS.speed.base.default + (index % 2) * ANIMATION_TOKENS.opacity.medium,
    color,
    width: lineWidth,
    activeSegmentIndex: (index * 3) % Math.max(nodes.length - segmentLength, 1),
    segmentLength,
    pathType: 'branch',
    layer: (index % 2) + 1,
    opacity: FIBER_ANIMATION_TOKENS.opacity.path.min + (index % FIBER_ANIMATION_TOKENS.layers.default) * ANIMATION_TOKENS.opacity.faint,
    glowIntensity: FIBER_ANIMATION_TOKENS.glow.min + (index % 2) * ANIMATION_TOKENS.opacity.dim
  };
};

export const getDefaultColors = (): string[] => [...COLOR_TOKENS.fiberPath];
