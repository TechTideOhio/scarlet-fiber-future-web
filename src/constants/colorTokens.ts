/**
 * 🎨 COLOR DESIGN TOKENS
 * Brand colors and gradients
 */

export const COLOR_TOKENS = {
  // 🎯 Brand colors
  buckeye: {
    scarlet: 'rgb(187, 0, 0)',
    scarletRgba: (alpha: number) => `rgba(187, 0, 0, ${alpha})`,
    black: '#1a1a1a',
    gray: '#4a5568',
  },

  // 🌈 Fiber path colors
  fiberPath: [
    'rgba(255, 50, 50, 1)',
    'rgba(255, 100, 100, 0.9)',
    'rgba(220, 30, 30, 0.8)',
    'rgba(187, 0, 0, 0.9)',
    'rgba(255, 80, 80, 0.7)',
    'rgba(200, 20, 20, 0.85)',
    'rgba(255, 120, 120, 0.8)',
    'rgba(180, 10, 10, 0.9)',
  ],

  // 💫 Glow colors
  glow: {
    outer: (alpha: number) => `rgba(255, 50, 50, ${alpha})`,
    middle: (alpha: number) => `rgba(255, 100, 100, ${alpha})`,
    core: (alpha: number) => `rgba(255, 255, 255, ${alpha})`,
  },

  // 🎨 Background
  background: {
    dark: 'rgba(5, 5, 10, 1)',
    subtle: 'rgba(8, 8, 15, 0.95)',
    grid: (alpha: number) => `rgba(187, 0, 0, ${alpha})`,
  },
} as const;

export const logColorToken = (token: string, value: any) => {
  console.log(`🎨 Color Token: ${token} = ${value}`);
};
