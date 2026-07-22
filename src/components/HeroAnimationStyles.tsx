import React from 'react';

const HeroAnimationStyles = () => {
  return (
    <style>
      {`
      .bg-radial-gradient {
        background: radial-gradient(circle at center, transparent 0%, transparent 50%, rgba(0,0,0,0.4) 100%);
      }

      .text-transparent {
        color: transparent !important;
      }
      `}
    </style>
  );
};

export default HeroAnimationStyles;
