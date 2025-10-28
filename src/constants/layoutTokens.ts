/**
 * 📐 LAYOUT DESIGN TOKENS
 * Spacing, sizing, and positioning constants
 */

export const LAYOUT_TOKENS = {
  // 📏 Spacing scale (pixels)
  spacing: {
    none: 0,
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    huge: 32,
    massive: 48,
    gigantic: 64,
  },

  // 🎯 Breakpoints (pixels)
  breakpoint: {
    mobile: 640,
    tablet: 768,
    desktop: 1024,
    wide: 1280,
    ultraWide: 1536,
  },

  // 📱 Container sizes
  container: {
    maxWidth: {
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
    },
    padding: {
      mobile: 16,
      desktop: 32,
    },
  },

  // 🎚️ Z-index layers
  zIndex: {
    behind: -1,
    base: 0,
    content: 1,
    overlay: 2,
    dropdown: 10,
    sticky: 20,
    modal: 50,
    notification: 100,
    tooltip: 1000,
  },

  // 📐 Grid
  grid: {
    size: {
      mobile: 100,
      desktop: 140,
    },
    spacing: {
      mobile: 120,
      desktop: 180,
    },
  },

  // 📊 Scroll thresholds
  scroll: {
    stickyButtonThreshold: 500,
    heroParallaxMultiplier: 0.3,
  },
} as const;

export const logLayoutToken = (token: string, value: any) => {
  console.log(`📐 Layout Token: ${token} = ${value}`);
};
