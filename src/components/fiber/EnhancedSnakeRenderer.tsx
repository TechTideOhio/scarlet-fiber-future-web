
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
    renderError,
    pathsLength: paths.length
  });

  // Debug info
  useEffect(() => {
    if (renderError) {
      console.error('Render error:', renderError);
    }
  }, [renderError]);

  // Add visible fallback for debugging
  const showFallback = !canvasReady || renderError || (canvasReady && paths.length === 0);

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
        <div className="absolute top-4 left-4 bg-red-900 text-white p-2 rounded text-xs z-10 max-w-xs">
          Render Error: {renderError}
        </div>
      )}
      
      {/* Loading state */}
      {!canvasReady && !renderError && (
        <div className="absolute inset-0 flex items-center justify-center text-white text-sm opacity-50 z-10">
          <div className="text-center">
            <div>Initializing canvas...</div>
            <div className="text-xs mt-2">Path count: {pathCount}</div>
          </div>
        </div>
      )}

      {/* Fallback pattern when no paths are rendering */}
      {showFallback && (
        <div className="absolute inset-0 z-1">
          <div 
            className="w-full h-full opacity-20"
            style={{
              backgroundImage: `
                radial-gradient(circle at 20% 50%, rgba(255, 50, 50, 0.3) 2px, transparent 2px),
                radial-gradient(circle at 40% 20%, rgba(255, 100, 100, 0.2) 1px, transparent 1px),
                radial-gradient(circle at 60% 70%, rgba(187, 0, 0, 0.25) 1.5px, transparent 1.5px),
                radial-gradient(circle at 80% 30%, rgba(255, 80, 80, 0.2) 1px, transparent 1px)
              `,
              backgroundSize: '200px 200px, 150px 150px, 180px 180px, 160px 160px',
              animation: 'pulse 3s ease-in-out infinite'
            }}
          />
        </div>
      )}

      {/* Debug info overlay */}
      {canvasReady && (
        <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white p-2 rounded text-xs z-10">
          <div>Canvas: Ready</div>
          <div>Paths: {paths.length}</div>
          <div>Visible: {isVisible ? 'Yes' : 'No'}</div>
          <div>Glow: {heroGlowIntensity.toFixed(2)}</div>
        </div>
      )}
    </div>
  );
};

export default EnhancedSnakeRenderer;
