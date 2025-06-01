
import React from 'react';

const StaticFiberBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      {/* Static gradient background */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 20% 80%, rgba(187, 0, 0, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(187, 0, 0, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(187, 0, 0, 0.05) 0%, transparent 50%),
            linear-gradient(135deg, #000000 0%, #1a0000 50%, #000000 100%)
          `
        }}
      />
      
      {/* Static fiber-like patterns */}
      <div className="absolute inset-0 opacity-20">
        {Array.from({ length: 6 }, (_, index) => (
          <div
            key={index}
            className="absolute h-full"
            style={{
              left: `${15 + index * 15}%`,
              width: '1px',
              background: `linear-gradient(to bottom, 
                rgba(187, 0, 0, ${0.3 + Math.random() * 0.3}), 
                rgba(187, 0, 0, 0.1), 
                transparent
              )`,
              transform: `rotate(${-10 + Math.random() * 20}deg)`,
              transformOrigin: 'top center'
            }}
          />
        ))}
      </div>

      {/* Print-friendly overlay */}
      <style>{`
        @media print {
          .static-fiber-background {
            background: linear-gradient(135deg, #f8f8f8 0%, #e8e8e8 100%) !important;
          }
          .static-fiber-background > * {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default StaticFiberBackground;
