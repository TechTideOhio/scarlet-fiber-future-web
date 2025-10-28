
import React, { useEffect, useRef } from 'react';
import { AnimatedFiber } from './AnimatedFiber';
import { FIBER_ANIMATION_TOKENS, ANIMATION_TOKENS, LAYOUT_TOKENS, logFiberToken } from '../constants';

const HeroAnimationCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const fibersRef = useRef<AnimatedFiber[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Create fibers
    const fiberCount = FIBER_ANIMATION_TOKENS.count.default.hero;
    console.log(`🚀 HERO CANVAS INIT v2.0: Creating ${fiberCount} fibers @ ${ANIMATION_TOKENS.masterSpeed.global}x speed (25x slower than original)`);
    
    for (let i = 0; i < fiberCount; i++) {
      fibersRef.current.push(new AnimatedFiber(canvas));
    }

    // Animation loop
    const animate = () => {
      ctx.fillStyle = `rgba(0, 0, 0, ${FIBER_ANIMATION_TOKENS.opacity.trail})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      fibersRef.current.forEach(fiber => {
        fiber.update();
        fiber.draw(ctx);
      });
      
      frameRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};

export default HeroAnimationCanvas;
