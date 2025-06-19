
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
  
  let renderedCount = 0;
  let totalActiveNodes = 0;
  
  sortedPaths.forEach((path, index) => {
    try {
      const result = renderEnhancedPath(ctx, path, isMobile);
      if (result.rendered) {
        renderedCount++;
        totalActiveNodes += result.activeNodes;
      }
    } catch (error) {
      console.error(`Path ${index} rendering error:`, error);
    }
  });
  
  // Enhanced logging every 60 frames to avoid spam
  if (renderedCount === 0) {
    console.warn(`No paths rendered! Total paths: ${sortedPaths.length}`);
  } else if (Math.random() < 0.01) { // 1% chance to log success
    console.log(`Rendered ${renderedCount}/${sortedPaths.length} paths with ${totalActiveNodes} active nodes`);
  }
};

export const renderEnhancedPath = (
  ctx: CanvasRenderingContext2D, 
  path: EnhancedSnakePath,
  isMobile: boolean
): { rendered: boolean; activeNodes: number } => {
  const activeNodes = path.nodes.filter(node => node.isActive && node.intensity > 0.05); // Lower threshold
  
  if (activeNodes.length < 2) {
    return { rendered: false, activeNodes: 0 };
  }

  ctx.save();
  
  // CRITICAL FIX: Enhanced visibility settings
  const pathOpacity = Math.max(path.opacity * 0.8, 0.4); // Ensure minimum visibility
  ctx.globalAlpha = pathOpacity;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  
  // CRITICAL FIX: Enhanced multi-layer glow with better visibility
  const glowLayers = path.pathType === 'main' ? 4 : 3;
  
  for (let layer = 0; layer < glowLayers; layer++) {
    ctx.beginPath();
    
    // Create smooth path through active nodes
    if (activeNodes.length >= 2) {
      ctx.moveTo(activeNodes[0].x, activeNodes[0].y);
      
      // Use quadratic curves for smoother paths
      for (let i = 1; i < activeNodes.length; i++) {
        const current = activeNodes[i];
        const previous = activeNodes[i - 1];
        
        if (i === activeNodes.length - 1) {
          ctx.lineTo(current.x, current.y);
        } else {
          const next = activeNodes[i + 1];
          const cpx = current.x;
          const cpy = current.y;
          const x = (current.x + next.x) / 2;
          const y = (current.y + next.y) / 2;
          ctx.quadraticCurveTo(cpx, cpy, x, y);
        }
      }
    }

    // CRITICAL FIX: Enhanced layer styling with guaranteed visibility
    const glowMultiplier = Math.max(path.glowIntensity, 0.5);
    
    if (layer === 0) {
      // Outer glow - more prominent
      ctx.strokeStyle = `rgba(255, 50, 50, ${Math.min(0.3 * glowMultiplier, 0.6)})`;
      ctx.lineWidth = path.width * 8;
      ctx.shadowBlur = isMobile ? 40 : 60;
      ctx.shadowColor = 'rgba(255, 50, 50, 0.9)';
    } else if (layer === 1) {
      // Middle glow - enhanced brightness
      ctx.strokeStyle = `rgba(255, 100, 100, ${Math.min(0.5 * glowMultiplier, 0.8)})`;
      ctx.lineWidth = path.width * 5;
      ctx.shadowBlur = isMobile ? 25 : 40;
      ctx.shadowColor = 'rgba(255, 100, 100, 0.7)';
    } else if (layer === 2) {
      // Inner glow - bright and visible
      ctx.strokeStyle = path.color;
      ctx.lineWidth = path.width * 3;
      ctx.shadowBlur = isMobile ? 15 : 25;
      ctx.shadowColor = path.color;
    } else {
      // Core line - always visible white core
      ctx.strokeStyle = `rgba(255, 255, 255, ${Math.min(glowMultiplier, 1)})`;
      ctx.lineWidth = Math.max(path.width * 1.5, 3); // Thicker core
      ctx.shadowBlur = isMobile ? 8 : 15;
      ctx.shadowColor = 'rgba(255, 255, 255, 1)';
    }
    
    ctx.stroke();
  }

  // Enhanced node rendering with guaranteed visibility
  let renderedNodeCount = 0;
  activeNodes.forEach(node => {
    if (node.intensity > 0.05) { // Lower threshold
      renderEnhancedNode(ctx, node, path, isMobile);
      renderedNodeCount++;
    }
  });

  ctx.restore();
  return { rendered: true, activeNodes: renderedNodeCount };
};

export const renderEnhancedNode = (
  ctx: CanvasRenderingContext2D, 
  node: any, 
  path: EnhancedSnakePath,
  isMobile: boolean
) => {
  const baseRadius = Math.max(path.width * 1.2, 4); // Larger base radius
  const nodeRadius = baseRadius * Math.max(node.intensity, 0.4); // Higher minimum
  const pulseRadius = nodeRadius * (1 + Math.sin(Date.now() * 0.008 + node.pulsePhase) * 0.3);
  
  // CRITICAL FIX: Enhanced node visibility
  ctx.save();
  
  // Outer pulse - more prominent
  ctx.beginPath();
  ctx.arc(node.x, node.y, pulseRadius * 3, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(255, 50, 50, ${Math.min(node.intensity * 0.2, 0.4)})`;
  ctx.shadowBlur = isMobile ? 45 : 80;
  ctx.shadowColor = 'rgba(255, 50, 50, 0.8)';
  ctx.fill();
  
  // Core node - always bright and visible
  ctx.beginPath();
  ctx.arc(node.x, node.y, Math.max(nodeRadius, 3), 0, Math.PI * 2);
  const coreOpacity = Math.min(Math.max(node.intensity * node.connectionStrength, 0.6), 1);
  ctx.fillStyle = `rgba(255, 255, 255, ${coreOpacity})`;
  ctx.shadowBlur = isMobile ? 25 : 35;
  ctx.shadowColor = 'rgba(255, 255, 255, 0.9)';
  ctx.fill();
  
  ctx.restore();
};
