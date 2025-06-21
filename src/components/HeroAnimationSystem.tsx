
import React, { useEffect, useRef, useState } from 'react';

const HeroAnimationSystem = () => {
  const canvasRef = useRef(null);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const frameRef = useRef(0);
  const fibersRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Initialize fibers
    class Fiber {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 50;
        this.targetX = Math.random() * canvas.width;
        this.targetY = -50;
        this.progress = 0;
        this.speed = 0.002 + Math.random() * 0.003; // Much slower
        this.width = 2 + Math.random() * 2;
        this.opacity = 0;
        
        // Control points for bezier curve
        this.cp1x = this.x + (Math.random() - 0.5) * 400;
        this.cp1y = canvas.height * 0.7;
        this.cp2x = this.targetX + (Math.random() - 0.5) * 400;
        this.cp2y = canvas.height * 0.3;
      }

      update() {
        this.progress += this.speed;
        
        // Fade in and out
        if (this.progress < 0.1) {
          this.opacity = this.progress * 10;
        } else if (this.progress > 0.9) {
          this.opacity = (1 - this.progress) * 10;
        } else {
          this.opacity = 1;
        }

        if (this.progress > 1) {
          this.reset();
        }
      }

      draw(ctx) {
        const t = this.progress;
        
        // Calculate current position on bezier curve
        const x = Math.pow(1-t, 3) * this.x + 
                 3 * Math.pow(1-t, 2) * t * this.cp1x + 
                 3 * (1-t) * Math.pow(t, 2) * this.cp2x + 
                 Math.pow(t, 3) * this.targetX;
                 
        const y = Math.pow(1-t, 3) * this.y + 
                 3 * Math.pow(1-t, 2) * t * this.cp1y + 
                 3 * (1-t) * Math.pow(t, 2) * this.cp2y + 
                 Math.pow(t, 3) * this.targetY;

        // Draw fiber trail
        ctx.save();
        ctx.globalAlpha = this.opacity * 0.8;
        
        // Create gradient for fiber
        const gradient = ctx.createLinearGradient(
          x - 50, y - 50, 
          x + 50, y + 50
        );
        gradient.addColorStop(0, 'rgba(255, 59, 48, 0)');
        gradient.addColorStop(0.5, 'rgba(255, 59, 48, 1)');
        gradient.addColorStop(1, 'rgba(255, 59, 48, 0)');
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = this.width;
        ctx.lineCap = 'round';
        
        // Draw the path
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.bezierCurveTo(
          this.cp1x, this.cp1y,
          this.cp2x, this.cp2y,
          this.targetX, this.targetY
        );
        ctx.stroke();
        
        // Draw bright core
        ctx.globalAlpha = this.opacity;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.lineWidth = this.width * 0.3;
        ctx.stroke();
        
        // Draw light point
        ctx.beginPath();
        ctx.arc(x, y, 4 + this.width, 0, Math.PI * 2);
        const pointGradient = ctx.createRadialGradient(x, y, 0, x, y, 4 + this.width);
        pointGradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        pointGradient.addColorStop(0.3, 'rgba(255, 59, 48, 0.8)');
        pointGradient.addColorStop(1, 'rgba(255, 59, 48, 0)');
        ctx.fillStyle = pointGradient;
        ctx.fill();
        
        ctx.restore();
      }
    }

    // Create fibers
    for (let i = 0; i < 5; i++) {
      fibersRef.current.push(new Fiber());
    }

    // Animation loop
    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
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
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* Clean gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-950 to-black" />
      
      {/* Canvas for fiber animations */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ mixBlendMode: 'screen' }}
      />
      
      {/* Subtle grid */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: 'radial-gradient(circle at center, transparent 0%, rgba(255,59,48,0.5) 100%)',
          backgroundSize: '100% 100%'
        }}
      />
      
      {/* Hero content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="text-center max-w-6xl mx-auto">
          <div className="mb-12">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tight animate-fade-in leading-tight">
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-red-500 to-white animate-text-shimmer bg-[length:200%_100%]">
                Connecting the Future,
              </span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-red-500 to-white animate-text-shimmer bg-[length:200%_100%] animation-delay-500">
                Powering Tomorrow.
              </span>
            </h1>
            
            <div className="h-px w-32 mx-auto bg-gradient-to-r from-transparent via-red-500 to-transparent animate-pulse" />
          </div>
          
          <p className="text-xl md:text-2xl text-gray-400 mb-12 animate-fade-in-delay max-w-3xl mx-auto font-light">
            Experience lightning-fast connectivity with our enterprise-grade fiber network solutions.
          </p>
          
          <button
            className="relative px-10 py-4 text-white font-medium overflow-hidden group animate-fade-in-delay-2"
            onMouseEnter={() => setIsButtonHovered(true)}
            onMouseLeave={() => setIsButtonHovered(false)}
            onClick={() => {
              const element = document.querySelector('#services-section');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            {/* Button background */}
            <div className="absolute inset-0 bg-white/5 backdrop-blur-sm border border-white/10 transition-all duration-300 group-hover:bg-white/10 group-hover:border-red-500/50" />
            
            {/* Button glow effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/20 to-transparent animate-shimmer-slow" />
            </div>
            
            {/* Button content */}
            <span className="relative z-10 flex items-center gap-3 text-sm tracking-wider uppercase">
              Start Your Project
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                className={`transform transition-transform duration-300 ${isButtonHovered ? 'translate-x-1' : ''}`}
              >
                <path
                  d="M5 12H19M19 12L12 5M19 12L12 19"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </button>
        </div>
      </div>
      
      {/* Vignette effect */}
      <div className="absolute inset-0 pointer-events-none bg-radial-gradient from-transparent via-transparent to-black/50" />
      
      {/* Custom styles */}
      <style jsx>{`
        @keyframes text-shimmer {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        
        .animation-delay-500 {
          animation-delay: 0.5s;
        }
        
        @keyframes fade-in {
          from { 
            opacity: 0; 
            transform: translateY(20px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        @keyframes shimmer-slow {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        .animate-text-shimmer {
          animation: text-shimmer 3s linear infinite;
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        
        .animate-fade-in-delay {
          opacity: 0;
          animation: fade-in 0.8s ease-out 0.2s forwards;
        }
        
        .animate-fade-in-delay-2 {
          opacity: 0;
          animation: fade-in 0.8s ease-out 0.4s forwards;
        }
        
        .animate-shimmer-slow {
          animation: shimmer-slow 3s ease-out infinite;
        }
        
        .bg-radial-gradient {
          background: radial-gradient(circle at center, transparent 0%, transparent 50%, rgba(0,0,0,0.4) 100%);
        }
      `}</style>
    </div>
  );
};

export default HeroAnimationSystem;
