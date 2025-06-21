
import React from 'react';

interface FloatingParticlesProps {
  intensity: number;
}

const FloatingParticles: React.FC<FloatingParticlesProps> = ({ intensity }) => {
  return (
    <div className="absolute inset-0">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-red-500 rounded-full hero-particle-float"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 10}s`,
            animationDuration: `${15 + Math.random() * 10}s`,
            opacity: intensity
          }}
        />
      ))}
    </div>
  );
};

export default FloatingParticles;
