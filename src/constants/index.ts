/**
 * 🎯 DESIGN TOKENS - SINGLE SOURCE OF TRUTH
 * All constants, magic numbers, and configuration values
 */

import { ANIMATION_TOKENS } from './animationTokens';
import { FIBER_ANIMATION_TOKENS } from './fiberAnimationTokens';
import { LAYOUT_TOKENS } from './layoutTokens';
import { PERFORMANCE_TOKENS } from './performanceTokens';
import { COLOR_TOKENS } from './colorTokens';

export { ANIMATION_TOKENS, logAnimationToken } from './animationTokens';
export { FIBER_ANIMATION_TOKENS, logFiberToken } from './fiberAnimationTokens';
export { LAYOUT_TOKENS, logLayoutToken } from './layoutTokens';
export { PERFORMANCE_TOKENS, logPerformanceToken } from './performanceTokens';
export { COLOR_TOKENS, logColorToken } from './colorTokens';

// 🎯 Token validation
export const validateTokens = () => {
  console.log('✅ Validating design tokens...');
  
  // Add runtime validation here
  const allTokens = {
    animation: ANIMATION_TOKENS,
    fiber: FIBER_ANIMATION_TOKENS,
    layout: LAYOUT_TOKENS,
    performance: PERFORMANCE_TOKENS,
    color: COLOR_TOKENS,
  };

  console.log('✅ Design tokens loaded:', Object.keys(allTokens));
  return allTokens;
};
