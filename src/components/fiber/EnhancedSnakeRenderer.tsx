
import React, { useEffect } from 'react';
import { useCanvasSetup } from '../../hooks/useCanvasSetup';
import { useSnakeAnimation } from '../../hooks/useSnakeAnimation';

interface EnhancedSnakeRendererProps {
  isVisible: boolean;
  pathCount: number;
  isMobile: boolean;
  enableInteractive: boolean;
  heroGlowIntensity?: number;
  mousePosition?: { x: number; y: number };
}

const EnhancedSnakeRenderer: React.FC<EnhancedSnakeRendererProps> = ({
  isVisible,
  pathCount,
  isMobile,
  enableInteractive,
  heroGlowIntensity = 0,
  mousePosition = { x: 0, y: 0 }
}) => {
  const {
    canvasRef,
    pathGeneratorRef,
    canvasReady,
    renderError,
    setRenderError
  } = useCanvasSetup({ pathCount, isMobile });

  const { paths } = useSnakeAnimation({
    isVisible,
    canvasReady,
    renderError,
    canvasRef,
    pathGeneratorRef,
    pathCount,
    heroGlowIntensity,
    isMobile,
    setRenderError
  });

  console.log('EnhancedSnakeRenderer render:', { 
    isVisible, 
    pathCount, 
    isMobile, 
    heroGlowIntensity,
    canvasReady,
    renderError 
  });

  // Debug info
  useEffect(() => {
    if (renderError) {
      console.error('Render error:', renderError);
    }
  }, [renderError]);

  return (
    <div className="absolute inset-0 w-full h-full">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{
          pointerEvents: enableInteractive ? 'auto' : 'none',
          opacity: isVisible && canvasReady ? 1 : 0,
          transition: 'opacity 1s ease-in-out',
          zIndex: 2,
          mixBlendMode: 'screen'
        }}
      />
      
      {/* Debug overlay */}
      {renderError && (
        <div className="absolute top-4 left-4 bg-red-900 text-white p-2 rounded text-xs z-10">
          Render Error: {renderError}
        </div>
      )}
      
      {!canvasReady && !renderError && (
        <div className="absolute inset-0 flex items-center justify-center text-white text-sm opacity-50">
          Initializing canvas...
        </div>
      )}
    </div>
  );
};

export default EnhancedSnakeRenderer;
