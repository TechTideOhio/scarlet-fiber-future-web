
import { EnhancedSnakePath, EnhancedSnakeNode, PathGenerationConfig } from '../types/snakeTypes';

export const createMainNetworkPath = (
  index: number, 
  color: string, 
  config: PathGenerationConfig
): EnhancedSnakePath => {
  const { containerWidth, containerHeight, isMobile } = config;
  const nodes: EnhancedSnakeNode[] = [];
  const segmentLength = isMobile ? 10 : 15;
  const pathType = Math.random() < 0.7 ? 'horizontal' : 'curved';
  
  if (pathType === 'horizontal') {
    const y = (containerHeight / 8) * (1 + (index % 6));
    const nodeCount = Math.floor(containerWidth / (isMobile ? 50 : 70));
    
    for (let i = 0; i < nodeCount; i++) {
      const progress = i / (nodeCount - 1);
      const x = progress * containerWidth;
      
      // Add organic wave motion
      const waveOffset = Math.sin(progress * Math.PI * 3 + index * 0.5) * (isMobile ? 25 : 50);
      const finalY = y + waveOffset;
      
      nodes.push({
        id: `main-node-${index}-${i}`,
        x: Math.max(0, Math.min(containerWidth, x)),
        y: Math.max(0, Math.min(containerHeight, finalY)),
        isActive: false,
        intensity: 0,
        pulsePhase: Math.random() * Math.PI * 2,
        connectionStrength: 0.8 + Math.random() * 0.2
      });
    }
  } else {
    // Curved diagonal paths
    const startX = Math.random() * containerWidth * 0.2;
    const endX = containerWidth * 0.8 + Math.random() * containerWidth * 0.2;
    const nodeCount = Math.floor(Math.abs(endX - startX) / (isMobile ? 60 : 80));
    
    for (let i = 0; i < nodeCount; i++) {
      const progress = i / (nodeCount - 1);
      const x = startX + (endX - startX) * progress;
      
      // Create bezier-like curve
      const curveHeight = containerHeight * 0.3;
      const y = curveHeight + Math.sin(progress * Math.PI) * curveHeight;
      
      nodes.push({
        id: `curved-node-${index}-${i}`,
        x: Math.max(0, Math.min(containerWidth, x)),
        y: Math.max(0, Math.min(containerHeight, y)),
        isActive: false,
        intensity: 0,
        pulsePhase: Math.random() * Math.PI * 2,
        connectionStrength: 0.7 + Math.random() * 0.3
      });
    }
  }

  return {
    id: `enhanced-path-${index}`,
    nodes,
    direction: pathType === 'horizontal' ? 'horizontal' : 'curved',
    speed: 0.8 + Math.random() * 1.2,
    color,
    width: isMobile ? 4 : 6,
    activeSegmentIndex: Math.random() * nodes.length,
    segmentLength,
    pathType: 'main',
    layer: index % 3,
    opacity: 0.8 + Math.random() * 0.2,
    glowIntensity: 0.6 + Math.random() * 0.4
  };
};

export const createBranchPath = (
  index: number, 
  color: string, 
  config: PathGenerationConfig
): EnhancedSnakePath => {
  const { containerWidth, containerHeight, isMobile } = config;
  const nodes: EnhancedSnakeNode[] = [];
  const nodeCount = isMobile ? 8 : 12;
  
  // Create shorter connecting paths
  const startX = Math.random() * containerWidth;
  const startY = Math.random() * containerHeight;
  const angle = Math.random() * Math.PI * 2;
  const length = isMobile ? 150 : 250;
  
  for (let i = 0; i < nodeCount; i++) {
    const progress = i / (nodeCount - 1);
    const x = startX + Math.cos(angle) * length * progress;
    const y = startY + Math.sin(angle) * length * progress;
    
    nodes.push({
      id: `branch-node-${index}-${i}`,
      x: Math.max(0, Math.min(containerWidth, x)),
      y: Math.max(0, Math.min(containerHeight, y)),
      isActive: false,
      intensity: 0,
      pulsePhase: Math.random() * Math.PI * 2,
      connectionStrength: 0.5 + Math.random() * 0.3
    });
  }

  return {
    id: `branch-path-${index}`,
    nodes,
    direction: 'diagonal',
    speed: 1.2 + Math.random() * 0.8,
    color,
    width: isMobile ? 2 : 3,
    activeSegmentIndex: 0,
    segmentLength: isMobile ? 6 : 8,
    pathType: 'branch',
    layer: (index % 2) + 1,
    opacity: 0.6 + Math.random() * 0.3,
    glowIntensity: 0.4 + Math.random() * 0.3
  };
};

export const getDefaultColors = (): string[] => [
  'rgba(255, 50, 50, 0.9)',
  'rgba(255, 100, 100, 0.8)',
  'rgba(220, 30, 30, 0.7)',
  'rgba(187, 0, 0, 0.8)',
  'rgba(255, 80, 80, 0.6)',
  'rgba(200, 20, 20, 0.75)'
];
