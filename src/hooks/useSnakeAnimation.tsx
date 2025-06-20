
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
  const initializationAttemptRef = useRef(0);

  // CRITICAL FIX: Enhanced path initialization with retry logic
  useEffect(() => {
    if (canvasReady && pathGeneratorRef.current && pathCount > 0) {
      initializationAttemptRef.current++;
      console.log(`Initializing paths attempt ${initializationAttemptRef.current} for pathCount:`, pathCount);
      
      try {
        const generatedPaths = pathGeneratorRef.current.generateEnhancedPaths(pathCount);
        
        if (generatedPaths.length === 0) {
          console.error('CRITICAL: No paths generated!');
          setRenderError('Failed to generate animation paths');
          return;
        }
        
        // CRITICAL FIX: Validate paths have active nodes
        let validPaths = 0;
        generatedPaths.forEach((path, i) => {
          if (path.nodes.length > 0) {
            validPaths++;
            console.log(`Path ${i} validation:`, { 
              nodeCount: path.nodes.length, 
              activeSegmentIndex: path.activeSegmentIndex,
              segmentLength: path.segmentLength,
              pathType: path.pathType
            });
          }
        });
        
        console.log(`Generated ${validPaths}/${generatedPaths.length} valid paths`);
        
        if (validPaths === 0) {
          console.error('CRITICAL: No valid paths generated!');
          setRenderError('All generated paths are invalid');
          return;
        }
        
        setPaths(generatedPaths);
        setAnimationStarted(false);
        frameCountRef.current = 0;
        setRenderError(null);
        
        console.log('Path initialization successful:', {
          totalPaths: generatedPaths.length,
          validPaths,
          canvasReady,
          pathCount
        });
        
      } catch (error) {
        console.error('Path generation error:', error);
        setRenderError(error instanceof Error ? error.message : 'Path generation failed');
      }
    }
  }, [canvasReady, pathCount, pathGeneratorRef, setRenderError]);

  // CRITICAL FIX: Enhanced animation loop with comprehensive error handling
  useEffect(() => {
    if (!isVisible || !canvasReady || renderError || paths.length === 0) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = undefined;
      }
      console.log('Animation stopped:', { isVisible, canvasReady, renderError, pathsLength: paths.length });
      return;
    }

    console.log('Starting animation loop with:', { 
      pathsLength: paths.length, 
      heroGlowIntensity,
      frameCount: frameCountRef.current 
    });

    const animate = (currentTime: number) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      
      if (!canvas || !ctx || !pathGeneratorRef.current) {
        console.warn('Animation frame skipped - missing dependencies');
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      try {
        // CRITICAL FIX: Proper timing calculation with bounds
        const deltaTime = lastTimeRef.current === 0 ? 16 : Math.min(Math.max(currentTime - lastTimeRef.current, 8), 100);
        lastTimeRef.current = currentTime;
        frameCountRef.current++;

        // Update and render paths
        setPaths(currentPaths => {
          if (currentPaths.length === 0) {
            console.warn('No paths to update in animation frame');
            return currentPaths;
          }
          
          const updatedPaths = currentPaths.map((path, index) => {
            try {
              return pathGeneratorRef.current!.updateEnhancedPath(path, deltaTime, heroGlowIntensity);
            } catch (pathError) {
              console.error(`Path ${index} update error:`, pathError);
              return path; // Return unchanged path on error
            }
          });

          // Debug logging for first few frames and periodically
          if (!animationStarted && frameCountRef.current <= 10) {
            const activePathsCount = updatedPaths.filter(path => {
              const activeNodes = path.nodes.filter(n => n.isActive && n.intensity > 0);
              return activeNodes.length > 0;
            }).length;
            
            console.log(`Frame ${frameCountRef.current} debug:`, {
              totalPaths: updatedPaths.length,
              activePathsCount,
              deltaTime,
              heroGlowIntensity
            });
            
            if (frameCountRef.current === 10) {
              setAnimationStarted(true);
              console.log('Animation initialization complete');
            }
          }

          // CRITICAL FIX: Enhanced rendering with comprehensive error handling
          try {
            renderEnhancedPaths(ctx, updatedPaths, isMobile);
            
            // Success - clear any previous errors
            if (renderError) {
              setRenderError(null);
            }
          } catch (renderErr) {
            console.error('Render error:', renderErr);
            if (frameCountRef.current % 120 === 0) { // Log every 2 seconds to avoid spam
              setRenderError(renderErr instanceof Error ? renderErr.message : 'Rendering failed');
            }
          }

          return updatedPaths;
        });

        // Periodic performance logging
        if (frameCountRef.current % 300 === 0) { // Every 5 seconds
          console.log(`Animation performance check - Frame ${frameCountRef.current}:`, {
            pathsLength: paths.length,
            deltaTime,
            heroGlowIntensity,
            canvasSize: { width: canvas.width, height: canvas.height }
          });
        }

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
