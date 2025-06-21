
import React from 'react';

interface AnimatedSVGBackgroundProps {
  mousePosition: { x: number; y: number };
  intensity: number;
}

const AnimatedSVGBackground: React.FC<AnimatedSVGBackgroundProps> = ({ 
  mousePosition, 
  intensity 
}) => {
  return (
    <svg className="absolute inset-0 w-full h-full">
      <defs>
        <linearGradient id="fiber-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#dc2626" stopOpacity="0">
            <animate attributeName="stop-opacity" values="0;1;0" dur="3s" repeatCount="indefinite" />
          </stop>
          <stop offset="50%" stopColor="#ef4444" stopOpacity="1">
            <animate attributeName="stop-opacity" values="1;0.5;1" dur="3s" repeatCount="indefinite" />
          </stop>
          <stop offset="100%" stopColor="#dc2626" stopOpacity="0">
            <animate attributeName="stop-opacity" values="0;1;0" dur="3s" repeatCount="indefinite" />
          </stop>
        </linearGradient>
        
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Animated fiber paths */}
      {[...Array(6)].map((_, i) => (
        <g key={i}>
          <path
            d={`M ${-100 + i * 100} ${window.innerHeight} Q ${window.innerWidth / 2} ${window.innerHeight / 2} ${window.innerWidth + 100 - i * 50} ${-100}`}
            fill="none"
            stroke="url(#fiber-gradient)"
            strokeWidth="2"
            filter="url(#glow)"
            opacity={0.8 * intensity}
          >
            <animate
              attributeName="d"
              values={`M ${-100 + i * 100} ${window.innerHeight} Q ${window.innerWidth / 2} ${window.innerHeight / 2} ${window.innerWidth + 100 - i * 50} ${-100};
                      M ${-100 + i * 100} ${window.innerHeight} Q ${window.innerWidth / 3} ${window.innerHeight / 3} ${window.innerWidth + 100 - i * 50} ${-100};
                      M ${-100 + i * 100} ${window.innerHeight} Q ${window.innerWidth * 0.7} ${window.innerHeight * 0.7} ${window.innerWidth + 100 - i * 50} ${-100};
                      M ${-100 + i * 100} ${window.innerHeight} Q ${window.innerWidth / 2} ${window.innerHeight / 2} ${window.innerWidth + 100 - i * 50} ${-100}`}
              dur={`${8 + i * 2}s`}
              repeatCount="indefinite"
            />
          </path>
          
          {/* Light particles */}
          <circle r="4" fill="#ef4444" filter="url(#glow)">
            <animateMotion
              dur={`${4 + i}s`}
              repeatCount="indefinite"
              path={`M ${-100 + i * 100} ${window.innerHeight} Q ${window.innerWidth / 2} ${window.innerHeight / 2} ${window.innerWidth + 100 - i * 50} ${-100}`}
            />
            <animate attributeName="opacity" values="0;1;1;0" dur={`${4 + i}s`} repeatCount="indefinite" />
            <animate attributeName="r" values="2;6;2" dur={`${4 + i}s`} repeatCount="indefinite" />
          </circle>
        </g>
      ))}
      
      {/* Mouse-following glow */}
      <circle
        cx={mousePosition.x}
        cy={mousePosition.y}
        r="100"
        fill="none"
        stroke="rgba(239, 68, 68, 0.3)"
        strokeWidth="2"
        filter="url(#glow)"
        className="pointer-events-none hero-mouse-glow"
      />
    </svg>
  );
};

export default AnimatedSVGBackground;
