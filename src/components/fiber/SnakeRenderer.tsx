
import React, { useEffect, useRef, useState } from 'react';
import { SnakePathGenerator, SnakePath } from './SnakePathGenerator';

interface SnakeRendererProps {
  isVisible: boolean;
  pathCount: number;
  isMobile: boolean;
  enableInteractive: boolean;
}

const SnakeRenderer: React.FC<SnakeRendererProps> = ({
  isVisible,
  pathCount,
  isMobile,
  enableInteractive
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const pathGeneratorRef = useRef<SnakePathGenerator>();
  const [paths, setPaths] = useState<SnakePath[]>([]);
  const lastTimeRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateCanvasSize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      
      // Set actual size in memory (scaled to account for extra pixel density)
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      
      // Set display size (css pixels)
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      
      // Scale the drawing context so everything draws at the correct size
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
      }
      
      // Reinitialize path generator with new dimensions
      pathGeneratorRef.current = new SnakePathGenerator(rect.width, rect.height, isMobile);
      setPaths(pathGeneratorRef.current.generateNetworkPaths(pathCount));
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, [pathCount, isMobile]);

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

      // Clear canvas completely
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and render paths
      setPaths(currentPaths => {
        const updatedPaths = currentPaths.map(path => 
          pathGeneratorRef.current!.updatePathAnimation(path, deltaTime)
        );

        // Render the updated paths
        renderPaths(ctx, updatedPaths);
        
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
  }, [isVisible]);

  const renderPaths = (ctx: CanvasRenderingContext2D, pathsToRender: SnakePath[]) => {
    pathsToRender.forEach(path => {
      renderSnakePath(ctx, path);
    });
  };

  const renderSnakePath = (ctx: CanvasRenderingContext2D, path: SnakePath) => {
    const activeNodes = path.nodes.filter(node => node.isActive && node.intensity > 0);
    
    if (activeNodes.length < 2) return;

    // Set up context for glowing effect
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // Draw multiple layers for glow effect
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(activeNodes[0].x, activeNodes[0].y);
      
      for (let j = 1; j < activeNodes.length; j++) {
        ctx.lineTo(activeNodes[j].x, activeNodes[j].y);
      }

      // Different layer properties for glow
      if (i === 0) {
        // Outer glow
        ctx.strokeStyle = `rgba(255, 50, 50, ${0.1})`;
        ctx.lineWidth = path.width * 4;
        ctx.shadowBlur = isMobile ? 15 : 25;
        ctx.shadowColor = 'rgba(255, 50, 50, 0.8)';
      } else if (i === 1) {
        // Middle glow
        ctx.strokeStyle = `rgba(255, 100, 100, ${0.3})`;
        ctx.lineWidth = path.width * 2;
        ctx.shadowBlur = isMobile ? 8 : 12;
        ctx.shadowColor = 'rgba(255, 100, 100, 0.6)';
      } else {
        // Core line
        ctx.strokeStyle = path.color;
        ctx.lineWidth = path.width;
        ctx.shadowBlur = isMobile ? 4 : 6;
        ctx.shadowColor = path.color;
      }
      
      ctx.stroke();
    }

    // Draw glowing nodes
    activeNodes.forEach(node => {
      if (node.intensity > 0.3) {
        const nodeRadius = (path.width * 0.8) * node.intensity;
        
        // Outer glow for node
        ctx.beginPath();
        ctx.arc(node.x, node.y, nodeRadius * 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 50, 50, ${node.intensity * 0.1})`;
        ctx.shadowBlur = isMobile ? 20 : 30;
        ctx.shadowColor = 'rgba(255, 50, 50, 0.8)';
        ctx.fill();
        
        // Core node
        ctx.beginPath();
        ctx.arc(node.x, node.y, nodeRadius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${node.intensity * 0.9})`;
        ctx.shadowBlur = isMobile ? 10 : 15;
        ctx.shadowColor = path.color;
        ctx.fill();
      }
    });

    // Reset shadow
    ctx.shadowBlur = 0;
  };

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{
        pointerEvents: enableInteractive ? 'auto' : 'none',
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 1s ease-in-out',
        zIndex: 2
      }}
    />
  );
};

export default SnakeRenderer;
