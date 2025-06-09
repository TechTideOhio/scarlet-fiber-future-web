
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
      canvas.width = rect.width;
      canvas.height = rect.height;
      
      // Reinitialize path generator with new dimensions
      pathGeneratorRef.current = new SnakePathGenerator(canvas.width, canvas.height, isMobile);
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

      // Clear canvas with fade effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

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

    // Draw path connections
    ctx.beginPath();
    ctx.moveTo(activeNodes[0].x, activeNodes[0].y);
    
    for (let i = 1; i < activeNodes.length; i++) {
      ctx.lineTo(activeNodes[i].x, activeNodes[i].y);
    }

    // Apply gradient stroke
    const gradient = ctx.createLinearGradient(
      activeNodes[0].x, activeNodes[0].y,
      activeNodes[activeNodes.length - 1].x, activeNodes[activeNodes.length - 1].y
    );
    
    gradient.addColorStop(0, 'transparent');
    gradient.addColorStop(0.3, path.color);
    gradient.addColorStop(0.7, path.color);
    gradient.addColorStop(1, 'transparent');

    ctx.strokeStyle = gradient;
    ctx.lineWidth = path.width;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.shadowColor = path.color;
    ctx.shadowBlur = isMobile ? 8 : 12;
    ctx.stroke();

    // Draw glowing nodes
    activeNodes.forEach(node => {
      if (node.intensity > 0.3) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, (path.width * 0.8) * node.intensity, 0, Math.PI * 2);
        ctx.fillStyle = path.color;
        ctx.shadowBlur = isMobile ? 15 : 20;
        ctx.fill();
      }
    });

    // Reset shadow
    ctx.shadowBlur = 0;
  };

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{
        mixBlendMode: 'screen',
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 1s ease-in-out'
      }}
    />
  );
};

export default SnakeRenderer;
