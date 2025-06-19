
import React, { useEffect } from 'react';
import { useFiberInteraction } from '../hooks/useFiberInteraction';
import { useWebGLState } from '../hooks/useWebGLState';
import { usePerformanceMonitor } from '../hooks/usePerformanceMonitor';
import { useLazyFiberEffects } from '../hooks/useLazyFiberEffects';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { useFiberSync } from '../hooks/useFiberSync';
import { shouldUseParticleEffects } from '../utils/deviceDetection';
import SnakeFiberAnimation from './SnakeFiberAnimation';
import StaticFiberBackground from './StaticFiberBackground';
import AccessibilityControls from './AccessibilityControls';

const WebGLFiberRenderer = React.lazy(() => import('./WebGLFiberRenderer'));

const FiberBackground = () => {
  const { containerRef, mousePosition, userInteracted } = useFiberInteraction();
  const { webglState, handleWebGLLoaded, handleWebGLError } = useWebGLState();
  const { 
    currentQuality, 
    startMonitoring, 
    deviceCapabilities,
    isPaused,
    setQuality,
    togglePause,
    optimalFiberCount
  } = usePerformanceMonitor();
  
  const { shouldShowCSS, shouldShowMouseEffects, shouldShowWebGL } = useLazyFiberEffects(currentQuality);
  const { elementRef, isVisible } = useIntersectionObserver();
  const { fiberGlowIntensity, buttonPulse } = useFiberSync();

  console.log('FiberBackground render (Enhanced Snake mode):', { 
    currentQuality, 
    shouldShowCSS, 
    isVisible, 
    isPaused,
    optimalFiberCount,
    fiberGlowIntensity,
    deviceCapabilities: deviceCapabilities?.isMobile 
  });

  // Start performance monitoring when component mounts and is visible
  useEffect(() => {
    if (isVisible && currentQuality !== 'static' && !isPaused) {
      startMonitoring();
    }
  }, [isVisible, currentQuality, startMonitoring, isPaused]);

  // Container styles with optimizations
  const containerStyles = {
    contain: 'layout style paint',
    transform: 'translate3d(0,0,0)',
    zIndex: 1
  };

  return (
    <div 
      ref={(node) => {
        if (node) {
          containerRef.current = node;
          elementRef.current = node;
        }
      }} 
      className="absolute inset-0 w-full h-full bg-black overflow-hidden"
      style={containerStyles}
    >
      {/* Enhanced Snake Fiber Animation with hero synchronization */}
      <SnakeFiberAnimation 
        opacity={webglState.loaded ? 0.7 : 1}
        enableMouseEffects={shouldShowMouseEffects && deviceCapabilities?.touchEnabled}
        isVisible={isVisible && !isPaused}
        quality={currentQuality}
        fiberCount={Math.max(optimalFiberCount || 8, 4)}
        isMobile={deviceCapabilities?.isMobile}
        heroGlowIntensity={fiberGlowIntensity}
        mousePosition={mousePosition}
      />

      {/* Static background overlay for very low quality scenarios */}
      {currentQuality === 'static' && (
        <StaticFiberBackground />
      )}

      {/* WebGL Enhancement Layer - Only for high quality */}
      {shouldShowWebGL && webglState.supported && webglState.shouldUse && !webglState.error && isVisible && !isPaused && shouldUseParticleEffects(deviceCapabilities) && (
        <React.Suspense fallback={null}>
          <div className={`absolute inset-0 transition-opacity duration-2000 ${webglState.loaded ? 'opacity-100' : 'opacity-0'}`}>
            <WebGLFiberRenderer
              onLoaded={handleWebGLLoaded}
              onError={handleWebGLError}
              mousePosition={mousePosition}
              isVisible={isVisible && !isPaused}
              enableParticles={shouldUseParticleEffects(deviceCapabilities)}
              fiberCount={Math.min(optimalFiberCount || 10, 12)}
            />
          </div>
        </React.Suspense>
      )}

      {/* Accessibility Controls */}
      <AccessibilityControls
        isPaused={isPaused}
        onTogglePause={togglePause}
        quality={currentQuality}
        onQualityChange={setQuality}
      />
    </div>
  );
};

export default FiberBackground;
