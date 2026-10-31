
import { useState, useRef, useCallback } from 'react';
import { AnimationState } from './types';

export const useAnimationState = () => {
  const [animationState, setAnimationState] = useState<AnimationState>({
    paths: [],
    animationStarted: false,
    frameCount: 0,
    lastTime: 0
  });

  const animationRef = useRef<number | undefined>();
  const lastTimeRef = useRef<number>(0);
  const initializationAttemptRef = useRef<number>(0);

  // Stable identity so effects can list it as a dependency without re-running every render.
  const updateAnimationState = useCallback((updates: Partial<AnimationState>) => {
    setAnimationState(prev => ({ ...prev, ...updates }));
  }, []);

  const resetAnimation = () => {
    setAnimationState({
      paths: [],
      animationStarted: false,
      frameCount: 0,
      lastTime: 0
    });
    lastTimeRef.current = 0;
  };

  return {
    animationState,
    setAnimationState,
    updateAnimationState,
    resetAnimation,
    animationRef,
    lastTimeRef,
    initializationAttemptRef
  };
};
