
import React from 'react';
import { useFiberInteraction } from '../hooks/useFiberInteraction';
import { useWebGLState } from '../hooks/useWebGLState';
import CSSFiberAnimation from './CSSFiberAnimation';

const WebGLFiberRenderer = React.lazy(() => import('./WebGLFiberRenderer'));

const FiberBackground = () => {
  const { containerRef, mousePosition, userInteracted } = useFiberInteraction();
  const { webglState, handleWebGLLoaded, handleWebGLError } = useWebGLState();

  const shouldLoadWebGL = webglState.supported && webglState.shouldUse && userInteracted && !webglState.error;

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full bg-black overflow-hidden">
      {/* CSS Fiber Animation - Always shown first */}
      <CSSFiberAnimation opacity={webglState.loaded ? 0.3 : 1} />

      {/* WebGL Enhancement Layer */}
      {shouldLoadWebGL && (
        <React.Suspense fallback={null}>
          <div className={`absolute inset-0 transition-opacity duration-2000 ${webglState.loaded ? 'opacity-100' : 'opacity-0'}`}>
            <WebGLFiberRenderer
              onLoaded={handleWebGLLoaded}
              onError={handleWebGLError}
              mousePosition={mousePosition}
            />
          </div>
        </React.Suspense>
      )}
    </div>
  );
};

export default FiberBackground;
