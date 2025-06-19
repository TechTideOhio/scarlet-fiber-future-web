
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

  // Initialize paths when canvas is ready
  useEffect(() => {
    if (canvasReady && pathGeneratorRef.current) {
      const generatedPaths = pathGeneratorRef.current.generateEnhancedPaths(pathCount);
      console.log('Generated paths:', generatedPaths.length);
      setPaths(generatedPaths);
    }
  }, [canvasReady, pathCount]);

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

          renderEnhancedPaths(ctx, updatedPaths, isMobile);
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
  }, [isVisible, heroGlowIntensity, canvasReady, renderError, isMobile, setRenderError]);

  return { paths };
};
