
export interface PerformanceConfig {
  maxPaths: number;
  renderLayers: number;
  glowQuality: 'low' | 'medium' | 'high';
  enableParticles: boolean;
  frameRateTarget: number;
}

export const getPerformanceConfig = (
  quality: string,
  isMobile: boolean,
  deviceCapabilities?: any
): PerformanceConfig => {
  const baseConfig: PerformanceConfig = {
    maxPaths: 8,
    renderLayers: 3,
    glowQuality: 'medium',
    enableParticles: false,
    frameRateTarget: 60
  };

  if (isMobile) {
    baseConfig.frameRateTarget = 30;
    baseConfig.renderLayers = 2;
  }

  switch (quality) {
    case 'high':
      return {
        ...baseConfig,
        maxPaths: isMobile ?  8 : 12,
        renderLayers: isMobile ? 3 : 4,
        glowQuality: 'high',
        enableParticles: !isMobile,
        frameRateTarget: isMobile ? 30 : 60
      };
    
    case 'medium':
      return {
        ...baseConfig,
        maxPaths: isMobile ? 6 : 9,
        renderLayers: 3,
        glowQuality: 'medium',
        enableParticles: false,
        frameRateTarget: isMobile ? 30 : 45
      };
    
    case 'low':
      return {
        ...baseConfig,
        maxPaths: isMobile ? 4 : 6,
        renderLayers: 2,
        glowQuality: 'low',
        enableParticles: false,
        frameRateTarget: 30
      };
    
    default:
      return baseConfig;
  }
};

export const shouldReduceEffects = (fps: number, targetFps: number): boolean => {
  return fps < targetFps * 0.8; // If FPS drops below 80% of target
};

export const calculateAdaptiveOpacity = (
  baseOpacity: number,
  heroIntensity: number,
  performanceRatio: number
): number => {
  const heroBoost = heroIntensity * 0.2;
  const performanceFactor = Math.max(0.5, performanceRatio);
  return Math.min(1, (baseOpacity + heroBoost) * performanceFactor);
};
