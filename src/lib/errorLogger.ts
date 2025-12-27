// Centralized error logging service
// Logs to console in development, analytics in production
// Ready for Sentry integration

import { trackError } from './analytics';

interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string;
  additionalData?: Record<string, unknown>;
}

interface LoggedError {
  message: string;
  stack?: string;
  context?: ErrorContext;
  timestamp: number;
}

// Rate limiting to prevent error flood
const errorCache = new Map<string, number>();
const ERROR_THROTTLE_MS = 5000; // Same error can only be logged once per 5 seconds

const shouldLogError = (errorKey: string): boolean => {
  const lastLogged = errorCache.get(errorKey);
  const now = Date.now();
  
  if (lastLogged && now - lastLogged < ERROR_THROTTLE_MS) {
    return false;
  }
  
  errorCache.set(errorKey, now);
  return true;
};

// Clean up old cache entries periodically
setInterval(() => {
  const now = Date.now();
  errorCache.forEach((timestamp, key) => {
    if (now - timestamp > ERROR_THROTTLE_MS * 2) {
      errorCache.delete(key);
    }
  });
}, 30000);

export const logError = (
  error: Error | string,
  context?: ErrorContext
): void => {
  const errorMessage = error instanceof Error ? error.message : error;
  const errorStack = error instanceof Error ? error.stack : undefined;
  const errorKey = `${errorMessage}-${context?.component || 'unknown'}`;

  if (!shouldLogError(errorKey)) {
    return;
  }

  const loggedError: LoggedError = {
    message: errorMessage,
    stack: errorStack,
    context,
    timestamp: Date.now(),
  };

  // Always log to console in development
  if (import.meta.env.DEV) {
    console.error('[Error Logger]', loggedError);
  }

  // Track in analytics
  trackError(
    errorMessage,
    errorStack,
    context?.component || context?.action
  );

  // TODO: Add Sentry integration when SENTRY_DSN is configured
  // if (import.meta.env.VITE_SENTRY_DSN) {
  //   Sentry.captureException(error, { extra: context });
  // }
};

export const logWarning = (
  message: string,
  context?: ErrorContext
): void => {
  if (import.meta.env.DEV) {
    console.warn('[Warning Logger]', message, context);
  }
};

export const logInfo = (
  message: string,
  data?: Record<string, unknown>
): void => {
  if (import.meta.env.DEV) {
    console.info('[Info Logger]', message, data);
  }
};

// Capture unhandled errors
export const setupGlobalErrorHandlers = (): void => {
  // Handle uncaught errors
  window.onerror = (message, source, lineno, colno, error) => {
    logError(error || String(message), {
      component: 'GlobalErrorHandler',
      action: 'uncaught_error',
      additionalData: { source, lineno, colno },
    });
    return false; // Let the error propagate
  };

  // Handle unhandled promise rejections
  window.onunhandledrejection = (event) => {
    const error = event.reason instanceof Error 
      ? event.reason 
      : new Error(String(event.reason));
    
    logError(error, {
      component: 'GlobalErrorHandler',
      action: 'unhandled_rejection',
    });
  };
};

export default {
  logError,
  logWarning,
  logInfo,
  setupGlobalErrorHandlers,
};
