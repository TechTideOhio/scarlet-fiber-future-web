
import { useEffect } from 'react';
import { renderEnhancedPaths } from '../../utils/snakeRenderer';
import { AnimationLoopProps } from './types';

export const useAnimationLoop = ({
  isVisible,
  canvasReady,
  renderError,
  canvasRef,
  pathGeneratorRef,
  heroGlowIntensity,
  isMobile,
  setRenderError,
  animationState,
  setAnimationState
}: AnimationLoopProps) => {

  const startAnimationLoop = (animationRef: React.MutableRefObject<number | undefined>, lastTimeRef: React.MutableRefObject<number>) => {
    useEffect(() => {
      if (!isVisible || !canvasReady || renderError || animationState.paths.length === 0) {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
          animationRef.current = undefined;
        }
        console.log('Animation stopped:', { isVisible, canvasReady, renderError, pathsLength: animationState.paths.length });
        return;
      }

      console.log('Starting animation loop with:', { 
        pathsLength: animationState.paths.length, 
        heroGlowIntensity,
        frameCount: animationState.frameCount 
      });

      const animate = (currentTime: number) => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        
        if (!canvas || !ctx || !pathGeneratorRef.current) {
          console.warn('Animation frame skipped - missing dependencies');
          if (animationRef.current) {
            animationRef.current = requestAnimationFrame(animate);
          }
          return;
        }

        try {
          // CRITICAL FIX: Proper timing calculation with bounds
          const deltaTime = lastTimeRef.current === 0 ? 16 : Math.min(Math.max(currentTime - lastTimeRef.current, 8), 100);
          lastTimeRef.current = currentTime;

          setAnimationState(prevState => {
            const newFrameCount = prevState.frameCount + 1;
            
            if (prevState.paths.length === 0) {
              console.warn('No paths to update in animation frame');
              return prevState;
            }
            
            const updatedPaths = prevState.paths.map((path, index) => {
              try {
                return pathGeneratorRef.current!.updateEnhancedPath(path, deltaTime, heroGlowIntensity);
              } catch (pathError) {
                console.error(`Path ${index} update error:`, pathError);
                return path; // Return unchanged path on error
              }
            });

            // Debug logging for first few frames and periodically
            if (!prevState.animationStarted && newFrameCount <= 10) {
              const activePathsCount = updatedPaths.filter(path => {
                const activeNodes = path.nodes.filter(n => n.isActive && n.intensity > 0);
                return activeNodes.length > 0;
              }).length;
              
              console.log(`Frame ${newFrameCount} debug:`, {
                totalPaths: updatedPaths.length,
                activePathsCount,
                deltaTime,
                heroGlowIntensity
              });
              
              if (newFrameCount === 10) {
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
              if (newFrameCount % 120 === 0) { // Log every 2 seconds to avoid spam
                setRenderError(renderErr instanceof Error ? renderErr.message : 'Rendering failed');
              }
            }

            // Periodic performance logging
            if (newFrameCount % 300 === 0) { // Every 5 seconds
              console.log(`Animation performance check - Frame ${newFrameCount}:`, {
                pathsLength: updatedPaths.length,
                deltaTime,
                heroGlowIntensity,
                canvasSize: { width: canvas.width, height: canvas.height }
              });
            }

            return {
              ...prevState,
              paths: updatedPaths,
              frameCount: newFrameCount,
              animationStarted: newFrameCount === 10 ? true : prevState.animationStarted,
              lastTime: currentTime
            };
          });

        } catch (error) {
          console.error('Animation frame error:', error);
          setRenderError(error instanceof Error ? error.message : 'Animation error');
        }

        if (animationRef.current) {
          animationRef.current = requestAnimationFrame(animate);
        }
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
    }, [isVisible, heroGlowIntensity, canvasReady, renderError, isMobile, setRenderError, animationState.paths.length]);
  };

  return { startAnimationLoop };
};
