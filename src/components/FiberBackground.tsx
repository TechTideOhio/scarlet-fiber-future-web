
import React, { useEffect } from 'react';
import { useFiberInteraction } from '../hooks/useFiberInteraction';
import { useWebGLState } from '../hooks/useWebGLState';
import { usePerformanceMonitor } from '../hooks/usePerformanceMonitor';
import { useLazyFiberEffects } from '../hooks/useLazyFiberEffects';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
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

  console.log('FiberBackground render (Snake mode):', { 
    currentQuality, 
    shouldShowCSS, 
    isVisible, 
    isPaused,
    optimalFiberCount,
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
      {/* Primary Snake Fiber Animation */}
      <SnakeFiberAnimation 
        opacity={webglState.loaded ? 0.6 : 1}
        enableMouseEffects={shouldShowMouseEffects && deviceCapabilities?.touchEnabled}
        isVisible={isVisible && !isPaused}
        quality={currentQuality}
        fiberCount={Math.max(optimalFiberCount || 6, 3)} // Fewer paths for Snake mode
        isMobile={deviceCapabilities?.isMobile}
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
              fiberCount={Math.min(optimalFiberCount || 8, 10)}
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

      {/* Debug info in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-4 left-4 text-white text-xs bg-black bg-opacity-50 p-2 rounded z-50">
          Quality: {currentQuality} | Device: {deviceCapabilities?.isMobile ? 'Mobile' : 'Desktop'} | 
          RAM: {deviceCapabilities?.ram}GB | Snake Paths: {optimalFiberCount} | 
          Visible: {isVisible ? 'Y' : 'N'} | Paused: {isPaused ? 'Y' : 'N'} | 
          Snake Mode: Active
        </div>
      )}
    </div>
  );
};

export default FiberBackground;
