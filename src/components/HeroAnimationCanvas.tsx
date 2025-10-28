
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
    
    // System audit on startup
    console.log(`
🎮 ============================================
   ANIMATION SYSTEM AUDIT v3.0
🎮 ============================================
📊 Master Speed: ${ANIMATION_TOKENS.masterSpeed.global}x (${(1/ANIMATION_TOKENS.masterSpeed.global).toFixed(1)}x slower)

🎨 Canvas Fibers (AnimatedFiber):
   - Count: ${fiberCount}
   - Speed Multiplier: ${ANIMATION_TOKENS.masterSpeed.fiber.canvas}x
   - Effective Speed: ${(ANIMATION_TOKENS.masterSpeed.global * ANIMATION_TOKENS.masterSpeed.fiber.canvas).toFixed(4)}x
   - Base Speed Range: ${FIBER_ANIMATION_TOKENS.speed.base.min}-${FIBER_ANIMATION_TOKENS.speed.base.default}

🐍 Snake Paths (EnhancedSnake):
   - Speed Multiplier: ${ANIMATION_TOKENS.masterSpeed.fiber.snake}x
   - Effective Speed: ${(ANIMATION_TOKENS.masterSpeed.global * ANIMATION_TOKENS.masterSpeed.fiber.snake).toFixed(4)}x
   - Progression Rate: ${FIBER_ANIMATION_TOKENS.speed.progression}

🧵 CSS Fiber Strands (FiberStrand):
   - Duration Range: ${ANIMATION_TOKENS.duration.backgroundPulse}-${ANIMATION_TOKENS.duration.backgroundPulse * 2}ms
   - Adjusted Duration: ${(ANIMATION_TOKENS.duration.backgroundPulse / ANIMATION_TOKENS.masterSpeed.global).toFixed(0)}-${(ANIMATION_TOKENS.duration.backgroundPulse * 2 / ANIMATION_TOKENS.masterSpeed.global).toFixed(0)}ms
   - Slowdown Factor: ${(1 / ANIMATION_TOKENS.masterSpeed.global).toFixed(1)}x

🎮 ============================================
    `);
    
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
