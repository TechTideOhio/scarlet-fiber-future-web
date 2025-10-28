
import { EnhancedSnakePath } from '../components/fiber/types/snakeTypes';
import { ANIMATION_TOKENS, FIBER_ANIMATION_TOKENS, COLOR_TOKENS, PERFORMANCE_TOKENS, logFiberToken } from '../constants';

export const renderEnhancedPaths = (
  ctx: CanvasRenderingContext2D, 
  pathsToRender: EnhancedSnakePath[],
  isMobile: boolean
) => {
  if (!pathsToRender.length) {
    console.warn('No paths to render');
    return;
  }

  // Get display dimensions from canvas dataset
  const canvas = ctx.canvas;
  const displayWidth = parseInt(canvas.dataset.displayWidth || '0') || canvas.width;
  const displayHeight = parseInt(canvas.dataset.displayHeight || '0') || canvas.height;
  
  // CRITICAL FIX: Clear canvas using display dimensions
  ctx.clearRect(0, 0, displayWidth, displayHeight);
  
  // Add subtle background to prevent pure black
  ctx.fillStyle = COLOR_TOKENS.background.subtle;
  ctx.fillRect(0, 0, displayWidth, displayHeight);

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
  
  // Enhanced logging for debugging
  if (renderedCount === 0) {
    console.warn(`CRITICAL: No paths rendered! Total paths: ${sortedPaths.length}`);
    sortedPaths.forEach((path, i) => {
      const activeNodes = path.nodes.filter(n => n.isActive && n.intensity > 0);
      console.warn(`Path ${i} debug:`, {
        activeNodes: activeNodes.length,
        totalNodes: path.nodes.length,
        activeSegmentIndex: path.activeSegmentIndex,
        segmentLength: path.segmentLength
      });
    });
  } else if (Math.random() < PERFORMANCE_TOKENS.logging.successRate) {
    logFiberToken('render-success', `${renderedCount}/${sortedPaths.length} paths, ${totalActiveNodes} nodes`);
  }
};

