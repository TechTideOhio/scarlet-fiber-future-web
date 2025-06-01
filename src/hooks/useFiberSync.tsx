
import { useEffect, useState } from 'react';

export const useFiberSync = () => {
  const [fiberGlowIntensity, setFiberGlowIntensity] = useState(0.3);
  const [buttonPulse, setButtonPulse] = useState(false);

  useEffect(() => {
    let animationId: number;
    
    const animate = () => {
      const time = Date.now() * 0.001;
      const intensity = 0.3 + Math.sin(time * 2) * 0.2;
      
      setFiberGlowIntensity(intensity);
      
      // Trigger button pulse at glow peaks
      const shouldPulse = intensity > 0.45;
      setButtonPulse(shouldPulse);
      
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  return {
    fiberGlowIntensity,
    buttonPulse
  };
};
