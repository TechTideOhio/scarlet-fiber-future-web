
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

  console.log(`Rendering ${pathsToRender.length} paths`);

  // Sort paths by layer for proper depth
  const sortedPaths = [...pathsToRender].sort((a, b) => a.layer - b.layer);
  
  let renderedCount = 0;
  sortedPaths.forEach((path, index) => {
    try {
      const rendered = renderEnhancedPath(ctx, path, isMobile);
      if (rendered) renderedCount++;
    } catch (error) {
      console.error(`Path ${index} rendering error:`, error);
    }
  });
  
  console.log(`Successfully rendered ${renderedCount}/${sortedPaths.length} paths`);
};

export const renderEnhancedPath = (
  ctx: CanvasRenderingContext2D, 
  path: EnhancedSnakePath,
  isMobile: boolean
): boolean => {
  const activeNodes = path.nodes.filter(node => node.isActive && node.intensity > 0);
  
  if (activeNodes.length < 2) {
    // Debug: Log why path wasn't rendered
    console.log(`Path ${path.id} not rendered: activeNodes=${activeNodes.length}, totalNodes=${path.nodes.length}`);
    return false;
  }

  console.log(`Rendering path ${path.id}: ${activeNodes.length} active nodes`);

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

    // Layer-specific styling with enhanced visibility
    if (layer === 0) {
      // Outer glow - more visible
      ctx.strokeStyle = `rgba(255, 50, 50, ${Math.min(0.15 * path.glowIntensity, 0.4)})`;
      ctx.lineWidth = path.width * 6;
      ctx.shadowBlur = isMobile ? 30 : 45;
      ctx.shadowColor = 'rgba(255, 50, 50, 0.8)';
    } else if (layer === 1) {
      // Middle glow - enhanced
      ctx.strokeStyle = `rgba(255, 100, 100, ${Math.min(0.25 * path.glowIntensity, 0.6)})`;
      ctx.lineWidth = path.width * 4;
      ctx.shadowBlur = isMobile ? 20 : 30;
      ctx.shadowColor = 'rgba(255, 100, 100, 0.6)';
    } else if (layer === 2) {
      // Inner glow - brighter
      ctx.strokeStyle = path.color;
      ctx.lineWidth = path.width * 2;
      ctx.shadowBlur = isMobile ? 12 : 18;
      ctx.shadowColor = path.color;
    } else {
      // Core line - always visible
      ctx.strokeStyle = `rgba(255, 255, 255, ${Math.min(0.9 * path.glowIntensity, 1)})`;
      ctx.lineWidth = Math.max(path.width * 0.8, 2);
      ctx.shadowBlur = isMobile ? 6 : 10;
      ctx.shadowColor = 'rgba(255, 255, 255, 0.9)';
    }
    
    ctx.stroke();
  }

  // Enhanced node rendering
  let renderedNodes = 0;
  activeNodes.forEach(node => {
    if (node.intensity > 0.1) {
      renderEnhancedNode(ctx, node, path, isMobile);
      renderedNodes++;
    }
  });

  console.log(`Path ${path.id} rendered with ${renderedNodes} nodes`);

  ctx.restore();
  return true;
};

export const renderEnhancedNode = (
  ctx: CanvasRenderingContext2D, 
  node: any, 
  path: EnhancedSnakePath,
  isMobile: boolean
) => {
  const baseRadius = Math.max(path.width * 0.8, 3);
  const nodeRadius = baseRadius * Math.max(node.intensity, 0.3);
  const pulseRadius = nodeRadius * (1 + Math.sin(Date.now() * 0.005 + node.pulsePhase) * 0.4);
  
  // Outer pulse - more visible
  ctx.beginPath();
  ctx.arc(node.x, node.y, pulseRadius * 2.5, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(255, 50, 50, ${Math.min(node.intensity * 0.1, 0.3)})`;
  ctx.shadowBlur = isMobile ? 35 : 60;
  ctx.shadowColor = 'rgba(255, 50, 50, 0.6)';
  ctx.fill();
  
  // Core node - always visible
  ctx.beginPath();
  ctx.arc(node.x, node.y, Math.max(nodeRadius, 2), 0, Math.PI * 2);
  const coreOpacity = Math.min(Math.max(node.intensity * node.connectionStrength, 0.4), 1);
  ctx.fillStyle = `rgba(255, 255, 255, ${coreOpacity})`;
  ctx.shadowBlur = isMobile ? 20 : 25;
  ctx.shadowColor = path.color;
  ctx.fill();
};
