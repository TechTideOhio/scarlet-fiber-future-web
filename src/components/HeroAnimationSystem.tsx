
import React, { useEffect, useRef, useState } from 'react';

interface HeroAnimationSystemProps {
  isVisible?: boolean;
  intensity?: number;
  className?: string;
}

const HeroAnimationSystem: React.FC<HeroAnimationSystemProps> = ({
  isVisible = true,
  intensity = 0.5,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isVisible) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const updateCanvasSize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      
      ctx.scale(dpr, dpr);
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    // Fiber animation variables
    const fibers: Array<{
      points: Array<{ x: number; y: number }>;
      offset: number;
      speed: number;
    }> = [];

    // Initialize fibers
    for (let i = 0; i < 6; i++) {
      const fiber = {
        points: [],
        offset: Math.random() * Math.PI * 2,
        speed: 0.01 + Math.random() * 0.02
      };

      // Create curved path points
      for (let j = 0; j <= 50; j++) {
        const t = j / 50;
        const x = (canvas.clientWidth / 6) * i + Math.sin(t * Math.PI * 2 + i) * 50;
        const y = t * canvas.clientHeight;
        fiber.points.push({ x, y });
      }

      fibers.push(fiber);
    }

    // Animation loop
    let time = 0;
    const animate = () => {
      const rect = canvas.getBoundingClientRect();
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, rect.width, rect.height);

      time += 0.016;

      fibers.forEach((fiber, index) => {
        // Update fiber path with wave motion
        fiber.points.forEach((point, pointIndex) => {
          const t = pointIndex / fiber.points.length;
          const baseX = (rect.width / 6) * index;
          point.x = baseX + Math.sin(time * fiber.speed + fiber.offset + t * Math.PI * 2) * 30;
          point.y = t * rect.height + Math.cos(time * fiber.speed * 0.5 + fiber.offset) * 10;
        });

        // Draw fiber
        ctx.beginPath();
        ctx.moveTo(fiber.points[0].x, fiber.points[0].y);
        
        for (let i = 1; i < fiber.points.length; i++) {
          ctx.lineTo(fiber.points[i].x, fiber.points[i].y);
        }

        // Gradient stroke
        const gradient = ctx.createLinearGradient(0, 0, 0, rect.height);
        gradient.addColorStop(0, `rgba(187, 0, 0, ${0.3 * intensity})`);
        gradient.addColorStop(0.5, `rgba(255, 102, 102, ${0.8 * intensity})`);
        gradient.addColorStop(1, `rgba(187, 0, 0, ${0.3 * intensity})`);

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Add glow effect
        ctx.shadowColor = '#ff6666';
        ctx.shadowBlur = 10;
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Draw particles along the fiber
        const particleCount = 3;
        for (let p = 0; p < particleCount; p++) {
          const particleT = (time * fiber.speed + p * 0.3) % 1;
          const pointIndex = Math.floor(particleT * (fiber.points.length - 1));
          const point = fiber.points[pointIndex];

          if (point) {
            ctx.beginPath();
            ctx.arc(point.x, point.y, 3, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 102, 102, ${0.8 * intensity})`;
            ctx.fill();
            
            // Particle glow
            ctx.shadowColor = '#ff6666';
            ctx.shadowBlur = 8;
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        }
      });

      // Mouse glow effect
      if (mousePosition.x > 0 && mousePosition.y > 0) {
        const gradient = ctx.createRadialGradient(
          mousePosition.x, mousePosition.y, 0,
          mousePosition.x, mousePosition.y, 100
        );
        gradient.addColorStop(0, `rgba(255, 102, 102, ${0.3 * intensity})`);
        gradient.addColorStop(1, 'rgba(255, 102, 102, 0)');

        ctx.beginPath();
        ctx.arc(mousePosition.x, mousePosition.y, 100, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, [isVisible, intensity]);

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  if (!isVisible) return null;

  return (
    <div className={`relative min-h-screen overflow-hidden ${className}`}>
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-red-950/20" />
      
      {/* Canvas animation layer */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ background: 'transparent' }}
      />
      
      {/* Hero content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight">
            Connecting the Future,{' '}
            <span className="block">Powering Tomorrow.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-200 mb-12 max-w-2xl mx-auto">
            Experience lightning-fast connectivity with our enterprise-grade fiber network solutions.
          </p>
          
          <button 
            className="bg-[#BB0000] hover:bg-[#990000] text-white font-bold px-12 py-5 rounded-md transition-all duration-300 hover:translate-y-[-2px] shadow-lg hover:shadow-xl"
            onClick={() => {
              const element = document.querySelector('#services-section');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            Start Your Project
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroAnimationSystem;