export const renderEnhancedPath = (
  ctx: CanvasRenderingContext2D, 
  path: EnhancedSnakePath,
  isMobile: boolean
): { rendered: boolean; activeNodes: number } => {
  const activeNodes = path.nodes.filter(
    node => node.isActive && node.intensity > FIBER_ANIMATION_TOKENS.node.visibilityThreshold
  );
  
  if (activeNodes.length < 2) {
    return { rendered: false, activeNodes: 0 };
  }

  ctx.save();
  
  // CRITICAL FIX: Enhanced visibility settings with guaranteed opacity
  const pathOpacity = Math.max(
    path.opacity * ANIMATION_TOKENS.opacity.nearFull, 
    FIBER_ANIMATION_TOKENS.opacity.path.min
  );
  ctx.globalAlpha = pathOpacity;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  
  // CRITICAL FIX: Enhanced multi-layer glow with better visibility
  const glowLayers = path.pathType === 'main' ? 5 : 4;
  
  for (let layer = 0; layer < glowLayers; layer++) {
    ctx.beginPath();
    
    // Create smooth path through active nodes
    if (activeNodes.length >= 2) {
      ctx.moveTo(activeNodes[0].x, activeNodes[0].y);
      
      // Use smooth curves for better visual appeal
      for (let i = 1; i < activeNodes.length; i++) {
        const current = activeNodes[i];
        
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
    const glowMultiplier = Math.max(path.glowIntensity, FIBER_ANIMATION_TOKENS.glow.min);
    
    if (layer === 0) {
      // Outer glow - most prominent
      ctx.strokeStyle = COLOR_TOKENS.glow.outer(Math.min(0.4 * glowMultiplier, 0.8));
      ctx.lineWidth = path.width * 12;
      ctx.shadowBlur = isMobile ? 50 : 80;
      ctx.shadowColor = COLOR_TOKENS.buckeye.scarletRgba(1);
    } else if (layer === 1) {
      // Middle glow - enhanced brightness
      ctx.strokeStyle = COLOR_TOKENS.glow.middle(Math.min(0.6 * glowMultiplier, 1));
      ctx.lineWidth = path.width * 8;
      ctx.shadowBlur = isMobile ? 35 : 60;
      ctx.shadowColor = COLOR_TOKENS.glow.middle(0.9);
    } else if (layer === 2) {
      // Inner glow - bright and visible
      ctx.strokeStyle = path.color;
      ctx.lineWidth = path.width * 5;
      ctx.shadowBlur = isMobile ? 20 : 40;
      ctx.shadowColor = path.color;
    } else if (layer === 3) {
      // Core line - always visible white core
      ctx.strokeStyle = COLOR_TOKENS.glow.core(Math.min(glowMultiplier, 1));
      ctx.lineWidth = Math.max(path.width * 2.5, 4);
      ctx.shadowBlur = isMobile ? 12 : 20;
      ctx.shadowColor = COLOR_TOKENS.glow.core(1);
    } else {
      // Ultra bright center for main paths
      ctx.strokeStyle = COLOR_TOKENS.glow.core(1);
      ctx.lineWidth = Math.max(path.width * 1.5, 3);
      ctx.shadowBlur = isMobile ? 8 : 15;
      ctx.shadowColor = COLOR_TOKENS.glow.core(1);
    }
    
    ctx.stroke();
  }

  // Enhanced node rendering with guaranteed visibility
  let renderedNodeCount = 0;
  activeNodes.forEach(node => {
    if (node.intensity > FIBER_ANIMATION_TOKENS.node.visibilityThreshold) {
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
  const baseRadius = Math.max(
    path.width * FIBER_ANIMATION_TOKENS.node.radiusMultiplier, 
    FIBER_ANIMATION_TOKENS.node.minRadius
  );
  const nodeRadius = baseRadius * Math.max(node.intensity, ANIMATION_TOKENS.opacity.medium);
  const pulseRadius = nodeRadius * (1 + Math.sin(Date.now() * 0.01 + node.pulsePhase) * 0.4);
  
  // CRITICAL FIX: Enhanced node visibility with multiple layers
  ctx.save();
  
  // Outer pulse - very prominent
  ctx.beginPath();
  ctx.arc(node.x, node.y, pulseRadius * 4, 0, Math.PI * 2);
  ctx.fillStyle = COLOR_TOKENS.glow.outer(Math.min(node.intensity * ANIMATION_TOKENS.opacity.dim, ANIMATION_TOKENS.opacity.visible));
  ctx.shadowBlur = isMobile ? 60 : 100;
  ctx.shadowColor = COLOR_TOKENS.buckeye.scarletRgba(1);
  ctx.fill();
  
  // Middle glow
  ctx.beginPath();
  ctx.arc(node.x, node.y, pulseRadius * 2, 0, Math.PI * 2);
  ctx.fillStyle = COLOR_TOKENS.glow.middle(Math.min(node.intensity * ANIMATION_TOKENS.opacity.medium, ANIMATION_TOKENS.opacity.veryBright));
  ctx.shadowBlur = isMobile ? 40 : 60;
  ctx.shadowColor = COLOR_TOKENS.glow.middle(ANIMATION_TOKENS.opacity.nearFull);
  ctx.fill();
  
  // Core node - always bright and visible
  ctx.beginPath();
  ctx.arc(node.x, node.y, Math.max(nodeRadius, 4), 0, Math.PI * 2);
  const coreOpacity = Math.min(
    Math.max(node.intensity * node.connectionStrength, ANIMATION_TOKENS.opacity.veryBright), 
    ANIMATION_TOKENS.opacity.full
  );
  ctx.fillStyle = COLOR_TOKENS.glow.core(coreOpacity);
  ctx.shadowBlur = isMobile ? 30 : 45;
  ctx.shadowColor = COLOR_TOKENS.glow.core(1);
  ctx.fill();
  
  ctx.restore();
};
