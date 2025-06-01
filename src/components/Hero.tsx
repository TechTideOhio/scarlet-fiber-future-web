
import React from 'react';
import EnhancedHero from './EnhancedHero';
import ResourcePreloader from './ResourcePreloader';

const Hero = () => {
  return (
    <>
      <ResourcePreloader />
      <EnhancedHero />
    </>
  );
};

export default Hero;
