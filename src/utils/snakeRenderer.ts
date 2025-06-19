import { EnhancedSnakePath } from '../components/fiber/types/snakeTypes';

export const renderEnhancedPaths = (
  ctx: CanvasRenderingContext2D, 
  pathsToRender: EnhancedSnakePath[],
  isMobile: boolean
) => {
  if (!pathsToRender.length) {
    console.warn('No paths to render');
    return;
  }

  // Sort paths by layer for proper depth
  const sortedPaths = [...pathsToRender].sort((a, b) => a.layer - b.layer);
  
  sortedPaths.forEach(path => {
    try {
      renderEnhancedPath(ctx, path, isMobile);
    } catch (error) {
      console.error('Path rendering error:', error);
    }
  });
};

export const renderEnhancedPath = (
  ctx: CanvasRenderingContext2D, 
  path: EnhancedSnakePath,
  isMobile: boolean
) => {
  const activeNodes = path.nodes.filter(node => node.isActive && node.intensity > 0);
  
  if (activeNodes.length < 2) return;

  ctx.save();
  ctx.globalAlpha = Math.min(path.opacity, 1);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  
  // Multi-layer glow effect
  const glowLayers = path.pathType === 'main' ? 4 : 3;
  
  for (let layer = 0; layer < glowLayers; layer++) {
    ctx.beginPath();
    
    // Create smooth path through nodes
    if (activeNodes.length >= 2) {
      ctx.moveTo(activeNodes[0].x, activeNodes[0].y);
      
      for (let i = 1; i < activeNodes.length; i++) {
        ctx.lineTo(activeNodes[i].x, activeNodes[i].y);
      }
    }

    // Layer-specific styling
    if (layer === 0) {
      // Outer glow
      ctx.strokeStyle = `rgba(255, 50, 50, ${Math.min(0.08 * path.glowIntensity, 0.3)})`;
      ctx.lineWidth = path.width * 6;
      ctx.shadowBlur = isMobile ? 25 : 40;
      ctx.shadowColor = 'rgba(255, 50, 50, 0.6)';
    } else if (layer === 1) {
      // Middle glow
      ctx.strokeStyle = `rgba(255, 100, 100, ${Math.min(0.15 * path.glowIntensity, 0.4)})`;
      ctx.lineWidth = path.width * 3;
      ctx.shadowBlur = isMobile ? 15 : 25;
      ctx.shadowColor = 'rgba(255, 100, 100, 0.4)';
    } else if (layer === 2) {
      // Inner glow
      ctx.strokeStyle = path.color;
      ctx.lineWidth = path.width * 1.5;
      ctx.shadowBlur = isMobile ? 8 : 12;
      ctx.shadowColor = path.color;
    } else {
      // Core line
      ctx.strokeStyle = `rgba(255, 255, 255, ${Math.min(0.8 * path.glowIntensity, 0.9)})`;
      ctx.lineWidth = path.width * 0.5;
      ctx.shadowBlur = isMobile ? 4 : 6;
      ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
    }
    
    ctx.stroke();
  }

  // Enhanced node rendering
  activeNodes.forEach(node => {
    if (node.intensity > 0.2) {
      renderEnhancedNode(ctx, node, path, isMobile);
    }
  });

  ctx.restore();
};

export const renderEnhancedNode = (
  ctx: CanvasRenderingContext2D, 
  node: any, 
  path: EnhancedSnakePath,
  isMobile: boolean
) => {
  const nodeRadius = (path.width * 0.8) * node.intensity;
  const pulseRadius = nodeRadius * (1 + Math.sin(Date.now() * 0.005 + node.pulsePhase) * 0.3);
  
  // Outer pulse
  ctx.beginPath();
  ctx.arc(node.x, node.y, pulseRadius * 2, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(255, 50, 50, ${Math.min(node.intensity * 0.05, 0.2)})`;
  ctx.shadowBlur = isMobile ? 30 : 50;
  ctx.shadowColor = 'rgba(255, 50, 50, 0.4)';
  ctx.fill();
  
  // Core node
  ctx.beginPath();
  ctx.arc(node.x, node.y, nodeRadius, 0, Math.PI * 2);
  const coreOpacity = Math.min(node.intensity * node.connectionStrength, 1);
  ctx.fillStyle = `rgba(255, 255, 255, ${coreOpacity})`;
  ctx.shadowBlur = isMobile ? 15 : 20;
  ctx.shadowColor = path.color;
  ctx.fill();
};
