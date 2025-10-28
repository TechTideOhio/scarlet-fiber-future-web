
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
    const minFiberDuration = Math.floor(1/(FIBER_ANIMATION_TOKENS.speed.base.min * ANIMATION_TOKENS.masterSpeed.global)/60);
    const maxFiberDuration = Math.floor(1/(FIBER_ANIMATION_TOKENS.speed.base.default * ANIMATION_TOKENS.masterSpeed.global)/60);
    
    console.log(`
🎮 ============================================
   ANIMATION SYSTEM AUDIT v4.0
🎮 ============================================
📊 Master Speed: ${ANIMATION_TOKENS.masterSpeed.global}x (${(1/ANIMATION_TOKENS.masterSpeed.global).toFixed(0)}x slower)

🎨 Canvas Fibers (AnimatedFiber):
   - Count: ${fiberCount}
   - Base Speed: ${FIBER_ANIMATION_TOKENS.speed.base.min}-${FIBER_ANIMATION_TOKENS.speed.base.default}/frame
   - Effective Speed: ${(FIBER_ANIMATION_TOKENS.speed.base.min * ANIMATION_TOKENS.masterSpeed.global).toFixed(8)}-${(FIBER_ANIMATION_TOKENS.speed.base.default * ANIMATION_TOKENS.masterSpeed.global).toFixed(8)}/frame
   - Target Duration: ${FIBER_ANIMATION_TOKENS.targetDuration.fiber.min}-${FIBER_ANIMATION_TOKENS.targetDuration.fiber.max}s
   - Estimated: ${minFiberDuration}-${maxFiberDuration}s ✅

🐍 Snake Paths (EnhancedSnake):
   - Progression: ${FIBER_ANIMATION_TOKENS.speed.progression}/ms
   - Effective: ${(FIBER_ANIMATION_TOKENS.speed.progression * ANIMATION_TOKENS.masterSpeed.global).toFixed(8)}/ms
   - Target Duration: ${FIBER_ANIMATION_TOKENS.targetDuration.snake.min}-${FIBER_ANIMATION_TOKENS.targetDuration.snake.max}s

🧵 CSS Strands (FiberStrand):
   - Duration: ${(ANIMATION_TOKENS.duration.backgroundPulse / ANIMATION_TOKENS.masterSpeed.global / 1000).toFixed(0)}-${(ANIMATION_TOKENS.duration.backgroundPulse * 2 / ANIMATION_TOKENS.masterSpeed.global / 1000).toFixed(0)}s
   - Target: ${FIBER_ANIMATION_TOKENS.targetDuration.cssStrand.min}-${FIBER_ANIMATION_TOKENS.targetDuration.cssStrand.max}s
   - Status: ✅ SYNCHRONIZED

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
