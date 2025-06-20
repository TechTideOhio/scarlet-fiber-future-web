
import { useState, useRef } from 'react';
import { AnimationState } from './types';

export const useAnimationState = () => {
  const [animationState, setAnimationState] = useState<AnimationState>({
    paths: [],
    animationStarted: false,
    frameCount: 0,
    lastTime: 0
  });

  const animationRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);
  const initializationAttemptRef = useRef(0);

  const updateAnimationState = (updates: Partial<AnimationState>) => {
    setAnimationState(prev => ({ ...prev, ...updates }));
  };

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
