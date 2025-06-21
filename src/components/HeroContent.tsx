
import React from 'react';

const HeroContent: React.FC = () => {
  return (
    <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
      <div className="text-center max-w-4xl mx-auto">
        {/* Content is now handled directly in HeroAnimationSystem */}
        <div className="text-gray-400 text-sm">
          Hero content is now integrated into the main animation system
        </div>
      </div>
    </div>
  );
};

export default HeroContent;
