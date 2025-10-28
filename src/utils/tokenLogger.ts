/**
 * 📊 TOKEN LOGGER
 * Centralized logging for token usage
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

export const createTokenLogger = (prefix: string) => {
  return {
    log: (message: string, data?: any, level: LogLevel = 'info') => {
      const emoji = {
        info: '📊',
        warn: '⚠️',
        error: '🚨',
        debug: '🔍',
      }[level];

      if (data) {
        console[level](`${emoji} ${prefix}: ${message}`, data);
      } else {
        console[level](`${emoji} ${prefix}: ${message}`);
      }
    },

    logTokenUsage: (tokenName: string, value: any) => {
      console.log(`🎯 Token Used: ${prefix}.${tokenName} = ${value}`);
    },
  };
};

// Preset loggers
export const animationLogger = createTokenLogger('ANIMATION');
export const fiberLogger = createTokenLogger('FIBER');
export const layoutLogger = createTokenLogger('LAYOUT');
export const performanceLogger = createTokenLogger('PERFORMANCE');
