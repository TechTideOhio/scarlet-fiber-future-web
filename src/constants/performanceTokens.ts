/**
 * ⚡ PERFORMANCE DESIGN TOKENS
 * FPS thresholds, quality settings, and performance limits
 */

export const PERFORMANCE_TOKENS = {
  // 🎯 FPS thresholds
  fps: {
    min: {
      desktop: 30,
      mobile: 24,
    },
    target: {
      desktop: 60,
      mobile: 45,
    },
    ideal: 60,
    lowPerformanceThreshold: 30,
    degradeThreshold: 25,
  },

  // ⏱️ Monitoring
  monitoring: {
    duration: 5000, // 5 seconds
    sampleInterval: 16, // ~1 frame at 60fps
    measureInterval: 1000, // 1 second
  },

  // 🔋 Battery thresholds
  battery: {
    lowLevel: 0.2, // 20%
  },

  // 🎨 Device memory (GB)
  memory: {
    low: 2,
    medium: 4,
    high: 6,
    premium: 8,
  },

  // 🖥️ Canvas rendering
  canvas: {
    maxDevicePixelRatio: 2,
    clearAlpha: 0.95,
    updateDelay: 50, // milliseconds
  },

  // ⏱️ Delta time bounds (milliseconds)
  deltaTime: {
    min: 8,
    default: 16,
    max: 100,
  },

  // 🔄 Animation frame logging
  logging: {
    initialFrames: 10,
    periodicInterval: 300, // Every 5 seconds at 60fps
    renderErrorInterval: 120, // Every 2 seconds
    successRate: 0.02, // 2% of frames
  },
} as const;

export const logPerformanceToken = (token: string, value: any) => {
  console.log(`⚡ Performance Token: ${token} = ${value}`);
};
