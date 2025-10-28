/**
 * 🎬 ANIMATION DESIGN TOKENS
 * Single source of truth for all animation timings and easing
 */

export const ANIMATION_TOKENS = {
  // ⏱️ Duration tokens (milliseconds)
  duration: {
    instant: 0,
    flash: 100,
    fast: 200,
    normal: 300,
    comfortable: 500,
    slow: 800,
    verySlow: 1000,
    glacial: 1500,
    heroFade: 2000,
    backgroundPulse: 3000,
    gridPulse: 6000,
  },

  // 🎭 Easing tokens
  easing: {
    linear: 'linear',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
    spring: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },

  // 🌊 Opacity transitions
  opacity: {
    invisible: 0,
    barelyVisible: 0.02,
    verySubtle: 0.05,
    subtle: 0.1,
    faint: 0.2,
    dim: 0.3,
    medium: 0.5,
    visible: 0.6,
    bright: 0.7,
    veryBright: 0.8,
    nearFull: 0.9,
    almostFull: 0.95,
    full: 1,
  },

  // 🎯 Animation delays
  delay: {
    none: 0,
    tiny: 100,
    short: 200,
    medium: 400,
    long: 500,
    veryLong: 800,
  },

  // 🔄 Loop counts
  repeat: {
    once: 1,
    twice: 2,
    several: 3,
    infinite: 'infinite',
  },

  // 🌊 Parallax speeds
  parallax: {
    heroSpeed: 0.3,
    slow: 0.2,
    fast: 0.5,
  },

  // 🎮 Master Animation Speed Controls
  // These control the overall animation speed across all systems
  masterSpeed: {
    // Global multiplier - affects ALL animations (1.0 = normal, 0.2 = 5x slower)
    global: 0.2,
    
    // Specific system multipliers (applied on top of global)
    fiber: {
      progress: 1.0,      // Fiber path progression speed
      snake: 1.0,         // Snake animation speed
      canvas: 1.0,        // Canvas-based animations
    },
    
    // Semantic presets for easy adjustment
    presets: {
      ultraSlow: 0.1,
      verySlow: 0.2,
      slow: 0.4,
      normal: 1.0,
      fast: 1.5,
      veryFast: 2.0,
      ultraFast: 3.0,
    },
  },
} as const;

// 📊 Logging helper
export const logAnimationToken = (token: string, value: any) => {
  console.log(`🎬 Animation Token: ${token} = ${value}`);
};
