
import React, { useEffect, useRef, useState } from 'react';
import { EnhancedSnakeGenerator, EnhancedSnakePath } from './EnhancedSnakeGenerator';

interface EnhancedSnakeRendererProps {
  isVisible: boolean;
  pathCount: number;
  isMobile: boolean;
  enableInteractive: boolean;
  heroGlowIntensity?: number;
  mousePosition?: { x: number; y: number };
}

const EnhancedSnakeRenderer: React.FC<EnhancedSnakeRendererProps> = ({
  isVisible,
  pathCount,
  isMobile,
  enableInteractive,
  heroGlowIntensity = 0,
  mousePosition = { x: 0, y: 0 }
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const pathGeneratorRef = useRef<EnhancedSnakeGenerator>();
  const [paths, setPaths] = useState<EnhancedSnakePath[]>([]);
  const lastTimeRef = useRef<number>(0);
  const backgroundRef = useRef<HTMLCanvasElement>(null);

  // Initialize canvas and paths
  useEffect(() => {
    const canvas = canvasRef.current;
    const backgroundCanvas = backgroundRef.current;
    if (!canvas || !backgroundCanvas) return;

    const updateCanvasSize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2); // Limit DPR for performance
      
      // Main canvas
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      
      // Background canvas
      backgroundCanvas.width = rect.width * dpr;
      backgroundCanvas.height = rect.height * dpr;
      backgroundCanvas.style.width = rect.width + 'px';
      backgroundCanvas.style.height = rect.height + 'px';
      
      const ctx = canvas.getContext('2d');
      const bgCtx = backgroundCanvas.getContext('2d');
      
      if (ctx) ctx.scale(dpr, dpr);
      if (bgCtx) bgCtx.scale(dpr, dpr);
      
      // Initialize generator
      pathGeneratorRef.current = new EnhancedSnakeGenerator(rect.width, rect.height, isMobile);
      setPaths(pathGeneratorRef.current.generateEnhancedPaths(pathCount));
      
      // Draw static background
      if (bgCtx) {
        drawStaticBackground(bgCtx, rect.width, rect.height);
      }
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, [pathCount, isMobile]);

  // Animation loop
  useEffect(() => {
    if (!isVisible) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    const animate = (currentTime: number) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx || !pathGeneratorRef.current) return;

      const deltaTime = currentTime - lastTimeRef.current;
      lastTimeRef.current = currentTime;

      // Clear with slight trail effect for motion blur
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and render paths
      setPaths(currentPaths => {
        const updatedPaths = currentPaths.map(path => 
          pathGeneratorRef.current!.updateEnhancedPath(path, deltaTime, heroGlowIntensity)
        );

        renderEnhancedPaths(ctx, updatedPaths);
        return updatedPaths;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isVisible, heroGlowIntensity]);

  const drawStaticBackground = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Subtle grid pattern
    ctx.strokeStyle = 'rgba(255, 50, 50, 0.03)';
    ctx.lineWidth = 1;
    
    const gridSize = isMobile ? 40 : 60;
    
    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    
    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  };

  const renderEnhancedPaths = (ctx: CanvasRenderingContext2D, pathsToRender: EnhancedSnakePath[]) => {
    // Sort paths by layer for proper depth
    const sortedPaths = [...pathsToRender].sort((a, b) => a.layer - b.layer);
    
    sortedPaths.forEach(path => {
      renderEnhancedPath(ctx, path);
    });
  };

  const renderEnhancedPath = (ctx: CanvasRenderingContext2D, path: EnhancedSnakePath) => {
    const activeNodes = path.nodes.filter(node => node.isActive && node.intensity > 0);
    
    if (activeNodes.length < 2) return;

    ctx.save();
    ctx.globalAlpha = path.opacity;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // Multi-layer glow effect
    const glowLayers = path.pathType === 'main' ? 4 : 3;
    
    for (let layer = 0; layer < glowLayers; layer++) {
      ctx.beginPath();
      
      // Create smooth curve through nodes
      if (activeNodes.length >= 2) {
        ctx.moveTo(activeNodes[0].x, activeNodes[0].y);
        
        for (let i = 1; i < activeNodes.length - 1; i++) {
          const current = activeNodes[i];
          const next = activeNodes[i + 1];
          const cpX = (current.x + next.x) / 2;
          const cpY = (current.y + next.y) / 2;
          ctx.quadraticCurveTo(current.x, current.y, cpX, cpY);
        }
        
        if (activeNodes.length > 1) {
          const lastNode = activeNodes[activeNodes.length - 1];
          ctx.lineTo(lastNode.x, lastNode.y);
        }
      }

      // Layer-specific styling
      if (layer === 0) {
        // Outer glow
        ctx.strokeStyle = `rgba(255, 50, 50, ${0.08 * path.glowIntensity})`;
        ctx.lineWidth = path.width * 6;
        ctx.shadowBlur = isMobile ? 25 : 40;
        ctx.shadowColor = 'rgba(255, 50, 50, 0.6)';
      } else if (layer === 1) {
        // Middle glow
        ctx.strokeStyle = `rgba(255, 100, 100, ${0.15 * path.glowIntensity})`;
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
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.8 * path.glowIntensity})`;
        ctx.lineWidth = path.width * 0.5;
        ctx.shadowBlur = isMobile ? 4 : 6;
        ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
      }
      
      ctx.stroke();
    }

    // Enhanced node rendering
    activeNodes.forEach(node => {
      if (node.intensity > 0.2) {
        renderEnhancedNode(ctx, node, path);
      }
    });

    ctx.restore();
  };

  const renderEnhancedNode = (ctx: CanvasRenderingContext2D, node: any, path: EnhancedSnakePath) => {
    const nodeRadius = (path.width * 0.8) * node.intensity;
    const pulseRadius = nodeRadius * (1 + Math.sin(Date.now() * 0.005 + node.pulsePhase) * 0.3);
    
    // Outer pulse
    ctx.beginPath();
    ctx.arc(node.x, node.y, pulseRadius * 2, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 50, 50, ${node.intensity * 0.05})`;
    ctx.shadowBlur = isMobile ? 30 : 50;
    ctx.shadowColor = 'rgba(255, 50, 50, 0.4)';
    ctx.fill();
    
    // Core node with connection strength indicator
    ctx.beginPath();
    ctx.arc(node.x, node.y, nodeRadius, 0, Math.PI * 2);
    const coreOpacity = node.intensity * node.connectionStrength;
    ctx.fillStyle = `rgba(255, 255, 255, ${coreOpacity})`;
    ctx.shadowBlur = isMobile ? 15 : 20;
    ctx.shadowColor = path.color;
    ctx.fill();
  };

  return (
    <div className="absolute inset-0 w-full h-full">
      <canvas
        ref={backgroundRef}
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 1 }}
      />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{
          pointerEvents: enableInteractive ? 'auto' : 'none',
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 1s ease-in-out',
          zIndex: 2,
          mixBlendMode: 'screen'
        }}
      />
    </div>
  );
};

export default EnhancedSnakeRenderer;
