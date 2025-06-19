
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
        
        console.log('Canvas setup - rect:', { width: rect.width, height: rect.height });
        console.log('Canvas setup - dpr:', dpr);
        
        // CRITICAL FIX: Set canvas size with proper scaling
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        canvas.style.width = rect.width + 'px';
        canvas.style.height = rect.height + 'px';
        
        console.log('Canvas setup - final dimensions:', { 
          canvasWidth: canvas.width, 
          canvasHeight: canvas.height,
          styleWidth: canvas.style.width,
          styleHeight: canvas.style.height
        });
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          throw new Error('Failed to get 2D context');
        }
        
        // CRITICAL FIX: Scale context properly for HiDPI
        ctx.scale(dpr, dpr);
        
        // CRITICAL FIX: Clear canvas using display dimensions, not buffer dimensions
        ctx.fillStyle = 'rgba(5, 5, 10, 1)';
        ctx.fillRect(0, 0, rect.width, rect.height);
        
        console.log('Canvas cleared with dark background using display dimensions:', rect.width, 'x', rect.height);
        
        // Store display dimensions for use in animation
        canvas.dataset.displayWidth = rect.width.toString();
        canvas.dataset.displayHeight = rect.height.toString();
        
        // Initialize generator with display dimensions
        pathGeneratorRef.current = new EnhancedSnakeGenerator(rect.width, rect.height, isMobile);
        console.log('Path generator initialized with display dimensions:', rect.width, 'x', rect.height);
        
        setCanvasReady(true);
        setRenderError(null);
        
      } catch (error) {
        console.error('Canvas setup error:', error);
        setRenderError(error instanceof Error ? error.message : 'Canvas setup failed');
        setCanvasReady(false);
      }
    };

    // Add slight delay to ensure DOM is ready
    const timeoutId = setTimeout(updateCanvasSize, 50);
    window.addEventListener('resize', updateCanvasSize);
    
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, [pathCount, isMobile]);

  return {
    canvasRef,
    pathGeneratorRef,
    canvasReady,
    renderError,
    setRenderError
  };
};
