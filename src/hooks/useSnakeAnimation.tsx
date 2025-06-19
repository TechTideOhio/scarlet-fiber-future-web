
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
  const frameCountRef = useRef(0);

  // Initialize paths when canvas is ready
  useEffect(() => {
    if (canvasReady && pathGeneratorRef.current && pathCount > 0) {
      console.log('Initializing paths for pathCount:', pathCount);
      
      try {
        const generatedPaths = pathGeneratorRef.current.generateEnhancedPaths(pathCount);
        
        if (generatedPaths.length === 0) {
          console.error('No paths generated!');
          setRenderError('Failed to generate animation paths');
          return;
        }
        
        console.log('Generated paths successfully:', {
          count: generatedPaths.length,
          firstPathNodes: generatedPaths[0]?.nodes?.length,
          firstPathActiveIndex: generatedPaths[0]?.activeSegmentIndex
        });
        
        setPaths(generatedPaths);
        setAnimationStarted(false);
        frameCountRef.current = 0;
        setRenderError(null);
        
      } catch (error) {
        console.error('Path generation error:', error);
        setRenderError(error instanceof Error ? error.message : 'Path generation failed');
      }
    }
  }, [canvasReady, pathCount, pathGeneratorRef]);

  // CRITICAL FIX: Enhanced animation loop with proper error handling
  useEffect(() => {
    if (!isVisible || !canvasReady || renderError || paths.length === 0) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = undefined;
      }
      return;
    }

    console.log('Starting animation loop with paths:', paths.length);

    const animate = (currentTime: number) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      
      if (!canvas || !ctx || !pathGeneratorRef.current) {
        console.warn('Animation frame skipped - missing dependencies');
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      try {
        // CRITICAL FIX: Proper timing calculation
        const deltaTime = lastTimeRef.current === 0 ? 16 : Math.min(currentTime - lastTimeRef.current, 50);
        lastTimeRef.current = currentTime;
        frameCountRef.current++;

        // Get canvas display dimensions for clearing
        const rect = canvas.getBoundingClientRect();
        
        // CRITICAL FIX: Clear using display dimensions, not canvas buffer dimensions
        ctx.clearRect(0, 0, rect.width, rect.height);
        
        // Add very subtle background to prevent pure black
        ctx.fillStyle = 'rgba(5, 5, 10, 0.1)';
        ctx.fillRect(0, 0, rect.width, rect.height);

        // Update and render paths
        setPaths(currentPaths => {
          if (currentPaths.length === 0) return currentPaths;
          
          const updatedPaths = currentPaths.map(path => 
            pathGeneratorRef.current!.updateEnhancedPath(path, deltaTime, heroGlowIntensity)
          );

          // Debug logging for first few frames
          if (!animationStarted && frameCountRef.current <= 5) {
            const firstPath = updatedPaths[0];
            const activeNodes = firstPath?.nodes?.filter(n => n.isActive && n.intensity > 0) || [];
            console.log(`Frame ${frameCountRef.current} - First path state:`, {
              activeSegmentIndex: firstPath?.activeSegmentIndex,
              activeNodes: activeNodes.length,
              totalNodes: firstPath?.nodes?.length,
              deltaTime
            });
            
            if (frameCountRef.current === 5) {
              setAnimationStarted(true);
            }
          }

          // CRITICAL FIX: Enhanced rendering with error handling
          try {
            renderEnhancedPaths(ctx, updatedPaths, isMobile);
            
            // Success - clear any previous errors
            if (renderError) {
              setRenderError(null);
            }
          } catch (renderErr) {
            console.error('Render error:', renderErr);
            if (frameCountRef.current % 60 === 0) { // Log every 60 frames to avoid spam
              setRenderError(renderErr instanceof Error ? renderErr.message : 'Rendering failed');
            }
          }

          return updatedPaths;
        });

      } catch (error) {
        console.error('Animation frame error:', error);
        setRenderError(error instanceof Error ? error.message : 'Animation error');
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    // Start animation with proper initialization
    lastTimeRef.current = performance.now();
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = undefined;
      }
    };
  }, [isVisible, heroGlowIntensity, canvasReady, renderError, isMobile, setRenderError, paths.length]);

  return { paths };
};
