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

  /**
   * 🎮 MASTER ANIMATION SPEED CONTROLS
   * ⚠️  CRITICAL: This is the SINGLE SOURCE OF TRUTH for all animation speeds
   * 
   * HOW IT WORKS:
   * - JavaScript animations: multiply speed by masterSpeed
   * - CSS animations: divide duration by masterSpeed (inverse!)
   * 
   * EXAMPLE (masterSpeed.global = 0.04 = 25x slower):
   * - JS: baseSpeed × 0.04 = much slower progression
   * - CSS: baseDuration ÷ 0.04 = much longer duration
   * 
   * TO CHANGE GLOBAL SPEED:
   * 1. Update masterSpeed.global value
   * 2. Check console logs for "ANIMATION SYSTEM AUDIT"
   * 3. Verify all 3 systems report same slowdown factor
   * 
   * @see AnimatedFiber.tsx - Canvas fiber animation
   * @see pathUpdater.ts - Snake path animation
   * @see FiberStrand.tsx - CSS fiber strands
   */
  masterSpeed: {
    // Global multiplier - affects ALL animations (1.0 = normal, 0.04 = 25x slower for smooth, elegant motion)
    global: 0.04,
    
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
    
    /**
     * Helper to calculate CSS animation duration with masterSpeed applied
     * CSS durations work inversely: slower speed = longer duration
     */
    getCSSAnimationDuration: (baseDurationMs: number, global: number = 0.04) => {
      return (baseDurationMs / global) / 1000; // Convert to seconds
    },
    
    /**
     * Validation guard for masterSpeed values
     */
    validateSpeed: (speed: number): number => {
      const min = 0.01;
      const max = 3.0;
      if (speed < min || speed > max) {
        console.error(`❌ INVALID masterSpeed: ${speed}. Must be between ${min}-${max}. Using default 1.0`);
        return 1.0;
      }
      return speed;
    },
  },
} as const;

// 📊 Logging helpers
export const logAnimationToken = (token: string, value: any) => {
  console.log(`🎬 Animation Token: ${token} = ${value}`);
};

export const logAnimationSpeed = (system: string, speed: number, duration?: number) => {
  const global = ANIMATION_TOKENS.masterSpeed.global;
  const slowdownFactor = (1 / global).toFixed(1);
  console.log(
    `🎮 ANIMATION SPEED [${system}]: speed=${speed.toFixed(6)}x, ` +
    `${duration ? `duration=${duration.toFixed(2)}s, ` : ''}` +
    `global=${global}x (${slowdownFactor}x slower)`
  );
};
