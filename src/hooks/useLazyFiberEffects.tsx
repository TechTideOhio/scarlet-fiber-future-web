
import { useEffect, useState, useRef } from 'react';
import type { QualityLevel } from './usePerformanceMonitor';

interface LazyEffectsState {
  cssReady: boolean;
  mouseEffectsReady: boolean;
  webglReady: boolean;
  userInteracted: boolean;
}

export const useLazyFiberEffects = (quality: QualityLevel) => {
  const [effectsState, setEffectsState] = useState<LazyEffectsState>({
    cssReady: true, // CSS animations start immediately
    mouseEffectsReady: false,
    webglReady: false,
    userInteracted: false
  });

  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const userInteractionListenersRef = useRef<(() => void)[]>([]);

  // Clear timeouts helper
  const clearTimeouts = () => {
    timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    timeoutsRef.current = [];
  };

  // Set up progressive loading based on quality
  useEffect(() => {
    clearTimeouts();

    // Always start with CSS ready
    setEffectsState(prev => ({ ...prev, cssReady: true }));

    if (quality === 'static') {
      // No effects for static mode
      setEffectsState(prev => ({
        ...prev,
        mouseEffectsReady: false,
        webglReady: false
      }));
      return;
    }

    // Load mouse effects after 1 second (for medium and high quality)
    if (quality === 'medium' || quality === 'high') {
      const mouseTimeout = setTimeout(() => {
        setEffectsState(prev => ({ ...prev, mouseEffectsReady: true }));
      }, 1000);
      timeoutsRef.current.push(mouseTimeout);
    }

    // Load WebGL after 3 seconds or user interaction (high quality only)
    if (quality === 'high') {
      const webglTimeout = setTimeout(() => {
        setEffectsState(prev => ({ ...prev, webglReady: true }));
      }, 3000);
      timeoutsRef.current.push(webglTimeout);
    }

    return clearTimeouts;
  }, [quality]);

  // Handle user interaction for immediate WebGL loading
  useEffect(() => {
    if (quality !== 'high' || effectsState.userInteracted) return;

    const handleInteraction = () => {
      setEffectsState(prev => ({ 
        ...prev, 
        userInteracted: true,
        webglReady: true 
      }));
      
      // Remove listeners after first interaction
      userInteractionListenersRef.current.forEach(cleanup => cleanup());
      userInteractionListenersRef.current = [];
    };

    const events = ['mousedown', 'touchstart', 'keydown', 'wheel'];
    
    events.forEach(event => {
      const listener = () => handleInteraction();
      window.addEventListener(event, listener, { once: true, passive: true });
      
      userInteractionListenersRef.current.push(() => {
        window.removeEventListener(event, listener);
      });
    });

    return () => {
      userInteractionListenersRef.current.forEach(cleanup => cleanup());
      userInteractionListenersRef.current = [];
    };
  }, [quality, effectsState.userInteracted]);

  // Cleanup
  useEffect(() => {
    return () => {
      clearTimeouts();
      userInteractionListenersRef.current.forEach(cleanup => cleanup());
    };
  }, []);

  return {
    shouldShowCSS: effectsState.cssReady && quality !== 'static',
    shouldShowMouseEffects: effectsState.mouseEffectsReady && (quality === 'medium' || quality === 'high'),
    shouldShowWebGL: effectsState.webglReady && quality === 'high',
    userInteracted: effectsState.userInteracted
  };
};
