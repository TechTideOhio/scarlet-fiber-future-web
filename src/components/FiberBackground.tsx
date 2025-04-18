
import React, { useEffect, useRef } from 'react';

const FiberBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // Fiber strand class
    class FiberStrand {
      x: number;
      y: number;
      length: number;
      angle: number;
      speed: number;
      opacity: number;
      pulsePhase: number;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.length = 100 + Math.random() * 200;
        this.angle = Math.random() * Math.PI * 2;
        this.speed = 0.2 + Math.random() * 0.3;
        this.opacity = 0.1 + Math.random() * 0.3;
        this.pulsePhase = Math.random() * Math.PI * 2;
      }

      update() {
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        this.pulsePhase += 0.02;

        if (this.x < -100) this.x = canvas.width + 100;
        if (this.x > canvas.width + 100) this.x = -100;
        if (this.y < -100) this.y = canvas.height + 100;
        if (this.y > canvas.height + 100) this.y = -100;
      }

      draw(ctx: CanvasRenderingContext2D) {
        const pulseOpacity = this.opacity * (0.8 + Math.sin(this.pulsePhase) * 0.2);
        
        const gradient = ctx.createLinearGradient(
          this.x,
          this.y,
          this.x + Math.cos(this.angle) * this.length,
          this.y + Math.sin(this.angle) * this.length
        );

        gradient.addColorStop(0, `rgba(187, 0, 0, ${pulseOpacity})`);
        gradient.addColorStop(1, 'rgba(187, 0, 0, 0)');

        ctx.beginPath();
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(
          this.x + Math.cos(this.angle) * this.length,
          this.y + Math.sin(this.angle) * this.length
        );
        ctx.stroke();
      }
    }

    // Create fiber strands
    const strands: FiberStrand[] = Array(50)
      .fill(null)
      .map(() => new FiberStrand());

    // Animation loop
    let animationFrameId: number;
    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      strands.forEach(strand => {
        strand.update();
        strand.draw(ctx);
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', setCanvasSize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ background: 'black' }}
    />
  );
};

export default FiberBackground;
