import { FIBER_ANIMATION_TOKENS, PERFORMANCE_TOKENS, logPerformanceToken } from '../constants';

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
    maxPaths: FIBER_ANIMATION_TOKENS.count.default.base,
    renderLayers: FIBER_ANIMATION_TOKENS.layers.default,
    glowQuality: 'medium',
    enableParticles: false,
    frameRateTarget: PERFORMANCE_TOKENS.fps.ideal
  };

  if (isMobile) {
    baseConfig.frameRateTarget = PERFORMANCE_TOKENS.fps.target.mobile;
    baseConfig.renderLayers = FIBER_ANIMATION_TOKENS.layers.min;
  }

  logPerformanceToken('config-created', `quality: ${quality}, mobile: ${isMobile}`);

  switch (quality) {
    case 'high':
      return {
        ...baseConfig,
        maxPaths: isMobile 
          ? FIBER_ANIMATION_TOKENS.count.mobile.high 
          : FIBER_ANIMATION_TOKENS.count.desktop.high,
        renderLayers: isMobile 
          ? FIBER_ANIMATION_TOKENS.layers.default 
          : FIBER_ANIMATION_TOKENS.layers.max,
        glowQuality: 'high',
        enableParticles: !isMobile,
        frameRateTarget: isMobile 
          ? PERFORMANCE_TOKENS.fps.target.mobile 
          : PERFORMANCE_TOKENS.fps.ideal
      };
    
    case 'medium':
      return {
        ...baseConfig,
        maxPaths: isMobile 
          ? FIBER_ANIMATION_TOKENS.count.mobile.medium 
          : FIBER_ANIMATION_TOKENS.count.desktop.medium,
        renderLayers: FIBER_ANIMATION_TOKENS.layers.default,
        glowQuality: 'medium',
        enableParticles: false,
        frameRateTarget: isMobile 
          ? PERFORMANCE_TOKENS.fps.target.mobile 
          : PERFORMANCE_TOKENS.fps.target.desktop
      };
    
    case 'low':
      return {
        ...baseConfig,
        maxPaths: isMobile 
          ? FIBER_ANIMATION_TOKENS.count.mobile.low 
          : FIBER_ANIMATION_TOKENS.count.desktop.low,
        renderLayers: FIBER_ANIMATION_TOKENS.layers.min,
        glowQuality: 'low',
        enableParticles: false,
        frameRateTarget: PERFORMANCE_TOKENS.fps.target.mobile
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
  const heroBoost = heroIntensity * FIBER_ANIMATION_TOKENS.opacity.heroBoost;
  const performanceFactor = Math.max(
    FIBER_ANIMATION_TOKENS.opacity.performanceMin, 
    performanceRatio
  );
  return Math.min(1, (baseOpacity + heroBoost) * performanceFactor);
};
