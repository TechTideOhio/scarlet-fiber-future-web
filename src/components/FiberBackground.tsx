
import React, { useEffect } from 'react';
import { useFiberInteraction } from '../hooks/useFiberInteraction';
import { useWebGLState } from '../hooks/useWebGLState';
import { usePerformanceMonitor } from '../hooks/usePerformanceMonitor';
import { useLazyFiberEffects } from '../hooks/useLazyFiberEffects';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { shouldUseParticleEffects } from '../utils/deviceDetection';
import CSSFiberAnimation from './CSSFiberAnimation';
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

  // Start performance monitoring when component mounts and is visible
  useEffect(() => {
    if (isVisible && currentQuality !== 'static' && !isPaused) {
      startMonitoring();
    }
  }, [isVisible, currentQuality, startMonitoring, isPaused]);

  // Determine if WebGL should load based on all conditions
  const shouldLoadWebGL = shouldShowWebGL && 
                          webglState.supported && 
                          webglState.shouldUse && 
                          (userInteracted || shouldShowWebGL) && 
                          !webglState.error &&
                          isVisible &&
                          !isPaused &&
                          shouldUseParticleEffects(deviceCapabilities);

  // Static fallback for old browsers or when quality is static
  if (currentQuality === 'static' || deviceCapabilities.isOldBrowser || deviceCapabilities.prefersCSSOnly) {
    return (
      <div 
        ref={(node) => {
          if (node) {
            containerRef.current = node;
            elementRef.current = node;
          }
        }} 
        className="absolute inset-0 w-full h-full"
      >
        <StaticFiberBackground />
        <AccessibilityControls
          isPaused={isPaused}
          onTogglePause={togglePause}
          quality={currentQuality}
          onQualityChange={setQuality}
        />
      </div>
    );
  }

  // Container styles with optimizations
  const containerStyles = {
    contain: 'layout style paint', // CSS containment
    transform: 'translate3d(0,0,0)', // GPU acceleration
    willChange: isVisible && !isPaused ? 'auto' : 'auto' // Only use will-change when needed
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
      {/* CSS Fiber Animation - Conditionally rendered based on quality */}
      {shouldShowCSS && (
        <CSSFiberAnimation 
          opacity={webglState.loaded ? 0.3 : 1}
          enableMouseEffects={shouldShowMouseEffects && deviceCapabilities.touchEnabled}
          isVisible={isVisible && !isPaused}
          quality={currentQuality}
          fiberCount={optimalFiberCount}
          isMobile={deviceCapabilities.isMobile}
        />
      )}

      {/* WebGL Enhancement Layer - Only for high quality with particle support */}
      {shouldLoadWebGL && (
        <React.Suspense fallback={null}>
          <div className={`absolute inset-0 transition-opacity duration-2000 ${webglState.loaded ? 'opacity-100' : 'opacity-0'}`}>
            <WebGLFiberRenderer
              onLoaded={handleWebGLLoaded}
              onError={handleWebGLError}
              mousePosition={mousePosition}
              isVisible={isVisible && !isPaused}
              enableParticles={shouldUseParticleEffects(deviceCapabilities)}
              fiberCount={Math.min(optimalFiberCount, 15)} // Limit WebGL fibers
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
        <div className="absolute top-4 left-4 text-white text-xs bg-black bg-opacity-50 p-2 rounded">
          Quality: {currentQuality} | Device: {deviceCapabilities.isMobile ? 'Mobile' : 'Desktop'} | 
          RAM: {deviceCapabilities.ram}GB | Fibers: {optimalFiberCount} | 
          Visible: {isVisible ? 'Y' : 'N'} | Paused: {isPaused ? 'Y' : 'N'}
        </div>
      )}
    </div>
  );
};

export default FiberBackground;
