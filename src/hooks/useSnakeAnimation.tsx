
import { useEffect, useRef, useState } from 'react';
import { EnhancedSnakePath, EnhancedSnakeGenerator } from '../components/fiber/EnhancedSnakeGenerator';
import { renderEnhancedPaths } from '../utils/snakeRenderer';

interface UseSnakeAnimationProps {
  isVisible: boolean;
  canvasReady: boolean;
  renderError: string | null;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  pathGeneratorRef: React.RefObject<EnhancedSnakeGenerator>;
  pathCount: number;
  heroGlowIntensity: number;
  isMobile: boolean;
  setRenderError: (error: string | null) => void;
}

export const useSnakeAnimation = ({
  isVisible,
  canvasReady,
  renderError,
  canvasRef,
  pathGeneratorRef,
  pathCount,
  heroGlowIntensity,
  isMobile,
  setRenderError
}: UseSnakeAnimationProps) => {
  const animationRef = useRef<number>();
  const [paths, setPaths] = useState<EnhancedSnakePath[]>([]);
  const lastTimeRef = useRef<number>(0);
  const [animationStarted, setAnimationStarted] = useState(false);

  // Initialize paths when canvas is ready
  useEffect(() => {
    if (canvasReady && pathGeneratorRef.current) {
      console.log('Generating paths for pathCount:', pathCount);
      const generatedPaths = pathGeneratorRef.current.generateEnhancedPaths(pathCount);
      
      // Fix: Start with activeSegmentIndex at 0 for proper sequential activation
      const initializedPaths = generatedPaths.map(path => ({
        ...path,
        activeSegmentIndex: 0
      }));
      
      console.log('Generated and initialized paths:', initializedPaths.length);
      console.log('First path nodes:', initializedPaths[0]?.nodes?.length);
      setPaths(initializedPaths);
      setAnimationStarted(false);
    }
  }, [canvasReady, pathCount]);

  // Animation loop with immediate start
  useEffect(() => {
    if (!isVisible || !canvasReady || renderError || paths.length === 0) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    const animate = (currentTime: number) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      
      if (!canvas || !ctx || !pathGeneratorRef.current) {
        console.warn('Animation frame skipped - missing dependencies');
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      try {
        const deltaTime = currentTime - lastTimeRef.current;
        lastTimeRef.current = currentTime;

        // Get canvas dimensions for clearing
        const rect = canvas.getBoundingClientRect();
        
        // Fix: Clear canvas using proper dimensions
        ctx.clearRect(0, 0, rect.width, rect.height);
        
        // Add subtle background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.02)';
        ctx.fillRect(0, 0, rect.width, rect.height);

        // Update and render paths
        setPaths(currentPaths => {
          const updatedPaths = currentPaths.map(path => 
            pathGeneratorRef.current!.updateEnhancedPath(path, deltaTime, heroGlowIntensity)
          );

          // Debug: Log first path state
          if (!animationStarted && updatedPaths.length > 0) {
            console.log('Animation starting - first path state:', {
              activeSegmentIndex: updatedPaths[0].activeSegmentIndex,
              activeNodes: updatedPaths[0].nodes.filter(n => n.isActive).length,
              totalNodes: updatedPaths[0].nodes.length
            });
            setAnimationStarted(true);
          }

          // Render with error handling
          try {
            renderEnhancedPaths(ctx, updatedPaths, isMobile);
            
            // Debug: Log rendering attempt
            if (deltaTime > 0) {
              console.log('Rendered paths:', updatedPaths.length, 'at time:', currentTime);
            }
          } catch (renderErr) {
            console.error('Render error:', renderErr);
          }

          return updatedPaths;
        });

      } catch (error) {
        console.error('Animation frame error:', error);
        setRenderError(error instanceof Error ? error.message : 'Animation error');
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    console.log('Starting animation loop with paths:', paths.length);
    lastTimeRef.current = performance.now();
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isVisible, heroGlowIntensity, canvasReady, renderError, isMobile, setRenderError, paths.length]);

  return { paths };
};
