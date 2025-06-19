
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
  const [canvasReady, setCanvasReady] = useState(false);
  const [renderError, setRenderError] = useState<string | null>(null);

  console.log('EnhancedSnakeRenderer render:', { 
    isVisible, 
    pathCount, 
    isMobile, 
    heroGlowIntensity,
    canvasReady,
    renderError 
  });

  // Initialize canvas and paths
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.error('Canvas ref not available');
      return;
    }

    const updateCanvasSize = () => {
      try {
        const rect = canvas.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        
        console.log('Setting up canvas:', { 
          width: rect.width, 
          height: rect.height, 
          dpr 
        });
        
        // Set canvas size
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        canvas.style.width = rect.width + 'px';
        canvas.style.height = rect.height + 'px';
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          throw new Error('Failed to get 2D context');
        }
        
        ctx.scale(dpr, dpr);
        
        // Clear canvas to black
        ctx.fillStyle = 'rgba(0, 0, 0, 1)';
        ctx.fillRect(0, 0, rect.width, rect.height);
        
        // Initialize generator
        pathGeneratorRef.current = new EnhancedSnakeGenerator(rect.width, rect.height, isMobile);
        const generatedPaths = pathGeneratorRef.current.generateEnhancedPaths(pathCount);
        
        console.log('Generated paths:', generatedPaths.length);
        setPaths(generatedPaths);
        setCanvasReady(true);
        setRenderError(null);
        
      } catch (error) {
        console.error('Canvas setup error:', error);
        setRenderError(error instanceof Error ? error.message : 'Canvas setup failed');
        setCanvasReady(false);
      }
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, [pathCount, isMobile]);

  // Animation loop
  useEffect(() => {
    if (!isVisible || !canvasReady || renderError) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    const animate = (currentTime: number) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      
      if (!canvas || !ctx || !pathGeneratorRef.current) {
        console.warn('Animation frame skipped - missing canvas or context');
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      try {
        const deltaTime = currentTime - lastTimeRef.current;
        lastTimeRef.current = currentTime;

        // Get canvas dimensions
        const rect = canvas.getBoundingClientRect();
        
        // Clear canvas properly
        ctx.clearRect(0, 0, rect.width, rect.height);
        
        // Add subtle background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.02)';
        ctx.fillRect(0, 0, rect.width, rect.height);

        // Update and render paths
        setPaths(currentPaths => {
          const updatedPaths = currentPaths.map(path => 
            pathGeneratorRef.current!.updateEnhancedPath(path, deltaTime, heroGlowIntensity)
          );

          renderEnhancedPaths(ctx, updatedPaths);
          return updatedPaths;
        });

      } catch (error) {
        console.error('Animation frame error:', error);
        setRenderError(error instanceof Error ? error.message : 'Animation error');
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    console.log('Starting animation loop');
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isVisible, heroGlowIntensity, canvasReady, renderError]);

  const renderEnhancedPaths = (ctx: CanvasRenderingContext2D, pathsToRender: EnhancedSnakePath[]) => {
    if (!pathsToRender.length) {
      console.warn('No paths to render');
      return;
    }

    // Sort paths by layer for proper depth
    const sortedPaths = [...pathsToRender].sort((a, b) => a.layer - b.layer);
    
    sortedPaths.forEach(path => {
      try {
        renderEnhancedPath(ctx, path);
      } catch (error) {
        console.error('Path rendering error:', error);
      }
    });
  };

  const renderEnhancedPath = (ctx: CanvasRenderingContext2D, path: EnhancedSnakePath) => {
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

  // Debug info
  useEffect(() => {
    if (renderError) {
      console.error('Render error:', renderError);
    }
  }, [renderError]);

  return (
    <div className="absolute inset-0 w-full h-full">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{
          pointerEvents: enableInteractive ? 'auto' : 'none',
          opacity: isVisible && canvasReady ? 1 : 0,
          transition: 'opacity 1s ease-in-out',
          zIndex: 2,
          mixBlendMode: 'screen'
        }}
      />
      
      {/* Debug overlay */}
      {renderError && (
        <div className="absolute top-4 left-4 bg-red-900 text-white p-2 rounded text-xs z-10">
          Render Error: {renderError}
        </div>
      )}
      
      {!canvasReady && !renderError && (
        <div className="absolute inset-0 flex items-center justify-center text-white text-sm opacity-50">
          Initializing canvas...
        </div>
      )}
    </div>
  );
};

export default EnhancedSnakeRenderer;
