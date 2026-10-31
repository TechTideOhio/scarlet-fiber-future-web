
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

  // Initialize paths when dependencies change. Must run before the animation loop
  // so effect order matches the previous implementation.
  usePathInitialization({
    canvasReady,
    pathGeneratorRef,
    pathCount,
    setRenderError,
    initializationAttemptRef,
    updateAnimationState
  });

  // Start animation loop
  useAnimationLoop({
    isVisible,
    canvasReady,
    renderError,
    canvasRef,
    pathGeneratorRef,
    heroGlowIntensity,
    isMobile,
    setRenderError,
    animationState,
    setAnimationState,
    animationRef,
    lastTimeRef
  });

  return { paths: animationState.paths };
};
