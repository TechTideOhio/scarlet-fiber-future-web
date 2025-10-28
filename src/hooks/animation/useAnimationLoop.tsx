
import { useEffect } from 'react';
import { renderEnhancedPaths } from '../../utils/snakeRenderer';
import { AnimationLoopProps } from './types';
import { PERFORMANCE_TOKENS, ANIMATION_TOKENS, logPerformanceToken } from '../../constants';

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
          // Proper timing calculation with bounds
          const deltaTime = lastTimeRef.current === 0 
            ? PERFORMANCE_TOKENS.deltaTime.default 
            : Math.min(
                Math.max(currentTime - lastTimeRef.current, PERFORMANCE_TOKENS.deltaTime.min), 
                PERFORMANCE_TOKENS.deltaTime.max
              );
          lastTimeRef.current = currentTime;
          
          // Log frame timing every 120 frames (~2 seconds @ 60fps)
          const newFrameCount = (animationState.frameCount || 0) + 1;
          if (newFrameCount % 120 === 0) {
            console.log(`🎬 Animation Frame #${newFrameCount}: dt=${deltaTime.toFixed(1)}ms, masterSpeed=${ANIMATION_TOKENS.masterSpeed.global}x, heroGlow=${heroGlowIntensity.toFixed(2)}`);
          }

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

            // Debug logging for first few frames (using token for frame check)
            if (!prevState.animationStarted && newFrameCount <= PERFORMANCE_TOKENS.logging.initialFrames) {
              const activePathsCount = updatedPaths.filter(path => {
                const activeNodes = path.nodes.filter(n => n.isActive && n.intensity > 0);
                return activeNodes.length > 0;
              }).length;
              
              console.log(`🚀 Frame ${newFrameCount} Init:`, {
                totalPaths: updatedPaths.length,
                activePaths: activePathsCount,
                deltaTime: deltaTime.toFixed(1) + 'ms',
                speedMultiplier: ANIMATION_TOKENS.masterSpeed.global + 'x',
                heroGlow: heroGlowIntensity.toFixed(2)
              });
              
              if (newFrameCount === PERFORMANCE_TOKENS.logging.initialFrames) {
                console.log(`✅ Animation Init Complete: ${ANIMATION_TOKENS.masterSpeed.global}x speed, ${updatedPaths.length} paths`);
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
              if (newFrameCount % PERFORMANCE_TOKENS.logging.renderErrorInterval === 0) {
                setRenderError(renderErr instanceof Error ? renderErr.message : 'Rendering failed');
              }
            }

            // Periodic performance logging
            if (newFrameCount % PERFORMANCE_TOKENS.logging.periodicInterval === 0) {
              logPerformanceToken('frame-milestone', `Frame ${newFrameCount}`);
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
              animationStarted: newFrameCount === PERFORMANCE_TOKENS.logging.initialFrames ? true : prevState.animationStarted,
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
