
import React, { useEffect, useRef, useState } from 'react';

interface FloatingParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  angle: number;
}

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
  const containerRef = useRef<HTMLDivElement>(null);
  const [particles, setParticles] = useState<FloatingParticle[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const animationRef = useRef<number>();

  // Initialize particles
  useEffect(() => {
    if (!isVisible) return;

    const particleCount = 15;
    const newParticles: FloatingParticle[] = [];

    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.3 + 0.1,
        speed: Math.random() * 0.5 + 0.2,
        angle: Math.random() * Math.PI * 2
      });
    }

    setParticles(newParticles);
  }, [isVisible]);

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100
        });
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      return () => container.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  // Animation loop
  useEffect(() => {
    if (!isVisible || particles.length === 0) return;

    let lastTime = 0;

    const animate = (currentTime: number) => {
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      setParticles(prevParticles => 
        prevParticles.map(particle => ({
          ...particle,
          x: (particle.x + Math.cos(particle.angle) * particle.speed * 0.1) % 100,
          y: (particle.y + Math.sin(particle.angle) * particle.speed * 0.1) % 100,
          angle: particle.angle + 0.001
        }))
      );

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isVisible, particles.length]);

  if (!isVisible) return null;

  return (
    <div 
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden ${className}`}
      style={{ zIndex: 1 }}
    >
      {/* Animated Fiber Lines */}
      <div className="absolute inset-0">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={`fiber-${i}`}
            className="absolute w-px bg-gradient-to-b from-transparent via-red-500/30 to-transparent"
            style={{
              left: `${15 + i * 12}%`,
              height: '100%',
              opacity: intensity * 0.6,
              animation: `fiberGlow ${3 + i * 0.5}s ease-in-out infinite alternate`,
              transform: `translateY(${Math.sin(i * 0.5) * 10}px)`
            }}
          />
        ))}
      </div>

      {/* Diagonal Fiber Lines */}
      <div className="absolute inset-0">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={`diagonal-${i}`}
            className="absolute bg-gradient-to-r from-transparent via-red-400/20 to-transparent"
            style={{
              top: `${20 + i * 20}%`,
              left: '0%',
              width: '100%',
              height: '1px',
              opacity: intensity * 0.4,
              animation: `diagonalMove ${4 + i * 0.7}s linear infinite`,
              transform: `rotate(${5 + i * 2}deg) translateX(${mousePosition.x * 0.1}px)`
            }}
          />
        ))}
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0">
        {particles.map(particle => (
          <div
            key={particle.id}
            className="absolute w-1 h-1 bg-red-400 rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              opacity: particle.opacity * intensity,
              transform: `scale(${particle.size * 0.5})`,
              boxShadow: `0 0 ${particle.size * 4}px rgba(239, 68, 68, ${particle.opacity * 0.5})`
            }}
          />
        ))}
      </div>

      {/* Interactive Glow Effect */}
      <div
        className="absolute w-32 h-32 bg-red-500/10 rounded-full blur-xl pointer-events-none transition-all duration-300"
        style={{
          left: `${mousePosition.x}%`,
          top: `${mousePosition.y}%`,
          transform: 'translate(-50%, -50%)',
          opacity: intensity * 0.3
        }}
      />

      {/* Gradient Overlay */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-red-900/5 via-transparent to-blue-900/5"
        style={{ opacity: intensity * 0.3 }}
      />
    </div>
  );
};

export default HeroAnimationSystem;
