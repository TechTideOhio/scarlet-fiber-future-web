
import { useEffect, useRef, useState } from 'react';
import { EnhancedSnakeGenerator } from '../components/fiber/EnhancedSnakeGenerator';

interface UseCanvasSetupProps {
  pathCount: number;
  isMobile: boolean;
}

export const useCanvasSetup = ({ pathCount, isMobile }: UseCanvasSetupProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pathGeneratorRef = useRef<EnhancedSnakeGenerator>();
  const [canvasReady, setCanvasReady] = useState(false);
  const [renderError, setRenderError] = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.error('Canvas ref not available');
      return;
    }

    const updateCanvasSize = () => {
      try {
        const rect = canvas.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        
        console.log('Setting up canvas:', { 
          width: rect.width, 
          height: rect.height, 
          dpr 
        });
        
        // Set canvas size
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        canvas.style.width = rect.width + 'px';
        canvas.style.height = rect.height + 'px';
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          throw new Error('Failed to get 2D context');
        }
        
        ctx.scale(dpr, dpr);
        
        // Clear canvas to black
        ctx.fillStyle = 'rgba(0, 0, 0, 1)';
        ctx.fillRect(0, 0, rect.width, rect.height);
        
        // Initialize generator
        pathGeneratorRef.current = new EnhancedSnakeGenerator(rect.width, rect.height, isMobile);
        
        setCanvasReady(true);
        setRenderError(null);
        
      } catch (error) {
        console.error('Canvas setup error:', error);
        setRenderError(error instanceof Error ? error.message : 'Canvas setup failed');
        setCanvasReady(false);
      }
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, [pathCount, isMobile]);

  return {
    canvasRef,
    pathGeneratorRef,
    canvasReady,
    renderError,
    setRenderError
  };
};
