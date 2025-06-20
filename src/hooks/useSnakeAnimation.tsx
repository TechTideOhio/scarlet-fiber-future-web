
import { useAnimationState } from './animation/useAnimationState';
import { usePathInitialization } from './animation/usePathInitialization';
import { useAnimationLoop } from './animation/useAnimationLoop';
import type { UseSnakeAnimationProps } from './animation/types';

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
  
  const {
    animationState,
    setAnimationState,
    updateAnimationState,
    resetAnimation,
    animationRef,
    lastTimeRef,
    initializationAttemptRef
  } = useAnimationState();

  const { initializePaths } = usePathInitialization({
    canvasReady,
    pathGeneratorRef,
    pathCount,
    setRenderError
  });

  const { startAnimationLoop } = useAnimationLoop({
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
  });

  // Initialize paths when dependencies change
  initializePaths(initializationAttemptRef, updateAnimationState);

  // Start animation loop
  startAnimationLoop(animationRef, lastTimeRef);

  return { paths: animationState.paths };
};
