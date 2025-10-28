/**
 * 🔆 FIBER ANIMATION DESIGN TOKENS
 * All fiber path animation settings
 */

export const FIBER_ANIMATION_TOKENS = {
  // 🎯 Path count by quality
  pathCount: {
    mobile: {
      static: 0,
      low: 3,
      medium: 4,
      high: 6,
    },
    desktop: {
      static: 0,
      low: 5,
      medium: 7,
      high: 10,
    },
  },

  // 🔢 Fiber count (alias for pathCount)
  count: {
    min: 8,
    default: {
      base: 8,
      hero: 5,
    },
    mobile: {
      low: 4,
      medium: 6,
      high: 8,
    },
    desktop: {
      low: 6,
      medium: 9,
      high: 12,
    },
  },

  // 📚 Layer depth
  layers: {
    min: 2,
    default: 3,
    max: 4,
  },

  // 📏 Segment lengths
  segmentLength: {
    mobile: {
      main: 8,
      branch: 8,
    },
    desktop: {
      main: 12,
      branch: 12,
    },
  },

  // 🏃 Speed multipliers
  speed: {
    base: {
      min: 0.25,
      default: 0.5,
    },
    multiplier: {
      main: 0.3,
      branch: 0.4,
    },
    progression: 0.001, // Reduced from 0.002 for 50% slower
  },

  // 💫 Visual properties
  opacity: {
    container: {
      min: 0.85,
      enhanced: 0.95,
    },
    path: {
      min: 0.6,
      base: 0.7,
      max: 1,
    },
    trail: 0.05,
    heroBoost: 0.2,
    performanceMin: 0.5,
  },

  // ✨ Glow intensity
  glow: {
    min: 0.8,
    base: 0.8,
    max: 2.5,
    heroBoost: 0.4,
    heroPathBoost: 0.3,
  },

  // 🎨 Rendering
  lineWidth: {
    mobile: {
      main: 3,
      branch: 3,
      node: 2,
    },
    desktop: {
      main: 5,
      branch: 4,
      node: 3,
    },
  },

  // 🌈 Color intensity
  colorIntensity: {
    contrast: 1.6,
    saturation: 1.8,
  },

  // 🎨 Visual effects
  effects: {
    contrast: 1.1,
    saturation: 1.2,
  },

  // 💨 Pulse effect
  pulse: {
    speed: 0.0015, // Reduced from 0.003 (50% slower)
    amplitude: 0.3,
    offset: 0.7,
  },

  // 🎯 Node properties
  node: {
    minIntensity: 0.2,
    minVisibility: 0.4,
    visibilityThreshold: 0.1,
    radiusMultiplier: 1.5,
    minRadius: 5,
  },
} as const;

export const logFiberToken = (token: string, value: any) => {
  console.log(`🔆 Fiber Token: ${token} = ${value}`);
};
